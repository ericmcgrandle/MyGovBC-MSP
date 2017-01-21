import {Relationship, StatusInCanada, Activities} from "./status-activities-documents";
import {PersonDocuments} from "./person-document.model";
import {Address} from "./address.model";
import moment = require("moment");
import {UUID} from "angular2-uuid";
import * as _ from 'lodash';

var sha1 =  require('sha1');

enum Gender {
  Female = <any>"F",
  Male = <any>"M"
}

class Person {

  readonly uuid = UUID.UUID();

  relationship: Relationship;
  _status: StatusInCanada;
  _currentActivity: Activities;
  documents: PersonDocuments = new PersonDocuments();
  /**
   * Name section
   */
  firstName: string;
  middleName: string;
  lastName: string;

  /**
   * Gender
   */
  gender: Gender;

  /**
   * Date of birth section
   */
  dob_day: number;
  dob_month: number;
  dob_year: number;

  get hasDob(): boolean {
    return (this.dob_year != null &&
      this.dob_month != null &&
      this.dob_day != null);
  }

  get dob() {
    return this.parseDate(this.dob_year, this.dob_month, this.dob_day);
  }

  arrivalToBCDay: number;
  arrivalToBCMonth: number;
  arrivalToBCYear: number;

  get hasArrivalToBC(): boolean {
    return (this.arrivalToBCDay != null &&
      this.arrivalToBCMonth != null &&
      this.arrivalToBCYear != null);
  }

  get arrivalToBC() {
    return this.parseDate(this.arrivalToBCYear, this.arrivalToBCMonth, this.arrivalToBCDay);
  }

  arrivalToCanadaDay: number;
  arrivalToCanadaMonth: number;
  arrivalToCanadaYear: number;

  get arrivalToCanada() {
    return this.parseDate(this.arrivalToCanadaYear, this.arrivalToCanadaMonth, this.arrivalToCanadaDay);
  }

  get hasArrivalToCanada(): boolean {
    return (this.arrivalToCanadaDay != null &&
    this.arrivalToCanadaMonth != null &&
    this.arrivalToCanadaYear != null);
  }

  /**
   * BC Personal Health Number
   */
  previous_phn: string;
  healthNumberFromOtherProvince:string;
  hasPreviousBCPhn: boolean;

  institutionWorkHistory: string;

  /**
   * Discharge date if worked in CDN forces
   */
  dischargeYear: number;
  dischargeMonth: number;
  dischargeDay: number;

  get hasDischarge(): boolean {
    return (this.dischargeDay != null &&
    this.dischargeMonth != null &&
    this.dischargeYear != null);
  }

  get dischargeDate() {
    return this.parseDate(this.dischargeYear, this.dischargeMonth, this.dischargeDay);
  }

  /**
   * Which province the person has moved from
   */
  movedFromProvince: string;

  /**
   * This property is for storing user provided answer to the following question:
   * Do you currently live in BC?
   */
  liveInBC:boolean;

  /**
   * Derived from answer to question: Do you have a previous PHN?
   * If answser is NO, the livedInBCSinceBirth = false
   * See https://apps.gcpe.gov.bc.ca/jira/browse/PSPDN-398
   */
  livedInBCSinceBirth:boolean = null;

  /**
   * This property is for storing user provided answer to the following question:
   * Are you planning to stay for six months or longer
   */
  stayForSixMonthsOrLonger:boolean;

  /**
   * This property is for storing user provided answer to the following question:
   * Are you planning to leave BCfor longer than 30 days in the next six months?
   */
  plannedAbsence:boolean;


  fullTimeStudent: boolean;
  inBCafterStudies: boolean;

  /**
   * For children 19-24, we need the school name and address
   */
  schoolName: string;
  schoolAddress: Address = new Address();

  /**
   * When the student expects to finish
   */
  studiesFinishedYear: number;
  studiesFinishedMonth: number;
  studiesFinishedDay: number;

  get hasStudiesFinished(): boolean {
    return (this.studiesFinishedDay != null &&
    this.studiesFinishedMonth != null &&
    this.studiesFinishedYear != null);
  }

  get studiesFinishedDate() {
    return this.parseDate(this.studiesFinishedYear, this.studiesFinishedMonth, this.studiesFinishedDay);
  }

  /**
   * If school outside BC when did they leave
   */
  studiesDepartureYear: number;
  studiesDepartureMonth: number;
  studiesDepartureDay: number;

  get hasStudiesDeparture(): boolean {
    return (this.studiesDepartureDay != null &&
    this.studiesDepartureMonth != null &&
    this.studiesDepartureYear != null);
  }

  get studiesDepartureDate() {
    return this.parseDate(this.studiesDepartureYear, this.studiesDepartureMonth, this.studiesDepartureDay);
  }

  get status(){
    return this._status;
  }
  set status(st:StatusInCanada){
    this._status = st;
    if(this._status === StatusInCanada.PermanentResident 
      || this._status === StatusInCanada.TemporaryResident){
        this.livedInBCSinceBirth = false;
      }
  }

  get currentActivity(){
    return this._currentActivity;
  }

