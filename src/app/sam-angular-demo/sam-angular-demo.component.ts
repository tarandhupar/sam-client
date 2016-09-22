import { Component } from '@angular/core';

@Component({
  styleUrls: ['./sam-angular-demo.css'],
  templateUrl: 'sam-angular-demo.template.html'
})
export class SamAngularDemo {
  // Select Component
  selectModel: any = 'ma';
  selectConfig = {
    options: [
      {value: 'dc', label: 'Washington DC'},
      {value: 'ma', label: 'Maryland'},
      {value: 'va', label: 'Virginia'},
    ],
    placeholder: 'Select a region',
    label: 'Region',
    name: 'region',
    errorMessage: '',
    hint: '',
    hasEmptyOption: false
  };

  // Checkboxes Component
  checkboxModel: any = {
    ma: true,
    dc: false,
    va: false
  };
  checkboxConfig: any = {
    options: [
      {value: 'dc', label: 'DC', idFor: 'checkbox-dc'},
      {value: 'ma', label: 'Maryland', idFor: 'checkbox-maryland'},
      {value: 'va', label: 'Virginia', idFor: 'checkbox-virginia', disabled: true},
    ],
    name: 'regions',
    label: 'Select a region',
    errorMessage: '',
    hint: '',
    hasSelectAll: false
  };

  // Radio Component
  radioModel: any = 'ma';
  radioConfig: any = {
    options: [
      {value: 'dc', label: 'DC', idFor: 'radio-dc'},
      {value: 'ma', label: 'Maryland', idFor: 'radio-maryland'},
      {value: 'va', label: 'Virginia', idFor: 'radio-virginia'},
    ],
    name: 'radio-component',
    label: 'Select a region',
    errorMessage: '',
    hint: ''
  };

  constructor() {  }

}
