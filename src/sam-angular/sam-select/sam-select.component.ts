import { Component, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { LabelWrapper } from '../common/wrappers/label-wrapper.component';
import { OptionsType, WrapperConfigType } from '../common/types';

export type SelectConfigType = {
  options: OptionsType,
  label: string, // Human readable name, which will be the <label> content.
  name: string, // machine readable name. The label-for/select-id name.
  disabled?: boolean,
  wrapper?: WrapperConfigType,
};

/**
 * @Input() config : SelectConfigType - a configuration object.
 * @Input() model - the value of the select component
 *
 */
@Component({
  selector: 'samSelect2',
  template: `
      <labelWrapper [label]="config.wrapper.label" [name]="config.wrapper.name" [hint]="config.wrapper.hint" [errorMessage]="config.wrapper.errorMessage">
        <select [attr.id]="config.name" [ngModel]="model" (change)="onChange(select.value)" #select [disabled]="config.disabled">
          <option *ngFor="let option of config.options" [value]="option.value" [disabled]="option.disabled">{{option.label}}</option>
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
