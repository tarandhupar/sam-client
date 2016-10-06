import { Component, Input, Output, EventEmitter } from '@angular/core';
import { OptionsType } from '../common/types';

/**
 *
 */
@Component({
  selector: 'samDropdown2',
  template: `
      <label for="name" class="usa-sr-only">{{name}}</label>
      <select [attr.id]="name" [ngModel]="model" (change)="onChange(select.value)" #select [disabled]="disabled">
        <option *ngFor="let option of options" [value]="option.value" [disabled]="option.disabled">{{option.label}}</option>
      </select>
  `,
})
export class SamDropdownComponent {
  @Input() model: string|number|symbol;
  @Input() options: OptionsType;
  @Input() name: string;
  @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  onChange(val) {
    this.model = val;
    this.modelChange.emit(val);
  }
}
