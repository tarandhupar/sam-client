import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { ValidationErrors } from "../../app-utils/types";
import { OpportunityFieldNames, OpportunitySectionNames } from "./framework/data-model/opportunity-form-constants";
import { OpportunityFormViewModel } from "./framework/data-model/opportunity-form/opportunity-form.model";
import { OppNoticeTypeMapService } from './framework/service/notice-type-map/notice-type-map.service';
import moment = require("moment");

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
    [OpportunityFieldNames.NOTICE_NUMBER]: this.validateNoticeNumber,
    [OpportunityFieldNames.CONTRACTING_OFFICE]: this.validateFederalAgency,

    //General Information
    [OpportunityFieldNames.ARCHIVE_POLICY]: this.validateArchiveType,
    [OpportunityFieldNames.ARCHIVE_DATE]: this.validateArchiveDate,
    [OpportunityFieldNames.VENDORS_CD_IVL]: this.validateIvlAdd,
    [OpportunityFieldNames.VENDORS_V_IVL]: this.validateIvlView,

    // Classification
    [OpportunityFieldNames.PRODUCT_SERVICE_CODE]: this.validateClassificationCodeType,
    [OpportunityFieldNames.PRIMARY_NAICS_CODE]: this.validatePrimaryNAICSCodeType,
    [OpportunityFieldNames.ZIP]: this.validateZip,

    //Description
    [OpportunityFieldNames.DESCRIPTION]: this.validateDesc,
  };

  constructor(private noticeTypeMapService: OppNoticeTypeMapService) {
    let initSectionError = (id, label): OppFieldErrorList => {
      return { id, label, errorList: [] };
    };

    this._errors = {
      errorList: [
        initSectionError(OpportunitySectionNames.HEADER, 'Header Information'),
        initSectionError(OpportunitySectionNames.GENERAL, 'General Information'),
        initSectionError(OpportunitySectionNames.CLASSIFICATION, 'Classification'),
        initSectionError(OpportunitySectionNames.DESCRIPTION, 'Description'),
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
    if (applicable && applicable.errorList) {
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
  public validateAll() {
    Object.keys(this._fieldValidatorFnMap).forEach((field) => {
      let validatorFn = this._fieldValidatorFnMap[field].bind(this);
      validatorFn();
    });
  }

  public static findErrorById(fieldErrorList: OppFieldErrorList, id: string): (OppFieldError | OppFieldErrorList | null) {
    if (fieldErrorList && fieldErrorList.errorList.length > 0) {
      for (let error of fieldErrorList.errorList) {
        if (error.id && error.id === id) {
          return error;
        }
      }
    }

    return null;
  }

  public static findSectionErrorById(fieldErrorList: any, sectionId: string, fieldId: string = null): (OppFieldError | OppFieldErrorList | null) {
    if (fieldErrorList && fieldErrorList.errorList && fieldErrorList.errorList.length > 0) {
      for (let error of fieldErrorList.errorList) {
        if (error.id && error.id === sectionId) {
          if (fieldId) {
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

  private validateRequired(fieldName, ...properties): ValidationErrors | null {
    let valid = true;

    for (let prop of properties) {
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

  public validateNoticeNumber(): OppFieldError {
    let noticeNumberErrors = {
      id: OpportunityFieldNames.NOTICE_NUMBER,
      errors: this.validateRequired('Notice Number', this._viewModel.oppHeaderInfoViewModel.noticeNumber)
    };

    let headerErrors = OpportunityFormErrorService.findErrorById(this._errors, OpportunitySectionNames.HEADER) as OppFieldErrorList;
    this.setOrUpdateError(headerErrors, noticeNumberErrors);

    return noticeNumberErrors;
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

  public validateArchiveDate(): (OppFieldError) {
    let dateError = {};

    let fieldErrors = {
      id: OpportunityFieldNames.ARCHIVE_DATE,
      errors: null
    };

    if (this._viewModel.oppGeneralInfoViewModel.archiveType == 'autocustom' || this._viewModel.oppGeneralInfoViewModel.archiveType == 'manual') {

      if (!this._viewModel.oppGeneralInfoViewModel.archiveDate.valueOf() || this._viewModel.oppGeneralInfoViewModel.archiveDate.valueOf() == "null" || this._viewModel.oppGeneralInfoViewModel.archiveDate.valueOf() == "") {
        dateError['dateRequiredError'] = {
          message: "Archiving Specific Date is a required field"
        };

      } else {
        let dateM = moment(this._viewModel.oppGeneralInfoViewModel.archiveDate.valueOf());
        if (!dateM.isValid()) {
          dateError['invalidDateError'] = {
            message: "Invalid Date"
          };
        } else {
          if (dateM.get('year') < 1000) {
            dateError['yearDateError'] = {
              message: "Please enter 4 digit year"
            };
          }
        }
      }
    }

    fieldErrors.errors = _.isEmpty(dateError) ? null : dateError;

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

  // Classification Section
  // --------------------------------------------------------------------------
  public validateClassificationCodeType(): OppFieldError {
    let fieldErrors = {
      id: OpportunityFieldNames.PRODUCT_SERVICE_CODE,
      errors: this.noticeTypeMapService.checkFieldRequired(this._viewModel.oppHeaderInfoViewModel.opportunityType, 'PRODUCT_SERVICE_CODE') ?
        this.validateRequired('Product Service Code', this._viewModel.oppClassificationViewModel.classificationCodeType) : null
    };

    let sectionErrors = OpportunityFormErrorService.findErrorById(this._errors, OpportunitySectionNames.CLASSIFICATION) as OppFieldErrorList;
    this.setOrUpdateError(sectionErrors, fieldErrors);
    return fieldErrors;
  }

  public validatePrimaryNAICSCodeType(): OppFieldError {
    let fieldErrors = {
      id: OpportunityFieldNames.PRIMARY_NAICS_CODE,
      errors: null
    };

    if (this.noticeTypeMapService.checkFieldRequired(this._viewModel.oppHeaderInfoViewModel.opportunityType, 'PRIMARY_NAICS_CODE')) {
      let primaryNAICSCodes;

      if (this._viewModel.oppClassificationViewModel.naicsCodeTypes) {
        primaryNAICSCodes = this._viewModel.oppClassificationViewModel.naicsCodeTypes.filter(naics => {
          return naics && naics.type === 'Primary' && naics.code && naics.code.length > 0;
        });
      }

      fieldErrors.errors = this.validateRequired('Primary NAICS Code', primaryNAICSCodes);
    }

    let sectionErrors = OpportunityFormErrorService.findErrorById(this._errors, OpportunitySectionNames.CLASSIFICATION) as OppFieldErrorList;
    this.setOrUpdateError(sectionErrors, fieldErrors);
    return fieldErrors;
  }

  public validateZip(): OppFieldError {
    let fieldErrors = {
      id: OpportunityFieldNames.ZIP,
      errors: null
    };

    if (this._viewModel.oppClassificationViewModel.zip && !this._viewModel.oppClassificationViewModel.zip.match(/^\d{5}$/)) {
      fieldErrors.errors = {
        zipCodeError: {
          message: 'Zip Code - Please enter a five digit number'
        }
      };
    }

    let sectionErrors = OpportunityFormErrorService.findErrorById(this._errors, OpportunitySectionNames.CLASSIFICATION) as OppFieldErrorList;
    this.setOrUpdateError(sectionErrors, fieldErrors);
    return fieldErrors;
  }

  // Description Section
  // --------------------------------------------------------------------------
  public validateDesc(): OppFieldError {
    let fieldErrors = {
      id: OpportunityFieldNames.DESCRIPTION,
      errors: this.validateRequired('Description', this._viewModel.description)
    };

    let sectionErrors = OpportunityFormErrorService.findErrorById(this._errors, OpportunitySectionNames.DESCRIPTION) as OppFieldErrorList;
    this.setOrUpdateError(sectionErrors, fieldErrors);
    return fieldErrors;
  }
}
