import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';
import { state, trigger, style } from '@angular/animations';
import {
  MspPerson,
  Gender
} from '../../../../components/msp/model/msp-person.model';
import { OutofBCRecord } from '../../../../models/outof-bc-record.model';
import {
  ActivitiesRules,
  StatusInCanada,
  Activities,
  DocumentRules,
  Documents,
  Relationship,
  LangStatus,
  LangActivities
} from '../../../msp-core/models/status-activities-documents';
import { MspImage } from '../../../../models/msp-image';
import * as _ from 'lodash';

import { MspGenderComponent } from '../../../../components/msp/common/gender/gender.component';
import { MspSchoolDateComponent } from '../../../../components/msp/common/schoolDate/school-date.component';
import { HealthNumberComponent } from '../../../../components/msp/common/health-number/health-number.component';
import { MspDischargeDateComponent } from '../../../../components/msp/common/discharge-date/discharge-date.component';

import { MspArrivalDateComponent } from '../../../../components/msp/common/arrival-date/arrival-date.component';
import { MspOutofBCRecordComponent } from '../../../../components/msp/common/outof-bc/outof-bc.component';
import { BaseComponent } from '../../../../models/base.component';
import {
  CANADA,
  Address,
  ProvinceList,
  BRITISH_COLUMBIA} from 'moh-common-lib';
import { MspAddressConstants } from '../../../../models/msp-address.constants';
import { MspDocumentConstants } from '../../../../models/msp-document.constants';
import { MspIdReqModalComponent } from '../../../msp-core/components/id-req-modal/id-req-modal.component';
import { MspImageErrorModalComponent } from '../../../msp-core/components/image-error-modal/image-error-modal.component';
import { MspBirthDateComponent } from '../../../msp-core/components/birthdate/birthdate.component';
import { MspAddressComponent } from '../../../msp-core/components/address/address.component';
import { ServicesCardDisclaimerModalComponent } from '../../../msp-core/components/services-card-disclaimer/services-card-disclaimer.component';
@Component({
  selector: 'msp-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss'],

  animations: [
    trigger('shrinkOut', [
      state('in', style({ display: 'none' })),
      state('out', style({ display: 'block' }))
      // transition('* => *', animate(500))
    ]),

    trigger('shrinkOutStatus', [
      state('in', style({ display: 'none' })),
      state('out', style({ display: 'block' }))
      // transition('* => *', animate(500))
    ]),

    trigger('genderListSignal', [
      state('in', style({ display: 'none' })),
      state('out', style({ display: 'block' }))
      // transition('* => *', animate(500))
    ]),

    trigger('institutionWorkSignal', [
      state('in', style({ display: 'none' })),
      state('out', style({ display: 'block' }))
      // transition('* => *', animate(500))
    ])
  ]
})
export class PersonalDetailsComponent extends BaseComponent {
  /**
   * Constant values for this component
   * TODO: Determine if any of these constants are common to other components
   *
   * NOTE: Address information should be a separate component as its elements are repeated on this page
   */
  movedFromCountryLabel = 'Which country are you moving from?';
  movedFromProvinceLabel = [
   'Which province are you moving from?',
   'Which province are they moving from?',
   'Which province are they moving from?',
   'Which province are they moving from?'
  ];


  documentUploadLabel = [
    'Upload your documents',
    ' Upload your spouse\'s documents',
    'Upload your child\'s documents',
    '<\Upload your child\'s documents'
  ];

  langDocuments = MspDocumentConstants.documentList;

  lang = require('./i18n');
  langActivities = LangActivities;


  // Expose some types to template
  Activities: typeof Activities = Activities;
  Relationship: typeof Relationship = Relationship;
  StatusInCanada: typeof StatusInCanada = StatusInCanada;
  Gender: typeof Gender = Gender;

  public styleClass = 'control-label';

  @ViewChild('idReqModal') idReqModal: MspIdReqModalComponent;
  @ViewChild('imageErrorModal') imageErrorModal: MspImageErrorModalComponent;
  @ViewChild('outOfBCRecord') outOfBCRecord: MspOutofBCRecordComponent;
  @ViewChild('gender') gender: MspGenderComponent;
  @ViewChild('birthDate') birthdate: MspBirthDateComponent;
  @ViewChild('arrivalDateBC') arrivalDateBC: MspArrivalDateComponent;
  @ViewChild('arrivalDateCanada') arrivalDateCanada: MspArrivalDateComponent;
  @ViewChild('healthNumber') healthNumber: HealthNumberComponent;
  @ViewChild('armedForcedQuestion') armedForcedQuestion: HTMLElement;
  @ViewChild('dischargeDate') dischargeDate: MspDischargeDateComponent;
  @ViewChild('schoolQuestion') schoolQuestion: HTMLElement;
  @ViewChild('inBCAfterStudiesQuestion') inBCAfterStudiesQuestion: HTMLElement;
  @ViewChild('schoolAddress') schoolAddress: MspAddressComponent;
  @ViewChild('schoolDate') schoolDate: MspSchoolDateComponent;
  @ViewChild('mspServicesCardModal')
  servicesCardDisclaimerModalComponent: ServicesCardDisclaimerModalComponent;

