import { Component, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { LabelWrapper, LabelWrapperConfigType } from '../common/wrappers/label-wrapper.component';
import { OptionsType } from '../common/options.types';

export type SelectConfigType = {
  options: OptionsType,
  label: string, // Human readable name, which will be the <label> content.
  name: string, // machine readable name. The label-for/select-id name.
  hasEmptyOption?: boolean,
  placeholder?: string,
  disabled?: boolean,
  wrapper?: LabelWrapperConfigType,
};

/**
 * @Input() config : SelectConfigType - a configuration object.
 * @Input() model - the value of the select component
 *
 */
@Component({
  selector: 'samSelect2',
  template: `
      <labelWrapper [config]="config.wrapper">
        <select [attr.id]="config.name" [ngModel]="model" (change)="onChange(select.value)" #select [disabled]="config.disabled">
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
    this.config.wrapper = this.config.wrapper || {
        name: this.config.name,
        label: this.config.label,
      };
  }

  onChange(val) {
    this.model = val;
    this.modelChange.emit(val);
  }
}
