import { Component, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { LabelWrapper } from '../common/wrappers/label-wrapper.component';
import { OptionsType } from '../common/types';

/**
 * @Input() model - the value of the select component
 *
 */
@Component({
  selector: 'samSelect2',
  template: `
      <labelWrapper [label]="label" [name]="name" [hint]="hint" [errorMessage]="errorMessage">
        <select [attr.id]="name" [ngModel]="model" (change)="onChange(select.value)" #select [disabled]="disabled">
          <option *ngFor="let option of options" [value]="option.value" [disabled]="option.disabled">{{option.label}}</option>
        </select>
      </labelWrapper>
  `,
})
export class SamSelectComponent {
  @Input() model: string|number|symbol;
  @Input() options: OptionsType;
  @Input() label: string;
  @Input() name: string;
  @Input() hint: string;
  @Input() errorMessage: string;
  @Input() disabled: boolean;

  @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(LabelWrapper)
  public wrapper: LabelWrapper;

  constructor() { }

  onChange(val) {
    this.model = val;
    this.modelChange.emit(val);
  }
}
