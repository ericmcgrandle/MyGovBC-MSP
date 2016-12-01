import {Component, Inject, Input} from '@angular/core'
import {Person} from "../../model/person.model";

require('./name.component.less')
@Component({
  selector: 'msp-name',
  templateUrl: './name.component.html'
})
export class MspNameComponent {
    lang = require('./i18n');

    @Input() person: Person;

    constructor(@Inject('appConstants') appConstants: Object) {
    }
}