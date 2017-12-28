import {Component, EventEmitter, Input, OnChanges, Output} from "@angular/core";
import {
  OppFieldError, OppFieldErrorList, isOppFieldError,
  isOppFieldErrorList, OpportunityFormErrorService
} from "../../opportunity-operations/opportunity-form-error.service";
import {Router} from "@angular/router";
import {ValidationErrors} from "../../../app-utils/types";
import {OpportunitySectionFieldsBiMap} from "../../opportunity-operations/framework/data-model/opportunity-form-constants";

@Component({
  selector: 'opp-error-display',
  template: `
  <opp-error-display-helper [validationErrors]="validationErrors" (onNavigation)="onNavigation.emit($event)"></opp-error-display-helper>
  `
})
export class OpportunityErrorDisplayComponent implements OnChanges {
  @Input()
  public validationErrors: (OppFieldError | OppFieldErrorList) = null;
  @Output() message = new EventEmitter();
  @Output() onNavigation = new EventEmitter();

  public numErrors: number = 0;
  public numPristine: number = 0;

  public formatErrors(validationErrors: OppFieldError | OppFieldErrorList, pristineSections: any[]): void {
    this.validationErrors = validationErrors;
    this.numErrors = 0;
    this.numPristine = pristineSections.length;
    this.processErrors(this.validationErrors);
    this.emitErrors();
  }

  // do any required processing here (recursive traversal)
  private processErrors(validationErrors: OppFieldError | OppFieldErrorList): void {
    // base case
    if (isOppFieldError(validationErrors)) {
      if (validationErrors.errors) {
        this.numErrors += Object.keys(validationErrors.errors).length;
      }
    }

    // recursive case
    else if (isOppFieldErrorList(validationErrors)) {
      for (let error of validationErrors.errorList) {
        this.processErrors(error);
      }
    }
  }

  private emitErrors(): void {
    if ((this.numErrors + this.numPristine) > 0) {
      // Construct a message of the form 'You must resolve X issues and complete Y sections in order to submit the form.'
      let message = 'You must ';

      if (this.numErrors > 0) {
        message += 'resolve ';
        message += this.numErrors + ' ';
        message += this.numErrors === 1 ? 'issue ' : 'issues ';
        if (this.numPristine > 0) {
          message += 'and ';
        }
      }

      if (this.numPristine > 0) {
        message += 'complete ';
        message += this.numPristine + ' ';
        message += this.numPristine === 1 ? 'section ' : 'sections ';
      }

      message += 'in order to submit the form.';
      this.message.emit(message);
    } else {
      this.message.emit('');
    }
  }

  public hasErrors(errors: (OppFieldError | OppFieldErrorList)): boolean {
    return OpportunityFormErrorService.hasErrors(errors);
  }
}

@Component({
  selector: 'opp-error-display-helper',
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
        <opp-error-display-helper [validationErrors]="error" (onNavigation)="onNavigation.emit($event)"></opp-error-display-helper>
      </ng-container>
    </ng-container>
    
  </ng-container>
  `
})
export class OpportunityErrorDisplayHelperComponent {
  @Input()
  public validationErrors: (OppFieldError | OppFieldErrorList) = null;
  @Output()
  public onNavigation = new EventEmitter();

  constructor(private router: Router){}

  // todo: handle this as part of preprocess
  public isLeaf(node: any): boolean {
    return isOppFieldError(node);
  }

  // todo: handle this as part of preprocess
  public isBranch(node: any): boolean {
    return isOppFieldErrorList(node);
  }

  // todo: handle this as part of preprocess ??
  public hasErrors(node: (OppFieldError | OppFieldErrorList)): boolean {
    return OpportunityFormErrorService.hasErrors(node);
  }

  public toIterable(obj: ValidationErrors): Array<any> {
    let arr = [];

    for (let error in obj) {
      arr.push(obj[error]);
    }

    return arr;
  }

  public onErrorClick(fieldId: string): void {
    let section = OpportunitySectionFieldsBiMap.fieldSections[fieldId];
    let programId = this.router.url.split('/')[2];
    let url = '/opp/' + programId + '/edit';

    if (section) {
      url += '#' + section + '-' + fieldId;
    }

    this.router.navigateByUrl(url);

    this.onNavigation.emit({url, section, programId, fieldId});
  }
}
