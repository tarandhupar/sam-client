import { Injectable } from '@angular/core';
import { FALFormViewModel } from './fal-form.model';
import { ValidationErrors } from '../../app-utils/types';
import { FALSectionNames, FALFieldNames, FALSectionFieldsList } from './fal-form.constants';

export interface FieldError {
  id?: string,
  label?: string,
  errors: ValidationErrors | null
}

export interface FieldErrorList {
  id?: string,
  label?: string,
  errorList: (FieldError | FieldErrorList)[]
}

export function isFieldError(arg: any): arg is FieldError {
  return arg && arg.errors !== undefined;
}

export function isFieldErrorList(arg: any): arg is FieldErrorList {
  return arg && arg.errorList !== undefined;
}

@Injectable()
export class FALFormErrorService {
  private _viewModel: FALFormViewModel;
  private _errors: FieldErrorList;

  get viewModel() {
    return this._viewModel;
  }

  set viewModel(viewModel: FALFormViewModel) {
    this._viewModel = viewModel;
  }

  get errors() {
    return this._errors;
  }

  public static hasErrors(errorObj: (FieldError | FieldErrorList)): boolean  {
    if (isFieldError(errorObj)) {
      return errorObj.errors != null;
    } else if (isFieldErrorList(errorObj)) {
      for (let error of errorObj.errorList) {
        if (FALFormErrorService.hasErrors(error)) {
          return true;
        }
      }

      return false;
    }

    return true; // null, undefined, or invalid type
  }

  public initFALErrors(): void {
    this._errors = {
      errorList: [
        {
          id: FALSectionNames.HEADER,
          label: 'Header Information',
          errorList: []
        },
        {
          id: FALSectionNames.OVERVIEW,
          label: 'Overview',
          errorList: []
        }
      ]
    };

    for (let field of FALSectionFieldsList.OVERVIEW_FIELDS) {
      this.validate(FALSectionNames.OVERVIEW, field);
    }

    for ( let field of FALSectionFieldsList.HEADER_FIELDS) {
      this.validate(FALSectionNames.HEADER, field);
    }
  }

  private findErrorById(fieldErrorList: FieldErrorList, id: string): (FieldError | FieldErrorList | null) {
    for (let error of fieldErrorList.errorList) {
      if (error.id && error.id === id) {
        return error;
      }
    }

    return null;
  }

  private setOrUpdateError(fieldErrorList: FieldErrorList, error: (FieldError | FieldErrorList)): void {
    let existing = this.findErrorById(fieldErrorList, error.id);

    if (existing) {
      if (isFieldError(error) && isFieldError(existing)) {
        existing.errors = error.errors;
      }
      else if (isFieldErrorList(error) && isFieldErrorList(existing)) {
        existing.errorList = error.errorList;
      } else {
        console.log('Error: Found incompatible error types for ', error, ' and ', existing);
      }
    } else {
      fieldErrorList.errorList.push(error);
    }
  }

  public validate(sectionName: string, fieldName: string): void {
    switch (sectionName) {
      case FALSectionNames.HEADER:
        this.validateHeaderInfo(fieldName);
        break;
      case FALSectionNames.OVERVIEW:
        this.validateOverview(fieldName);
        break;
    }
  }


  //Header Information Section
  public validateHeaderInfo(fieldName: string): void {
    switch (fieldName) {
      case FALFieldNames.TITLE:
        this.validateHeaderTitle();
        break;
      case FALFieldNames.FEDERAL_AGENCY:
        this.validateFederalAgency();
        break;
      case FALFieldNames.FALNO:
        this.validateHeaderProgNo();
        break;
    }
  }

  public validateHeaderTitle(): FieldError {
    let errors: ValidationErrors = null;

    if (!this._viewModel.title) {
      errors = {
        missingField: {
          message: 'Title field cannot be empty'
        }
      };
    }

    let titleErrors = {
      id: FALFieldNames.TITLE,
      errors: errors
    };

    let headerErrors = this.findErrorById(this._errors, FALSectionNames.HEADER) as FieldErrorList;

    this.setOrUpdateError(headerErrors, titleErrors);

    return titleErrors;
  }

  public validateHeaderProgNo(): FieldError {
    let errors: ValidationErrors = null;

    if (!this._viewModel.programNumber) {
      errors = {
        missingField: {
          message: 'FAL Number field cannot be empty.'
        }
      };
    }
    else if(this._viewModel.programNumber.indexOf(".") == -1 && this._viewModel.programNumber.length !== 3){
      errors = {
        maxFieldLength: {
          message: 'FAL Number field value falls outside the range defined for this organization.'
        }
      };
    }

    let falNoErrors = {
      id: FALFieldNames.FALNO,
      errors: errors
    };

    let headerErrors = this.findErrorById(this._errors, FALSectionNames.HEADER) as FieldErrorList;

    this.setOrUpdateError(headerErrors, falNoErrors);

    return falNoErrors;

  }