  @Input() person: MspPerson;
  @Input() id: string;
  @Input() showError: boolean;
  @Output() notifyChildRemoval: EventEmitter<MspPerson> = new EventEmitter<
    MspPerson
  >();
  @Output() notifySpouseRemoval: EventEmitter<MspPerson> = new EventEmitter<
    MspPerson
  >();
  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();


  shrinkOut: string;
  shrinkOutStatus: string;
  genderListSignal: string;
  institutionWorkSignal: string;
  showServicesCardModal: boolean = false;

  /** Hides the 'Clear Spouse/Child' button, and the <hr> at the end of the component. Useful in layouts where this form must be embedded in a larger form.. */
  @Input() embedded: boolean = false;





  // START -- NEW CODE FOR PAGE
  @Input() sectionTitle: string = 'Status in Canada';
  @Input() sectionInstruct: string = 'Please provide your immigration status information. You will be required to upload documents to support your status in Canada.';
  @Input() statusLabel: string = 'Your immigration status in Canada';


  statusOpts: string[] = Object.keys(LangStatus).map( x  => LangStatus[x] );

  selectedOpt; // Temporary
  // END -- NEW CODE FOR PAGE

  constructor(private el: ElementRef, private cd: ChangeDetectorRef) {
    super(cd);
  }


  institutionList: string[] = ['Yes', 'No'];

  /**
   * Gets status available to the current person
   */
 /* get statusInCanada(): StatusInCanada[] {
    return StatusRules.availableStatus(this.person.relationship);
  }*/

  setStatus(value: StatusInCanada, p: MspPerson) {
    if (typeof value === 'object') return;
    p.status = value;
    p.currentActivity = null;

    if (p.status !== StatusInCanada.CitizenAdult) {
      p.institutionWorkHistory = 'No';
    }
    this.showServicesCardModal = true;

    this.onChange.emit(value);
  }

  setActivity(value: Activities) {
    if (
      this.showServicesCardModal &&
      this.person.bcServiceCardShowStatus &&
      this.person.relationship !== this.Relationship.ChildUnder19
    ) {
      this.servicesCardDisclaimerModalComponent.showModal();
      this.showServicesCardModal = false;
    }

    this.person.currentActivity = value;
    this.person.movedFromProvinceOrCountry = '';
    this.onChange.emit(value);
  }

  get activitiesTable() {
    if (!this.activities) return;
    return this.activities.map(itm => {
      const label = this.langActivities[itm];
      return {
        label,
        value: itm
      };
    });
  }

  /**
   * Gets the available activities given the known status
   */
  get activities(): Activities[] {
    return ActivitiesRules.availableActivities(
      this.person.relationship,
      this.person.status
    );
  }

  /**
   * Gets the available documents given the known status and activity
   */
  get documents(): Documents[] {
    return DocumentRules.availiableDocuments(
      this.person.status,
      this.person.currentActivity
    );
  }

  /**
   * Gets the available documents given the known status and activity
   */
  get nameChangeDocuments(): Documents[] {
    return DocumentRules.nameChangeDocument();
  }

  addDocument(evt: MspImage) {
    this.person.documents.images = this.person.documents.images.concat(evt);
    this.onChange.emit(evt);
  }

  deleteDocument(evt: Array<any>) {
    console.log('evt', evt);
    this.person.documents.images = evt;
    this.onChange.emit(evt);
  }

  errorDocument(evt: MspImage) {
    this.imageErrorModal.imageWithError = evt;
    this.imageErrorModal.showFullSizeView();
    this.imageErrorModal.forceRender();
  }

  ngAfterContentInit() {
    super.ngAfterContentInit();

    this.cd.detectChanges();
    /**
     * Load an empty row to screen
     */
    if (this.person.relationship === Relationship.Spouse) {
      window.scrollTo(0, this.el.nativeElement.offsetTop);
    }
  }

  get arrivalDateLabel(): string {
    if (this.person.currentActivity === Activities.LivingInBCWithoutMSP) {
      return 'Most recent move to B.C.';
    }
    return 'Arrival date in B.C.';
  }

  provinceUpdate(evt: string) {
    this.person.movedFromProvinceOrCountry = evt;
    this.onChange.emit(evt);
  }

  get schoolInBC(): boolean {
    return (
      this.person.schoolAddress &&
      this.person.schoolAddress.province &&
      this.person.schoolAddress.province ===  BRITISH_COLUMBIA
    );
  }
  setFullTimeStudent(event: any) {
    this.person.fullTimeStudent = event;
    if (!this.person.fullTimeStudent) {
      this.person.inBCafterStudies = null;
    }
    this.onChange.emit(event);
    this.emitIsFormValid();
  }
  setStayInBCAfterStudy(event: boolean) {
    this.person.inBCafterStudies = event;
    this.onChange.emit(event);
    this.emitIsFormValid();
    this.emitIsFormValid();
  }

