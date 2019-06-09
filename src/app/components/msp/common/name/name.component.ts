import {Component, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef} from '@angular/core';
import {Person} from '../../model/msp-person.model';
import {NgForm} from '@angular/forms';
import {BaseComponent} from '../base.component';
import {debounceTime} from "rxjs/operators";


@Component({
  selector: 'msp-name',
  templateUrl: './name.component.html'
})
export class MspNameComponent extends BaseComponent {
  lang = require('./i18n');

  @Input() person: Person;
  @Input() showError: boolean;
  @Output() onChange = new EventEmitter<any>();
  @ViewChild('formRef') form: NgForm;
  Person: typeof Person = Person;

  constructor(private cd: ChangeDetectorRef) {
    super(cd);
  }

  ngAfterViewInit(): void {
      // https://github.com/angular/angular/issues/24818
      this.form.valueChanges.pipe(debounceTime(0)).subscribe((values) => {
        this.onChange.emit(values);
      }
    );
  }
}