  /**
   * All activies in the system now indicates that person has not lived in BC since birth.
   */
  set currentActivity(act: Activities) {
    this._currentActivity = act;
    this.livedInBCSinceBirth = false;
  }

  get hasFullName():boolean {
    return (this.firstName != null &&
        this.lastName != null);
  }
  get fullName():string {
    let fullName = this.firstName;
    if (this.middleName != null &&
      this.middleName.length > 0) {
      fullName += " " + this.middleName;
    }
    fullName +=  " " + this.lastName;

    return fullName;
  }

  /**
   * Social Insurance Number
   */
  sin: string;

  /*
    Outside BC section
   */
  outsideBC: boolean = false;
  outsideBCDepartureDateYear: number;
  outsideBCDepartureDateMonth: number;
  outsideBCDepartureDateDay: number;
  outsideBCReturnDateYear: number;
  outsideBCReturnDateMonth: number;
  outsideBCReturnDateDay: number;
  outsideBCFamilyMemberReason: string;

  get hasOutsideBCDepartureDate(): boolean {
    return (this.outsideBCDepartureDateDay != null &&
    this.outsideBCDepartureDateMonth != null &&
    this.outsideBCReturnDateYear != null);
  }

  get hasOutsideBCReturnDate(): boolean {
    return (this.outsideBCReturnDateDay != null &&
    this.outsideBCReturnDateMonth != null &&
    this.outsideBCReturnDateYear != null);
  }

  get outsideBCDepartureDate() {
    return this.parseDate(this.outsideBCDepartureDateYear, this.outsideBCDepartureDateMonth, this.outsideBCDepartureDateDay);
  }

  get outsideBCReturnDate() {
    return this.parseDate(this.outsideBCReturnDateYear, this.outsideBCReturnDateMonth, this.outsideBCReturnDateDay);
  }

  /**
   These questions need to be visible to everyone except those who have selected one of the two following statuses:
   Canadian citizen - moving from another province
   Permanent Resident - moving from another province
   */
  test30DayCandidate(): boolean {
    if (this.status == StatusInCanada.CitizenAdult && this.currentActivity == Activities.MovingFromProvince) {
      return false;
    }
    if (this.status == StatusInCanada.PermanentResident && this.currentActivity == Activities.MovingFromProvince) {
      return false;
    }
    return true;
  }

  /**
   These questions need to be visible to everyone except those who have selected one of the two following statuses:
   Canadian citizen - moving from another province
   Permanent Resident - moving from another province
   */
  test30DayCandidateAvailable(): boolean {
    if (this.outsideBC) {
      return false;
    }
   return this.test30DayCandidate();
  }

  resetOutsideBCValues(): void {
    this.outsideBC = false;
    this.outsideBCFamilyMemberReason = null;
    this.outsideBCDepartureDateYear = null;
    this.outsideBCDepartureDateMonth = null;
    this.outsideBCDepartureDateDay = null;
    this.outsideBCReturnDateYear = null;
    this.outsideBCReturnDateMonth = null;
    this.outsideBCReturnDateDay = null;
  }


  id:string;
  constructor(rel: Relationship){
    this.relationship = rel;
    this.id = sha1(new Date().getTime()).substring(0,9);
  }

  private parseDate (year: number, month: number, day: number) {
    return moment({
      year: year,
      month: month - 1, // moment use 0 index for month :(
      day: day,
    }).utc(); // use UTC mode to prevent browser timezone shifting
  }

  private isNotEmpty(thing:any):boolean{
    return thing !== null && thing !== undefined;
  }

  get isInfoComplete(){
    let basic =  _.isString(this.gender)
    && _.isString(this.firstName) && this.firstName.length > 0 && _.isString(this.lastName) && this.lastName.length > 0
    // && this.isNotEmpty(this.dob_day) && this.isNotEmpty(this.dob_month) && this.isNotEmpty(this.dob_year)
    && _.isNumber(this.dob_day) && _.isString(this.dob_month) && _.isNumber(this.dob_year)
    && _.isNumber(this._status) && _.isNumber(this._currentActivity);

    let returningToBCComplete = true;

    // code 0 is "Returning to BC after an absence"
    if(this.currentActivity === 0){
      returningToBCComplete = _.isBoolean(this.hasPreviousBCPhn)
      && _.isNumber(this.arrivalToBCYear) && _.isString(this.arrivalToBCMonth) && _.isNumber(this.arrivalToBCDay);
    }

    // code 1 is "Moving from another province"
    let movingFromAnotherProvince = true;
    if(this.currentActivity === 1){
      movingFromAnotherProvince = _.isString(this.movedFromProvince) && this.movedFromProvince.length > 1;
    }

    let studentComplete = true;
    if(this.fullTimeStudent === true){
      studentComplete = _.isBoolean(this.inBCafterStudies);
    }

    let arrivalInCanadaComplete = _.isNumber(this.arrivalToCanadaDay) && _.isString(this.arrivalToCanadaMonth) && _.isNumber(this.arrivalToCanadaYear);
    return basic 
      && returningToBCComplete 
      && arrivalInCanadaComplete
      && movingFromAnotherProvince
      && studentComplete;
  }
}

export {Person, Gender};