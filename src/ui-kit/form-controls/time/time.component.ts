import {Component, Input, ViewChild, Output, EventEmitter, OnInit, OnChanges} from '@angular/core';
import * as moment from 'moment/moment';

@Component({
  selector: 'samTime',
  template: `
    <div class="sam-time usa-date-of-birth">
      <div class="usa-form-group usa-form-group-month">
        <label [attr.for]="hourName()">Hour</label>
        <input [attr.id]="hourName()" type="number" [(ngModel)]='hours' (ngModelChange)="onChange()" class="usa-form-control" [disabled]="disabled">
      </div>
      <div class="usa-form-group usa-form-group-month">
        <label [attr.for]="minuteName()">Minute</label>
        <input [attr.id]="minuteName()" type="number" [(ngModel)]="minutes" (ngModelChange)="onChange()" class="usa-form-control" [disabled]="disabled">
      </div>
      <div class="usa-form-group usa-form-group-year">
        <label [attr.for]="amPmName()">AM/PM</label>
        <select [attr.id]="amPmName()" [(ngModel)]='amPm' (ngModelChange)="onChange()" [disabled]="disabled">
          <option value="am">AM</option>
          <option value="pm">PM</option>
        </select>
      </div>
    </div>
  `,
})
export class SamTimeComponent implements OnChanges {
  INPUT_FORMAT: string = "H:m";
  OUTPUT_FORMAT: string = "HH:mm:ss";

  @Input() value: string; // must be a 24 hour time and have the format HH:mm
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() disabled: boolean;
  @Input() name: string;

  hours: number;
  minutes: number;
  amPm: string;

  constructor() { }

  ngOnChanges() {
    this.parseValue();
  }

  parseValue() {
    let m = moment(this.value, this.INPUT_FORMAT);
    let hours = m.hours();
    let minutes = m.minutes();

    // convert from 24 hour to 12 hour time

    if (hours > 12) {
      this.amPm = 'pm';
      hours -= 12;
    } else {
      this.amPm = 'am';
    }

    if (hours === 0) {
      hours = 12;
    }

    this.hours = hours;
    this.minutes = minutes;
  }

  onChange() {
    this.valueChange.emit(this.toString());
  }

  isValid() {
    return !isNaN(this.hours) && !isNaN(this.minutes)
      && typeof this.hours === 'number' && typeof this.minutes === 'number'
      && this.hours >= 1 && this.hours <= 12
      && this.minutes >= 0 && this.minutes <= 59
  }

  getTime(): any {
    if (!this.isValid()) {
      return null;
    }

    // convert from 12 hour to 24 hour times

    let hours = this.hours;

    if (hours === 12) {
      hours = 0;
    }

    if (this.amPm === 'pm') {
      hours += 12;
    }

    return moment({hour: hours, minute: this.minutes});
  }

  toString() {
    if (!this.isValid()) {
      return null;
    } else {
      return this.getTime().format(this.OUTPUT_FORMAT);
    }
  }

  hourName() {
    return `${name}_hour`;
  }

  minuteName() {
    return `${name}_minute`;
  }

  amPmName() {
    return `${name}_amPm`;
  }

}
