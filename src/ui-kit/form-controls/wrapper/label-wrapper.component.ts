import { Component, Input } from '@angular/core';
import {FormControl} from "@angular/forms";

@Component({
  selector: 'labelWrapper',
  template: `
    <div class='label-wrapper' [class.usa-input-error]="!!errorMessage">
      <label [attr.for]="name" [class.usa-input-error-label]="errorMessage">{{label}}<span *ngIf="required" class="usa-additional_text">Required</span></label>
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
  @Input() required: boolean = false;
  @Input() errorMessage: string;

  constructor() { }

  formatErrors(control: FormControl) {
    if (!control) {
      return;
    }

    if (control.invalid && control.errors) {
      for (let k in control.errors) {
        let errorObject = control[k];
        switch (k) {
          case 'maxLength':
            this.errorMessage = `This field has too many characters`;
            break;
          case 'required':
            this.errorMessage = 'This field cannot be empty';
            break;
          default:
            if (errorObject.message) {
              this.errorMessage = errorObject.message;
            } else {
              this.errorMessage = 'Invalid';
            }
        }
      }
    } else if (control.valid) {
      this.errorMessage = '';
    }
  }
}
