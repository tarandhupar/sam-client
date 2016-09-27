import { Component } from '@angular/core';
import { CheckboxesConfigType, RadioButtonsConfigType, SelectConfigType } from '../../sam-angular'

@Component({
  styleUrls: ['./sam-angular-demo.css'],
  templateUrl: 'sam-angular-demo.template.html'
})
export class SamAngularDemo {
  // Select Component
  selectModel: any = 'ma';
  selectConfig: SelectConfigType = {
    options: [
      {value: 'dc', label: 'Washington DC'},
      {value: 'ma', label: 'Maryland'},
      {value: 'va', label: 'Virginia'},
    ],
    name: 'name',
    placeholder: 'Select a region',
    wrapper: {
      label: 'Region',
    }
  };

  // Checkboxes Component
  checkboxModel: any = {
    ma: true,
    dc: false,
    va: false
  };
  checkboxConfig: CheckboxesConfigType = {
    options: [
      {value: 'dc', label: 'DC', idFor: 'checkbox-dc'},
      {value: 'ma', label: 'Maryland', idFor: 'checkbox-maryland'},
      {value: 'va', label: 'Virginia', idFor: 'checkbox-virginia', disabled: true},
    ],
    name: 'regions',
    wrapper: {
        label: 'Select a region'
    }
  };

  // Radio Component
  radioModel: any = 'ma';
  radioConfig: RadioButtonsConfigType = {
    options: [
      {value: 'dc', label: 'DC', idFor: 'radio-dc'},
      {value: 'ma', label: 'Maryland', idFor: 'radio-maryland'},
      {value: 'va', label: 'Virginia', idFor: 'radio-virginia'},
    ],
    name: 'radio-component',
    wrapper: {
      label: 'Select a region',
      errorMessage: '',
      hint: ''
    }
  };

  constructor() {  }

}
