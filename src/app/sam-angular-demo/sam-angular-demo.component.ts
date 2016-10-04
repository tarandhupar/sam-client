import { Component } from '@angular/core';
import { CheckboxesConfigType, RadioButtonsConfigType, SelectConfigType } from '../../sam-angular'

@Component({
  styleUrls: ['./sam-angular-demo.css'],
  templateUrl: 'sam-angular-demo.template.html'
})
export class SamAngularDemo {
  // Select Component
  selectModel = '';
  selectConfig: SelectConfigType = {
    options: [
      {value:'', label: 'Default option', name: 'empty', disabled: true},
      {value: 'dc', label: 'Washington DC', name: 'dc'},
      {value: 'ma', label: 'Maryland', name: 'maryland'},
      {value: 'va', label: 'Virginia', name: 'virginia'},
    ],
    label: 'region',
    name: 'region',
    wrapper: {
      label: 'Region',
      name: 'region',
    }
  };

  // Checkboxes Component
  checkboxModel: any = ['ma'];
  checkboxConfig: CheckboxesConfigType = {
    options: [
      {value: 'dc', label: 'DC', name: 'checkbox-dc'},
      {value: 'ma', label: 'Maryland', name: 'checkbox-maryland'},
      {value: 'va', label: 'Virginia', name: 'checkbox-virginia'},
    ],
    name: 'my-sr-name',
    label: 'Select a region',
    wrapper: {
        label: 'Select a region'
    }
  };

  // Radio Component
  radioModel: any = 'ma';
  radioConfig: RadioButtonsConfigType = {
    options: [
      {value: 'dc', label: 'DC', name: 'radio-dc'},
      {value: 'ma', label: 'Maryland', name: 'radio-maryland'},
      {value: 'va', label: 'Virginia', name: 'radio-virginia'},
    ],
    name: 'radio-component',
    label: 'Select a region',
    wrapper: {
      label: 'Select a region',
      errorMessage: '',
      hint: ''
    }
  };

  constructor() {  }

  onEmptyOptionChanged($event) {
    if ($event.target.checked) {
      this.selectConfig.options.unshift({label: '', value: '', name: 'empty-option'});
    } else {
      this.selectConfig.options.shift();
    }
  }


}
