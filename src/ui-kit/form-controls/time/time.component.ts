import {Component, Input, ViewChild, Output, EventEmitter, OnInit, OnChanges} from '@angular/core';
import * as moment from 'moment/moment';

@Component({
  selector: 'samTime',
  template: `
    <div class="sam-time usa-date-of-birth">
      <div class="usa-form-group usa-form-group-month">
        <label>Hour</label>
        <input type="number" [(ngModel)]='hours' (ngModelChange)="onChange()" class="usa-form-control" min="1" max="12" [disabled]="disabled">
      </div>
      <div class="usa-form-group usa-form-group-month">
        <label>Minute</label>
        <input type="number" [(ngModel)]="minutes" (ngModelChange)="onChange()" class="usa-form-control" min="0" max="59" [disabled]="disabled">
      </div>
      <div class="usa-form-group usa-form-group-year">
        <label>AM/PM</label>
        <select [(ngModel)]='amPm' (ngModelChange)="onChange()" [disabled]="disabled">
          <option value="am">AM</option>
          <option value="pm">PM</option>
        </select>
      </div>
    </div>
  `,
})
export class SamTimeComponent implements OnInit, OnChanges {
  @Input() value: string; // must be a 24 hour time and have the format HH:mm
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() disabled: boolean;

  hours: number;
  minutes: number;
  amPm: string;

  constructor() { }

  ngOnChanges() {
    let m = moment(this.value, 'H:m');
    let hours = m.hours();
    let minutes = m.minutes();

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
    return this.getTime().isValid();
  }

  getTime(): any {
    if (typeof this.hours !== 'number' || typeof this.minutes !== 'number') {
      return '';
    }

    console.log('hours: ', this.hours, ' minutes: ', this.minutes);

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
    if (!this.getTime() || !this.getTime().valid()) {
      return '';
    } else {
      return this.getTime().format('HH:mm:ss');
    }

  }

}
