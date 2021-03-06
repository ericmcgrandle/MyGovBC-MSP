import { Component, ViewChild, AfterViewInit, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { AbstractForm, ApiStatusCodes, ErrorMessage } from 'moh-common-lib';
import { Router } from '@angular/router';
import { HeaderService } from '../../../../services/header.service';
import { MspConsentModalComponent } from '../../../msp-core/components/consent-modal/consent-modal.component';
import { AclDataService } from '../../services/acl-data.service';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { EnrolmentMembership } from '../../model/enrolment-membership.enum';
import { environment } from '../../../../../environments/environment';
import { MspLogService } from '../../../../services/log.service';
import { AclApiService } from '../../services/acl-api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AclApiPayLoad } from '../../model/acl-api.model';
import { ROUTES_ACL } from '../../request-acl-route-constants';
import { subYears, startOfToday } from 'date-fns';

@Component({
  selector: 'msp-request-letter',
  templateUrl: './request-letter.component.html',
  styleUrls: ['./request-letter.component.scss']
})
export class RequestLetterComponent extends AbstractForm implements AfterViewInit, OnDestroy {

  @ViewChild('mspConsentModal') mspConsentModal: MspConsentModalComponent;

  // Used to indicate that the system is processing the request
  loading: boolean = false;
  captchaApiBaseUrl: string = environment.appConstants.captchaApiBaseUrl;
  showCaptcha: boolean = false;
  accountHolderInput: string = 'AccountHolderPhn';
  specificMemberInput: string = 'SpecificMember';

  // Radio button labels
  radioBtnLabels = [
    { label: 'Myself only', value: EnrolmentMembership.MyselfOnly },
    { label: 'All members on my Medical Services Plan Account', value: EnrolmentMembership.AllMembers },
    { label: 'One specific member on my Medical Services Plan Account', value: EnrolmentMembership.SpecificMember },
  ];

  errorMessage: ErrorMessage = {
    duplicate: 'This PHN was already used for another family member. Please provide the PHN that is listed on the family member\'s BC Services Card.'
  };

  dobErrorMsg: ErrorMessage = {
    invalidRange: 'An applicant must be 16 years or older.'
  };
  dobEndRange = subYears( startOfToday(), 16 );

  private _subscription: Subscription;

  constructor( protected router: Router,
               private header: HeaderService,
               private dataService: AclDataService,
               private logService: MspLogService,
               private aclApiService: AclApiService,
               private cd: ChangeDetectorRef ) {
    super( router );

    // Set service name for application
    this.header.setTitle( 'Account Confirmation Request' );
  }

  get application() {
    return this.dataService.application;
  }

  get isSpecificMember() {
    return this.application.enrolmentMembership === EnrolmentMembership.SpecificMember;
  }

  get accountHolderPhn(): string {
    return this.application.accountHolderPhn ? this.application.accountHolderPhn : null;
  }
  set accountHolderPhn( phn: string ) {
    this.application.accountHolderPhn = phn;
  }

  get postalCode(): string {
    return this.application.postalCode ? this.application.postalCode : null;
  }
  set postalCode( val: string ) {
    this.application.postalCode = val;
  }

  get accountHolderDob(): Date {
    return this.application.accountHolderDob;
  }
  set accountHolderDob( dt: Date ) {
    this.application.accountHolderDob = dt;
  }

  get enrolmentMembership(): EnrolmentMembership {
   return this.application.enrolmentMembership;
  }
  set enrolmentMembership( val: EnrolmentMembership ) {
    if ( val === EnrolmentMembership.SpecificMember ) {
      this.showCaptcha = false;
    }
    this.application.enrolmentMembership = val;
  }

  get specificMemberPhn(): string {
    return this.application.specificMemberPhn ? this.application.specificMemberPhn : null;
  }
  set specificMemberPhn( phn: string ) {
    this.application.specificMemberPhn = phn;
  }

  ngAfterViewInit() {
    // Display consent modal if no agreement
    if ( !this.dataService.application.infoCollectionAgreement ) {
      this.mspConsentModal.showFullSizeView();
    }

    if ( this.form ) {
      this._subscription = this.form.valueChanges.pipe(
          debounceTime( 100 )
        ).subscribe(() => {

          // Clear out specific member PHN
          if ( !this.isSpecificMember ) {
            this.application.specificMemberPhn = '';
            this.triggerValidation( this.accountHolderInput );
          }

          if ( !this.showCaptcha && this.form.valid && this.application.infoCollectionAgreement ) {
            this.showCaptcha = true;
          }

          this.dataService.saveApplication();
        });
    }
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  acceptAgreement( $event ) {
    this.dataService.application.infoCollectionAgreement = $event;
    this.dataService.saveApplication();
  }

  triggerValidation( controlName: string ) {
    const control = this.form.controls[ controlName ];
    if ( control ) {
      setTimeout( () => {
        control.updateValueAndValidity();
        this.cd.detectChanges();
      }, 0);
    }
  }

  continue(): void {

    if ( !this.form.valid || !this.application.authorizationToken ) {

      this.markAllInputsTouched();
      return;
    }

    this.loading = true;

    // Setup the request
    const subscription = this.aclApiService.sendAclRequest( this.dataService.application );

    // Trigger the HTTP request
    subscription.subscribe( response => {

      // business errors.. Might be either a RAPID validation failure or DB error
      const payload: AclApiPayLoad = <AclApiPayLoad> response;

      // Required field in payload. - work around
      // If not there we do not have the correct structure for response
      if ( !payload.hasOwnProperty('referenceNumber')  ) {

        this.application.regenUUID(); // Generates a new uuid
        this.application.authorizationToken = null;
        this.dataService.saveApplication(); // save changes

        this.logService.log(
          {
            name: 'Account Confirmation Letter - Submission Response Error',
            confirmationNumber: this.application.uuid
          },
          'Account Confirmation Letter - Submission Response Error' + response
        );

        this.navigate( ROUTES_ACL.CONFIRMATION.fullpath,
        {
          status: ApiStatusCodes.ERROR,
        });
        return;
      }

      const isSuccess =  payload.referenceNumber &&
                         payload.dberrorCode === 'Y' &&
                         payload.rapidResponse === 'Y';
      if ( isSuccess ) {
        this.loading = false;

        // Successfully submitted request
        this.dataService.removeApplication();  // clear storage for application
        this.logService.log(
          {
              name: 'Account Confirmation Letter - Received refNo ',
              confirmationNumber: payload.referenceNumber
            },
            'Account Confirmation Letter - Submission Response Success'
        );

        this.navigate( ROUTES_ACL.CONFIRMATION.fullpath,
          {
            confirmationNum: payload.referenceNumber,
            status: ApiStatusCodes.SUCCESS,
          });
        return;
      }

      this.logService.log(
        {
          name: 'Account Confirmation Letter - RAPID/DB Error',
          confirmationNumber: this.application.uuid
        },
        'Account Confirmation Letter - Submission Response Error' + JSON.stringify(payload)
      );

      // Get error repsonse messages from ENV server
      this.aclApiService
          .sendSpaEnvServer( '{"SPA_ENV_ACL_' + payload.rapidResponse + '":""}' )
          .subscribe( spaResponse => {
              this.loading = false;

              if (spaResponse instanceof HttpErrorResponse) { // probable network errors..Spa Env server could be down
                this.logService.log(
                  {
                      name: 'account-letter - SPA Env System Error',
                      url: this.router.url
                  },
                  'account-letter - SPA Env Rapid Response Error' + spaResponse.message
                );

                this.navigate( ROUTES_ACL.CONFIRMATION.fullpath,
                  {
                    status: ApiStatusCodes.ERROR,
                    message: spaResponse.message
                  });
                return;
              }

              this.application.regenUUID(); // Generates a new uuid
              this.application.authorizationToken = null;
              this.dataService.saveApplication(); // save changes

              const key = Object.keys(spaResponse)[0];
              this.navigate( ROUTES_ACL.CONFIRMATION.fullpath,
                {
                  status: ApiStatusCodes.ERROR,
                  message: spaResponse[key]
                });
          });
    },
    (responseError) => {
      this.loading = false;

      // Network error
      if ( responseError instanceof HttpErrorResponse ) {

        this.application.regenUUID(); // Generates a new uuid
        this.application.authorizationToken = null;
        this.dataService.saveApplication(); // save changes

        this.logService.log(
          {
            name: 'Account Confirmation Letter - System Error',
            confirmationNumber: this.application.uuid
          },
          'Account Confirmation Letter - Submission Response Error' + responseError.message
        );
      }
      this.navigate( ROUTES_ACL.CONFIRMATION.fullpath,
        {
          status: ApiStatusCodes.ERROR,
        });
    });
  }
}
