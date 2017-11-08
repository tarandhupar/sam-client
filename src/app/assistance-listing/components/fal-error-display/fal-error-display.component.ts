import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core'
import {
  FieldError, FieldErrorList,
  isFieldError, isFieldErrorList, FALFormErrorService
} from '../../assistance-listing-operations/fal-form-error.service';
import {
  FALSectionFieldsBiMap, FALFieldNames,
  FALSectionNames
} from '../../assistance-listing-operations/fal-form.constants';
import { Router } from '@angular/router';
import { ValidationErrors } from '../../../app-utils/types';
/*
<sam-alert *ngIf="validationErrors && hasErrors(validationErrors)" [attr.id]="'fal-errors-alert'" [type]="'warning'" [title]="'You must resolve ' + numErrors + ' issue(s) to submit the form'">
  <fal-error-display-helper [validationErrors]="validationErrors"></fal-error-display-helper>
</sam-alert>
*/
@Component({
  selector: 'fal-error-display',
  template: `
  <fal-error-display-helper [validationErrors]="validationErrors" (onNavigation)="onNavigation.emit($event)"></fal-error-display-helper>
  `
})
export class FALErrorDisplayComponent implements OnChanges {
  @Input()
  public validationErrors: (FieldError | FieldErrorList) = null;
  @Output() message = new EventEmitter();
  @Output() onNavigation = new EventEmitter();

  public numErrors: number = 0;

  public formatErrors(validationErrors: FieldError | FieldErrorList): void {
    this.validationErrors = validationErrors;
    this.numErrors = 0;
    this.processErrors(this.validationErrors);
    this.emitErrors();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.numErrors = 0;
    this.processErrors(this.validationErrors);
    this.emitErrors();
  }

  // do any required processing here (recursive traversal)
  private processErrors(validationErrors: FieldError | FieldErrorList): void {
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
  }

  private emitErrors(): void {
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
      <div *ngFor="let error of toIterable(validationErrors.errors)" class="m_L-4x">
        <i class="fa fa-angle-right" aria-hidden="true"></i> <a (click)="onErrorClick(validationErrors.id)">{{ error.message }}</a>
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
        <fal-error-display-helper [validationErrors]="error" (onNavigation)="onNavigation.emit($event)"></fal-error-display-helper>
      </ng-container>
    </ng-container>
    
  </ng-container>
  `
})
export class FALErrorDisplayHelperComponent {
  @Input()
  public validationErrors: (FieldError | FieldErrorList) = null;
  @Output()
  public onNavigation = new EventEmitter();

  constructor(private router: Router){}

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

  public toIterable(obj: ValidationErrors): Array<any> {
    let arr = [];

    for (let error in obj) {
      arr.push(obj[error]);
    }

    return arr;
  }

  public onErrorClick(fieldId: string): void {
    let section = FALSectionFieldsBiMap.fieldSections[fieldId];
    let programId = this.router.url.split('/')[2];
    let url = '/fal/' + programId + '/edit';

    if (fieldId.indexOf(FALFieldNames.COMPLIANCE_REPORTS) !== -1) {
      section = FALSectionNames.COMPLIANCE_REQUIREMENTS;
    }

    if (fieldId.indexOf(FALFieldNames.AUTHORIZATION_LIST) !== -1) {
      section = FALSectionNames.AUTHORIZATION;
      fieldId = FALFieldNames.AUTHORIZATION_LIST;
    }

    if (fieldId.indexOf(FALFieldNames.CONTACT_LIST) !== -1) {
      section = FALSectionNames.CONTACT_INFORMATION;
      fieldId = FALFieldNames.CONTACT_LIST;
    }

    if (fieldId.indexOf(FALFieldNames.OBLIGATION_LIST) !== -1) {
      section = FALSectionNames.OBLIGATIONS;
      fieldId = FALFieldNames.OBLIGATION_LIST;
    }

    if (fieldId.indexOf(FALFieldNames.FUNDED_PROJECTS) !== -1) {
      section = FALSectionNames.OVERVIEW;
      fieldId = FALFieldNames.FUNDED_PROJECTS;
    }

    if (fieldId.indexOf(FALFieldNames.TAFS_CODES) !== -1) {
      section = FALSectionNames.OTHER_FINANCIAL_INFO;
      fieldId = FALFieldNames.TAFS_CODES;
    }

    if (fieldId.indexOf(FALFieldNames.PROGRAM_ACCOMPLISHMENTS) !== -1) {
      section = FALSectionNames.OTHER_FINANCIAL_INFO;
      fieldId = FALFieldNames.PROGRAM_ACCOMPLISHMENTS;
    }

    if (fieldId.indexOf(FALFieldNames.ACCOUNT_IDENTIFICATION) !== -1) {
      section = FALSectionNames.OTHER_FINANCIAL_INFO;
      fieldId = FALFieldNames.ACCOUNT_IDENTIFICATION;
    }

    if (fieldId.indexOf(FALFieldNames.DEADLINES_LIST) !== -1) {
      section = FALSectionNames.APPLYING_FOR_ASSISTANCE;
      fieldId = FALFieldNames.DEADLINES_LIST;
    }

    if (section) {
      url += '#' + section + '-' + fieldId;
    }

    this.router.navigateByUrl(url);

    this.onNavigation.emit({url, section, programId, fieldId});
  }
}
