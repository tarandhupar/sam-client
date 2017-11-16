import { Injectable } from '@angular/core';
import { FALFormViewModel } from './fal-form.model';
import { ValidationErrors } from '../../app-utils/types';
import { FALSectionNames, FALFieldNames } from './fal-form.constants';
import * as _ from 'lodash';
import { ReplaySubject, Subject } from "rxjs";
import { FALFormService } from "./fal-form.service";
import * as moment from 'moment/moment';

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

  private _fieldValidatorFnMap = {
    // Header Information
    [FALFieldNames.TITLE]: this.validateHeaderTitle,
    [FALFieldNames.FEDERAL_AGENCY]: this.validateFederalAgency,
    [FALFieldNames.FALNO]: this.validateHeaderProgNo,

    // Overview
    [FALFieldNames.OBJECTIVE]: this.validateObjective,
    [FALFieldNames.FUNDED_PROJECTS]: this.validateFundedProjects,
    [FALFieldNames.FUNCTIONAL_CODES]: this.validateFunctionalCodes,
    [FALFieldNames.SUBJECT_TERMS]: this.validateSubjectTerms,

    // Authorization
    [FALFieldNames.AUTHORIZATION_LIST]: this.validateAuthList,

    // Financial Obligations
    [FALFieldNames.OBLIGATION_LIST]: this.validateObligationList,

    // Other Financial Info
    [FALFieldNames.PROGRAM_ACCOMPLISHMENTS]: this.validateProgramAccomplishments,
    [FALFieldNames.ACCOUNT_IDENTIFICATION]: this.validateAccountIdentification,
    [FALFieldNames.TAFS_CODES]: this.validateTafsCodes,

    // Criteria
    [FALFieldNames.DOCUMENTATION]: this.validateCriteriaDocumentation,
    [FALFieldNames.APPLICANT_LIST]: this.validateApplicantList,
    [FALFieldNames.BENEFICIARY_LIST]: this.validateBeneficiaryList,
    [FALFieldNames.LENGTH_TIME_DESC]: this.validateLengthTimeDesc,
    [FALFieldNames.AWARDED_TYPE]: this.validateAwardedType,
    [FALFieldNames.ASS_USAGE_LIST]: this.validateAssistanceUsageList,
    [FALFieldNames.ASS_USAGE_DESC]: this.validateAssUsageDesc,
    [FALFieldNames.USAGE_RESTRICTIONS]: this.validateCriteriaUsageRes,
    [FALFieldNames.USE_DIS_FUNDS]: this.validateCriteriaUseDisFunds,
    [FALFieldNames.USE_LOAN_TERMS]: this.validateCriteriaUseLoanTerms,

    // Applying for Assistance
    [FALFieldNames.DEADLINES]: this.validateDeadlinesFlag,
    [FALFieldNames.DEADLINES_LIST]: this.validateDeadlineList,
    [FALFieldNames.PREAPPCOORD_ADDITIONAL_INFO]: this.validatePreAppCoordAddInfo,
    [FALFieldNames.SELECTION_CRITERIA_DESCRIPTION]: this.validateSelCritDescription,
    [FALFieldNames.AWARD_PROCEDURE_DESCRIPTION]: this.validateAwardProcDescription,
    [FALFieldNames.APPROVAL_INTERVAL]: this.validateApprovalInterval,
    [FALFieldNames.RENEWAL_INTERVAL]: this.validateRenewalInterval,
    [FALFieldNames.APPEAL_INTERVAL]: this.validateAppealInterval,

    // Compliance Requirement
    [FALFieldNames.COMPLIANCE_REPORTS]: this.validateComplianceReports,
    [FALFieldNames.OTHER_AUDIT_REQUIREMENTS]: this.validateComplianceAudits,
    [FALFieldNames.ADDITIONAL_DOCUMENTATION]: this.validateAdditionDocumentation,

    // Contact Information
    [FALFieldNames.CONTACT_LIST]: this.validateContactList,
    [FALFieldNames.CONTACT_WEBSITE]: this.validateContactWebsite,
  };

  constructor(private falFormService: FALFormService) {
    let initSectionError = (id, label): FieldErrorList => {
      return { id, label, errorList: [] };
    };

    this._errors = {
      errorList: [
        initSectionError(FALSectionNames.HEADER, 'Header Information'),
        initSectionError(FALSectionNames.OVERVIEW, 'Overview'),
        initSectionError(FALSectionNames.AUTHORIZATION, 'Authorization'),
        initSectionError(FALSectionNames.OBLIGATIONS, 'Obligations'),
        initSectionError(FALSectionNames.OTHER_FINANCIAL_INFO, 'Other Financial Information'),
        initSectionError(FALSectionNames.CRITERIA_INFO, 'Criteria for Applying'),
        initSectionError(FALSectionNames.APPLYING_FOR_ASSISTANCE, 'Applying for Assistance'),
        initSectionError(FALSectionNames.COMPLIANCE_REQUIREMENTS, 'Compliance Requirements'),
        initSectionError(FALSectionNames.CONTACT_INFORMATION, 'Contact Information'),
      ]
    };
  }

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
    if(applicable && applicable.errorList) {
      applicable.errorList = applicable.errorList.filter((section) => {
        return this._viewModel.getSectionStatus(section.id) === 'updated';
      });
    }

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

  // todo: review how to handle exceptions -- actions taken on completion but does returned observable still complete??
  public validateAll(): Subject<any> {
    let response: Subject<any> = new ReplaySubject(1);
    let async = [FALFieldNames.FALNO]; // list of fields to be validated asynchronously

    // validate all synchronous fields first
    Object.keys(this._fieldValidatorFnMap).forEach((field) => {
      if (async.indexOf(field) < 0) {

        // field is not async so just call its validator
        let validatorFn = this._fieldValidatorFnMap[field].bind(this);
        validatorFn();
      }
    });

    // emit event - all synchronous fields validated
    response.next({ type: 'allSyncValidated' });

    // if there are any asynchronous fields, validate them separately
    if (async.length > 0) {
      let completed = 0; // # of completed async validations counter
      async.map((field) => {

        // field is async so subscribe to the validator
        let validatorFn = this._fieldValidatorFnMap[field].bind(this);
        (validatorFn() as Subject<any>).subscribe((result) => {

          // emit event - specific async field validated
          response.next({ type: 'asyncValidated', field });

          // check whether all async validations are completed
          if (++completed === async.length) {
            // emit event - all asynchronous fields validated
            response.next({ type: 'allAsyncValidated' });
            response.complete();
          }
        });
      });
    } else { // else there are no asynchronous fields so complete immediately
      response.complete();
    }

    return response;
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
    if(fieldErrorList && fieldErrorList.errorList && fieldErrorList.errorList.length > 0) {
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

  public validateHeaderTitle(): FieldError {
    let titleErrors = {
      id: FALFieldNames.TITLE,
      errors: this.validateRequired('Title', this._viewModel.title)
    };

    let headerErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.HEADER) as FieldErrorList;
    this.setOrUpdateError(headerErrors, titleErrors);

    return titleErrors;
  }

  public validateHeaderProgNo(): Subject<any> {
    let errors: ValidationErrors = null;
    let response: Subject<any> = new ReplaySubject(1);
    let finished = false;

    if(this._viewModel.organizationId && (this._viewModel.isNewDraft || this._viewModel.isRejected || this._viewModel.programId === null) ) {
      this.falFormService.getFederalHierarchyConfiguration(this._viewModel.organizationId).subscribe(data => {

        if (!data.programNumberAuto) {
          if (this._viewModel.programNumber) {

            let progNo = this.getSlicedProgNo();

            if (progNo.length !== 3) {
              errors = {
                maxFieldLength: {
                  message: 'CFDA Number field - Please enter a three digit number'
                }
              };
              finished = true;
            }
            else {
              //Check for No in range
              this.checkForInRange(progNo, errors, data.programNumberLow, data.programNumberHigh);
              if (errors) {
                finished = true;
              }
              else {
                //Check for Unique No
                this.checkForUniqueProgNo(response, errors);
              }
            } //end of else
          }
          else {
            errors = this.requiredFieldError('CFDA Number field');
            finished = true;
          }
        } //end of if validateFlag
        else {
          finished = true;
        }

        if (finished) {
          let falNoErrors = this.buildProgNoErrorJson(errors);
          response.next(falNoErrors);
          response.complete();
        }
      });
    }
    else {

      if(!this.viewModel.organizationId) {
        this._viewModel.programNumber = '';
      }

      let falNoErrors = this.buildProgNoErrorJson(errors);
      response.next(falNoErrors);
      response.complete();
    }

    return response;
  }

  public getSlicedProgNo(): string {
    let progNo = '';
    if (this._viewModel.programNumber.indexOf(".") == -1) {
      progNo = this._viewModel.programNumber;
    }
    else {
      progNo = this._viewModel.programNumber.slice(3);
    }
    return progNo;
  }


  public checkForInRange(progNo, errors, programNumberLow, programNumberHigh){
    if (progNo < programNumberLow || progNo > programNumberHigh) {
      errors = {
        maxFieldLength: {
          message: 'CFDA Number field value falls outside the range defined for this organization'
        }
      };
    }

    return errors;
  }

  public checkForUniqueProgNo(response, errors){
    this.falFormService.isProgramNumberUnique(this._viewModel.programNumber, this._viewModel.programId, this._viewModel.organizationId)
      .subscribe(res => {
        if(!res['content']['isProgramNumberUnique']) {
          errors = {
            programNumberUnique: {
              message: 'CFDA Number already exists. Please enter a valid Number'
            }
          };
        }

        let falNoErrors = this.buildProgNoErrorJson(errors);

        response.next(falNoErrors);
        response.complete();
      });
  }

  public buildProgNoErrorJson(errors){
    let falNoErrors = {
      id: FALFieldNames.FALNO,
      errors: errors
    };

    let headerErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.HEADER) as FieldErrorList;
    this.setOrUpdateError(headerErrors, falNoErrors);

    return falNoErrors;
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

      let fy: number = moment().year();
      // Only take into account the previous, current, and budget fiscal years
      let applicableProjects = projects.list.filter((project) => {
        let year: number = project.fiscalYear;
        return (year >= fy - 1) && (year <= fy + 1) || year == null;
      });

      for (let i = 0; i < applicableProjects.length; i++) {
        let project = applicableProjects[i];
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
  public validateProgramAccomplishments(): (FieldErrorList | null) {
    let errors: FieldError[] = [];

    if (this._viewModel.accomplishments && this._viewModel.accomplishments.list && this._viewModel.accomplishments.isApplicable) {
      let accomplishments = this._viewModel.accomplishments;

      let fy: number = moment().year();
      // Only take into account the previous, current, and budget fiscal years
      let applicableAccomplishments = accomplishments.list.filter((accomplishment) => {
        let year: number = accomplishment.fiscalYear;
        return (year >= fy - 1) && (year <= fy + 1) || year == null;
      });

      if (applicableAccomplishments.length > 0) {
        for (let i = 0; i < applicableAccomplishments.length; i++) {
          let accomplishment = applicableAccomplishments[i];
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
              message: 'At least one program accomplishment is required'
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
            message: 'At least one valid account identification code is required'
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
            message: 'At least one valid TAFS code is required'
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
  public validateDeadlinesFlag(): FieldError {
    let fieldErrors = {
      id: FALFieldNames.DEADLINES,
      errors: this.validateRequired('Deadlines', this._viewModel.deadlineFlag)
    };

    let sectionErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.APPLYING_FOR_ASSISTANCE) as FieldErrorList;
    this.setOrUpdateError(sectionErrors, fieldErrors);

    return fieldErrors;
  }

  public validateDeadlineList():(FieldErrorList | null) {
    let errors: FieldError[] = [];

    if (this._viewModel.deadlineList.length > 0 && this._viewModel.deadlineFlag == 'yes') {
      let deadlineList = this._viewModel.deadlineList;
      for (let i = 0; i < deadlineList.length; i++) {
        let deadlineItem = deadlineList[i];
        let startDateM, endDateM: any;
        let isStartDateValid: boolean;

        let deadlineError = {
          id: FALFieldNames.DEADLINES_LIST + i,
          errors: {}
        };

        if (!deadlineItem.start) {
          deadlineError.errors['startDateError'] = {
            message: 'Deadlines: Row ' + (i + 1) + ' From Date is required'
          };
          isStartDateValid = false;
        }
        else {
          startDateM = moment(deadlineItem.start);
          isStartDateValid = startDateM.isValid();

          if(!isStartDateValid || deadlineItem.start == "Invalid date") {
            deadlineError.errors['startDateError'] = {
              message: 'Deadlines: Row ' + (i + 1) + ' Invalid From date'
            };
          }
          else if (startDateM.get('year') < 1000) {
            deadlineError.errors['startDateError'] = {
              message: 'Deadlines: Row ' + (i + 1) + ' Please enter 4 digit year in From date'
            };
          }
        }

        if(deadlineItem.end) {
          endDateM = moment(deadlineItem.end);
          if(!endDateM.isValid() || deadlineItem.end == "Invalid date") {
            deadlineError.errors['endDateError'] = {
              message: 'Deadlines: Row ' + (i + 1) + ' Invalid To date'
            };
          }
          else if (endDateM.get('year') < 1000) {
            deadlineError.errors['endDateError'] = {
              message: 'Deadlines: Row ' + (i + 1) + ' Please enter 4 digit year in To date'
            };
          }

          if(endDateM.isValid() && isStartDateValid && startDateM.get('year') >= 1000 && endDateM.get('year') >= 1000 && endDateM.diff(startDateM) < 0) {
            deadlineError.errors['dateRangeError'] = {
              message: 'Deadlines: Row ' + (i + 1) + ' Invalid date range'
            };
          }
        }

        if (!(_.isEmpty(deadlineError.errors))) {
          errors.push(deadlineError);
        }
      }
    }

    let deadlineListErrors = {
      id: FALFieldNames.DEADLINES_LIST,
      errorList: errors
    };

    let sectionErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.APPLYING_FOR_ASSISTANCE) as FieldErrorList;
    this.setOrUpdateError(sectionErrors, deadlineListErrors);

    if (errors.length > 0) {
      return deadlineListErrors;
    } else {
      return null;
    }
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

    //country validation
    if(!contact.country) {
      contactError.errors['missingCountry'] = {
        message: 'Contacts: Row ' + (i + 1) + ' Country is required'
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
