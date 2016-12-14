import { Component, Input, ViewChild,Output, EventEmitter,OnInit } from '@angular/core';
import { LabelWrapper } from '../wrapper/label-wrapper.component';

/**
 * The <samNameInput> component is a Name entry portion of a form
 *
 * @Input/@Output model - the bound value of the component
 * @Input prefix - Prefix name/id attribute values
 *
 */
@Component({
  selector: 'samDateEntry',
  template: `
    <labelWrapper [label]="'Date of birth'" [name]="getIdentifer('date')" [errorMessage]="errorMsg" [hint]="'For example: 04 28 1986'">
      <div class="usa-date-of-birth" style="overflow:auto;">
        <div class="usa-form-group usa-form-group-month">
          <label [attr.for]="getIdentifer('date')+'_1'">Month</label>
          <input (blur)="onBlur($event)" [(ngModel)]="model.month" (ngModelChange)="onChange()" class="usa-input-inline" aria-describedby="dobHint" class="usa-form-control" id="{{getIdentifer('date')}}_1" name="date_of_birth_1" pattern="0?[1-9]|1[012]" type="number" min="1" max="12">
        </div>
        <div class="usa-form-group usa-form-group-day">
          <label [attr.for]="getIdentifer('date')+'_2'">Day</label>
          <input (blur)="onBlur($event)" [(ngModel)]="model.day" (ngModelChange)="onChange()" class="usa-input-inline" aria-describedby="dobHint" class="usa-form-control" id="{{getIdentifer('date')}}_2" name="date_of_birth_2" pattern="0?[1-9]|1[0-9]|2[0-9]|3[01]" type="number" min="1" max="31">
        </div>
        <div class="usa-form-group usa-form-group-year">
          <label [attr.for]="getIdentifer('date')+'_3'">Year</label>
          <input (blur)="onBlur($event)" [(ngModel)]="model.year" (ngModelChange)="onChange()" class="usa-input-inline" aria-describedby="dobHint" class="usa-form-control" id="{{getIdentifer('date')}}_3" name="date_of_birth_3" pattern="[0-9]{4}" type="number" min="1900" max="3000">
        </div>
      </div>
    </labelWrapper>
  `,
})
export class SamDateEntryComponent implements OnInit{
  @Input() model: Object = {
    month:"",
    day:"",
    year:""
  };
  @Input() prefix: string = "";
  @Output() emitter = new EventEmitter<string>();
  errorMsg: string = "";

  constructor() { }

  ngOnInit() { }

  onBlur(evt){
    this.validate();
  }

  onChange(){
    if(this.errorMsg){
      this.validate();
    }
  }

  validate(){
    let isValid = true;
    if(this.model["year"] != null && this.model["year"]<1900){
      isValid = false;
    } 
    if(this.model["day"] != null && (this.model["day"]<1 || this.model["day"] > 31)){
      isValid = false;
    } 
    if(this.model["month"] != null && (this.model["month"]<1 || this.model["month"] > 12)){
      isValid = false;
    } 
    if(this.model["month"] == null || this.model["day"] == null || this.model["year"] == null){
      isValid = false;
    }

    if(!isValid){ 
      this.errorMsg = "Invalid date";
    } else {
      this.errorMsg = "";
    }
  }

  getIdentifer(str){
    if(this.prefix && this.prefix.length>0){
      str = this.prefix + "-" + str;
    }
    return str;
  }

}
