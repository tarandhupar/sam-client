export class OpportunitySectionNames {
  static readonly AWARD_DETAILS = 'award';
  static readonly CLASSIFICATION = 'classification';
  static readonly DESCRIPTION = 'description';
  static readonly PACKAGES = 'packages';
  static readonly HEADER = 'header';
  static readonly GENERAL = 'general';
  static readonly CONTACT = 'contact';
  static readonly IVL = 'ivl-summary';
}

export class OpportunityFieldNames {

  //Header Information
  static readonly TITLE = 'opp-title';
  static readonly OPPORTUNITY_TYPE = 'opp-type';
  static readonly NOTICE_NUMBER = 'opp-notice-number';
  static readonly CONTRACTING_OFFICE = 'opp-contracting-office';
  static readonly RELATED_NOTICE = 'opp-related-notice';

  //Award Details
  static readonly AWARD_DATE = 'opp-award-date';
  static readonly AWARD_NUMBER = 'opp-award-number';
  static readonly DELIVERY_ORDER_NUMBER = 'opp-delivery-order-number';
  static readonly AWARDEE_DUNS = 'opp-awardee-duns-number';
  static readonly AWARDEE_NAME = 'opp-awardee-name';
  static readonly AMOUNT = 'opp-amount';
  static readonly LINE_ITEM_NUMBER = 'opp-line-item-number';

  //General Information
  static readonly ARCHIVE_POLICY = 'opp-archive-policy';
  static readonly ARCHIVE_DATE = 'opp-archive-date';
  static readonly ARCHIVE_TIME = 'opp-archive-time';
  static readonly VENDORS_CD_IVL = 'opp-vendor-cd-ivl';
  static readonly VENDORS_V_IVL = 'opp-vendor-v-ivl';
  static readonly ADDITIONAL_REPORTING = 'opp-additional-reporting';

  //classification
  static readonly SET_ASIDE_TYPE = 'opp-set-aside-type';
  static readonly PRODUCT_SERVICE_CODE = 'opp-classification-product-service-code';
  static readonly PRIMARY_NAICS_CODE = 'opp-primary-naics-code';
  static readonly SECONDARY_NAICS_CODE = 'opp-secondary-naics-code';
  static readonly PLACE_PERFORMNCE_LOCATION = 'opp-place-performance-location';
  static readonly ZIP = 'opp-zip';

  //description
  static readonly DESCRIPTION = 'opp-description';