  public validateFederalAgency(): FieldError {
    let errors: ValidationErrors = null;

    if(!this._viewModel.organizationId){
      errors = {
        missingField: {
          message: 'Federal Agency field cannot be empty.'
        }
      };
    }

    let agencyErrors = {
      id: FALFieldNames.FEDERAL_AGENCY,
      errors: errors
    };

    let headerErrors = this.findErrorById(this._errors, FALSectionNames.HEADER) as FieldErrorList;

    this.setOrUpdateError(headerErrors, agencyErrors);

    return agencyErrors;
  }

  //Overview Section

  public validateOverview(fieldName: string): void {
    switch (fieldName) {
      case FALFieldNames.OBJECTIVE:
        this.validateObjective();
        break;
      case FALFieldNames.FUNDED_PROJECTS:
        this.clearFundedProjectsErrors();
        if(this._viewModel.projects && this._viewModel.projects.list) {
          for (let i = 0; i < this._viewModel.projects.list.length; i++) {
            this.validateFundedProjectsExample(i);
            this.validateFundedProjectsYear(i);
          }
        }
        break;
      case FALFieldNames.FUNCTIONAL_CODES:
        this.validateFunctionalCodes();
        break;
      case FALFieldNames.SUBJECT_TERMS:
        this.validateSubjectTerms();
        break;
    }
  }

  public validateObjective(): FieldError {
    let errors: ValidationErrors = null;

    if (!this._viewModel.objective) {
      errors = {
        missingField: {
          message: 'Objectives are missing'
        }
      };
    }

    let objectiveErrors = {
      id: FALFieldNames.OBJECTIVE,
      errors: errors
    };

    let overviewErrors = this.findErrorById(this._errors, FALSectionNames.OVERVIEW) as FieldErrorList;

    this.setOrUpdateError(overviewErrors, objectiveErrors);

    return objectiveErrors;
  }

  public validateSubjectTerms(): FieldError {
    let errors: ValidationErrors = null;

    if (!(this._viewModel.subjectTerms.length > 0)) {
      errors = {
        missingField: {
          message: 'Subject Terms are missing'
        }
      };
    }

    let subjectTermsErrors = {
      id: FALFieldNames.SUBJECT_TERMS,
      errors: errors
    };

    let overviewErrors = this.findErrorById(this._errors, FALSectionNames.OVERVIEW) as FieldErrorList;

    this.setOrUpdateError(overviewErrors, subjectTermsErrors);

    return subjectTermsErrors;
  }

  public validateFunctionalCodes(): FieldError {
    let errors: ValidationErrors = null;

    if (!(this._viewModel.functionalCodes.length > 0)) {
      errors = {
        missingField: {
          message: 'Functional Codes are missing'
        }
      };
    }

    let functionalCodesErrors = {
      id: FALFieldNames.FUNCTIONAL_CODES,
      errors: errors
    };

    let overviewErrors = this.findErrorById(this._errors, FALSectionNames.OVERVIEW) as FieldErrorList;

    this.setOrUpdateError(overviewErrors, functionalCodesErrors);

    return functionalCodesErrors;
  }

  public clearFundedProjectsErrors(): void {
    let fundedProjectsErrors: FieldErrorList = {
      id: FALFieldNames.FUNDED_PROJECTS,
      //label: 'Funded Projects',
      errorList: []
    };

    let overviewErrors = this.findErrorById(this._errors, FALSectionNames.OVERVIEW) as FieldErrorList;
    this.setOrUpdateError(overviewErrors, fundedProjectsErrors);
  }

  public validateFundedProjectsYear(index: number): (FieldError | null) {
    let error: FieldError = null;

    if (this._viewModel.projects && this._viewModel.projects.isApplicable && this._viewModel.projects.list && this._viewModel.projects.list[index]) {
      let project = this._viewModel.projects.list[index];

      if (!project.fiscalYear) {
        error = {
          id: FALFieldNames.FUNDED_PROJECTS + index,
          errors: {
            missingYear: {
              message: 'Examples of Funded Projects: Row ' + (index + 1) + ' is missing Year'
            }
          }
        };
      }
    }

    if (error) {
      let overviewErrors = this.findErrorById(this._errors, FALSectionNames.OVERVIEW) as FieldErrorList;
      let fundedProjectErrors = this.findErrorById(overviewErrors, FALFieldNames.FUNDED_PROJECTS) as FieldErrorList;
      fundedProjectErrors.errorList.push(error);
    }

    return error;
  }

  public validateFundedProjectsExample(index: number): (FieldError | null) {
    let error: FieldError = null;

    if (this._viewModel.projects && this._viewModel.projects.isApplicable && this._viewModel.projects.list && this._viewModel.projects.list[index]) {
      let project = this._viewModel.projects.list[index];

      if (!project.description) {
        error = {
          id: FALFieldNames.FUNDED_PROJECTS + index,
          errors: {
            missingDescription: {
              message: 'Examples of Funded Projects: Row ' + (index + 1) + ' is missing Example'
            }
          }
        };
      }
    }

    if (error) {
      let overviewErrors = this.findErrorById(this._errors, FALSectionNames.OVERVIEW) as FieldErrorList;
      let fundedProjectErrors = this.findErrorById(overviewErrors, FALFieldNames.FUNDED_PROJECTS) as FieldErrorList;
      fundedProjectErrors.errorList.push(error);
    }

    return error;
  }
}
