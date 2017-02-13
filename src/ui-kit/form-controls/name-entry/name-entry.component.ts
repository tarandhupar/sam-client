import { Component, Input } from '@angular/core';
import { LabelWrapper } from '../wrapper/label-wrapper.component';

import * as suffixes from './suffixes.json';

/**
 * The <samNameInput> component is a Name entry portion of a form
 *
 * @Input/@Output model - the bound value of the component
 * @Input prefix - Prefix name/id attribute values
 *
 */
@Component({
  selector: 'samNameEntry',
  template: `
    <fieldset>
      <legend *ngIf="legend.length" [innerText]="legend"></legend>

      <labelWrapper class="label-wrapper" [label]="'First Name'" [name]="getIdentifer('first-name')" [errorMessage]="fNameErrorMsg" [required]="true">
        <input (blur)="validateFirstName()" (ngModelChange)="validateFirstName()" [(ngModel)]="model.firstName" id="{{getIdentifer('first-name')}}" name="{{getIdentifer('first-name')}}" type="text" required="" aria-required="true">
      </labelWrapper>

      <labelWrapper class="label-wrapper" [label]="'Middle Name'" [name]="getIdentifer('middle-name')" [errorMessage]="mNameErrorMsg">
        <input (ngModelChange)="validateMiddleName()" [(ngModel)]="model.middleName" id="{{getIdentifer('middle-name')}}" name="{{getIdentifer('middle-name')}}" type="text">
      </labelWrapper>

      <labelWrapper class="label-wrapper" [label]="'Last Name'" [name]="getIdentifer('last-name')" [errorMessage]="lNameErrorMsg" [required]="true">
        <input (blur)="validateLastName()" (ngModelChange)="validateLastName()" [(ngModel)]="model.lastName" id="{{getIdentifer('last-name')}}" name="{{getIdentifer('last-name')}}" type="text" required="" aria-required="true">
      </labelWrapper>

      <samSelect [(model)]="model.suffix"
                 [name]="getIdentifer('suffix')"
                 [options]="store.suffixes"
                 [errorMessage]="suffixErrorMsg"
                 label="Suffix">
      </samSelect>
    </fieldset>
  `,
})
export class SamNameEntryComponent {
  @Input() legend: string = "Name"
  @Input() model: any = {
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: ""
  };

  @Input() prefix: string = "";

  fNameErrorMsg: string = "";
  mNameErrorMsg: string = "";
  lNameErrorMsg: string = "";
  suffixErrorMsg: string = "";

  private store = {
    suffixes: suffixes.map((item) => {
      return {
        label: item.suffix,
        value: item.suffix
      };
    })
  };

  getIdentifer(str) {
    if(this.prefix.length > 0) {
      str = `${this.prefix}-${str}`;
    }

    return str;
  }

  validateFirstName() {
    var error = false;

    if(/^[0-9]+$/.test(this.model.firstName)) {
      error = true;
      this.fNameErrorMsg = "Please enter a valid name";
    }

    if(this.model.firstName.length == 0) {
      error = true;
      this.fNameErrorMsg = "This field is required";
    }

    if(!error) {
      this.fNameErrorMsg = "";
    }
  }

  validateMiddleName() {
    var error = false;

    if(/^[0-9]+$/.test(this.model.middleName)) {
      error = true;
      this.mNameErrorMsg = "Please enter a valid name";
    }

    if(!error) {
      this.mNameErrorMsg = "";
    }
  }

  validateLastName(){
    var error = false;

    if(/^[0-9]+$/.test(this.model.lastName)) {
      error = true;
      this.lNameErrorMsg = "Please enter a valid name";
    }

    if(this.model.lastName.length == 0) {
      error = true;
      this.lNameErrorMsg = "This field is required";
    }

    if(!error) {
      this.lNameErrorMsg = "";
    }
  }
}
