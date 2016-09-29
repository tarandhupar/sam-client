import { Component, Input } from '@angular/core';
import { WrapperConfigType } from 'wrapper-config.types';

/**
 * label: <string> *optional* The text value of the <label> which will describe the wrapped content
 * errorMessage: <string> *optional* An alternate error message
 * hint: <string> *optional* Helpful text describing how to use the wrapped content
 * @Input() labelFor: <string> *optionsal* The value of the for attribute of the label.
 */
export type FieldsetWrapperConfigType = {
  label?: string,
  hint?: string,
  errorMessage?: string
};

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
  @Input() config: FieldsetWrapperConfigType = {};

  constructor() { }
}
