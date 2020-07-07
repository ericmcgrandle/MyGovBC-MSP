import { Component, ViewChild, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { MspAccountApp, AccountChangeOptions } from '../../models/account.model';
import { MspAccountMaintenanceDataService } from '../../services/msp-account-data.service';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { ContainerService, PageStateService } from 'moh-common-lib';
import { Router } from '@angular/router';
import { MspPerson } from '../../../../components/msp/model/msp-person.model';
import { Relationship } from 'app/models/relationship.enum';
import { BaseForm } from '../../models/base-form';
import { CancellationReasons } from '../../../../models/status-activities-documents';

@Component({
  selector: 'msp-spouse-info',
  templateUrl: './spouse-info.component.html',
  styleUrls: ['./spouse-info.component.scss']
})

export class SpouseInfoComponent extends BaseForm implements OnInit, AfterViewInit, OnDestroy {

  accountApp: MspAccountApp;
  accountChangeOptions: AccountChangeOptions;
  showAddSpouse: boolean;
  showRemoveSpouse: boolean;
  showUpdateSpouse: boolean;
  subscriptions: Subscription[];

  constructor(public dataService: MspAccountMaintenanceDataService,
              protected router: Router,
              protected containerService: ContainerService,
              protected pageStateService: PageStateService) {
    super(router, containerService, pageStateService);
    if (this.dataService.getMspAccountApp().hasSpouseAdded) {
      this.showAddSpouse = true;
    }
    if (this.dataService.getMspAccountApp().hasSpouseRemoved) {
      this.showRemoveSpouse = true;
    }
    if (this.dataService.getMspAccountApp().hasSpouseUpdated) {
      this.showUpdateSpouse = true;
    }
  }

  @ViewChild('formRef') form: NgForm;

  ngOnInit() {
    this.accountApp = this.dataService.accountApp;
    this.accountChangeOptions = this.dataService.accountApp.accountChangeOptions;
    this.pageStateService.setPageIncomplete(this.router.url);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(itm => itm.unsubscribe());
  }

  ngAfterViewInit() {
    if (this.form) {
      this.subscriptions = [
        this.form.valueChanges.pipe(
          debounceTime(100)
        ).subscribe(() => {
          this.dataService.saveMspAccountApp();
        })
      ];
    }
  }

  addSpouse() {
    this.accountApp.hasSpouseAdded = true;
    this.accountApp.hasSpouseUpdated = false;
    this.accountChangeOptions.dependentChange = true;
    this.showAddSpouse = true;
    this.showUpdateSpouse = false;
    return this.showAddSpouse;
  }

  removeSpouse() {
    this.accountApp.hasSpouseRemoved = true;
    this.accountApp.hasSpouseUpdated = false;
    this.accountChangeOptions.dependentChange = true;
    this.showRemoveSpouse = true;
    this.showUpdateSpouse = false;
    return this.showRemoveSpouse;
  }

  updateSpouse() {
    this.accountApp.hasSpouseAdded = false;
    this.accountApp.hasSpouseRemoved = false;
    this.accountApp.hasSpouseUpdated = true;
    this.showRemoveSpouse = false;
    this.showAddSpouse = false;
    this.showUpdateSpouse = true;
    return this.showUpdateSpouse;
  }

  removedAddedSpouse() {
    this.addedSpouse.documents = null;
    this.showAddSpouse = false;
    this.accountApp.hasSpouseAdded = false;
    this.accountChangeOptions.dependentChange = false;
    this.dataService.accountApp.addedSpouse = new MspPerson(Relationship.Spouse);
}

  removedDeletedSpouse() {
    this.removedSpouse.documents = null;
    this.showRemoveSpouse = false;
    this.accountApp.hasSpouseRemoved = false;
    this.accountChangeOptions.dependentChange = false;
    this.dataService.accountApp.removedSpouse = new MspPerson(Relationship.Spouse);
  }

  removedUpdatedSpouse() {
    this.updatedSpouse.documents = null;
    this.showUpdateSpouse = false;
    this.accountApp.hasSpouseUpdated = false;
    this.dataService.accountApp.updatedSpouse = new MspPerson(Relationship.Spouse);
  }

  get addedSpouse(): MspPerson {
    return this.dataService.getMspAccountApp().addedSpouse;
  }

  get removedSpouse(): MspPerson {
    return this.dataService.getMspAccountApp().removedSpouse;
  }

  get updatedSpouse(): MspPerson {
    return this.dataService.getMspAccountApp().updatedSpouse;
  }

  get showAddedSpouseBottomButtons(): boolean {
    return this.accountApp.addedSpouse.immigrationStatusChange !== undefined;
  }

  checkAdd() {
    let valid = true;
    if (this.accountApp.hasSpouseAdded === true) {
      valid = valid && this.addedSpouse.immigrationStatusChange !== undefined;
    }
    valid = valid && this.addedSpouse.gender !== undefined
      && this.addedSpouse.updateNameDueToMarriage !== undefined;
    if (this.addedSpouse.updateStatusInCanada === true) {
      valid = valid && this.addedSpouse.updateStatusInCanadaDocType.images !== undefined;
    }
    if (this.addedSpouse.updateNameDueToMarriage === true) {
      valid = valid && this.addedSpouse.updateNameDueToMarriageRequestedLastName
        && this.addedSpouse.updateNameDueToMarriageRequestedLastName.length > 0
        && this.addedSpouse.updateNameDueToMarriageRequestedLastName.match(/\d+/g) === null
        && this.addedSpouse.nameChangeDocs.images.length > 0;
    }
    return valid;
  }

  checkRemove() {
    let valid = true;
    valid = valid && this.removedSpouse.cancellationReason !== undefined;
    if (this.removedSpouse.cancellationReason === CancellationReasons.SeparatedDivorced) {
      valid = valid && this.removedSpouse.hasCurrentMailingAddress !== undefined
        && this.removedSpouse.removedSpouseDueToDivorceDoc.images
        && this.removedSpouse.removedSpouseDueToDivorceDoc.images.length > 0;
    }
    if (this.removedSpouse.cancellationReason !== undefined
      && this.removedSpouse.cancellationReason !== CancellationReasons.OutOfProvinceOrCountry) {
      valid = valid && this.removedSpouse.cancellationDate !== undefined
        && this.removedSpouse.cancellationDate !== null;
    }
    return valid;
  }

  checkUpdate() {
    let valid = true;
    if (this.updatedSpouse.updateStatusInCanada === true) {
      valid = valid && this.updatedSpouse.updateStatusInCanadaDocType.images.length > 0;
    }
    if (this.updatedSpouse.updateNameDueToMarriage === true) {
      valid = valid && this.updatedSpouse.updateNameDueToMarriageDocType.images.length > 0;
    }
    if (this.updatedSpouse.updateNameDueToNameChange === true) {
      valid = valid && this.updatedSpouse.updateNameDueToNameChangeDocType.images.length > 0;
    }
    if (this.updatedSpouse.updateGender === true) {
      valid = valid && this.updatedSpouse.updateGenderDocType.images.length > 0
        && this.updatedSpouse.updateGenderDocType2.images.length > 0;
      if (this.updatedSpouse.updateGenderAdditionalDocs === true) {
        valid = valid && this.updatedSpouse.updateGenderDocType3.images.length > 0;
      }
    }
    if (this.updatedSpouse.updateNameDueToError === true) {
      valid = valid && this.updatedSpouse.updateNameDueToErrorDocType.images.length > 0;
    }
    if (this.updatedSpouse.updateBirthdate === true) {
      valid = valid && this.updatedSpouse.updateBirthdateDocType.images.length > 0;
    }
    if (this.updatedSpouse.updateGenderDesignation === true) {
      valid = valid && this.updatedSpouse.updateGenderDesignationDocType.images.length > 0;
    }
    return valid;
  }

  canContinue(): boolean {
    let valid = super.canContinue();
    if (this.accountApp.hasSpouseAdded === true) {
      valid = valid && this.checkAdd();
    }
    if (this.accountApp.hasSpouseRemoved === true) {
      valid = valid && this.checkRemove();
    }
    if (this.accountApp.hasSpouseUpdated === true) {
      valid = valid && this.checkUpdate();
    }
    return valid;
  }

  continue(): void {
    if (!this.canContinue()) {
      console.log('Please fill in all required fields on the form.');
      this.markAllInputsTouched();
      return;
    }
    this.navigate('/deam/child-info');
  }
}
