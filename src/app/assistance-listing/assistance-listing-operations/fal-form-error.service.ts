import { Injectable } from '@angular/core';
import { FALFormViewModel } from './fal-form.model';
import { ValidationErrors } from '../../app-utils/types';
import { FALSectionNames, FALFieldNames, FALSectionFieldsList } from './fal-form.constants';
import * as _ from 'lodash';

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
        }
      ]
    };

    for (let field of FALSectionFieldsList.OVERVIEW_FIELDS) {
      this.validate(FALSectionNames.OVERVIEW, field);
    }

    for (let field of FALSectionFieldsList.HEADER_FIELDS) {
      this.validate(FALSectionNames.HEADER, field);
    }

    for (let field of FALSectionFieldsList.AUTHORIZATION_FIELDS) {
      this.validate(FALSectionNames.AUTHORIZATION, field);
    }

    for (let field of FALSectionFieldsList.CRITERIA_FIELDS) {
      this.validate(FALSectionNames.CRITERIA_INFO, field);
    }

    for (let field of FALSectionFieldsList.APPLYING_FOR_ASSISTANCE_FIELDS){
      this.validate(FALSectionNames.APPLYING_FOR_ASSISTANCE, field);
    }

    for (let field of FALSectionFieldsList.COMPLIANCE_REQUIREMENTS_FIELDS) {
      this.validate(FALSectionNames.COMPLIANCE_REQUIREMENTS, field);
    }
  }

  public static findErrorById(fieldErrorList: FieldErrorList, id: string): (FieldError | FieldErrorList | null) {
    for (let error of fieldErrorList.errorList) {
      if (error.id && error.id === id) {
        return error;
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
      case FALSectionNames.CRITERIA_INFO:
        this.validateCriteria(fieldName);
        break;
      case FALSectionNames.APPLYING_FOR_ASSISTANCE:
        this.validateApplyingForAssistance(fieldName);
        break;
      case FALSectionNames.COMPLIANCE_REQUIREMENTS:
        this.validateComplianceRequirement(fieldName);
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

    let headerErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.HEADER) as FieldErrorList;

    this.setOrUpdateError(headerErrors, titleErrors);

    return titleErrors;
  }

  public validateHeaderProgNo(): FieldError {
    let errors: ValidationErrors = null;

    if (!this._viewModel.programNumber) {
      errors = {
        missingField: {
          message: 'FAL Number field cannot be empty'
        }
      };
    }
    else if (this._viewModel.programNumber.indexOf(".") == -1 && this._viewModel.programNumber.length !== 3) {
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

    let headerErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.HEADER) as FieldErrorList;

    this.setOrUpdateError(headerErrors, falNoErrors);

    return falNoErrors;

  }

  public validateFederalAgency(): FieldError {
    let errors: ValidationErrors = null;

    if (!this._viewModel.organizationId) {
      errors = {
        missingField: {
          message: 'Federal Agency field cannot be empty'
        }
      };
    }

    let agencyErrors = {
      id: FALFieldNames.FEDERAL_AGENCY,
      errors: errors
    };

    let headerErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.HEADER) as FieldErrorList;

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
        this.validateFundedProjects;
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

    let overviewErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.OVERVIEW) as FieldErrorList;

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

    let overviewErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.OVERVIEW) as FieldErrorList;

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
            message: 'Examples of Funded Projects: Row ' + (i + 1) + ' is missing Year'
          };
        }

        if (!project.description) {
          projectError.errors['missingDescription'] = {
            message: 'Examples of Funded Projects: Row ' + (i + 1) + ' is missing Examples'
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

  //Authorization
  public validateAuthorization(fieldName: string): void {
    switch (fieldName) {
      case FALFieldNames.AUTHORIZATION_LIST:
        this.validateAuthList();
        break;
    }
  }

  public validateAuthList(): (FieldErrorList | null) {
    let errors: FieldError[] = [];

    if(this._viewModel.authList && this._viewModel.authList.length > 0) {
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
        id: FALFieldNames.AUTHORIZATION_LIST + '-no-auth',
        errors: {
          noAuth : {
            message : 'Atleast one authorization is required'
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
        message: (child ? 'Ammendment: Row ' + i + ' is missing Authorization Type' : 'Authorization: Row ' + i + ' is missing Authorization Type')
      };
    }

    if (!(_.isEmpty(authError.errors))) {
      errors.push(authError);
    }
  }

  //Criteria Section
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
    let errors: ValidationErrors = null;
    if (!this._viewModel.documentation.description && this._viewModel.documentation.isApplicable) {
      errors = {
        missingField: {
          message: 'Credentials and Documentation are missing'
        }
      };
    }

    let documentationErrors = {
      id: FALFieldNames.DOCUMENTATION,
      errors: errors
    };

    let criteriaErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.CRITERIA_INFO) as FieldErrorList;
    this.setOrUpdateError(criteriaErrors, documentationErrors);

    return documentationErrors;
  }

  public validateApplicantList(): FieldError {
    let errors: ValidationErrors = null;

    if (!(this._viewModel.appListDisplay.length > 0)) {
      errors = {
        missingField: {
          message: 'Applicant Eligibility is missing'
        }
      };
    }

    let appListDisplayErrors = {
      id: FALFieldNames.APPLICANT_LIST,
      errors: errors
    };

    let criteriaErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.CRITERIA_INFO) as FieldErrorList;

    this.setOrUpdateError(criteriaErrors, appListDisplayErrors);

    return appListDisplayErrors;
  }

  public validateBeneficiaryList(): FieldError {
    let errors: ValidationErrors = null;
    if ((!(this._viewModel.benListDisplay.length > 0)) && !this.viewModel.isSameAsApplicant) {
      errors = {
        missingField: {
          message: 'Beneficiary Eligibility is missing'
        }
      };
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
    let errors: ValidationErrors = null;
    if (!this._viewModel.lengthTimeDesc) {
      errors = {
        missingField: {
          message: 'Length and Time Phasing of Assistance is missing'
        }
      };
    }

    let lengthTimeDescErrors = {
      id: FALFieldNames.LENGTH_TIME_DESC,
      errors: errors
    };

    let criteriaErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.CRITERIA_INFO) as FieldErrorList;
    this.setOrUpdateError(criteriaErrors, lengthTimeDescErrors);

    return lengthTimeDescErrors;
  }

  public validateAwardedType(): FieldError {
    let errors: ValidationErrors = null;
    if ((this._viewModel.awardedType.length > 0 && this._viewModel.awardedType === 'na')) {
      errors = {
        missingField: {
          message: 'Assistance awarded and/or released is missing'
        }
      };
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
    let errors: ValidationErrors = null;

    if (!(this._viewModel.assListDisplay.length > 0)) {
      errors = {
        missingField: {
          message: 'Use of Assistance is missing'
        }
      };
    }

    let assListDisplayErrors = {
      id: FALFieldNames.ASS_USAGE_LIST,
      errors: errors
    };

    let criteriaErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.CRITERIA_INFO) as FieldErrorList;

    this.setOrUpdateError(criteriaErrors, assListDisplayErrors);

    return assListDisplayErrors;
  }

  validateAssUsageDesc(): FieldError {
    let errors: ValidationErrors = null;
    if (!this._viewModel.assUsageDesc) {
      errors = {
        missingField: {
          message: 'Use of Assistance Description is missing'
        }
      };
    }

    let assUsageDescErrors = {
      id: FALFieldNames.ASS_USAGE_DESC,
      errors: errors
    };

    let criteriaErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.CRITERIA_INFO) as FieldErrorList;
    this.setOrUpdateError(criteriaErrors, assUsageDescErrors);

    return assUsageDescErrors;
  }

  validateCriteriaUsageRes(): FieldError {
    let errors: ValidationErrors = null;
    if (!this._viewModel.usageRes.description && this._viewModel.usageRes.isApplicable) {
      errors = {
        missingField: {
          message: 'Use Restrictions are missing'
        }
      };
    }

    let usageResErrors = {
      id: FALFieldNames.USAGE_RESTRICTIONS,
      errors: errors
    };

    let criteriaErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.CRITERIA_INFO) as FieldErrorList;
    this.setOrUpdateError(criteriaErrors, usageResErrors);

    return usageResErrors;
  }

  validateCriteriaUseDisFunds(): FieldError {
    let errors: ValidationErrors = null;
    if (!this._viewModel.useDisFunds.description && this._viewModel.useDisFunds.isApplicable) {
      errors = {
        missingField: {
          message: 'Discretionary Funds are missing'
        }
      };
    }

    let useDisFundsErrors = {
      id: FALFieldNames.USE_DIS_FUNDS,
      errors: errors
    };

    let criteriaErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.CRITERIA_INFO) as FieldErrorList;
    this.setOrUpdateError(criteriaErrors, useDisFundsErrors);

    return useDisFundsErrors;
  }

  validateCriteriaUseLoanTerms(): FieldError {
    let errors: ValidationErrors = null;
    if (!this._viewModel.useLoanTerms.description && this._viewModel.useLoanTerms.isApplicable) {
      errors = {
        missingField: {
          message: 'Loan Types of Assistance are missing'
        }
      };
    }

    let useLoanTermsErrors = {
      id: FALFieldNames.USE_LOAN_TERMS,
      errors: errors
    };

    let criteriaErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.CRITERIA_INFO) as FieldErrorList;
    this.setOrUpdateError(criteriaErrors, useLoanTermsErrors);

    return useLoanTermsErrors;
  }

  //Applying for Assistance Section
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
    let errors: ValidationErrors = null;

    if (!this._viewModel.deadlineFlag) {
      errors = {
        missingField: {
          message: 'Deadlines are missing'
        }
      };
    }

    let fieldErrors = {
      id: FALFieldNames.DEADLINES,
      errors: errors
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
          errors = {
            missingField: {
              message: 'Additional Information field cannot be empty'
            }
          };

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

    if (this._viewModel.selCriteriaIsApp && !this._viewModel.selCriteriaDesc) {
      errors = {
        missingField: {
          message: 'Criteria for Selecting Proposals - Please describe field cannot be empty'
        }
      };
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
    let errors: ValidationErrors = null;

    if (!this._viewModel.awardProcDesc) {
      errors = {
        missingField: {
          message: 'Award Procedure field cannot be empty'
        }
      };
    }

    let fieldErrors = {
      id: FALFieldNames.AWARD_PROCEDURE_DESCRIPTION,
      errors: errors
    };

    let sectionErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.APPLYING_FOR_ASSISTANCE) as FieldErrorList;

    this.setOrUpdateError(sectionErrors, fieldErrors);

    return fieldErrors;
  }

  public validateApprovalInterval(): FieldError {
    let errors: ValidationErrors = null;
    if (this._viewModel.approvalInterval == 'na') {
      errors = {
        missingField: {
          message: 'Date Range for Approval/Disapproval field cannot be empty'
        }
      };
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
      errors = {
        missingField: {
          message: 'Appeals field cannot be empty'
        }
      };
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
      errors = {
        missingField: {
          message: 'Renewal field cannot be empty'
        }
      };
    }

    let fieldErrors = {
      id: FALFieldNames.RENEWAL_INTERVAL,
      errors: errors
    };

    let sectionErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.APPLYING_FOR_ASSISTANCE) as FieldErrorList;

    this.setOrUpdateError(sectionErrors, fieldErrors);

    return fieldErrors;
  }

  //Compliance Requirement
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
      for(let report of this._viewModel.complianceReports) {
        if(report.isSelected && (report.description == null || report.description == "")) {
          let message = '';
          let reportError = {
            id: 'compliance-reports-textarea' + counter,
            errors: {}
          };

          switch (report.code) {
            case 'program':
              message = 'Program Reports Description Field cannot be empty';
              break;
            case 'cash':
              message = 'Cash Reports Description Field cannot be empty';
              break;
            case 'progress':
              message = 'Progress Reports Description Field cannot be empty';
              break;
            case 'expenditure':
              message = 'Expenditure Reports Description Field cannot be empty';
              break;
            case 'performanceMonitoring':
              message = 'Performance Reports Description Field cannot be empty';
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

    if((this._viewModel.audit && this._viewModel.audit.isApplicable && !this._viewModel.audit.description) || this._viewModel.audit == null) {
      errors = {
        missingField: {
          message: 'Other Audit Requirement Description field cannot be empty'
        }
      };
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

    if((this._viewModel.documents && this._viewModel.documents.isApplicable && !this._viewModel.documents.description) || this._viewModel.documents == null) {
      errors = {
        missingField: {
          message: 'Regulations, Guidelines, and Literature Description field cannot be empty'
        }
      };
    }

    let fieldErrors = {
      id: FALFieldNames.ADDITIONAL_DOCUMENTATION,
      errors: errors
    };

    let sectionErrors = FALFormErrorService.findErrorById(this._errors, FALSectionNames.COMPLIANCE_REQUIREMENTS) as FieldErrorList;

    this.setOrUpdateError(sectionErrors, fieldErrors);

    return fieldErrors;
  }

}
