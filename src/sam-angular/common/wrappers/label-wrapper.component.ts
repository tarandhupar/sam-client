import { Component, Input } from '@angular/core';
import { WrapperConfigType } from '../types';

@Component({
  selector: 'labelWrapper',
  template: `
    <div [class.usa-input-error]="!!config.errorMessage">
      <label [attr.for]="config.name" [class.usa-input-error-label]="config.errorMessage">{{config.label}}</label>
      <span *ngIf="config.errorMessage" class="usa-input-error-message">{{config.errorMessage}}</span>
      <span *ngIf="config.hint" class="usa-form-hint">{{config.hint}}</span>
      <ng-content></ng-content>
    </div>
  `,
})
export class LabelWrapper {
  @Input() config: WrapperConfigType;
  constructor() { }
}
