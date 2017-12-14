import * as _ from 'lodash';

export class FALSectionNames {
  static readonly HEADER = 'header-information';
  static readonly OVERVIEW = 'overview';
  static readonly AUTHORIZATION = 'authorization';
  static readonly OBLIGATIONS = 'financial-information-obligations';
  static readonly OTHER_FINANCIAL_INFO = 'financial-information-other';
  static readonly CRITERIA_INFO = 'criteria-information';
  static readonly APPLYING_FOR_ASSISTANCE = 'applying-for-assistance';
  static readonly COMPLIANCE_REQUIREMENTS = 'compliance-requirements';
  static readonly CONTACT_INFORMATION = 'contact-information';
}

export class FALFieldNames {
  //Header Information
  static readonly TITLE = 'fal-header-title';
  static readonly FEDERAL_AGENCY = 'fal-header-fed-agency';
  static readonly FALNO = 'fal-header-falNo';

  //Overview
  static readonly OBJECTIVE = 'fal-objective';
  static readonly FUNDED_PROJECTS = 'fal-funded-projects';
  static readonly FUNCTIONAL_CODES = 'fal-functional-codes';
  static readonly SUBJECT_TERMS = 'fal-subject-terms';

  //Authorizations
  static readonly AUTHORIZATION_LIST = 'fal-authorization-authList';
  static readonly NO_AUTHORIZATION = 'fal-no-auth';

  //Financial-Obligations
  static readonly OBLIGATION_LIST = 'fal-obligation-obligationList';
  static readonly PAST_FISCAL_YEAR = 'fal-obligation-past-fiscal-year';
  static readonly CURRENT_FISCAL_YEAR = 'fal-obligation-current-fiscal-year';
  static readonly BUDGET_FISCAL_YEAR = 'fal-obligation-budget-fiscal-year';

  // Other Financial Info
  static readonly PROGRAM_ACCOMPLISHMENTS = 'fal-financial-info-accomplishments';
  static readonly ACCOUNT_IDENTIFICATION = 'fal-financial-info-account-identification';
  static readonly TAFS_CODES = 'fal-financial-info-tafs-codes';

  //Criteria
  static readonly DOCUMENTATION = 'fal-criteria-documentation';
  static readonly APPLICANT_LIST = 'fal-criteria-applicant-list';
  static readonly BENEFICIARY_LIST = 'fal-criteria-beneficiary-list';
  static readonly LENGTH_TIME_DESC = 'fal-criteria-length-time-desc';
  static readonly AWARDED_TYPE = 'fal-criteria-awarded-type';
  static readonly ASS_USAGE_LIST= 'fal-criteria-ass-usage-list';
  static readonly ASS_USAGE_DESC = 'fal-criteria-ass-usage-desc';
  static readonly USAGE_RESTRICTIONS = 'fal-criteria-usage-restrictions';
  static readonly USE_DIS_FUNDS = 'fal-criteria-use-dis-funds';
  static readonly USE_LOAN_TERMS = 'fal-criteria-use-loan-terms';

  //Apply for Assistance
  static readonly DEADLINES = 'fal-appForAssist-deadline';
  static readonly DEADLINES_LIST = 'fal-appForAssist-deadline-list';
  static readonly PREAPPCOORD_ADDITIONAL_INFO = 'fal-appForAssist-pac-addInfo';
  static readonly SELECTION_CRITERIA_DESCRIPTION = 'fal-appForAssist-sc-description';
  static readonly AWARD_PROCEDURE_DESCRIPTION = 'fal-appForAssist-ap-description';
  static readonly APPROVAL_INTERVAL = 'fal-appForAssist-approval-interval';
  static readonly APPEAL_INTERVAL = 'fal-appForAssist-appeal-interval';
  static readonly RENEWAL_INTERVAL = 'fal-appForAssist-renewal-interval';

  //Compliance Requirements
  static readonly COMPLIANCE_REPORTS = 'fal-cr-reports';
  static readonly OTHER_AUDIT_REQUIREMENTS = 'fal-cr-audits';
  static readonly ADDITIONAL_DOCUMENTATION = 'fal-cr-additional-documentation';

  //Contact Information
  static readonly CONTACT_LIST = 'fal-contact-list';
  static readonly NO_CONTACT = 'fal-no-contact';
  static readonly CONTACT_WEBSITE = 'fal-contact-website';
}

export const FALSectionFieldsBiMap = (function() {
  let sectionFields = {
    [FALSectionNames.HEADER]: [
      FALFieldNames.TITLE,
      FALFieldNames.FEDERAL_AGENCY,
      FALFieldNames.FALNO
    ],

    [FALSectionNames.OVERVIEW]: [
      FALFieldNames.OBJECTIVE,
      FALFieldNames.FUNDED_PROJECTS,
      FALFieldNames.FUNCTIONAL_CODES,
      FALFieldNames.SUBJECT_TERMS
    ],

    [FALSectionNames.AUTHORIZATION]: [
      FALFieldNames.AUTHORIZATION_LIST
    ],

    [FALSectionNames.OBLIGATIONS]: [
      FALFieldNames.OBLIGATION_LIST
    ],

    [FALSectionNames.OTHER_FINANCIAL_INFO]: [
      FALFieldNames.PROGRAM_ACCOMPLISHMENTS,
      FALFieldNames.ACCOUNT_IDENTIFICATION,
      FALFieldNames.TAFS_CODES
    ],

    [FALSectionNames.CRITERIA_INFO]: [
      FALFieldNames.DOCUMENTATION,
      FALFieldNames.APPLICANT_LIST,
      FALFieldNames.BENEFICIARY_LIST,
      FALFieldNames.LENGTH_TIME_DESC,
      FALFieldNames.AWARDED_TYPE,
      FALFieldNames.ASS_USAGE_LIST,
      FALFieldNames.ASS_USAGE_DESC,
      FALFieldNames.USAGE_RESTRICTIONS,
      FALFieldNames.USE_DIS_FUNDS,
      FALFieldNames.USE_LOAN_TERMS,
    ],

    [FALSectionNames.APPLYING_FOR_ASSISTANCE]: [
      FALFieldNames.DEADLINES,
      FALFieldNames.DEADLINES_LIST,
      FALFieldNames.PREAPPCOORD_ADDITIONAL_INFO,
      FALFieldNames.SELECTION_CRITERIA_DESCRIPTION,
      FALFieldNames.AWARD_PROCEDURE_DESCRIPTION,
      FALFieldNames.APPROVAL_INTERVAL,
      FALFieldNames.RENEWAL_INTERVAL,
      FALFieldNames.APPEAL_INTERVAL
    ],

    [FALSectionNames.COMPLIANCE_REQUIREMENTS]: [
      FALFieldNames.COMPLIANCE_REPORTS,
      FALFieldNames.OTHER_AUDIT_REQUIREMENTS,
      FALFieldNames.ADDITIONAL_DOCUMENTATION
    ],

    [FALSectionNames.CONTACT_INFORMATION]: [
      FALFieldNames.CONTACT_LIST,
      FALFieldNames.CONTACT_WEBSITE
    ]
  };

  let fieldSections = {};

  Object.keys(sectionFields).forEach((section) => {
    sectionFields[section].forEach((field) => {
      fieldSections[field] = section;
    });
  });

  return {
    sectionFields,
    fieldSections
  };
})();

export class FALIAMUserRoles {
  static readonly ASSISTANCE_ADMINISTRATOR = 'Assistance Administrator';
}

export const FALIAMDomain = "Assistance Listing";