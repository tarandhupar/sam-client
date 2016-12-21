import { Component, Input, ViewChild,Output, EventEmitter,OnInit } from '@angular/core';
import * as moment from 'moment/moment';

/**
 * The <samNameInput> component is a Name entry portion of a form
 *
 * @Input/@Output model - the bound value of the component
 * @Input name - Prefix name/id attribute values
 *
 */
@Component({
  selector: 'samDateEntry',
  template: `
    <labelWrapper [label]="label" [name]="getIdentifer('date')" [errorMessage]="errorMessage" [hint]="hint">
      <div class="usa-date-of-birth" style="overflow:auto;">
        <div class="usa-form-group usa-form-group-month">
          <label [attr.for]="getIdentifer('date')+'_1'">Month</label>
          <input #month="ngModel" (blur)="onBlur($event)" [(ngModel)]="model.month" (ngModelChange)="onChange()" class="usa-input-inline" aria-describedby="dobHint" class="usa-form-control" id="{{getIdentifer('date')}}_1" name="date_of_birth_1" pattern="0?[1-9]|1[012]" type="number" min="1" max="12">
        </div>
        <div class="usa-form-group usa-form-group-day">
          <label [attr.for]="getIdentifer('date')+'_2'">Day</label>
          <input #day="ngModel" (blur)="onBlur($event)" [(ngModel)]="model.day" (ngModelChange)="onChange()" class="usa-input-inline" aria-describedby="dobHint" class="usa-form-control" id="{{getIdentifer('date')}}_2" name="date_of_birth_2" pattern="0?[1-9]|1[0-9]|2[0-9]|3[01]" type="number" min="1" max="31">
        </div>
        <div class="usa-form-group usa-form-group-year">
          <label [attr.for]="getIdentifer('date')+'_3'">Year</label>
          <input #year="ngModel" (blur)="onBlur($event)" [(ngModel)]="model.year" (ngModelChange)="onChange()" class="usa-input-inline" aria-describedby="dobHint" class="usa-form-control" id="{{getIdentifer('date')}}_3" name="date_of_birth_3" pattern="[0-9]{4}" type="number" min="1900" max="3000">
        </div>
      </div>
    </labelWrapper>
  `,
})
export class SamDateEntryComponent implements OnInit{
  model: any = {
    month:"",
    day:"",
    year:""
  };
  @Input() errorMessage: string = "";
  @Input() name: string = "";
  @Input() label: string = "";
  @Input() hint: string = "";
  @Input() prefix: string = "";
  @Input() init: string = "";

  @Output() modelChange = new EventEmitter<any>();

  @ViewChild('month') month;
  @ViewChild('day') day;
  @ViewChild('year') year;

  constructor() { }

  ngOnInit() {
    if (this.init) {
      let m = moment(this.init);
      if (m.isValid()) {
        this.model.month = m.month() + 1;
        this.model.day = m.date();
        this.model.year = m.year();
      } else {
        console.error('[init] date is invalid');
      }
    }
  }

  onBlur(evt){
    this.validate();
  }

  currentDate() {
    return moment([this.model.year, this.model.month-1, this.model.day]);
  }

  onChange(){
    if(this.errorMessage){
      this.validate();
    }
    if (this.currentDate().isValid()) {
      var dateString = this.currentDate().format("YYYY-MM-DD");
      this.modelChange.emit(dateString)
    }
  }

  validate(){
    let isDirty = this.month.dirty || this.day.dirty || this.year.dirty;
    let dateValid = this.currentDate().isValid();

    console.log(dateValid);
    if(!dateValid && isDirty){
      this.errorMessage = "Invalid date";
    } else {
      this.errorMessage = "";
    }
  }

  getIdentifer(str){
    if(this.name && this.name.length>0){
      str = this.name + "-" + str;
    }
    return str;
  }

}
