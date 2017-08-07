import { Injectable } from '@angular/core';
import { FALFormViewModel } from './fal-form.model';
import { ValidationErrors } from '../../app-utils/types';
import { FALSectionNames, FALFieldNames, FALSectionFieldsBiMap } from './fal-form.constants';
import * as _ from 'lodash';
import { ReplaySubject, Subject } from "rxjs";

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

  get errors(): FieldErrorList {
    return this._errors;
  }

  get applicableErrors(): FieldErrorList {
    let applicable = _.cloneDeep(this._errors);
    applicable.errorList = applicable.errorList.filter((section) => {
      return this._viewModel.getSectionStatus(section.id) === 'updated';
    });

    return applicable;
  }

  public static hasErrors(errorObj: (FieldError | FieldErrorList)): boolean {
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

    return false; // null, undefined, or invalid type
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
        },
        {
          id: FALSectionNames.AUTHORIZATION,
          label: 'Authorization',
          errorList: []
        },
        {
          id: FALSectionNames.OBLIGATIONS,
          label: 'Obligations',
          errorList: []
        },
        {
          id: FALSectionNames.OTHER_FINANCIAL_INFO,
          label: 'Other Financial Information',
          errorList: []
        },
        {
          id: FALSectionNames.CRITERIA_INFO,
          label: 'Criteria for Applying',
          errorList: []
        },
        {
          id: FALSectionNames.APPLYING_FOR_ASSISTANCE,
          label: 'Applying for Assistance',
          errorList: []
        },
        {
          id: FALSectionNames.COMPLIANCE_REQUIREMENTS,
          label: 'Compliance Requirements',
          errorList: []
        },
        {
          id: FALSectionNames.CONTACT_INFORMATION,
          label: 'Contact Information',
          errorList: []
        }
      ]
    };

    // todo: use string enums ??
    Object.keys(FALSectionFieldsBiMap.sectionFields).forEach((section) => {
      FALSectionFieldsBiMap.sectionFields[section].forEach((field) => {
        this.validate(section, field);
      });
    });
  }

  public static findErrorById(fieldErrorList: FieldErrorList, id: string): (FieldError | FieldErrorList | null) {
    if(fieldErrorList && fieldErrorList.errorList.length > 0) {
      for (let error of fieldErrorList.errorList) {
        if (error.id && error.id === id) {
          return error;
        }
      }
    }

    return null;
  }

  public static findSectionErrorById(fieldErrorList: any, sectionId: string, fieldId: string = null): (FieldError | FieldErrorList | null) {
    if(fieldErrorList && fieldErrorList.errorList.length > 0) {
      for (let error of fieldErrorList.errorList) {
        if (error.id && error.id === sectionId) {
          if(fieldId) {
            let fieldError = FALFormErrorService.findErrorById(error, fieldId);
            return fieldError;
          }
          else
            return error;
        }
      }
    }

    return null;
  }

  private setOrUpdateError(fieldErrorList: FieldErrorList, error: (FieldError | FieldErrorList)): void {
    let existing = FALFormErrorService.findErrorById(fieldErrorList, error.id);

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
      case FALSectionNames.AUTHORIZATION:
        this.validateAuthorization(fieldName);
        break;
      case FALSectionNames.OBLIGATIONS:
        this.validateObligation(fieldName);
        break;
      case FALSectionNames.OTHER_FINANCIAL_INFO:
        this.validateOtherFinancialInfo(fieldName);
        break;
      case FALSectionNames.CRITERIA_INFO:
        this.validateCriteria(fieldName);
        break;
      case FALSectionNames.APPLYING_FOR_ASSISTANCE:
        this.validateApplyingForAssistance(fieldName);
        break;
      case FALSectionNames.COMPLIANCE_REQUIREMENTS:
        this.validateComplianceRequirement(fieldName);
        break;
      case FALSectionNames.CONTACT_INFORMATION:
        this.validateContactInformation(fieldName);
        break;
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

  private validateConditionalRequired(fieldName, isApplicable, ...properties): ValidationErrors|null {
    return isApplicable ? this.validateRequired(fieldName, properties) : null;
  }

  // Header Information Section
  // --------------------------------------------------------------------------
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
    let titleErrors = {
      id: FALFieldNames.TITLE,
      errors: this.validateRequired('Title', this._viewModel.title)
    };

    let headerErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.HEADER) as FieldErrorList;
    this.setOrUpdateError(headerErrors, titleErrors);

    return titleErrors;
  }

  public validateHeaderProgNo(validateFlag = false, rangeLow = 0, rangeHigh = 0, cookie = null, programService = null): Subject<any> {
    let errors: ValidationErrors = null;
    let response: Subject<any> = new ReplaySubject(1);
    let finished = true;

    if(validateFlag) {

      let progNo;

      if (!this._viewModel.programNumber) {
        errors = this.requiredFieldError('FAL Number field');
      }
      else {

        if (this._viewModel.programNumber.indexOf(".") == -1) {
          progNo = this._viewModel.programNumber;
        }
        else {
          progNo = this._viewModel.programNumber.slice(3);
        }

        if(progNo.length !== 3) {
          errors = {
            maxFieldLength: {
              message: 'FAL Number field - Please enter a three digit number'
            }
          };
        }
        else if (progNo < rangeLow || progNo > rangeHigh) {
          errors = {
            maxFieldLength: {
              message: 'FAL Number field value falls outside the range defined for this organization'
            }
          };
        }
        else {
          finished = false;
          programService.isProgramNumberUnique(this._viewModel.programNumber, this._viewModel.programId, cookie, this._viewModel.organizationId)
            .subscribe(res => {
              if(!res['content']['isProgramNumberUnique']) {
                errors = {
                  programNumberUnique: {
                    message: 'CFDA Number already exists. Please enter a valid Number'
                  }
                };
              }

              let falNoErrors = {
                id: FALFieldNames.FALNO,
                errors: errors
              };

              let headerErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.HEADER) as FieldErrorList;
              this.setOrUpdateError(headerErrors, falNoErrors);

              response.next(falNoErrors);
              response.complete();
            });
        } //end of else
      }
    } //end of if validateFlag

    if (finished) {
      let falNoErrors = {
        id: FALFieldNames.FALNO,
        errors: errors
      };

      let headerErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.HEADER) as FieldErrorList;
      this.setOrUpdateError(headerErrors, falNoErrors);

      response.next(falNoErrors);
      response.complete();
    }

    return response;
  }


  public validateFederalAgency(): FieldError {
    let agencyErrors = {
      id: FALFieldNames.FEDERAL_AGENCY,
      errors: this.validateRequired('Federal Agency', this._viewModel.organizationId)
    };

    let headerErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.HEADER) as FieldErrorList;
    this.setOrUpdateError(headerErrors, agencyErrors);

    return agencyErrors;
  }

  // Overview Section
  // --------------------------------------------------------------------------
  public validateOverview(fieldName: string): void {
    switch (fieldName) {
      case FALFieldNames.OBJECTIVE:
        this.validateObjective();
        break;
      case FALFieldNames.FUNDED_PROJECTS:
        this.validateFundedProjects();
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
    let objectiveErrors = {
      id: FALFieldNames.OBJECTIVE,
      errors: this.validateRequired('Objectives', this._viewModel.objective)
    };

    let overviewErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.OVERVIEW) as FieldErrorList;
    this.setOrUpdateError(overviewErrors, objectiveErrors);

    return objectiveErrors;
  }

  public validateSubjectTerms(): FieldError {
    let subjectTermsErrors = {
      id: FALFieldNames.SUBJECT_TERMS,
      errors: this.validateRequired('Subject Terms', this._viewModel.subjectTerms)
    };

    let overviewErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.OVERVIEW) as FieldErrorList;
    this.setOrUpdateError(overviewErrors, subjectTermsErrors);

    return subjectTermsErrors;
  }

  public validateFunctionalCodes(): FieldError {
    let functionalCodesErrors = {
      id: FALFieldNames.FUNCTIONAL_CODES,
      errors: this.validateRequired('Functional Codes', this._viewModel.functionalCodes)
    };

    let overviewErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.OVERVIEW) as FieldErrorList;
    this.setOrUpdateError(overviewErrors, functionalCodesErrors);

    return functionalCodesErrors;
  }

  public validateFundedProjects(): (FieldErrorList | null) {
    let errors: FieldError[] = [];

    if (this._viewModel.projects && this._viewModel.projects.list && this._viewModel.projects.isApplicable) {
      let projects = this._viewModel.projects;
      for (let i = 0; i < projects.list.length; i++) {
        let project = projects.list[i];
        let projectError = {
          id: FALFieldNames.FUNDED_PROJECTS + i,
          errors: {}
        };

        if (!project.fiscalYear) {
          projectError.errors['missingYear'] = {
            message: 'Examples of Funded Projects: Row ' + (i + 1) + ' Year is required'
          };
        }

        if (!project.description) {
          projectError.errors['missingDescription'] = {
            message: 'Examples of Funded Projects: Row ' + (i + 1) + ' Examples is required'
          };
        }

        if (!(_.isEmpty(projectError.errors))) {
          errors.push(projectError);
        }
      }
    }

    let fundedProjectErrors = {
      id: FALFieldNames.FUNDED_PROJECTS,
      // label: 'Funded Projects',
      errorList: errors
    };

    let overviewErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.OVERVIEW) as FieldErrorList;
    this.setOrUpdateError(overviewErrors, fundedProjectErrors);

    if (errors.length > 0) {
      return fundedProjectErrors;
    } else {
      return null;
    }
  }

  // Authorization
  // --------------------------------------------------------------------------
  public validateAuthorization(fieldName: string): void {
    switch (fieldName) {
      case FALFieldNames.AUTHORIZATION_LIST:
        this.validateAuthList();
        break;
    }
  }

  public validateAuthList(): (FieldErrorList | null) {
    let errors: FieldError[] = [];

    if (this._viewModel.authList && this._viewModel.authList.length > 0) {
      let authList = this._viewModel.authList;
      let orderedAuthList = this.rearrangeAuthList(authList);
      let counter = 1;

      for (let key of Object.keys(orderedAuthList)) {
        let index = orderedAuthList[key].index;
        let auth = authList[index];
        this.checkAuthForError(auth, counter, errors, index);

        for(let childKey of Object.keys(orderedAuthList[key].children)){
          counter++;
          let childIndex = orderedAuthList[key].children[childKey].index;
          let ammend = authList[childIndex];
          this.checkAuthForError(ammend, counter, errors, childIndex, true);
        }

        counter++;

      } //end of for
    }
    else {
      let authError = {
        id: FALFieldNames.AUTHORIZATION_LIST,
        errors: {
          noAuth: {
            message: 'At least one authorization is required'
          }
        }
      };

      if (!(_.isEmpty(authError.errors))) {
        errors.push(authError);
      }
    }

    let authListErrors = {
      id: FALFieldNames.AUTHORIZATION_LIST,
      errorList: errors
    };

    let sectionErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.AUTHORIZATION) as FieldErrorList;
    this.setOrUpdateError(sectionErrors, authListErrors);

    if (errors.length > 0) {
      return authListErrors;
    } else {
      return null;
    }
  }

  public rearrangeAuthList(authList) {
    let orderedAuthArr = {};
    let counter = 0;
    for (let auth of authList) {
      if (auth.parentAuthorizationId == null) {
        orderedAuthArr[auth.authorizationId] = {index: counter, children: {}};
      }
      else {
        orderedAuthArr[auth.parentAuthorizationId]['children'][auth.authorizationId] = {index: counter };
      }
      counter = counter + 1;
    }
    return orderedAuthArr;
  }

  public checkAuthForError(auth, i, errors, index, child = false){

    let authError = {
      id: FALFieldNames.AUTHORIZATION_LIST + index,
      errors: {}
    };

    if (!auth.authorizationTypes && auth.authorizationId) {

      authError.errors['missingAuthType'] = {
        message: (child ? 'Amendment: Row ' + i + ' Authorization Type is required' : 'Authorization: Row ' + i + ' Authorization Type is required')
      };
    }

    if (!(_.isEmpty(authError.errors))) {
      errors.push(authError);
    }
  }

  // Financial Obligations
  // --------------------------------------------------------------------------
  public validateObligation(fieldName: string): void {
    switch (fieldName) {
      case FALFieldNames.OBLIGATION_LIST:
        this.validateObligationList();
        break;
    }
  }

  public validateObligationList(): (FieldErrorList | null) {
    let errors: FieldError[] = [];
    if (this._viewModel.obligations && this._viewModel.obligations.length > 0) {
      let obligations = this._viewModel.obligations;
      let orderedObligList = this.rearrangeObligationList(obligations);
      let counter = 1;
      for (let key of Object.keys(orderedObligList)) {
        let index = orderedObligList[key].index;
        let oblig = obligations[index];
        this.checkObligationForError(oblig, counter, errors, index);
        counter++;
      }
    }
    else {
      let obligError = {
        id: FALFieldNames.OBLIGATION_LIST,
        errors: {
          noOblig: {
            message: 'At least one obligation is required'
          }
        }
      };

      if (!(_.isEmpty(obligError.errors))) {
        errors.push(obligError);
      }
    }

    let obligListErrors = {
      id: FALFieldNames.OBLIGATION_LIST,
      errorList: errors
    };

    let sectionErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.OBLIGATIONS) as FieldErrorList;
    this.setOrUpdateError(sectionErrors, obligListErrors);

    if (errors.length > 0) {
      return obligListErrors;
    } else {
      return null;
    }
  }

  public checkObligationForError(oblig, i, errors, index) {
    let obligError = {
      id: FALFieldNames.OBLIGATION_LIST + index,
      errors: {}
    };

    if (oblig.obligationId && !oblig.assistanceType) {
      obligError.errors['missingAssistanceType'] = {
        message: 'Obligation: Row ' + i + ' Assistance Type is required'
      };
    }

    if (!(_.isEmpty(obligError.errors))) {
      errors.push(obligError);
    }
  }

  public rearrangeObligationList(obligationList) {
    let orderedOblig = {};
    let counter = 0;
    for (let oblig of obligationList) {
      if (oblig.obligationId !== null) {
        orderedOblig[oblig.obligationId] = {index: counter};
      }
      counter = counter + 1;
    }
    return orderedOblig;
  }

  // Other Financial Info Section
  // --------------------------------------------------------------------------
  public validateOtherFinancialInfo(fieldName: string): void {
    switch (fieldName) {
      case FALFieldNames.PROGRAM_ACCOMPLISHMENTS:
        this.validateProgramAccomplishments();
        break;
      case FALFieldNames.ACCOUNT_IDENTIFICATION:
        this.validateAccountIdentification();
        break;
      case FALFieldNames.TAFS_CODES:
        this.validateTafsCodes();
        break;
    }
  }

  public validateProgramAccomplishments(): (FieldErrorList | null) {
    let errors: FieldError[] = [];

    if (this._viewModel.accomplishments && this._viewModel.accomplishments.list && this._viewModel.accomplishments.isApplicable) {
      let accomplishments = this._viewModel.accomplishments;
      if (accomplishments.list.length > 0) {

        for (let i = 0; i < accomplishments.list.length; i++) {
          let accomplishment = accomplishments.list[i];
          let accomplishmentError = {
            id: FALFieldNames.PROGRAM_ACCOMPLISHMENTS + i,
            errors: {}
          };

          if (!accomplishment.fiscalYear) {
            accomplishmentError.errors['missingYear'] = {
              message: 'Program Accomplishments: Row ' + (i + 1) + ' Year is required'
            };
          }

          if (!accomplishment.description) {
            accomplishmentError.errors['missingDescription'] = {
              message: 'Program Accomplishments: Row ' + (i + 1) + ' Accomplishments is required'
            };
          }

          if (!(_.isEmpty(accomplishmentError.errors))) {
            errors.push(accomplishmentError);
          }
        }
      } else {
        errors.push({
          id: FALFieldNames.PROGRAM_ACCOMPLISHMENTS,
          errors: {
            atLeastOneAccomplishment: {
              message: 'At least one program accomplishment is required.'
            }
          }
        });
      }
    }

    let programAccomplishmentsErrors = {
      id: FALFieldNames.PROGRAM_ACCOMPLISHMENTS,
      // label: 'Program Accomplishments',
      errorList: errors
    };

    let financialInfoErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.OTHER_FINANCIAL_INFO) as FieldErrorList;
    this.setOrUpdateError(financialInfoErrors, programAccomplishmentsErrors);

    if (errors.length > 0) {
      return programAccomplishmentsErrors;
    } else {
      return null;
    }
  }

  public validateAccountIdentification(): (FieldErrorList | null) {
    let errors: FieldError[] = [];

    if (this._viewModel.accounts && this._viewModel.accounts.length > 0) {
      for (let i = 0; i < this._viewModel.accounts.length; i++) {
        let account = this._viewModel.accounts[i];
        let accountError = {
          id: FALFieldNames.ACCOUNT_IDENTIFICATION + i,
          errors: {}
        };

        if (!account.code || (account.code && !/^\d{2}-\d{4}-\d-\d-\d{3}$/.test(account.code))) {
          accountError.errors['invalidCode'] = {
            message: 'Account Identification: Row ' + (i + 1) + ' has an invalid code',
            index: i
          };
        }

        if (!(_.isEmpty(accountError.errors))) {
          errors.push(accountError);
        }
      }
    } else {
      errors.push({
        id: FALFieldNames.ACCOUNT_IDENTIFICATION,
        errors: {
          atLeastOneAccount: {
            listError:true,
            message: 'At least one valid account identification code is required.'
          }
        }
      });
    }

    let accountIdentificationErrors = {
      id: FALFieldNames.ACCOUNT_IDENTIFICATION,
      // label: 'Account Identification',
      errorList: errors
    };

    let financialInfoErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.OTHER_FINANCIAL_INFO) as FieldErrorList;
    this.setOrUpdateError(financialInfoErrors, accountIdentificationErrors);

    if (errors.length > 0) {
      return accountIdentificationErrors;
    } else {
      return null;
    }
  }

  public validateTafsCodes(): (FieldErrorList | null) {
    let errors: FieldError[] = [];

    if (this._viewModel.tafs && this._viewModel.tafs.length > 0) {
      for (let i = 0; i < this._viewModel.tafs.length; i++) {
        let tafs = this._viewModel.tafs[i];
        let tafsError = {
          id: FALFieldNames.TAFS_CODES + i,
          errors: {}
        };

        if (!tafs.departmentCode || (tafs.departmentCode && !/^\d{2}$/.test(tafs.departmentCode))) {
          tafsError.errors['invalidDepartmentCode'] = {
            message: 'TAFS Codes: Row ' + (i + 1) + ' has an invalid department code'
          };
        }

        if(!tafs.accountCode || (tafs.accountCode && !/^\d{4}$/.test(tafs.accountCode))) {
          tafsError.errors['invalidAccountCode'] = {
            message: 'TAFS Codes: Row ' + (i + 1) + ' has an invalid account main code'
          };
        }

        if(tafs.subAccountCode && !/^\d{3}$/.test(tafs.subAccountCode)) {
          tafsError.errors['invalidSubAccountCode'] = {
            message: 'TAFS Codes: Row ' + (i + 1) + ' has an invalid sub account code'
          };
        }

        if(tafs.allocationTransferAgency && !/^\d{2}$/.test(tafs.allocationTransferAgency)) {
          tafsError.errors['invalidTransferAgency'] = {
            message: 'TAFS Codes: Row ' + (i + 1) + ' has an invalid allocation transfer agency'
          };
        }

        if(tafs.fy1 && !/^\d{4}$/.test(tafs.fy1)) {
          tafsError.errors['invalidFY1'] = {
            message: 'TAFS Codes: Row ' + (i + 1) + ' has an invalid fiscal year 1'
          };
        }

        if(tafs.fy2 && !/^\d{4}$/.test(tafs.fy2)) {
          tafsError.errors['invalidFY2'] = {
            message: 'TAFS Codes: Row ' + (i + 1) + ' has an invalid fiscal year 2'
          };
        }

        if (!(_.isEmpty(tafsError.errors))) {
          errors.push(tafsError);
        }
      }
    } else {
      errors.push({
        id: FALFieldNames.TAFS_CODES,
        errors: {
          atLeastOneTAFS: {
            listError: true,
            message: 'At least one valid TAFS code is required.'
          }
        }
      });
    }

    let tafsErrors = {
      id: FALFieldNames.TAFS_CODES,
      // label: 'TAFS',
      errorList: errors
    };

    let financialInfoErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.OTHER_FINANCIAL_INFO) as FieldErrorList;
    this.setOrUpdateError(financialInfoErrors, tafsErrors);

    if (errors.length > 0) {
      return tafsErrors;
    } else {
      return null;
    }
  }

  // Criteria Section
  // --------------------------------------------------------------------------

  public validateCriteria(fieldName: string): void {
    switch (fieldName) {
      case FALFieldNames.DOCUMENTATION:
        this.validateCriteriaDocumentation();
        break;
      case FALFieldNames.APPLICANT_LIST:
        this.validateApplicantList();
        break;
      case FALFieldNames.BENEFICIARY_LIST:
        this.validateBeneficiaryList();
        break;
      case FALFieldNames.LENGTH_TIME_DESC:
        this.validateLengthTimeDesc();
        break;
      case FALFieldNames.AWARDED_TYPE:
        this.validateAwardedType();
        break;
      case FALFieldNames.ASS_USAGE_LIST:
        this.validateAssistanceUsageList();
        break;
      case FALFieldNames.ASS_USAGE_DESC:
        this.validateAssUsageDesc();
        break;
      case FALFieldNames.USAGE_RESTRICTIONS:
        this.validateCriteriaUsageRes();
        break;
      case FALFieldNames.USE_DIS_FUNDS:
        this.validateCriteriaUseDisFunds();
        break;
      case FALFieldNames.USE_LOAN_TERMS:
        this.validateCriteriaUseLoanTerms();
        break;
    }
  }

  validateCriteriaDocumentation(): FieldError {
    let isApplicable = this._viewModel.documentation.isApplicable;
    let documentation = this._viewModel.documentation.description;

    let documentationErrors = {
      id: FALFieldNames.DOCUMENTATION,
      errors: this.validateConditionalRequired('Credentials and Documentation', isApplicable, documentation)
    };

    let criteriaErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.CRITERIA_INFO) as FieldErrorList;
    this.setOrUpdateError(criteriaErrors, documentationErrors);

    return documentationErrors;
  }

  public validateApplicantList(): FieldError {
    let appListDisplayErrors = {
      id: FALFieldNames.APPLICANT_LIST,
      errors: this.validateRequired('Applicant Eligibility', this._viewModel.appListDisplay)
    };

    let criteriaErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.CRITERIA_INFO) as FieldErrorList;
    this.setOrUpdateError(criteriaErrors, appListDisplayErrors);

    return appListDisplayErrors;
  }

  public validateBeneficiaryList(): FieldError {
    let errors: ValidationErrors = null;
    if (!this.viewModel.isSameAsApplicant) {
      errors = this.validateRequired('Beneficiary Eligibility', this._viewModel.benListDisplay);
    }

    let benListDisplayErrors = {
      id: FALFieldNames.BENEFICIARY_LIST,
      errors: errors
    };

    let criteriaErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.CRITERIA_INFO) as FieldErrorList;
    this.setOrUpdateError(criteriaErrors, benListDisplayErrors);

    return benListDisplayErrors;
  }

  validateLengthTimeDesc(): FieldError {
    let lengthTimeDescErrors = {
      id: FALFieldNames.LENGTH_TIME_DESC,
      errors: this.validateRequired('Length and Time Phasing of Assistance', this._viewModel.lengthTimeDesc)
    };

    let criteriaErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.CRITERIA_INFO) as FieldErrorList;
    this.setOrUpdateError(criteriaErrors, lengthTimeDescErrors);

    return lengthTimeDescErrors;
  }

  public validateAwardedType(): FieldError {
    let errors: ValidationErrors = null;
    if ((this._viewModel.awardedType.length > 0 && this._viewModel.awardedType === 'na')) {
      errors = this.requiredFieldError('Assistance awarded and/or released');
    }

    let awardedTypeErrors = {
      id: FALFieldNames.AWARDED_TYPE,
      errors: errors
    };

    let criteriaErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.CRITERIA_INFO) as FieldErrorList;
    this.setOrUpdateError(criteriaErrors, awardedTypeErrors);

    return awardedTypeErrors;
  }

  public validateAssistanceUsageList(): FieldError {
    let assListDisplayErrors = {
      id: FALFieldNames.ASS_USAGE_LIST,
      errors: this.validateRequired('Use of Assistance', this._viewModel.assListDisplay)
    };

    let criteriaErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.CRITERIA_INFO) as FieldErrorList;
    this.setOrUpdateError(criteriaErrors, assListDisplayErrors);

    return assListDisplayErrors;
  }

  validateAssUsageDesc(): FieldError {
    let assUsageDescErrors = {
      id: FALFieldNames.ASS_USAGE_DESC,
      errors: this.validateRequired('Use of Assistance Description', this._viewModel.assUsageDesc)
    };

    let criteriaErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.CRITERIA_INFO) as FieldErrorList;
    this.setOrUpdateError(criteriaErrors, assUsageDescErrors);

    return assUsageDescErrors;
  }

  validateCriteriaUsageRes(): FieldError {
    let isApplicable = this._viewModel.usageRes.isApplicable;
    let usageRestrictions = this._viewModel.usageRes.description;

    let usageResErrors = {
      id: FALFieldNames.USAGE_RESTRICTIONS,
      errors: this.validateConditionalRequired('Use Restrictions', isApplicable, usageRestrictions)
    };

    let criteriaErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.CRITERIA_INFO) as FieldErrorList;
    this.setOrUpdateError(criteriaErrors, usageResErrors);

    return usageResErrors;
  }

  validateCriteriaUseDisFunds(): FieldError {
    let isApplicable = this._viewModel.useDisFunds.isApplicable;
    let discretionaryFunds = this._viewModel.useDisFunds.description;

    let useDisFundsErrors = {
      id: FALFieldNames.USE_DIS_FUNDS,
      errors: this.validateConditionalRequired('Discretionary Funds', isApplicable, discretionaryFunds)
    };

    let criteriaErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.CRITERIA_INFO) as FieldErrorList;
    this.setOrUpdateError(criteriaErrors, useDisFundsErrors);

    return useDisFundsErrors;
  }

  validateCriteriaUseLoanTerms(): FieldError {
    let isApplicable = this._viewModel.useLoanTerms.isApplicable;
    let loanTerms = this._viewModel.useLoanTerms.description;

    let useLoanTermsErrors = {
      id: FALFieldNames.USE_LOAN_TERMS,
      errors: this.validateConditionalRequired('Loan Types of Assistance', isApplicable, loanTerms)
    };

    let criteriaErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.CRITERIA_INFO) as FieldErrorList;
    this.setOrUpdateError(criteriaErrors, useLoanTermsErrors);

    return useLoanTermsErrors;
  }

  // Applying for Assistance Section
  // --------------------------------------------------------------------------
  public validateApplyingForAssistance(fieldName: string): void {
    switch (fieldName) {
      case FALFieldNames.DEADLINES:
        this.validateDeadlinesFlag();
        break;
      case FALFieldNames.PREAPPCOORD_ADDITIONAL_INFO:
        this.validatePreAppCoordAddInfo();
        break;
      case FALFieldNames.SELECTION_CRITERIA_DESCRIPTION:
        this.validateSelCritDescription();
        break;
      case FALFieldNames.AWARD_PROCEDURE_DESCRIPTION:
        this.validateAwardProcDescription();
        break;
      case FALFieldNames.APPROVAL_INTERVAL:
        this.validateApprovalInterval();
        break;
      case FALFieldNames.APPEAL_INTERVAL:
        this.validateAppealInterval();
        break;
      case FALFieldNames.RENEWAL_INTERVAL:
        this.validateRenewalInterval();
        break;
    }
  }

  public validateDeadlinesFlag(): FieldError {
    let fieldErrors = {
      id: FALFieldNames.DEADLINES,
      errors: this.validateRequired('Deadlines', this._viewModel.deadlineFlag)
    };

    let sectionErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.APPLYING_FOR_ASSISTANCE) as FieldErrorList;
    this.setOrUpdateError(sectionErrors, fieldErrors);

    return fieldErrors;
  }

  public validatePreAppCoordAddInfo(): FieldError {
    let errors: ValidationErrors = null;

    if (this._viewModel.preAppCoordReports.length > 0) {
      for(let report of this._viewModel.preAppCoordReports){
        if(report.reportCode == 'otherRequired' && report.isSelected && !this._viewModel.preAppCoordDesc){
          errors = this.requiredFieldError('Additional Information');
        } //end of if
      } //end of for
    }

    let fieldErrors = {
      id: FALFieldNames.PREAPPCOORD_ADDITIONAL_INFO,
      errors: errors
    };

    let sectionErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.APPLYING_FOR_ASSISTANCE) as FieldErrorList;
    this.setOrUpdateError(sectionErrors, fieldErrors);

    return fieldErrors;
  }

  public validateSelCritDescription(): FieldError {
    let errors: ValidationErrors = null;

    if (this._viewModel.selCriteriaIsApp) {
      errors = this.validateRequired('Criteria for Selecting Proposals - Please describe', this._viewModel.selCriteriaDesc);
    }

    let fieldErrors = {
      id: FALFieldNames.SELECTION_CRITERIA_DESCRIPTION,
      errors: errors
    };

    let sectionErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.APPLYING_FOR_ASSISTANCE) as FieldErrorList;
    this.setOrUpdateError(sectionErrors, fieldErrors);

    return fieldErrors;
  }

  public validateAwardProcDescription(): FieldError {
    let fieldErrors = {
      id: FALFieldNames.AWARD_PROCEDURE_DESCRIPTION,
      errors: this.validateRequired('Award Procedure', this._viewModel.awardProcDesc)
    };

    let sectionErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.APPLYING_FOR_ASSISTANCE) as FieldErrorList;
    this.setOrUpdateError(sectionErrors, fieldErrors);

    return fieldErrors;
  }

  public validateApprovalInterval(): FieldError {
    let errors: ValidationErrors = null;
    if (this._viewModel.approvalInterval == 'na') {
      errors = this.requiredFieldError('Date Range for Approval/Disapproval');
    }

    let fieldErrors = {
      id: FALFieldNames.APPROVAL_INTERVAL,
      errors: errors
    };

    let sectionErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.APPLYING_FOR_ASSISTANCE) as FieldErrorList;
    this.setOrUpdateError(sectionErrors, fieldErrors);

    return fieldErrors;
  }

  public validateAppealInterval(): FieldError {
    let errors: ValidationErrors = null;
    if (this._viewModel.appealInterval == 'na') {
      errors = this.requiredFieldError('Appeals');
    }

    let fieldErrors = {
      id: FALFieldNames.APPEAL_INTERVAL,
      errors: errors
    };

    let sectionErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.APPLYING_FOR_ASSISTANCE) as FieldErrorList;
    this.setOrUpdateError(sectionErrors, fieldErrors);

    return fieldErrors;
  }

  public validateRenewalInterval(): FieldError {
    let errors: ValidationErrors = null;
    if (this._viewModel.renewalInterval == 'na') {
      errors = this.requiredFieldError('Renewals');
    }

    let fieldErrors = {
      id: FALFieldNames.RENEWAL_INTERVAL,
      errors: errors
    };

    let sectionErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.APPLYING_FOR_ASSISTANCE) as FieldErrorList;
    this.setOrUpdateError(sectionErrors, fieldErrors);

    return fieldErrors;
  }

  // Compliance Requirement
  // --------------------------------------------------------------------------
  validateComplianceRequirement(fieldName: string): void {
    switch (fieldName) {
      case FALFieldNames.COMPLIANCE_REPORTS:
        this.validateComplianceReports();
        break;
      case FALFieldNames.OTHER_AUDIT_REQUIREMENTS:
        this.validateComplianceAudits();
        break;
      case FALFieldNames.ADDITIONAL_DOCUMENTATION:
        this.validateAdditionDocumentation();
        break;
    }//end of switch
  }

  public validateComplianceReports(): (FieldErrorList | null) {
    let errors: FieldError[] = [];
    if (this._viewModel.complianceReports) {
      let counter = 0;
      for (let report of this._viewModel.complianceReports) {
        if (report.isSelected && (report.description == null || report.description == "")) {
          let message = '';
          let reportError = {
            id: FALFieldNames.COMPLIANCE_REPORTS + '-textarea' + counter,
            errors: {}
          };

          switch (report.code) {
            case 'program':
              message = 'Program Reports Description is a required field';
              break;
            case 'cash':
              message = 'Cash Reports Description Field is a required field';
              break;
            case 'progress':
              message = 'Progress Reports Description Field is a required field';
              break;
            case 'expenditure':
              message = 'Expenditure Reports Description Field is a required field';
              break;
            case 'performanceMonitoring':
              message = 'Performance Reports Description Field is a required field';
              break;
          }

          reportError.errors['missingField'] = {
            message: message
          };

          if (!(_.isEmpty(reportError.errors))) {
            errors.push(reportError);
          }
        }
        counter++;
      }
    }

    let fieldErrors = {
      id: FALFieldNames.COMPLIANCE_REPORTS,
      errorList: errors
    };

    let sectionErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.COMPLIANCE_REQUIREMENTS) as FieldErrorList;
    this.setOrUpdateError(sectionErrors, fieldErrors);

    if (errors.length > 0) {
      return fieldErrors;
    } else {
      return null;
    }
  }

  public validateComplianceAudits(): FieldError {
    let errors: ValidationErrors = null;

    if ((this._viewModel.audit && this._viewModel.audit.isApplicable && !this._viewModel.audit.description) || this._viewModel.audit == null) {
      errors = this.requiredFieldError('Other Audit Requirement Description');
    }

    let fieldErrors = {
      id: FALFieldNames.OTHER_AUDIT_REQUIREMENTS,
      errors: errors
    };

    let sectionErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.COMPLIANCE_REQUIREMENTS) as FieldErrorList;
    this.setOrUpdateError(sectionErrors, fieldErrors);

    return fieldErrors;
  }

  public validateAdditionDocumentation(): FieldError {
    let errors: ValidationErrors = null;

    if ((this._viewModel.documents && this._viewModel.documents.isApplicable && !this._viewModel.documents.description) || this._viewModel.documents == null) {
      errors = this.requiredFieldError('Regulations, Guidelines, and Literature Description');
    }

    let fieldErrors = {
      id: FALFieldNames.ADDITIONAL_DOCUMENTATION,
      errors: errors
    };

    let sectionErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.COMPLIANCE_REQUIREMENTS) as FieldErrorList;
    this.setOrUpdateError(sectionErrors, fieldErrors);

    return fieldErrors;
  }

  // Contact Information
  // --------------------------------------------------------------------------
  validateContactInformation(fieldName: string): void {
    switch (fieldName) {
      case FALFieldNames.CONTACT_LIST:
        this.validateContactList();
        break;
      case FALFieldNames.CONTACT_WEBSITE:
        this.validateContactWebsite();
        break;
    }//end of switch
  }

  public validateContactList(): (FieldErrorList | null){
    let errors: FieldError[] = [];

    if(this._viewModel.contacts && this._viewModel.contacts.headquarters && this._viewModel.contacts.headquarters.length > 0) {
      let contacts = this._viewModel.contacts.headquarters;
      for (let i = 0; i < contacts.length; i++) {
        let contactError = {
          id: FALFieldNames.CONTACT_LIST + i,
          errors: {}
        };

        this.validateContactFields(contacts[i], contactError, i);

        if (!(_.isEmpty(contactError.errors))) {
          errors.push(contactError);
        }
      }
    }
    else {
      let contactError = {
        id: FALFieldNames.CONTACT_LIST,
        errors: {
          noContact : {
            listError: true,
            message : 'At least one contact is required'
          }
        }
      };

      if (!(_.isEmpty(contactError.errors))) {
        errors.push(contactError);
      }

    }

    let contactListErrors = {
      id: FALFieldNames.CONTACT_LIST,
      errorList: errors
    };

    let sectionErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.CONTACT_INFORMATION) as FieldErrorList;
    this.setOrUpdateError(sectionErrors, contactListErrors);

    if (errors.length > 0) {
      return contactListErrors;
    } else {
      return null;
    }
  }

  public validateContactFields(contact, contactError, i) {
    //fullName validation
    if (!contact.fullName) {
      contactError.errors['missingFullName'] = {
        message: 'Contacts: Row ' + (i + 1) + ' Full Name is required'
      };
    }

    //email validation
    if(!contact.email) {
      contactError.errors['missingEmail'] = {
        message: 'Contacts: Row ' + (i + 1) + ' Email is required'
      };
    }
    else {
      let pattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if(!pattern.test(contact.email)) {
        contactError.errors['wrongEmailFormat'] = {
          message: 'Contacts: Row ' + (i + 1) + ' Please enter a valid Internet email address. Format: username@host.domain'
        };
      }
    }

    //phone validation
    if(!contact.phone) {
      contactError.errors['missingPhone'] = {
        message: 'Contacts: Row ' + (i + 1) + ' Phone Number is required'
      }
    }
    else {
      if(contact.phone.length !== 10) {
        contactError.errors['maxLengthPhone'] = {
          message: 'Contacts: Row ' + (i + 1) + ' Phone must have 10 digits'
        }
      }
    }

    //fax validation
    if(contact.fax && contact.fax.length !== 10) {
      contactError.errors['maxLengthFax'] = {
        message: 'Contacts: Row ' + (i + 1) + ' Fax must have 10 digits'
      }
    }

    //street validation
    if(!contact.streetAddress) {
      contactError.errors['missingStreet'] = {
        message: 'Contacts: Row ' + (i + 1) + ' Street is required'
      }
    }

    //city validation
    if(!contact.city) {
      contactError.errors['missingCity'] = {
        message: 'Contacts: Row ' + (i + 1) + ' City is required'
      }
    }

    //state validation
    if(!contact.state || contact.state == 'na') {
      contactError.errors['missingState'] = {
        message: 'Contacts: Row ' + (i + 1) + ' State is required'
      }
    }

    //zip validation
    if(!contact.zip) {
      contactError.errors['missingZip'] = {
        message: 'Contacts: Row ' + (i + 1) + ' Zip is required'
      }
    }

  }

  public validateContactWebsite(): FieldError {
    let errors: ValidationErrors = null;

    if(this._viewModel.website) {
      let pattern = /^(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;
      if(!pattern.test(this._viewModel.website)) {
        errors = {
          urlFormatError: {
            message: 'Please enter a valid url. [protocol]://hostname.domain. Protocol can be ftp, http, or https. Spaces are not allowed.'
          }
        };
      }
    }

    let fieldErrors = {
      id: FALFieldNames.CONTACT_WEBSITE,
      errors: errors
    };

    let sectionErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.CONTACT_INFORMATION) as FieldErrorList;

    this.setOrUpdateError(sectionErrors, fieldErrors);

    return fieldErrors;
  }
}
