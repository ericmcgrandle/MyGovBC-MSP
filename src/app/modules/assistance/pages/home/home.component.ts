import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  TemplateRef
} from '@angular/core';
import { BaseComponent } from 'app/models/base.component';
import { MspDataService } from 'app/services/msp-data.service';
import { NgForm } from '@angular/forms';
import { PremiumRatesYear } from './home-constants';
import { debounceTime } from 'rxjs/operators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'msp-assist-home',
  template: `
    <common-page-section layout="noTips">
      <h2>Apply for Retroactive Premium Assistance</h2>
      <p>
        Retroactive Premium Assistance is available for up to six years prior to
        the current tax year for those on self-administered accounts. If you
        were covered on a group account during the period you are applying for,
        contact your group administrator.
      </p>

      <p>
        To be assessed for retroactive Premium Assistance, you must submit this
        form to Health Insurance BC (HIBC) with a copy of the Notice of
        Assessment (NOA) or Notice of Reassessment (NORA) from Canada Revenue
        Agency (CRA) for the applicable tax year.
      </p>

      <p>
        <!-- TODO: click to show modal -->
        <button class="btn btn-link p-0" (click)="openModal(modal)">
          MSP premium rates
        </button>
        are based on the previous tax year’s adjusted net income. (For example,
        2019 premiums are based on 2018 income.)
      </p>

      <p class="border-bottom">
        You will be required during this application to upload a copy of your
        Canada Revenue Agency Notice of Assessment or Notice of Reassessment
        (and your spouse’s, if applicable)
      </p>
      <form #formRef="ngForm" novalidate>
        <div class="row">
          <common-checkbox
            class="col"
            *ngFor="let option of options; index as i"
            [(ngModel)]="option.apply"
            [checked]="option.apply"
            [label]="option.year"
            (dataChange)="applyOption($event, i)"
            id="{{ option.year }}"
            name="{{ option.year }}"
          ></common-checkbox>
        </div>
      </form>
    </common-page-section>
    <ng-template #modal>
      <msp-assist-rates-helper-modal
        [rateData]="rateData"
      ></msp-assist-rates-helper-modal>
    </ng-template>
  `,
  styleUrls: ['./home.component.scss']
})
export class AssistanceHomeComponent extends BaseComponent implements OnInit {
  // @ViewChild('formRef') form: NgForm;
  title = 'Apply for Retroactive Premium Assistance';
  options: import('/Users/sean/MyGovBC-MSP/src/app/modules/assistance/models/assistance-year.model').AssistanceYear[];
  rateData: {};
  modalRef: BsModalRef;

  constructor(
    cd: ChangeDetectorRef,
    private dataSvc: MspDataService,
    private modalSvc: BsModalService
  ) {
    super(cd);
  }

  ngOnInit() {
    this.options = this.dataSvc.finAssistApp.assistYears;
    const data = {};
    for (let assistYear of this.options) {
      const helperData = new PremiumRatesYear();
      data[assistYear.year] = { ...helperData.brackets };
    }
    this.rateData = data;
  }

  applyOption(bool: boolean, i: number) {
    this.options[i].apply = bool;
    this.dataSvc.saveFinAssistApplication();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalSvc.show(template, {
      backdrop: true,
      class: 'modal-md',
      keyboard: false
    });
  }
}
