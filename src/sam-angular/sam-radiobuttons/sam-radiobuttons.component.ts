import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import {FieldsetWrapperConfigType, FieldsetWrapper} from '../common/wrappers/fieldset-wrapper.component';
import { OptionsType } from '../common/options.types';

export type RadioButtonsConfigType = {
  options: OptionsType,
  srName: string,
  wrapper?: FieldsetWrapperConfigType
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
 *   The input is an array where each element is the value of a checked checkbox.
 */
@Component({
  selector: 'samRadioButtons2',
  template: `
      <fieldsetWrapper [config]="config.wrapper">
        <ul class="usa-unstyled-list">
          <li *ngFor="let option of config.options; let i = index">
            <input [attr.id]="option.idFor" type="radio" (change)="onChange(option.value)" [attr.name]="config.name" [checked]="model === option.value">
            <label [attr.for]="option.idFor">{{option.label}}</label>
          </li>
        </ul>
      </fieldsetWrapper>
  `,
})
export class SamRadioButtonsComponent {
  @Input() config: RadioButtonsConfigType;
  @Input() model: any = {};
  @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(FieldsetWrapper)
  public wrapper: FieldsetWrapper;

  constructor() {

  }

  onChange(value) {
    this.model = value;
    this.modelChange.emit(value);
  }
}
