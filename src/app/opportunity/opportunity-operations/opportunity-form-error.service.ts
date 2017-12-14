import { Injectable } from '@angular/core';
import {OpportunityFormViewModel} from "./framework/data-model/opportunity-form/opportunity-form.model";
import {OpportunityFieldNames, OpportunitySectionNames} from "./framework/data-model/opportunity-form-constants";
import {ValidationErrors} from "../../app-utils/types";
import * as _ from 'lodash';

export interface OppFieldError {
  id?: string,
  label?: string,
  errors: ValidationErrors | null
}

export interface OppFieldErrorList {
  id?: string,
  label?: string,
  errorList: (OppFieldError | OppFieldErrorList)[]
}

export function isOppFieldError(arg: any): arg is OppFieldError {
  return arg && arg.errors !== undefined;
}

export function isOppFieldErrorList(arg: any): arg is OppFieldErrorList {
  return arg && arg.errorList !== undefined;
}

@Injectable()
export class OpportunityFormErrorService {
  private _viewModel: OpportunityFormViewModel;
  private _errors: OppFieldErrorList;

  private _fieldValidatorFnMap = {
    // Header Information
    [OpportunityFieldNames.OPPORTUNITY_TYPE]: this.validateHeaderType,
    [OpportunityFieldNames.TITLE]: this.validateHeaderTitle,
    [OpportunityFieldNames.PROCUREMENT_ID]: this.validateProcurementId,
    [OpportunityFieldNames.CONTRACTING_OFFICE]: this.validateFederalAgency,

    //General Information
    [OpportunityFieldNames.ARCHIVE_POLICY]: this.validateArchiveType,
    [OpportunityFieldNames.VENDORS_CD_IVL]: this.validateIvlAdd,
    [OpportunityFieldNames.VENDORS_V_IVL]: this.validateIvlView,
  };

  constructor() {
    let initSectionError = (id, label): OppFieldErrorList => {
      return { id, label, errorList: [] };
    };

    this._errors = {
      errorList: [
        initSectionError(OpportunitySectionNames.HEADER, 'Header Information'),
        initSectionError(OpportunitySectionNames.GENERAL, 'General Information'),
      ]
    };
  }

  get viewModel() {
    return this._viewModel;
  }

  set viewModel(viewModel: OpportunityFormViewModel) {
    this._viewModel = viewModel;
  }

  get errors(): OppFieldErrorList {
    return this._errors;
  }

  get applicableErrors(): OppFieldErrorList {
    let applicable = _.cloneDeep(this._errors);
    if(applicable && applicable.errorList) {
      applicable.errorList = applicable.errorList.filter((section) => {
        return this._viewModel.getSectionStatus(section.id) === 'updated';
      });
    }
    return applicable;
  }

  public static hasErrors(errorObj: (OppFieldError | OppFieldErrorList)): boolean {
    if (isOppFieldError(errorObj)) {
      return errorObj.errors != null;
    } else if (isOppFieldErrorList(errorObj)) {
      for (let error of errorObj.errorList) {
        if (OpportunityFormErrorService.hasErrors(error)) {
          return true;
        }
      }

      return false;
    }

    return false; // null, undefined, or invalid type
  }

  // todo: review how to handle exceptions -- actions taken on completion but does returned observable still complete??
  public validateAll(){
    Object.keys(this._fieldValidatorFnMap).forEach((field) => {
        let validatorFn = this._fieldValidatorFnMap[field].bind(this);
        validatorFn();
    });
  }

