import { Component, Input } from '@angular/core';
import { WrapperConfigType } from '../types';

@Component({
  selector: 'fieldsetWrapper',
  template: `
    <div [class.usa-input-error]="!!config.errorMessage">
      <fieldset class="usa-fieldset-inputs usa-sans">
        <legend [class.usa-input-error-label]="!!config.errorMessage">{{config.label}}</legend>
        <span *ngIf="config.errorMessage" class="usa-input-error-message">{{config.errorMessage}}</span>
        <span *ngIf="config.hint" class="usa-form-hint">{{config.hint}}</span>
        <ng-content></ng-content>
      </fieldset>
    </div>
  `,
})
export class FieldsetWrapper {
  @Input() config: WrapperConfigType;

  constructor() { }
}
