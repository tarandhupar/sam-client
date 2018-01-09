export class CBASectionNames {
  static readonly CBA = 'cba';
  static readonly ACTION_HISTORY = 'action-history';
}

export class CBAFieldNames {
  //  Metadata
  static readonly CBA_NUMBER = 'cba-number';
  static readonly REVISION_NUMBER = 'revision-number';

  //  Contractor Information
  static readonly PRIME_SUBCONTRACTOR_NAME = 'prime-subcon-name';
  static readonly PRIME_SUBCONTRACTOR_UNION = 'prime-subcon-union';
  static readonly LOCAL_UNION_NUMBER = 'local-union-number';

  //  Location Information
  static readonly LOCATION_STATE = 'location-state';
  static readonly LOCATION_COUNTY = 'location-county';
  static readonly LOCATION_CITY = 'location-city';
  static readonly LOCATION_ZIP = 'location-zip-code';

  //  Contracting Information
  static readonly CONTRACT_SERVICES = 'contract-services';
  static readonly CONTRACTING_ORG = 'contracting-org-id';
  static readonly PRIMARY_NAICS_CODE = 'opp-primary-naics-code';
  static readonly SECONDARY_NAICS_CODE = 'opp-secondary-naics-code';
  static readonly PLACE_PERFORMNCE_LOCATION = 'opp-place-performance-location';

  //  Dates
  static readonly EFFECTIVE_DATE_FROM = 'effective-date-from';
  static readonly EFFECTIVE_DATE_TO = 'effective-date-to';
  static readonly AMENDED_DATE = 'amended-date';
  static readonly SOLICITATION_NUMBER = 'solicitation-number';
}

export const CBASectionFieldsBiMap = (function() {
  let sectionFields = {
    [CBASectionNames.CBA]: [
      CBAFieldNames.PRIME_SUBCONTRACTOR_NAME,
      CBAFieldNames.PRIME_SUBCONTRACTOR_UNION,
      CBAFieldNames.LOCAL_UNION_NUMBER,
      CBAFieldNames.LOCATION_STATE,
      CBAFieldNames.LOCATION_COUNTY,
      CBAFieldNames.LOCATION_CITY,
      CBAFieldNames.LOCATION_ZIP,
      CBAFieldNames.CONTRACT_SERVICES,
      CBAFieldNames.CONTRACTING_ORG,
      CBAFieldNames.PRIMARY_NAICS_CODE,
      CBAFieldNames.SECONDARY_NAICS_CODE,
      CBAFieldNames.PLACE_PERFORMNCE_LOCATION,
      CBAFieldNames.EFFECTIVE_DATE_FROM,
      CBAFieldNames.EFFECTIVE_DATE_TO,
      CBAFieldNames.AMENDED_DATE,
      CBAFieldNames.SOLICITATION_NUMBER
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