  //contact-information
  static readonly PRIMARY_CONTACT = 'opp-primary-contact';
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

export const OpportunitySectionFieldsBiMap = (function() {
  let sectionFields = {
    [OpportunitySectionNames.HEADER]: [
      OpportunityFieldNames.TITLE,
      OpportunityFieldNames.CONTRACTING_OFFICE,
      OpportunityFieldNames.NOTICE_NUMBER,
      OpportunityFieldNames.OPPORTUNITY_TYPE
    ],
    [OpportunitySectionNames.GENERAL]: [
      OpportunityFieldNames.ARCHIVE_POLICY,
      OpportunityFieldNames.ARCHIVE_DATE,
      OpportunityFieldNames.VENDORS_CD_IVL,
      OpportunityFieldNames.VENDORS_V_IVL
    ],
    [OpportunitySectionNames.CLASSIFICATION]: [
      OpportunityFieldNames.SET_ASIDE_TYPE,
      OpportunityFieldNames.PRODUCT_SERVICE_CODE,
      OpportunityFieldNames.PRIMARY_NAICS_CODE,
      OpportunityFieldNames.SECONDARY_NAICS_CODE,
      OpportunityFieldNames.PLACE_PERFORMNCE_LOCATION,
      OpportunityFieldNames.ZIP,
    ],
    [OpportunitySectionNames.DESCRIPTION]: [
      OpportunityFieldNames.DESCRIPTION],
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

export const OppNoticeTypeFieldsMap = {
  [OpportunityNoticeTypes.PRESOLICITATION]: {
    [OpportunityFieldNames.PRIMARY_NAICS_CODE]: {required: false, display: true},
  },
  [OpportunityNoticeTypes.COMBINED_SYNOPSIS_SOLICITATION]: {
    [OpportunityFieldNames.AWARD_DATE] : {required: false, display: false},
    [OpportunityFieldNames.AWARD_NUMBER] : {required: false, display: true},
    [OpportunityFieldNames.AMOUNT] : {required: false, display: true},
    [OpportunityFieldNames.LINE_ITEM_NUMBER] : {required: false, display: true},
    [OpportunityFieldNames.DELIVERY_ORDER_NUMBER] : {required: false, display: false},
    [OpportunityFieldNames.AWARDEE_DUNS] : {required: false, display: false},
    [OpportunityFieldNames.AWARDEE_NAME] : {required: false, display: false},
  },
  [OpportunityNoticeTypes.SOURCES_SOUGHT] : {
    [OpportunityFieldNames.PRODUCT_SERVICE_CODE] : {required: false, display: true},
    [OpportunityFieldNames.PRIMARY_NAICS_CODE] : {required: false, display: true}
  },
  [OpportunityNoticeTypes.SPECIAL_NOTICE] : {
    [OpportunityFieldNames.PRODUCT_SERVICE_CODE] : {required: false, display: true},
    [OpportunityFieldNames.PRIMARY_NAICS_CODE] : {required: false, display: true},
    [OpportunityFieldNames.AWARD_DATE] : {required: false, display: true},
    [OpportunityFieldNames.AWARD_NUMBER] : {required: false, display: true},
    [OpportunityFieldNames.AMOUNT] : {required: false, display: true},
    [OpportunityFieldNames.LINE_ITEM_NUMBER] : {required: false, display: true},
    [OpportunityFieldNames.DELIVERY_ORDER_NUMBER] : {required: false, display: true},
    [OpportunityFieldNames.AWARDEE_DUNS] : {required: false, display: true},
    [OpportunityFieldNames.AWARDEE_NAME] : {required: false, display: true},
  },
  [OpportunityNoticeTypes.SALE_OF_SURPLUS_PROPERTY] : {
    [OpportunityFieldNames.PRIMARY_NAICS_CODE] : {required: false, display: true},
  },
  [OpportunityNoticeTypes.SOLICITATION]: {
    [OpportunityFieldNames.AWARD_DATE] : {required: false, display: false},
    [OpportunityFieldNames.AWARD_NUMBER] : {required: false, display: true},
    [OpportunityFieldNames.AMOUNT] : {required: false, display: true},
    [OpportunityFieldNames.LINE_ITEM_NUMBER] : {required: false, display: true},
    [OpportunityFieldNames.DELIVERY_ORDER_NUMBER] : {required: false, display: false},
    [OpportunityFieldNames.AWARDEE_DUNS] : {required: false, display: false},
    [OpportunityFieldNames.AWARDEE_NAME] : {required: false, display: false},
  },
  [OpportunityNoticeTypes.AWARD_NOTICE]: {
    [OpportunityFieldNames.AWARD_DATE] : {required: true, display: true},
    [OpportunityFieldNames.AWARD_NUMBER] : {required: true, display: true},
    [OpportunityFieldNames.AMOUNT] : {required: true, display: true},
    [OpportunityFieldNames.LINE_ITEM_NUMBER] : {required: false, display: true},
    [OpportunityFieldNames.DELIVERY_ORDER_NUMBER] : {required: false, display: true},
    [OpportunityFieldNames.AWARDEE_DUNS] : {required: false, display: true},
    [OpportunityFieldNames.AWARDEE_NAME] : {required: true, display: true},
    [OpportunityFieldNames.PRODUCT_SERVICE_CODE] : {required: false, display: true},
    [OpportunityFieldNames.PRIMARY_NAICS_CODE] : {required: false, display: true},
    [OpportunityFieldNames.DESCRIPTION] : {required: false, display: true},
    [OpportunityFieldNames.PRIMARY_CONTACT] : {required: false, display: true},
  },
  [OpportunityNoticeTypes.INTENT_TO_BUNDLE_REQUIREMENTS]: {
    [OpportunityFieldNames.AWARD_DATE] : {required: false, display: true},
    [OpportunityFieldNames.AWARD_NUMBER] : {required: false, display: true},
    [OpportunityFieldNames.DELIVERY_ORDER_NUMBER] : {required: false, display: true},
    [OpportunityFieldNames.AMOUNT] : {required: false, display: false},
    [OpportunityFieldNames.LINE_ITEM_NUMBER] : {required: false, display: false},
    [OpportunityFieldNames.AWARDEE_DUNS] : {required: false, display: false},
    [OpportunityFieldNames.AWARDEE_NAME] : {required: false, display: false},
    [OpportunityFieldNames.PRODUCT_SERVICE_CODE] : {required: false, display: true},
    [OpportunityFieldNames.PRIMARY_NAICS_CODE] : {required: false, display: true},
    [OpportunityFieldNames.SET_ASIDE_TYPE] : {required: false, display: false},
    [OpportunityFieldNames.SECONDARY_NAICS_CODE] : {required: false, display: false},
    [OpportunityFieldNames.PLACE_PERFORMNCE_LOCATION] : {required: false, display: false},
  },
  [OpportunityNoticeTypes.JUSTIFICATION_AND_APPROVAL]: {
    [OpportunityFieldNames.AWARD_DATE] : {required: false, display: true},
    [OpportunityFieldNames.AWARD_NUMBER] : {required: false, display: true},
    [OpportunityFieldNames.DELIVERY_ORDER_NUMBER] : {required: false, display: true},
    [OpportunityFieldNames.AMOUNT] : {required: false, display: false},
    [OpportunityFieldNames.LINE_ITEM_NUMBER] : {required: false, display: false},
    [OpportunityFieldNames.AWARDEE_DUNS] : {required: false, display: false},
    [OpportunityFieldNames.AWARDEE_NAME] : {required: false, display: false},
    [OpportunityFieldNames.PRODUCT_SERVICE_CODE] : {required: false, display: true},
    [OpportunityFieldNames.PRIMARY_NAICS_CODE] : {required: false, display: true},
    [OpportunityFieldNames.SET_ASIDE_TYPE] : {required: false, display: false},
    [OpportunityFieldNames.SECONDARY_NAICS_CODE] : {required: false, display: false},
    [OpportunityFieldNames.PLACE_PERFORMNCE_LOCATION] : {required: false, display: false},
    [OpportunityFieldNames.PLACE_PERFORMNCE_LOCATION] : {required: false, display: true},
  }
};

export const OppNoticeTypeSectionMap = {
  [OpportunityNoticeTypes.PRESOLICITATION]: {
    [OpportunitySectionNames.AWARD_DETAILS]: {disabled: true}
  },
  [OpportunityNoticeTypes.COMBINED_SYNOPSIS_SOLICITATION]: {
    [OpportunitySectionNames.AWARD_DETAILS]: {disabled: false}
  },
  [OpportunityNoticeTypes.SOURCES_SOUGHT]: {
    [OpportunitySectionNames.AWARD_DETAILS]: {disabled: true}
  },
  [OpportunityNoticeTypes.MODIFICATION_AMENDMENT_CANCEL]: {
    [OpportunitySectionNames.AWARD_DETAILS]: {disabled: true}
  },
  [OpportunityNoticeTypes.SALE_OF_SURPLUS_PROPERTY]: {
    [OpportunitySectionNames.AWARD_DETAILS]: {disabled: true}
  },
  [OpportunityNoticeTypes.SPECIAL_NOTICE]: {
    [OpportunitySectionNames.AWARD_DETAILS]: {disabled: false}
  },
  [OpportunityNoticeTypes.FOREIGN_GOVERNMENT_STANDARD]: {
    [OpportunitySectionNames.AWARD_DETAILS]: {disabled: true}
  },
  [OpportunityNoticeTypes.SOLICITATION]: {
    [OpportunitySectionNames.AWARD_DETAILS]: {disabled: false}
  },
  [OpportunityNoticeTypes.AWARD_NOTICE]: {
    [OpportunitySectionNames.AWARD_DETAILS]: {disabled: false}
  },
  [OpportunityNoticeTypes.JUSTIFICATION_AND_APPROVAL]: {
    [OpportunitySectionNames.AWARD_DETAILS]: {disabled: false}
  },
  [OpportunityNoticeTypes.INTENT_TO_BUNDLE_REQUIREMENTS]: {
    [OpportunitySectionNames.AWARD_DETAILS]: {disabled: false}
  },
  [OpportunityNoticeTypes.FAIR_OPPORTUNITY_LIMITED_SOURCES_JUSTIFICATION]: {
    [OpportunitySectionNames.AWARD_DETAILS]: {disabled: true}
  }
};