  schoolAddressUpdate(evt: any) {
    this.onChange.emit(evt);
  }

  setHasPreviousPhn(value: boolean) {
    this.person.hasPreviousBCPhn = value;
    this.onChange.emit(value);
    this.cd.detectChanges();
    this.emitIsFormValid();
  }
  updateSchoolExpectedCompletionDate(evt: any) {
    this.person.studiesFinishedDay = evt.day;
    this.person.studiesFinishedMonth = evt.month;
    this.person.studiesFinishedYear = evt.year;
    this.onChange.emit(evt);
  }

  updateSchoolDepartureDate(evt: any) {
    this.person.studiesDepartureDay = evt.day;
    this.person.studiesDepartureMonth = evt.month;
    this.person.studiesDepartureYear = evt.year;
    this.onChange.emit(evt);
  }

  removeChild(): void {
    this.notifyChildRemoval.emit(this.person);
    // this.notifyChildRemoval.next(id);
  }

  removeSpouse(): void {
    this.notifySpouseRemoval.emit(this.person);
  }

  get institutionWorkHistory(): string {
    return this.person.institutionWorkHistory;
  }

  selectInstitution(evt: boolean) {
    if (!evt) this.person = this.clearHistory(this.person);
    const history = evt ? 'Yes' : 'No';
    this.person.institutionWorkHistory = history;
    this.cd.detectChanges();
    this.onChange.emit(history);
    this.emitIsFormValid();
  }

  clearHistory(person: MspPerson) {
    person.dischargeDay = null;
    person.dischargeMonth = null;
    person.dischargeYear = null;
    return person;
  }

  toggleInstituationList() {
    this.institutionWorkSignal === 'out'
      ? (this.institutionWorkSignal = 'in')
      : (this.institutionWorkSignal = 'out');
  }

  get hasValidCurrentActivity(): boolean {
    const v = _.isNumber(this.person.currentActivity);
    return v;
  }

  get isInstitutionListShown() {
    return this.institutionWorkSignal === 'out';
  }

  handleHealthNumberChange(evt: string) {
    this.person.healthNumberFromOtherProvince = evt;
    this.onChange.emit(evt);
  }

  setBeenOutsideForOver30Days(out: boolean) {
    this.person.declarationForOutsideOver30Days = out;
    if (out) {
      this.person.outOfBCRecord = new OutofBCRecord();
    } else {
      this.person.outOfBCRecord = null;
    }
    this.cd.detectChanges();
    this.onChange.emit(out);
    this.emitIsFormValid();
  }

  handleDeleteOutofBCRecord(evt: OutofBCRecord) {
    this.person.outOfBCRecord = null;
    this.onChange.emit(evt);
  }

  handleOutofBCRecordChange(evt: OutofBCRecord) {
    this.onChange.emit(evt);
  }
  //If false, then we don't want users continuing to further application;
  checkEligibility(): boolean {
    return !this.person.ineligibleForMSP;
  }

  setMovedToBCPermanently(moved: boolean) {
    this.person.madePermanentMoveToBC = moved;
    this.onChange.emit(moved);
    this.emitIsFormValid();
  }
  setLivedInBCSinceBirth(lived: boolean) {
    this.person.livedInBCSinceBirth = lived;
    this.onChange.emit(lived);
    this.emitIsFormValid();
    this.cd.detectChanges();
  }

  viewIdReqModal(event: Documents) {
    this.idReqModal.showFullSizeView(event);
  }

  isValid(): boolean {
    // Some inputs can be determine via the form.isValid,
    // check these explicitly

    // Status
    if (this.person.currentActivity == null) {
      return false;
    }

    // moved to bc permanently
    if (this.person.madePermanentMoveToBC == null) {
      console.log('madePermanentMoveToBC invalid');
      return false;
    }

    // outside bc 30 days
    if (this.person.declarationForOutsideOver30Days == null) {
      console.log('declarationForOutsideOver30Days invalid');
      return false;
    }

    // previous PHN
    if (this.person.hasPreviousBCPhn == null) {
      console.log('hasPreviousBCPhn invalid');
      return false;
    }

    // armed forces
    if (
      this.armedForcedQuestion != null &&
      this.person.institutionWorkHistory == null
    ) {
      console.log('institutionWorkHistory invalid');
      return false;
    }

    if (this.person.isArrivalToBcBeforeDob) {
      return false;
    }

    if (this.person.isArrivalToCanadaBeforeDob) {
      return false;
    }

    // school
    if (this.schoolQuestion != null && this.person.fullTimeStudent == null) {
      console.log('schoolQuestion invalid');
      return false;
    }
    if (this.person.fullTimeStudent && this.person.inBCafterStudies == null) {
      console.log('inBCafterStudies invalid');
      return false;
    }

    return true;
  }
  setGender(evt: Gender) {
    this.person.gender = evt;
  }

  isCanada(addr: Address): boolean {
    return addr && CANADA === addr.country;
  }

  // Province list
  provList(exceptBC: boolean = false): ProvinceList[] {
    return MspAddressConstants.provList(exceptBC);
  }
}
