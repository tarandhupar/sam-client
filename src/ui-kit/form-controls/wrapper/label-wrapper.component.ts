import { Component, Input } from '@angular/core';

@Component({
  selector: 'labelWrapper',
  template: `
    <div [class.usa-input-error]="!!errorMessage">
      <label [attr.for]="name" [class.usa-input-error-label]="errorMessage">{{label}}</label>
      <span *ngIf="errorMessage" class="usa-input-error-message">{{errorMessage}}</span>
      <span *ngIf="hint" class="usa-form-hint">{{hint}}</span>
      <ng-content></ng-content>
    </div>
  `,
})
export class LabelWrapper {
  @Input() label: string;
  @Input() name: string;
  @Input() hint: string;
  @Input() errorMessage: string;

  constructor() { }
}
