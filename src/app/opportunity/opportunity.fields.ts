export enum OpportunityFields {
    // Header information section
  Header = <any>'header',
  Title = <any>'title',
  Solicitation = <any>'solicitation-number',
  HierarchyName = <any>'hierarchy-level',
  Location = <any>'location',

    // Award details section
  Award = <any>'award',
  AwardAmount = <any>'award-amount',
  AwardDate = <any>'award-date',
  AwardNumber = <any>'award-number',
  LineItemNumber = <any>'line-item-number',
  AwardedName = <any>'awarded-name',
  AwardedDUNS = <any>'awarded-duns',
  AwardedAddress = <any>'awarded-address',
  Contractor = <any>'contractor', // Contractor sub-section
  ContractorStreet = <any>'contractor-street',
  ContractorCity = <any>'contractor-city',
  ContractorState = <any>'contractor-state',
  ContractorZip = <any>'contractor-zip',
  ContractorCountry = <any>'contractor-country',

    // General information section
  General = <any>'general',
  Type = <any>'type',
  PostedDate = <any>'posted-date',
  OriginalPostedDate = <any>'original-posted-date',
  ResponseDate = <any>'response-date',
  OriginalResponseDate = <any>'original-response-date',
  ArchivePolicy = <any>'archiving-policy',
  ArchiveDate = <any>'archive-date',
  OriginalArchiveDate = <any>'original-archive-date',
  StatutoryAuthority = <any>'statutory-authority',
  JustificationAuthority = <any>'justification-authority',
  OrderNumber = <any>'order-number',
  ModificationNumber = <any>'modification-number',

    // Classification code section
  Classification = <any>'classification',
  SetAside = <any>'set-aside',
  OriginalSetAside = <any>'original-set-aside',
  ClassificationCode = <any>'classification-code',
  NAICSCode = <any>'naics-code',
  POP = <any>'pop', // POP sub-section
  POPLocation = <any>'pop-location',
  POPCity = <any>'pop-city',
  POPState = <any>'pop-state',
  POPZip = <any>'pop-zip',
  POPCountry = <any>'pop-country',

    // Synopsis section
  Synopsis = <any>'synopsis',
  Description = <any>'description',
  BenefitsDescription = <any>'benefits-description',

    // Contact information section
  Contact = <any>'contact',
  Office = <any>'contracting-office', // Contracting Office Address sub-section
  OfficeStreet = <any>'contracting-office-street',
  OfficeCity = <any>'contracting-office-city',
  OfficeState = <any>'contracting-office-state',
  OfficeCountry = <any>'contracting-office-country',
  OfficeZip = <any>'contracting-office-zip',
  POC = <any>'poc', // POC sub-section
  POCTitle = <any>'poc-title',
  POCFullName = <any>'poc-full-name',
  POCEmail = <any>'poc-email',
  POCPhone = <any>'poc-phone',
  POCFax = <any>'poc-fax'
}
