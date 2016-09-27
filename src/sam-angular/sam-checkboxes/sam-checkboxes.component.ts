import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { InputWrapper, OptionsType, InputWrapperConfigType } from '../common/input-wrapper/input-wrapper.component';

export type CheckboxesConfigType = {
  options: OptionsType,
  name: string,
  hasSelectAll?: boolean,
  wrapper?: InputWrapperConfigType
};

/**
 * The <samCheckboxes> component is a set of checkboxes compliant with sam.gov standards
 * https://gsa.github.io/sam-web-design-standards/
 *
 * @Input() config - a configuration object. This object can also contain any of the inputs for input-wrapper (e.g. "label").
 *   format:
 *   {
 *     options: Array<any>, an array of { value: <any>, label: <string> } objects.
 *     name: <string>, Legend is a descriptive name the input group that will be spoken by screen readers
 *     hasSelectAll: <boolean>, If true, there will be a "Select all" input before the other options
 *     ... (see input-wrapper-config for the rest of the wrapper properties)
 *   }
 *
 * @Input/@Output model - the bound value of the component
 */
@Component({
  selector: 'samCheckboxes2',
  template: `
      <inputWrapper [labelFor]="config.wrapper?.name" [label]="config.wrapper?.label" [errorMessage]="config.wrapper?.errorMessage" [hint]="config.wrapper?.hint" [errorLabel]="config.wrapper?.errorLabel">
        <fieldset class="usa-fieldset-inputs usa-sans">
          <legend class="usa-sr-only">{{config.name}}</legend>      
          <ul class="usa-unstyled-list">
            <li *ngIf="config.hasSelectAll">
              <input [attr.id]="checkAllLabelName()" type="checkbox" [(ngModel)]="isSelectAllChecked" (ngModelChange)="onSelectAllChange(isSelectAllChecked)">
              <label [attr.for]="checkAllLabelName()">Select all</label>
            </li>
            <li *ngFor="let option of config.options; let i = index">
              <input [attr.id]="option.idFor" [disabled]='option.disabled' type="checkbox" [(ngModel)]="model[option.value]">
              <label [attr.for]="option.idFor">{{option.label}}</label>
            </li>
          </ul>
        </fieldset>
      </inputWrapper>
  `,
})
export class SamCheckboxesComponent {
  @Input() config: CheckboxesConfigType;
  @Input() model: any = {};
  @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(InputWrapper)
  public wrapper: InputWrapper;

  constructor() {

  }

  ngOnInit() {
    this.config.options.forEach((option) => {
      this.model[option.value] = !!this.model[option.value];
    });
  }

  // Give the check all label a name for screen readers
  checkAllLabelName() {
    return `all-${this.config.name}`;
  }

  onSelectAllChange(isSelectAllChecked) {
    this.config.options.forEach((option) => {
      this.model[option.value] = isSelectAllChecked;
    });
    this.modelChange.emit(this.model);
  }
}
