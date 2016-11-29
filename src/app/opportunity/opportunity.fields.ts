export enum OpportunityFields {
    // Header information section
  Header = 'header',
  Title = 'title',
  Solicitation = 'solicitation-number',
  HierarchyName = 'hierarchy-level',
  Location = 'location',

    // Award details section
  Award = 'award',
  AwardAmount = 'award-amount',
  AwardDate = 'award-date',
  AwardNumber = 'award-number',
  LineItemNumber = 'line-item-number',
  AwardedName = 'awarded-name',
  AwardedDUNS = 'awarded-duns',
  AwardedAddress = 'awarded-address',
  ContractorStreet = 'contractor-street',
  ContractorCity = 'contractor-city',
  ContractorState = 'contractor-state',
  ContractorZip = 'contractor-zip',
  ContractorCountry = 'contractor-country',

    // General information section
  General = 'general',
  Type = 'type',
  PostedDate = 'posted-date',
  OriginalPostedDate = 'original-posted-date',
  ResponseDate = 'response-date',
  OriginalResponseDate = 'original-response-date',
  ArchivePolicy = 'archiving-policy',
  ArchiveDate = 'archive-date',
  OriginalArchiveDate = 'original-archive-date',
  StatutoryAuthority = 'statutory-authority',
  JustificationAuthority = 'justification-authority',
  OrderNumber = 'order-number',
  ModificationNumber = 'modification-number',

    // Classification code section
  Classification = 'classification',
  SetAside = 'set-aside',
  OriginalSetAside = 'original-set-aside',
  ClassificationCode = 'classification-code',
  NAICSCode = 'naics-code',
  POPLocation = 'pop-location',
  POPCity = 'pop-city',
  POPState = 'pop-state',
  POPZip = 'pop-zip',
  POPCountry = 'pop-country',

    // Synopsis section
  Synopsis = 'synopsis',
  Description = 'description',
  BenefitsDescription = 'benefits-description',

    // Contact information section
  Contact = 'contact',
  POC = 'poc',
  POCTitle = 'poc-title',
  POCFullName = 'poc-full-name',
  POCEmail = 'poc-email',
  POCPhone = 'poc-phone',
  POCFax = 'poc-fax'
}
