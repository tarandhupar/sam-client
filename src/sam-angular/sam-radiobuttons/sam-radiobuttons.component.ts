import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { InputWrapper, InputWrapperConfigType, OptionsType } from '../common/input-wrapper/input-wrapper.component';

export type RadioButtonsConfigType = {
  options: OptionsType,
  name: string,
  hasSelectAll?: boolean,
  wrapper?: InputWrapperConfigType
};

/**
 * The <samRadioButtons> component is a set of checkboxes compliant with sam.gov standards
 * https://gsa.github.io/sam-web-design-standards/
 *
 * @Input config: RadioButtonsConfigType
 *   {
 *     options: an array of objects: { value: <any>, label: <string>, disabled: <boolean>, idFor: <string> }
 *     name: <string>, A descriptive name the input group that will be spoken by screen readers, this is also
 *       the value of attribute "name" for each input. It must be unique among the dom.
 *   }
 * @Output/@Input model
 *   The input is an object where each property represents a checkbox value. It the property is true the checkbox
 *   is checked. model[checkBoxValue] == true is the checkbox is checked
 */
@Component({
  selector: 'samRadioButtons2',
  template: `
      <inputWrapper [label]="config.wrapper?.label" [errorMessage]="config.wrapper?.errorMessage" [hint]="config.wrapper?.hint" [errorLabel]="config.wrapper?.errorLabel">
        <fieldset class="usa-fieldset-inputs usa-sans">      
          <legend class="usa-sr-only">{{name}}</legend>
          <ul class="usa-unstyled-list">
            <li *ngFor="let option of config.options; let i = index">
              <input [attr.id]="option.idFor" type="radio" (change)="onChange(option.value)" [attr.name]="config.name" [checked]="model === option.value">
              <label [attr.for]="option.idFor">{{option.label}}</label>
            </li>
          </ul>
        </fieldset>
      </inputWrapper>
  `,
})
export class SamRadioButtonsComponent {
  @Input() config: RadioButtonsConfigType;
  @Input() model: any = {};
  @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(InputWrapper)
  public wrapper: InputWrapper;

  constructor() {

  }

  onChange(value) {
    this.model = value;
    this.modelChange.emit(value);
  }
}
