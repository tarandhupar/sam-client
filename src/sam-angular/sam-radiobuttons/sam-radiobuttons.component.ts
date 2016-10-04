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
      <fieldsetWrapper [label]="config.wrapper.label" [name]="config.wrapper.name" [hint]="config.wrapper.hint" [errorMessage]="config.wrapper.errorMessage">
        <ul class="usa-unstyled-list">
          <li *ngFor="let option of config.options; let i = index">
            <input [attr.id]="option.name" type="radio" (change)="onChange(option.value)" [attr.name]="config.name" [checked]="model === option.value">
            <label [attr.for]="option.name">{{option.label}}</label>
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

  ngOnInit() {
    this.config.wrapper = this.config.wrapper || {};
    this.config.wrapper.label = this.config.label;
  }

  onChange(value) {
    this.model = value;
    this.modelChange.emit(value);
  }
}
