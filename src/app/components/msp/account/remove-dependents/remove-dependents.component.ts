import {
    Component,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    ElementRef,
    ChangeDetectorRef,
    ViewChildren,
    QueryList
} from '@angular/core';
import {Person} from '../../model/person.model';
import {Relationship, StatusInCanada, CancellationReasons , CancellationReasonsForSpouse} from '../../model/status-activities-documents';
import {BaseComponent} from '../../common/base.component';
import {MspDataService} from '../../service/msp-data.service';
import {Router} from '@angular/router';
import {ProcessService} from '../../service/process.service';
import {LocalStorageService} from 'angular-2-local-storage';
import {MspToggleComponent} from '../../common/toggle/toggle.component';
import {MspStatusInCanadaRadioComponent} from '../../common/status-in-canada-radio/status-in-canada-radio.component';
import {MspAddressComponent} from '../../common/address/address.component';
import {AccountPersonalDetailsComponent} from '../personal-info/personal-details/personal-details.component';


@Component({
    selector: 'msp-remove-dependent',
    templateUrl: './remove-dependents.component.html',
    styleUrls: ['./remove-dependents.component.scss']
})
export class RemoveDependentComponent extends BaseComponent {
    // Constants for page - TODO: figure out which ones are common throughout application
    sectionTitle = [
        '', //0 indice is for the Applicant, but it doesn't make sense to have an applicant field here as it's about modifying dependents on on the plan.
        'Remove Spouse',
        '', //children under 19
        '', //children 19-24
        'Remove Children', //children under 24 - catch-all.
      ];


      sectionBody = [
        '',
        'A spouse is a resident of B.C. who is married to or is living and cohabiting in a marriage-like relationship with the applicant.', '', '', 'If you are removing a child, you do not need to upload supporting documentation. However, a child 0-18 years of age must have coverage under another account. (A child 19 years of age or over will be automatically set up on their own account.)'
      ];
      clearButton = [
        '',
        'Clear Spouse',
        '',
        '',
        'Clear Child',
      ];
      cancellationDate = 'Cancellation Date';
      reason = 'Reason for Cancellation';
      reasonDetailed = 'Please enter Reason for Cancellation';
      reasonDetailedRequired = 'Reason for cancellation is required.';

      cancellationReasonsChild = [
        // "Please select",
        'No longer in full time studies',
        'Deceased',
        'Out of Province / Out of Country',
        'Armed Forces',
        'Incarcerated'

      ];
        cancellationReasonsSpouse = [
            // "Please select",
            'Separated / Divorced',
            'Remove from account but still married/common-law',
            'Deceased',
            'Out of Province / Out of Country',
            'Armed Forces',
            'Incarcerated'
        ];
      pleaseSelect = 'Please select';
      knowSpouseCurrentMailing = [
        '',
        'Do you know your Spouse\'s current mailing address?',
        '',
        '',
        'Do you know your Child\'s current mailing address?',
      ];
      mailingAddr = 'Mailing Address';



    Relationship: typeof Relationship = Relationship;
    StatusInCanada: typeof StatusInCanada = StatusInCanada;
    CancellationReasons: typeof CancellationReasons = CancellationReasons;
    public showOtherCancellationReason: boolean = false;

    Person: typeof Person = Person;
    @Input() person: Person;
    @Output() onCancel: EventEmitter<void> = new EventEmitter<void>();
    @Output() onChange: EventEmitter<void> = new EventEmitter<void>();
    /** The element we focus on when this component is inited, for a11y. */
    @ViewChild('firstFocus') firstFocus: ElementRef;
    @Input() showError: boolean;
    @ViewChildren(MspToggleComponent) toggleComponents: QueryList<MspToggleComponent>;
    @ViewChildren(MspStatusInCanadaRadioComponent) statusRadioComponents: QueryList<MspStatusInCanadaRadioComponent>;
    @ViewChildren(AccountPersonalDetailsComponent) personalDetailsComponent: QueryList<AccountPersonalDetailsComponent>;

    constructor(private dataService: MspDataService,
                private _router: Router,
                private _processService: ProcessService,
                private cd: ChangeDetectorRef, private localStorageService: LocalStorageService) {

        super(cd);
    }


    change($event) {
        this.onChange.emit();
        this.emitIsFormValid();
    }

    ngAfterViewInit() {
        this.firstFocus.nativeElement.focus();
    }

    cancelDependentRemoval() {
        this.onCancel.emit();
    }

    /**
     * Returns an iterable array of Cancellation reasons, with the `prop` value
     * being the programmatic property name of CancellationRequests.
     *
     * @example
     * ```
     *    [
     *      {
   *        index: 0,
   *        prop: "NoLongerInFulLTimeStudies"
   *      }
     *    ]
     * ```
     */
    getCancellationReasonsIterable(relationship: number) {
       if (relationship === Relationship.ChildUnder24) {
        //CancellationReasons has duplicate keys, so only count half.
        return Object.keys(CancellationReasons)
            .filter(x => isNaN(Number(x)));

       } else {
              return Object.keys(CancellationReasonsForSpouse)
               .filter(x => isNaN(Number(x)));

       }
    }

    set reasonForCancellation(val: string) {
        this.person.reasonForCancellation = val;
    }

    /**
     * Essentially this is a wrapper for person.reasonForCancellation, but it has
     * special logic regarding "Other", as when the user selects "Other" we have
     * to show a text box allowing the user to select a custom string while
     * "Other" must remain shown in the <select> dropdown.
     *
     * Update - Other reason is removed during SLS changes
     */
    get reasonForCancellation() {
        //get all options
        const defaultOptions = this.getCancellationReasonsIterable(Relationship.ChildUnder24).concat(this.getCancellationReasonsIterable(Relationship.Spouse));

        if (this.person.reasonForCancellation === 'pleaseSelect') {
            return 'pleaseSelect';
        }

        const isDefaultOption = defaultOptions.indexOf(this.person.reasonForCancellation) >= 0;

        if (isDefaultOption) {
            return this.person.reasonForCancellation;
        }
        else {
            return 'Other';
        }

    }

    isValid(): boolean {
        // Some inputs can be determine via the form.isValid,
        // check these explicitly

        if (!this.person.reasonForCancellation || this.person.reasonForCancellation === 'pleaseSelect' ) {
            return false;
        }
        if (!this.person.cancellationDate) {
            return false;
        }
        if (this.person.knownMailingAddress) {
            return this.person.mailingAddress.isValid;
        }
        return true;
    }

    onChangeReasonForCancellation(event: string) {
        this.showOtherCancellationReason = event.toLowerCase() === 'other';
        if (!this.showOtherCancellationReason) {
            this.person.reasonForCancellation = event;
        }
        else {
            this.person.reasonForCancellation = '';
        }
        this.onChange.emit();
        this.emitIsFormValid();
    }
}
