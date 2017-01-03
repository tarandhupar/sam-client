import { Component, Input, ViewChild,Output, EventEmitter,OnInit } from '@angular/core';
import * as moment from 'moment/moment';

@Component({
  selector: 'samDateTime',
  template: `
    <labelWrapper [label]="label" [name]="name" [errorMessage]="errorMessage" [hint]="hint">
      <samTime #timeComponent [(value)]="time" (valueChange)="onChange($event)"></samTime>
      <samDate #dateComponent [(value)]="date" (valueChange)="onChange($event)" [name]='name'></samDate>
    </labelWrapper>
  `,
})
export class SamDateTimeComponent implements OnInit {
  @Input() value: string;
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() label: string;
  @Input() name: string;
  @Input() errorMessage: string;

  time: string;
  date: string;

  @ViewChild('dateComponent') dateComponent;
  @ViewChild('timeComponent') timeComponent;

  constructor() { }

  ngOnInit() {
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

  onChange() {
    if (this.dateComponent.isValid() && this.timeComponent.isValid()) {
      this.valueChange.emit(`${this.date}T${this.time}`);
    }
  }


}
