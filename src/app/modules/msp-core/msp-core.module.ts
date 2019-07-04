import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MspFullNameComponent } from './components/full-name/full-name.component';
import { SharedCoreModule } from 'moh-common-lib';
import { CaptchaModule } from 'moh-common-lib/captcha';
import { FormsModule } from '@angular/forms';
import { PersonalDetailsComponent } from './components/personal-details/personal-details.component';
import { CitizenStatusComponent } from './components/citizen-status/citizen-status.component';
import { ServicesCardDisclaimerModalComponent } from './components/services-card-disclaimer/services-card-disclaimer.component';
import { MspStatusInCanadaRadioComponent } from './components/status-in-canada-radio/status-in-canada-radio.component';
import { TextMaskModule } from 'angular2-text-mask';
import { MspIdReqModalComponent } from './components/id-req-modal/id-req-modal.component';
import { MspBirthDateComponent } from './components/birthdate/birthdate.component';
import { MspImageErrorModalComponent } from './components/image-error-modal/image-error-modal.component';

// TOBE REVIEWED
import { HealthNumberComponent } from '../../components/msp/common/health-number/health-number.component';
import { CalendarYearFormatter } from '../../components/msp/common/calendar/calendar-year-formatter.component';
import { CalendarYearValidator } from '../../components/msp/common/calendar/calendar-year.validator';
import { CalendarDayValidator } from '../../components/msp/common/calendar/calendar-day.validator';
import { CalendarMonthValidator } from '../../components/msp/common/calendar/calendar-month.validator';
import { MspAddressComponent } from './components/address/address.component';
import { MspPhoneComponent } from '../../components/msp/common/phone/phone.component';
import { MspArrivalDateComponent } from '../../components/msp/common/arrival-date/arrival-date.component';
import { MspDischargeDateComponent } from '../../components/msp/common/discharge-date/discharge-date.component';
import { MspDepartureDateComponent } from '../../components/msp/common/departure-date/departure-date.component';
import { MspReturnDateComponent } from '../../components/msp/common/return-date/return-date.component';
import { MspSchoolDateComponent } from '../../components/msp/common/schoolDate/school-date.component';
import { MspGenderComponent } from '../../components/msp/common/gender/gender.component';
import { MspProgressBarComponent } from '../account/components/progressBar/progressBar.component';
import { TransmissionErrorView } from '../../components/msp/common/transmission-error-view/transmission-error-view.component';
import { MspOutofBCRecordComponent } from '../../components/msp/common/outof-bc/outof-bc.component';
import { MspConsentModalComponent } from './components/consent-modal/consent-modal.component';
import { MspCancelComponent } from '../../components/msp/common/cancel/cancel.component';
import { MspToggleComponent } from '../../components/msp/common/toggle/toggle.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalModule, AccordionModule, TypeaheadModule } from 'ngx-bootstrap';
import { RouterModule } from '@angular/router';
import { ReplacewithlinksPipe } from '../../components/msp/common/replace-link-pipe/replacewithlinks.pipe';
import { MspPersonCardComponent } from '../../components/msp/common/person-card/person-card.component';
import { MspContactCardComponent } from '../../components/msp/common/contact-card/contact-card.component';
import { CommonDeductionCalculatorComponent } from './components/common-deduction-calculator/common-deduction-calculator.component';
import { KeyboardEventListner } from './components/keyboard-listener/keyboard-listener.directive';
import { MspAddressCardPartComponent } from './components/address-card-part/address-card-part.component';
import { CommonButtonGroupComponent } from './components/common-button-group/common-button-group.component';
import { CommonIncomeInputtextComponent } from './components/common-income-inputtext/common-income-inputtext.component';
import { CommonButtonComponent } from './components/common-button/common-button.component';
import { MspLoggerDirective } from './components/logging/msp-logger.directive';
import { HttpClientModule } from '@angular/common/http';
import { ReviewPartComponent } from './components/review-part/review-part.component';
import { ReviewCardWrapperComponent } from './components/review-card-wrapper/review-card-wrapper.component';
import { ErrorComponent } from './components/error/error.component';

import { ConfirmationComponent } from './confirmation/confirmation.component';

import { PersonalDetailsRetroSuppbenComponent } from './components/personal-details-retro-suppben/personal-details-retro-suppben.component';
import { AddressRetroSuppbenComponent } from './components/address-retro-suppben/address-retro-suppben.component';

const componentList = [
  MspFullNameComponent,
  PersonalDetailsComponent,
  CitizenStatusComponent,
  ServicesCardDisclaimerModalComponent,
  MspStatusInCanadaRadioComponent,
  MspIdReqModalComponent,
  MspBirthDateComponent,
  MspImageErrorModalComponent,
  CommonDeductionCalculatorComponent,
  MspAddressCardPartComponent,
  CommonButtonGroupComponent,
  CommonIncomeInputtextComponent,
  CommonButtonComponent,
  ReviewPartComponent,
  ErrorComponent,
  PersonalDetailsRetroSuppbenComponent,

  // Directives
  KeyboardEventListner,
  MspLoggerDirective,
  ReviewCardWrapperComponent
];

// TODO: Review to determine whether these should be replace with moh-common-lib
// components or be moved into msp-core, or moh-common-lib component updated to
// support functionality
const templistCore = [
  // General
  CalendarYearFormatter,
  CalendarYearValidator,
  CalendarDayValidator,
  CalendarMonthValidator,
  MspAddressComponent,
  MspPhoneComponent,
  MspArrivalDateComponent,
  MspDischargeDateComponent,
  MspDepartureDateComponent,
  MspReturnDateComponent,
  MspSchoolDateComponent,
  MspGenderComponent,
  MspProgressBarComponent,
  TransmissionErrorView,
  MspOutofBCRecordComponent,
  MspConsentModalComponent,
  MspCancelComponent,
  MspToggleComponent,
  HealthNumberComponent,
  ReplacewithlinksPipe,
  MspPersonCardComponent,
  MspContactCardComponent
];
@NgModule({
  imports: [
    CommonModule,
    SharedCoreModule,
    FormsModule,
    NgSelectModule,
    TextMaskModule,
    ModalModule,
    AccordionModule,
    RouterModule,
    TypeaheadModule.forRoot(),
    CaptchaModule,
    HttpClientModule
  ],

  declarations: [componentList, templistCore, AddressRetroSuppbenComponent, ConfirmationComponent],

  exports: [
    componentList,
    SharedCoreModule,
    CaptchaModule,

    // TODO: Be reviewed
    templistCore,

    ConfirmationComponent
  ]
})
export class MspCoreModule {}