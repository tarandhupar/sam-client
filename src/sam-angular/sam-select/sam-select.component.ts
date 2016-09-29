import { Component, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { LabelWrapper, LabelWrapperConfigType } from '../common/wrappers/label-wrapper.component';
import { OptionsType } from '../common/options.types';

export type SelectConfigType = {
  options: OptionsType,
  srName: string,
  hasEmptyOption?: boolean,
  placeholder?: string,
  disabled?: boolean,
  wrapper?: LabelWrapperConfigType,
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
 * @Input() model - tlhe bound value of the select component
 *
 */
@Component({
  selector: 'samSelect2',
  template: `
      <labelWrapper [config]="config.wrapper">
        <select [attr.name]="config.srName" [ngModel]="model" (change)="onChange(select.value)" #select [disabled]="config.disabled">
          <option *ngIf="config.placeholder" selected="selected" disabled="disabled" value="-1">{{config.placeholder}}</option>
          <option *ngIf="config.hasEmptyOption"></option>
          <option *ngFor="let option of config.options" [value]="option.value">{{option.label}}</option>
        </select>
      </labelWrapper>
  `,
})
export class SamSelectComponent {
  @Input() config: SelectConfigType;
  @Input() model: any = -1;
  @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(LabelWrapper)
  public wrapper: LabelWrapper;

  constructor() {

  }

  ngOnInit() {
    this.config.wrapper = this.config.wrapper || {};
    this.config.wrapper.labelFor = this.config.srName;
  }

  onChange(val) {
    this.model = val;
    this.modelChange.emit(val);
  }
}
