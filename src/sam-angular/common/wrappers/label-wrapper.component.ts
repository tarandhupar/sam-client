import { Component, Input } from '@angular/core';


/**
 * label: <string> *optional* The text value of the <label> which will describe the wrapped content
 * errorMessage: <string> *optional* An alternate error message
 * hint: <string> *optional* Helpful text describing how to use the wrapped content
 * @Input() labelFor: <string> *optionsal* The value of the for attribute of the label.
 */
export type LabelWrapperConfigType = {
  label?: string,
  hint?: string,
  errorMessage?: string,
  labelFor?: string
};

@Component({
  selector: 'labelWrapper',
  template: `
    <div [class.usa-input-error]="!!config.errorMessage">
      <label *ngIf="config.label" [attr.for]="config.labelFor" [class.usa-input-error-label]="config.errorMessage">{{config.label}}</label>
      <span *ngIf="config.errorMessage" class="usa-input-error-message">{{config.errorMessage}}</span>
      <span *ngIf="config.hint" class="usa-form-hint">{{config.hint}}</span>
      <ng-content></ng-content>
    </div>
  `,
})
export class LabelWrapper {
  @Input() config: LabelWrapperConfigType = {};
  constructor() { }
}
