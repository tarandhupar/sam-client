import { Component, Input } from '@angular/core';
import { FormControl } from "@angular/forms";

@Component({
  selector: 'fieldsetWrapper',
  template: `
    <div [class.usa-input-error]="!!errorMessage">
      <fieldset class="usa-fieldset-inputs usa-sans">
        <legend [class.usa-input-error-label]="!!errorMessage">{{label}}</legend>
        <span *ngIf="errorMessage" class="usa-input-error-message">{{errorMessage}}</span>
        <span *ngIf="hint" class="usa-form-hint">{{hint}}</span>
        <ng-content></ng-content>
      </fieldset>
    </div>
  `,
})
export class FieldsetWrapper {
  @Input() label: string;
  @Input() name: string;
  @Input() hint: string;
  @Input() errorMessage: string;

  constructor() { }

  formatErrors(control: FormControl) {
    if (!control) {
      return;
    }

    if (control.invalid && control.errors) {
      for (let k in control.errors) {
        let errorObject = control.errors[k];
        switch (k) {
          case 'maxlength':
            const actualLength = errorObject.actualLength;
            const requiredLength = errorObject.requiredLength;
            this.errorMessage = `Too many characters (${actualLength} or ${requiredLength})`;
            return;
          case 'required':
            this.errorMessage = 'This field cannot be empty';
            return;
          case 'isNotBeforeToday':
            this.errorMessage = "Date must not be before today";
            return;
          default:
            if (errorObject.message) {
              this.errorMessage = errorObject.message;
            } else {
              this.errorMessage = 'Invalid';
            }
            return;
        }
      }
    } else if (control.valid) {
      this.errorMessage = '';
    }
  }

}
