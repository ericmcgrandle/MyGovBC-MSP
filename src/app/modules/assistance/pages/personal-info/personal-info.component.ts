import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MspDataService } from '../../../../services/msp-data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { BaseComponent } from '../../../../models/base.component';
import { MspAddressComponent } from '../../../msp-core/components/address/address.component';
import { MspPhoneComponent } from '../../../../components/msp/common/phone/phone.component';
import { FinancialAssistApplication } from '../../models/financial-assist-application.model';
import { AssistanceYear } from '../../models/assistance-year.model';
import { MspPerson } from 'app/modules/account/models/account.model';
import { AssistStateService } from '../../services/assist-state.service';
import { Observable } from 'rxjs';

@Component({
  // templateUrl: './personal-info.component.html'
  template: `
    <h2>{{ title }}</h2>
    <h3>{{ subtitle }}</h3>
    <p class="border-bottom">{{ description }}</p>
    <common-page-section>
      <form #formRef="ngForm" novalidate>
        <msp-assist-account-holder
          [person]="financialAssistApplication.applicant"
          (dataChange)="saveAccountHolder($event)"
        ></msp-assist-account-holder>
      </form>
    </common-page-section>
    <h3>{{ documentsTitle }}</h3>
    <p class="border-bottom">{{ documentsDescription }}</p>
    <msp-assist-cra-documents
      [assistanceYears]="assistanceYears"
      [touched]="touched$ | async"
    ></msp-assist-cra-documents>
  `
})
export class AssistancePersonalInfoComponent extends BaseComponent {
  //DEF-74 KPS
  static ProcessStepNum = 1;

  @ViewChild('formRef') personalInfoForm: NgForm;
  @ViewChild('address') address: MspAddressComponent;
  @ViewChild('phone') phone: MspPhoneComponent;
  financialAssistApplication: FinancialAssistApplication;

  touched$: Observable<any>;

  title = 'Tell us about who is applying and upload official documents';
  subtitle = 'Account Holder (Main Applicant)';
  description =
    'Enter your legal name as it appears on your official Canadian identity documents, e.g., birth certificate, permanent resident card, passport.';
  documentsTitle = 'Documents';
  documentsDescription =
    'Upload your Notice of Assessment (NOA) or Notice of Reassessment (NORA) from Canada Revenue Agency for ';

  assistanceYears: any[];
  constructor(
    private dataService: MspDataService,
    private _router: Router,
    private route: ActivatedRoute,
    private stateSvc: AssistStateService,
    //private _processService: ProcessService,
    cd: ChangeDetectorRef
  ) {
    super(cd);
    this.financialAssistApplication = this.dataService.finAssistApp;
    // if the country is blank or null or undefined then assign Canada By Default //DEF-153
    if (
      !this.financialAssistApplication.mailingAddress.country ||
      this.financialAssistApplication.mailingAddress.country.trim().length === 0
    ) {
      this.financialAssistApplication.mailingAddress.country = 'Canada';
    }
  }

  ngAfterViewInit() {
    this.subscriptionList.push(
      this.personalInfoForm.valueChanges
        .pipe(
          debounceTime(250),
          distinctUntilChanged()
        )
        .subscribe(val => {
          this.dataService.saveFinAssistApplication();
        })
    );

    setTimeout(
      () => (this.touched$ = this.stateSvc.touched.asObservable()),
      500
    );

    this.stateSvc.setIndex(this.route.snapshot.routeConfig.path);
  }

  ngOnInit() {
    const assistYears = this.financialAssistApplication.assistYears;
    let arr = [];
    const checkYear = (year: AssistanceYear) => {
      return year.apply ? year : null;
    };
    for (let year of assistYears) {
      arr.push(checkYear(year));
    }
    this.assistanceYears = arr
      .filter(itm => itm != null)
      .map(itm => {
        let obj = itm;
        if (!obj.files) obj.files = [];
        return obj;
      });

    this.documentsDescription += this.createDocumentDesc(this.assistanceYears);
  }
  ngOnDestroy() {
    this.subscriptionList.forEach(itm => itm.unsubscribe());
  }

  createDocumentDesc(years: any[]) {
    return years
      .map(itm => itm.year)
      .sort((a, b) => a - b)
      .reduce((a, b, i, arr) =>
        i === arr.length - 1 ? `${a} and ${b}.` : `${a}, ${b}`
      );
  }

  // onChange($event) {
  //   console.log('event', $event);
  //   console.log('changes from child component triggering save: ');
  //   this.dataService.saveFinAssistApplication();
  // }

  // Final check to see if the country is present // DEF 153

  saveAccountHolder(evt: MspPerson) {
    console.log(evt);
    this.dataService.saveFinAssistApplication();
  }
}
