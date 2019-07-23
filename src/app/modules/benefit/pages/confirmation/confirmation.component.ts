import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {BaseComponent} from '../../../../models/base.component';
import {Subscription} from 'rxjs';
import {MspBenefitDataService} from '../../services/msp-benefit-data.service';
import {ActivatedRoute} from '@angular/router';
import {BenefitApplication} from '../../models/benefit-application.model';
import * as moment from 'moment';

@Component({
  selector: 'msp-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class BenefitConfirmationComponent {

    lang = require('./i18n');
    confirmationNum: string;
    subscription: Subscription;

    constructor(private route: ActivatedRoute, public dataService: MspBenefitDataService) {

    }

    ngOnInit(): void {
        this.subscription = this.route.queryParams.subscribe(
            params => {
                this.confirmationNum = params['confirmationNum'];
            }
        );
    }

    get benefitApp(): BenefitApplication {
        return this.dataService.benefitApp;
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    /**
     * Today's date
     * @returns {string}
     */
    get dateStamp(): string {
        return moment().format('MMMM DD, YYYY');
    }
}
