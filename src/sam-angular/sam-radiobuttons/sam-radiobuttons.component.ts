import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FieldsetWrapper } from '../common/wrappers/fieldset-wrapper.component';
import { OptionsType } from '../common/types';

export type RadioButtonsConfigType = {
  options: OptionsType, // an array of radio buttons
  label: string, // descriptive name that will be the legend, can contain spaces
  name: string, // machine readable name that will group the buttons, cannot contain spaces
  wrapper?: any
};

/**
 * The <samRadioButtons> component is a set of checkboxes compliant with sam.gov standards
 * https://gsa.github.io/sam-web-design-standards/
 *
 * @Input config: RadioButtonsConfigType
 * @Output/@Input model: string|number
 */
@Component({
  selector: 'samRadioButtons2',
  template: `
      <fieldsetWrapper [label]="label" [name]="name" [hint]="hint" [errorMessage]="errorMessage">
        <ul class="usa-unstyled-list">
          <li *ngFor="let option of options; let i = index">
            <input [attr.id]="option.name" type="radio" (change)="onChange(option.value)" [attr.name]="name" [checked]="model === option.value">
            <label [attr.for]="option.name">{{option.label}}</label>
          </li>
        </ul>
      </fieldsetWrapper>
  `,
})
export class SamRadioButtonsComponent {
  @Input() model: any = {};
  @Input() options: OptionsType;
  @Input() label: string;
  @Input() name: string;
  @Input() hint: string;
  @Input() errorMessage: string;

  @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(FieldsetWrapper)
  public wrapper: FieldsetWrapper;

  constructor() { }

  onChange(value) {
    this.model = value;
    this.modelChange.emit(value);
  }
}
