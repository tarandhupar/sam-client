export class OpportunitySectionNames {
  static readonly HEADER_INFORMATION = 'header-information';
  static readonly AWARD_DETAILS = 'award';
  static readonly GENERAL_INFORMATION = 'general-information';
  static readonly CLASSIFICATION = 'classification';
  static readonly DESCRIPTION = 'description';
  static readonly PACKAGES = 'packages';
  static readonly CONTACT_INFORMATION = 'contact-information';

  static readonly HEADER = 'header';
  static readonly GENERAL = 'general';
  static readonly CONTACT = 'contact';
  static readonly IVL = 'ivl-summary';
}


export class OpportunityFieldNames {

  //classification
  static readonly PRODUCT_SERVICE_CODE = 'opp-classification-product-service-code';
  static readonly PRIMARY_NAICS_CODE = 'opp-primary-naics-code';
}


export class OpportunityNoticeTypes {

  static readonly PRESOLICITATION = 'presolicitation';
  static readonly COMBINED_SYNOPSIS_SOLICITATION = 'combined-synopsis-solicitation';
  static readonly SOURCES_SOUGHT = 'sources-sought';
  static readonly MODIFICATION_AMENDMENT_CANCEL = 'modification-amendment-cancel';
  static readonly SALE_OF_SURPLUS_PROPERTY = 'sale-of-surplus-property';
  static readonly SPECIAL_NOTICE = 'special-notice';
  static readonly FOREIGN_GOVERNMENT_STANDARD = 'foreign-government-standard';
  static readonly SOLICITATION = 'solicitation';
  static readonly AWARD_NOTICE = 'award-notice';
  static readonly JUSTIFICATION_AND_APPROVAL = 'justification-and-approval';
  static readonly INTENT_TO_BUNDLE_REQUIREMENTS = 'intent-to-bundle-requirements';
  static readonly FAIR_OPPORTUNITY_LIMITED_SOURCES_JUSTIFICATION = 'fair-opportunity-limited-sources-justification';
}

export const OppNoticeTypeDbMap = {
  ['p'] : OpportunityNoticeTypes.PRESOLICITATION,
  ['k'] : OpportunityNoticeTypes.COMBINED_SYNOPSIS_SOLICITATION,
  ['r'] : OpportunityNoticeTypes.SOURCES_SOUGHT,
  ['m'] : OpportunityNoticeTypes.MODIFICATION_AMENDMENT_CANCEL,
  ['g'] : OpportunityNoticeTypes.SALE_OF_SURPLUS_PROPERTY,
  ['s'] : OpportunityNoticeTypes.SPECIAL_NOTICE,
  ['f'] : OpportunityNoticeTypes.FOREIGN_GOVERNMENT_STANDARD,
  ['o'] : OpportunityNoticeTypes.SOLICITATION,
  ['a'] : OpportunityNoticeTypes.AWARD_NOTICE,
  ['j'] : OpportunityNoticeTypes.JUSTIFICATION_AND_APPROVAL,
  ['i'] : OpportunityNoticeTypes.INTENT_TO_BUNDLE_REQUIREMENTS,
  ['l'] : OpportunityNoticeTypes.FAIR_OPPORTUNITY_LIMITED_SOURCES_JUSTIFICATION
};


export const OppNoticeTypeFieldsMap = {
  [OpportunityNoticeTypes.SOURCES_SOUGHT] : {
    [OpportunityFieldNames.PRODUCT_SERVICE_CODE] : {required : false , display : true} ,
    [OpportunityFieldNames.PRIMARY_NAICS_CODE] : {required : false , display : true}
  } ,
  [OpportunityNoticeTypes.SPECIAL_NOTICE] : {
    [OpportunityFieldNames.PRODUCT_SERVICE_CODE] : {required : false , display : true} ,
    [OpportunityFieldNames.PRIMARY_NAICS_CODE] : {required : false , display : true}
  } ,
  [OpportunityNoticeTypes.SALE_OF_SURPLUS_PROPERTY] : {
    [OpportunityFieldNames.PRIMARY_NAICS_CODE] : {required : false , display : true}
  }
};
