import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core'
import {
  FieldError, FieldErrorList,
  isFieldError, isFieldErrorList, FALFormErrorService
} from '../../assistance-listing-operations/fal-form-error.service';
/*
<sam-alert *ngIf="validationErrors && hasErrors(validationErrors)" [attr.id]="'fal-errors-alert'" [type]="'warning'" [title]="'You must resolve ' + numErrors + ' issue(s) to submit the form'">
  <fal-error-display-helper [validationErrors]="validationErrors"></fal-error-display-helper>
</sam-alert>
*/
@Component({
  selector: 'fal-error-display',
  template: `
  <fal-error-display-helper [validationErrors]="validationErrors"></fal-error-display-helper>
  `
})
export class FALErrorDisplayComponent implements OnChanges {
  @Input()
  public validationErrors: (FieldError | FieldErrorList) = null;
  @Output() message = new EventEmitter();

  public numErrors: number = 0;

  public formatErrors(validationErrors: FieldError | FieldErrorList): void {
    this.validationErrors = validationErrors;
    this.numErrors = 0;
    this.processErrors(this.validationErrors);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.numErrors = 0;
    this.processErrors(this.validationErrors);
  }

  // do any required processing here (recursive traversal)
  private processErrors(validationErrors: FieldError | FieldErrorList) {
    // base case
    if (isFieldError(validationErrors)) {
      if (validationErrors.errors) {
        this.numErrors += Object.keys(validationErrors.errors).length;
      }
    }

    // recursive case
    else if (isFieldErrorList(validationErrors)) {
      for (let error of validationErrors.errorList) {
        this.processErrors(error);
      }
    }
    if(this.numErrors > 0){
      this.message.emit('You must resolve ' + this.numErrors + ' issue(s) to submit the form');
    } else {
      this.message.emit('');
    }
  }

  public hasErrors(errors: (FieldError | FieldErrorList)): boolean {
    return FALFormErrorService.hasErrors(errors);
  }
}

@Component({
  selector: 'fal-error-display-helper',
  templateUrl: `
  <ng-container *ngIf="hasErrors(validationErrors)">
    <!-- base case: single field's errors -->
    <ng-container *ngIf="isLeaf(validationErrors)">
      <!-- then just display the error messages -->
      <div *ngFor="let errorObj of (validationErrors.errors | keys)" class="m_L-4x">
        <i class="fa fa-angle-right" aria-hidden="true"></i> {{ errorObj.value.message }}
      </div>
    </ng-container>
    
    <!-- recursive case: list of fields' errors -->
    <ng-container *ngIf="isBranch(validationErrors)">
      <!-- then show the section label -->
      <strong *ngIf="validationErrors.label">
        {{ validationErrors.label }}
      </strong>
      <!-- and recurse for each field -->
      <ng-container *ngFor="let error of validationErrors.errorList">
        <fal-error-display-helper [validationErrors]="error"></fal-error-display-helper>
      </ng-container>
    </ng-container>
    
  </ng-container>
  `
})
export class FALErrorDisplayHelperComponent {
  @Input()
  public validationErrors: (FieldError | FieldErrorList) = null;

  // todo: handle this as part of preprocess
  public isLeaf(node: any): boolean {
    return isFieldError(node);
  }

  // todo: handle this as part of preprocess
  public isBranch(node: any): boolean {
    return isFieldErrorList(node);
  }

  // todo: handle this as part of preprocess ??
  public hasErrors(node: (FieldError | FieldErrorList)): boolean {
    return FALFormErrorService.hasErrors(node);
  }
}
