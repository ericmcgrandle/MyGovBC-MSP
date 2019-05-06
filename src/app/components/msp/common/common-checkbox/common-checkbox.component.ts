import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';

@Component({
  selector: 'msp-common-checkbox',
  templateUrl: './common-checkbox.component.html',
  styleUrls: ['./common-checkbox.component.scss']
})
export class CommonCheckboxComponent implements OnInit {
  @Input() model: boolean = true ;
  @Input() required: boolean = true;
  @Input() disabled: boolean = false;
  @Input() label: string = 'Default Checkbox';
  @Input() checked: boolean =  false ;
  @Output() dataChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('checkbox') checkbox: ElementRef;

  constructor() { }

  ngOnInit() {
  }

  setCheckboxVal(event: boolean) {
    console.log(event);
    this.model = event;
    this.dataChange.emit(this.model);
  }

  focus() {
    this.checkbox.nativeElement.focus();
  }

}
