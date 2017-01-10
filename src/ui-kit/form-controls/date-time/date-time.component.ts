import {Component, Input, ViewChild, Output, EventEmitter, OnInit, forwardRef, OnChanges} from '@angular/core';
import * as moment from 'moment/moment';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from "@angular/forms";
import {LabelWrapper} from "../wrapper/label-wrapper.component";


const MY_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SamDateTimeComponent),
  multi: true
};

@Component({
  selector: 'samDateTime',
  template: `
    <labelWrapper [label]="label" [name]="name" [errorMessage]="errorMessage" [hint]="hint">
      <samTime #timeComponent [(value)]="time" (valueChange)="onInputChange($event)" [disabled]="disabled"></samTime>
      <samDate #dateComponent [(value)]="date" (valueChange)="onInputChange($event)" [name]='name' [disabled]="disabled"></samDate>
    </labelWrapper>
  `,
  providers: [ MY_VALUE_ACCESSOR ]
})
export class SamDateTimeComponent implements OnInit, OnChanges, ControlValueAccessor {
  @Input() value: string;
  @Output() valueChange: EventEmitter<any> = new EventEmitter();
  @Input() label: string;
  @Input() name: string;
  @Input() errorMessage: string;
  @Input() disabled: boolean = false;
  @Input() control;

  time: string = null;
  date: string = null;

  @ViewChild('dateComponent') dateComponent;
  @ViewChild('timeComponent') timeComponent;
  @ViewChild(LabelWrapper) wrapper;

  constructor() { }

  ngOnInit() {
    if (this.control) {
      this.wrapper.formatErrors(this.control);
    }
  }

  ngOnChanges() {
    this.setDateAndTime();
  }

  setDateAndTime() {
    if (this.value) {
      // use the more forgiving format (that doesn't need 0 padding) for inputs
      let m = moment(this.value, 'Y-M-DTH:m:s');
      if (m.isValid()) {
        this.time = m.format('H:m');
        this.date = m.format('Y-M-D');
      } else {
        console.error('[value] for samDateTime is invalid');
      }
    }
  }

  emitChanges(val) {
    this.onChange(val);
    this.valueChange.emit(val);
  }

  onInputChange() {
    if (this.date && this.time && this.dateComponent.isValid() && this.timeComponent.isValid()) {
      this.emitChanges(`${this.date}T${this.time}`);
      this.wrapper.formatErrors(this.control);
    } else {
      this.emitChanges(null);
    }
  }

  onChange: Function;
  onTouched: Function;

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  setDisabledState(disabled) {
    this.disabled = disabled;
  }

  writeValue(value) {
    this.value = value;
    this.setDateAndTime();
  }

}
