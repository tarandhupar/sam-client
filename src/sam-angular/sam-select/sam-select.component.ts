import { Component, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { InputWrapper, InputWrapperConfigType, OptionsType } from '../common/input-wrapper/input-wrapper.component';

export type SelectConfigType = {
  options: OptionsType,
  name: string,
  hasEmptyOption?: boolean,
  placeholder?: string,
  disabled?: boolean,
  wrapper?: InputWrapperConfigType
};

/**
 * @Input() config - a configuration object. This object can also contain any of the inputs for input-wrapper (e.g. "label").
 *   {
 *     options: Array<any>, an array of { value: <any>, label: <string> } objects.
 *     name: <string>, descript name for screen readers
 *     placeholder: <string> *optional* A disabled <option> element that is selected if no
 *            option has yet been selected by the user
 *     hasEmptyOption: <boolean> *optional* *default = false* If true, the select component has a blank <option>
 *            element so that the select value can be cleared
 *
 *   }
 * @Input() model - the bound value of the select component
 *
 */
@Component({
  selector: 'samSelect2',
  template: `
      <inputWrapper [labelFor]="config.name" [label]="config.wrapper?.label" [errorMessage]="config.wrapper?.errorMessage" [hint]="config.wrapper?.hint" [errorLabel]="config.wrapper?.errorLabel">
        <select [attr.name]="config.name" [ngModel]="model" (change)="onChange(select.value)" #select [disabled]="config.disabled">
          <option *ngIf="config.placeholder" selected="selected" disabled="disabled" value="-1">{{config.placeholder}}</option>
          <option *ngIf="config.hasEmptyOption"></option>
          <option *ngFor="let option of config.options" [value]="option.value">{{option.label}}</option>
        </select>
      </inputWrapper>
  `,
})
export class SamSelectComponent {
  @Input() config: SelectConfigType;
  @Input() model: any = -1;
  @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(InputWrapper)
  public wrapper: InputWrapper;

  constructor() {

  }

  onChange(val) {
    this.model = val;
    this.modelChange.emit(val);
  }
}
