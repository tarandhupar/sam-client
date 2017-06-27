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
}

export class FALSectionFieldsList {
  static readonly OVERVIEW_FIELDS = [
    FALFieldNames.OBJECTIVE,
    FALFieldNames.FUNDED_PROJECTS,
    FALFieldNames.FUNCTIONAL_CODES,
    FALFieldNames.SUBJECT_TERMS
  ];

  static readonly HEADER_FIELDS = [
    FALFieldNames.TITLE,
    FALFieldNames.FEDERAL_AGENCY,
    FALFieldNames.FALNO
  ];
}
