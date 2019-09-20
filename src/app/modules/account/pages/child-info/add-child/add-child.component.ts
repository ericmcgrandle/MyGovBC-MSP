import { Component, OnInit, Input, AfterViewInit, OnDestroy, ChangeDetectorRef, Injectable , ViewChild, ViewChildren , QueryList } from '@angular/core';
import { nameChangeSupportDocuments } from '../../../../msp-core/components/support-documents/support-documents.component';
import { AbstractForm } from 'moh-common-lib';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {BaseComponent} from '../../../../../models/base.component';
import {ProcessService, ProcessUrls} from '../../../../../services/process.service';
//import { AccountPersonalDetailsComponent}  from './personal-details/personal-details.component';
import { MspPerson } from '../../../models/account.model';
import { Relationship } from '../../../../../models/status-activities-documents';
import { MspAccountMaintenanceDataService } from '../../../services/msp-account-data.service';
import {ActivatedRoute} from '@angular/router';
import { MspAccountApp, AccountChangeOptions, UpdateList } from '../../../models/account.model';
import { PersonDocuments } from '../../../../../components/msp/model/person-document.model';

import {
  StatusRules,
  ActivitiesRules,
  StatusInCanada,
  Activities,
  DocumentRules,
  Documents
} from '../../../../../models/status-activities-documents';

import {
  Gender
} from '../../../../../components/msp/model/msp-person.model';
import { Person } from 'moh-common-lib';



@Component({
  selector: 'msp-add-child',
  templateUrl: './add-child.component.html',
  styleUrls: ['./add-child.component.scss']
})
export class AddChildComponent implements OnInit {
  
  statusLabel: string = 'Child\'s immigration status in Canada';
  relationShip : Relationship;
  isChildUnder19: boolean; //  = false;
  isCHildAdopted: boolean;
  hasMedicalCoverage: boolean;
  hasNameChanged: boolean;
  hasStatus: boolean;

  status : StatusInCanada[] = [ StatusInCanada.CitizenAdult, StatusInCanada.PermanentResident , StatusInCanada.TemporaryResident];

  childAgeCategory = [
		{label: '0-18 years', value: Relationship.ChildUnder19},
		{label: '19-24 years (must be a full-time student)', value: Relationship.Child19To24},
  ];

  nameChangeDocList = nameChangeSupportDocuments();
  
  @Input() accountChangeOptions: AccountChangeOptions;
  @Input() child: MspPerson ;
  @Input() accountApp: MspAccountApp;
  @Input() index: number;

  constructor( public dataService: MspAccountMaintenanceDataService) { }

  ngOnInit() {
  }

  get statusDocuments(): PersonDocuments {
    return this.child.documents;
  }

  get childNameChangedocs() : PersonDocuments {

    return this.child.nameChangeDocs;
  };

  /*displayStatusOpt(index: number): boolean {
    return this.children[index].relationship !== Relationship.Unknown;
  }*/



}