  public static findErrorById(fieldErrorList: OppFieldErrorList, id: string): (OppFieldError | OppFieldErrorList | null) {
  if(fieldErrorList && fieldErrorList.errorList.length > 0) {
  for (let error of fieldErrorList.errorList) {
  if (error.id && error.id === id) {
  return error;
}
}
}

return null;
}

public static findSectionErrorById(fieldErrorList: any, sectionId: string, fieldId: string = null): (OppFieldError | OppFieldErrorList | null) {
  if(fieldErrorList && fieldErrorList.errorList && fieldErrorList.errorList.length > 0) {
    for (let error of fieldErrorList.errorList) {
      if (error.id && error.id === sectionId) {
        if(fieldId) {
          let fieldError = OpportunityFormErrorService.findErrorById(error, fieldId);
          return fieldError;
        }
        else
          return error;
      }
    }
  }

  return null;
}

private setOrUpdateError(fieldErrorList: OppFieldErrorList, error: (OppFieldError | OppFieldErrorList)): void {
  let existing = OpportunityFormErrorService.findErrorById(fieldErrorList, error.id);

if (existing) {
  if (isOppFieldError(error) && isOppFieldError(existing)) {
    existing.errors = error.errors;
  }
  else if (isOppFieldErrorList(error) && isOppFieldErrorList(existing)) {
    existing.errorList = error.errorList;
  } else {
    console.log('Error: Found incompatible error types for ', error, ' and ', existing);
  }
} else {
  fieldErrorList.errorList.push(error);
}
}

private validateRequired(fieldName, ...properties): ValidationErrors|null {
  let valid = true;

  for(let prop of properties) {
    if (!prop && prop !== 0) { // null, undefined, "", false, NaN
      valid = false;
      break;
    } else {
      if (prop instanceof Array && !(prop.filter((a) => (!!a || a === 0)).length > 0)) {
        valid = false;
        break;
      }
    }
  }

  return valid ? null : this.requiredFieldError(fieldName);
}

private requiredFieldError(fieldName): ValidationErrors {
  return {
    requiredField: {
      message: fieldName + ' is a required field'
    }
  };
}

// Header Information Section
// --------------------------------------------------------------------------

public validateHeaderTitle(): OppFieldError {
  let titleErrors = {
    id: OpportunityFieldNames.TITLE,
    errors: this.validateRequired('Title', this._viewModel.title)
  };

  let headerErrors = OpportunityFormErrorService.findErrorById(this._errors, OpportunitySectionNames.HEADER) as OppFieldErrorList;
  this.setOrUpdateError(headerErrors, titleErrors);

  return titleErrors;
}

  public validateProcurementId(): OppFieldError {
    let procurementIdErrors = {
      id: OpportunityFieldNames.PROCUREMENT_ID,
      errors: this.validateRequired('Procurement ID', this._viewModel.oppHeaderInfoViewModel.procurementId )
    };

    let headerErrors = OpportunityFormErrorService.findErrorById(this._errors, OpportunitySectionNames.HEADER) as OppFieldErrorList;
    this.setOrUpdateError(headerErrors, procurementIdErrors);

    return procurementIdErrors;
  }



public validateFederalAgency(): OppFieldError {
  let agencyErrors = {
    id: OpportunityFieldNames.CONTRACTING_OFFICE,
    errors: this.validateRequired('Contracting Office', this._viewModel.oppHeaderInfoViewModel.office)
  };

  let headerErrors = OpportunityFormErrorService.findErrorById(this._errors, OpportunitySectionNames.HEADER) as OppFieldErrorList;
  this.setOrUpdateError(headerErrors, agencyErrors);

  return agencyErrors;
}


public validateHeaderType(): OppFieldError {
  let errors: ValidationErrors = null;
  if (this._viewModel.oppHeaderInfoViewModel.opportunityType == '') {
    errors = this.requiredFieldError('Type');
  }

  let fieldErrors = {
    id: OpportunityFieldNames.OPPORTUNITY_TYPE,
    errors: errors
  };

  let sectionErrors = OpportunityFormErrorService.findErrorById(this._errors, OpportunitySectionNames.HEADER) as OppFieldErrorList;
  this.setOrUpdateError(sectionErrors, fieldErrors);

  return fieldErrors;
}

//General Information Section
public validateArchiveType(): OppFieldError {
  let fieldErrors = {
    id: OpportunityFieldNames.ARCHIVE_POLICY,
    errors: this.validateRequired('Archiving Policy', this._viewModel.oppGeneralInfoViewModel.archiveType)
  };
  let sectionErrors = OpportunityFormErrorService.findErrorById(this._errors, OpportunitySectionNames.GENERAL) as OppFieldErrorList;
  this.setOrUpdateError(sectionErrors, fieldErrors);
  return fieldErrors;
}
public validateIvlAdd(): OppFieldError {
  let fieldErrors = {
    id: OpportunityFieldNames.VENDORS_CD_IVL,
    errors: this.validateRequired('IVL Add', this._viewModel.oppGeneralInfoViewModel.vendorCDIvl)
  };
  let sectionErrors = OpportunityFormErrorService.findErrorById(this._errors, OpportunitySectionNames.GENERAL) as OppFieldErrorList;
  this.setOrUpdateError(sectionErrors, fieldErrors);
  return fieldErrors;
}

public validateIvlView(): OppFieldError {
  let fieldErrors = {
    id: OpportunityFieldNames.VENDORS_V_IVL,
    errors: this.validateRequired('IVL View', this._viewModel.oppGeneralInfoViewModel.vendorViewIvl)
  };
  let sectionErrors = OpportunityFormErrorService.findErrorById(this._errors, OpportunitySectionNames.GENERAL) as OppFieldErrorList;
  this.setOrUpdateError(sectionErrors, fieldErrors);
  return fieldErrors;
}

}
