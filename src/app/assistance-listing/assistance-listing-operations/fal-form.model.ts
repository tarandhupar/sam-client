import * as _ from 'lodash';

export interface SectionInfo { // todo: switch to string enum
  id: string, // one of FALSectionNames
  status: string // 'pristine' or 'updated', maybe 'invalid' as well ?
}

//  TODO:  If view model exceeds 250 LOC, abstract out different sections to preserve readability
export class FALFormViewModel {
  private _programId: string;
  private _fal: any;
  private _data: any;
  private _additionalInfo: any;
  private _reason: any;
  public existing: any;

  constructor(fal) {
    this._fal = fal ? fal : {};
    this._data = (fal && fal.data) ? fal.data : {};
    this._programId = (fal && fal.id) ? fal.id : null;
    this._additionalInfo = (fal && fal.additionalInfo) ? fal.additionalInfo : {sections: []};
  }

  // todo: switch to string enum
  // todo: figure out how to handle null/undefined/etc.
  private getSectionInfo(id: string): SectionInfo {
    let sectionInfo: SectionInfo = null;

    if (this._additionalInfo && this._additionalInfo.sections && this._additionalInfo.sections.length > 0) {
      for (let section of this._additionalInfo.sections) {
        if (section.id === id) {
          sectionInfo = section;
          break;
        }
      }
    }
    return sectionInfo;
  }

  // todo: switch to string enum
  // todo: figure out how to handle null/undefined/etc.
  public getSectionStatus(id: string): string {
    this.existing = this.getSectionInfo(id);
    let status = 'pristine'; // all sections are pristine by default

    if (this.existing) {
      status = this.existing.status;
    } else if (this.existing === null || this.existing === undefined) {
      status = 'pristine';
    }

    return status;
  }

  // todo: switch to string enum
  public setSectionStatus(id: string, status: string): void {
    this.existing = this.getSectionInfo(id);

    if (this.existing) {
      this.existing.status = status;
    } else {
      if (this._additionalInfo!.sections) {
        this._additionalInfo!.sections.push({
          id: id,
          status: status
        });
      }
    }
  }

  get data() {
    return this._data;
  }

  get dataAndAdditionalInfo() {
    return {
      data: this._data,
      additionalInfo: this._additionalInfo
    };
  }

  set programId(programId: string) {
    this._programId = programId;
  }

  get programId() {
    return this._programId;
  }

  get isNew() {
    return this._programId == null || typeof this._programId === 'undefined';
  }

  get status(){
    return this._fal.status;
  }

  get _links(){
    return this._fal._links;
  }

  get latest(){
    return this._fal.latest;
  }

  get isRevision() {
    return this._fal.revision === true;
  }

  get isNewDraft() {
    if(this._fal.revision === false && this._fal.archived === false && this._fal.status && (this._fal.status.code === "draft" || this._fal.status.code === 'draft_review'))
      return true;

    return false;
  }

  get isRejected(){
    if(this._fal.status && this._fal.status.code === "rejected")
      return true;

    return false;
  }

  set addiInfo(addiInfo: any) {
    this._additionalInfo = addiInfo;
  }

  get addiInfo() {
    return this._additionalInfo;
  }

  get organizationId() {
    return this._data.organizationId || '';
  }

  set organizationId(org) {
    this._data.organizationId = org;
  }

  get relatedPrograms() {
    return (this._data.relatedPrograms || []);
  }

  set relatedPrograms(relatedPrograms) {
    this._data.relatedPrograms = relatedPrograms;
  }

  get programNumber() {
    return this._data.programNumber || '';
  }

  set programNumber(programNumber) {
    this._data.programNumber = programNumber;
  }

  get alternativeNames() {
    return this._data.alternativeNames || [];
  }

  set alternativeNames(alternativeNames) {
    this._data.alternativeNames = alternativeNames;
  }

  get title() {
    return this._data.title || '';
  }

  set title(title) {
    this._data.title = title;
  }

  //overview fields
  get objective() {
    return (this._data.objective ? this._data.objective : '');
  }

  set objective(objective) {
    this._data.objective = objective;
  }

  get description() {
    return (this._data.description ? this._data.description : '');
  }

  set description(description) {
    this._data.description = description;
  }

  get functionalCodes() {
    let functionalCodes = [];
    if (this._data.functionalCodes !== undefined && this._data.functionalCodes && this._data.functionalCodes.length > 0) {
      functionalCodes = this._data.functionalCodes;
    }
    return functionalCodes;
  }

  set functionalCodes(codes) {
    this._data.functionalCodes = codes;
  }

  get subjectTerms() {
    let subjectTerms = [];
    if (this._data.subjectTerms !== undefined && this._data.subjectTerms && this._data.subjectTerms.length > 0) {
      subjectTerms = this._data.subjectTerms;
    }
    return subjectTerms;
  }

  set subjectTerms(terms) {
    this._data.subjectTerms = terms;
  }

  get projects() {
    return (this._data.projects || null);
  }

  set projects(projects) {
    this._data.projects = projects;
  }

  get website() {
    return this._data.website;
  }

  set website(website) {
    this._data.website = website;
  }

  get additionalInfo() {
    let additionalInfo = '';

    if (this._data.contacts && this._data.contacts.local) {
      if (this._data.contacts.local.description) {
        additionalInfo = this._data.contacts.local.description;
      }
    }

    return additionalInfo;
  }

  set additionalInfo(additionalInfo) {
    if (!this._data.contacts) {
      this._data.contacts = {};
    }

    if (!this._data.contacts.local) {
      this._data.contacts.local = {};
    }

    this._data.contacts.local.description = additionalInfo;
  }

  get contacts() {
    return this._data.contacts ? this._data.contacts : {};
  }

  set contacts(contacts) {
    this._data.contacts = contacts;
  }

  get headquarters() {
    return this.contacts.headquarters ? this.contacts.headquarters : [];
  }

  get useRegionalOffice() {
    let useRegionalOffice = false;

    if (this._data.contacts && this._data.contacts.local) {
      useRegionalOffice = this._data.contacts.local.flag != 'none';
    }

    return useRegionalOffice;
  }

  set useRegionalOffice(flag) {
    if (!this._data.contacts) {
      this._data.contacts = {};
    }

    if (!this._data.contacts.local) {
      this._data.contacts.local = {};
    }

    this._data.contacts.local.flag = flag;
  }

  //Applying for Assistance section fields
  get deadlineFlag() {
    let flag = null;

    if (this._data.assistance && this._data.assistance.deadlines && this._data.assistance.deadlines.flag) {
      flag = this._data.assistance.deadlines.flag;
    }

    return flag;
  }

  set deadlineFlag(flag) {
    _.set(this._data, 'assistance.deadlines.flag', flag);
  }

  get deadlineDesc() {
    let desc = '';
    if (this._data.assistance && this._data.assistance.deadlines && this._data.assistance.deadlines.description) {
      desc = this._data.assistance.deadlines.description;
    }
    return desc;
  }

  set deadlineDesc(desc) {
    _.set(this._data, 'assistance.deadlines.description', desc);
  }

  get deadlineList() {
    let list = [];
    if (this._data.assistance && this._data.assistance.deadlines && this._data.assistance.deadlines.list) {
      list = this._data.assistance.deadlines.list;
    }

    for (let deadline of list) {
      deadline.start = deadline.start || null;
      deadline.end = deadline.end || null;
      deadline.description = deadline.description || null;
    }

    return list;
  }

  set deadlineList(list) {
    _.set(this._data, 'assistance.deadlines.list', list);
  }

  get preAppCoordReports() {

    let reports = [];
    if (this._data.assistance && this._data.assistance.preApplicationCoordination && this._data.assistance.preApplicationCoordination.environmentalImpact) {
      if (this._data.assistance.preApplicationCoordination.environmentalImpact.reports)
        reports = this._data.assistance.preApplicationCoordination.environmentalImpact.reports;
    }
    return reports;
  }

  set preAppCoordReports(reports) {
    _.set(this._data, 'assistance.preApplicationCoordination.environmentalImpact.reports', reports);
  }

  get preAppCoordDesc() {
    let desc = '';
    if (this._data.assistance && this._data.assistance.preApplicationCoordination && this._data.assistance.preApplicationCoordination.description) {
      desc = this._data.assistance.preApplicationCoordination.description;
    }
    return desc;
  }

  set preAppCoordDesc(desc) {
    _.set(this._data, 'assistance.preApplicationCoordination.description', desc);
  }

  get appProcIsApp() {
    let flag = false;
    if (this._data.assistance && this._data.assistance.applicationProcedure && this._data.assistance.applicationProcedure.isApplicable) {
      flag = this._data.assistance.applicationProcedure.isApplicable;
    }
    return flag;
  }

  set appProcIsApp(flag) {

    _.set(this._data, 'assistance.applicationProcedure.isApplicable', flag);
  }

  get appProcDesc() {
    let desc = '';

    if (this._data.assistance && this._data.assistance.applicationProcedure && this._data.assistance.applicationProcedure.description) {
      desc = this._data.assistance.applicationProcedure.description;
    }

    return desc;
  }

  set appProcDesc(desc) {

    _.set(this._data, 'assistance.applicationProcedure.description', desc);
  }

  get selCriteriaIsApp() {
    let flag = false;
    if (this._data.assistance && this._data.assistance.selectionCriteria && this._data.assistance.selectionCriteria.isApplicable) {
      flag = this._data.assistance.selectionCriteria.isApplicable;
    }
    return flag;
  }

  set selCriteriaIsApp(flag) {
    _.set(this._data, 'assistance.selectionCriteria.isApplicable', flag);
  }

  get selCriteriaDesc() {
    let desc = '';
    if (this._data.assistance && this._data.assistance.selectionCriteria && this._data.assistance.selectionCriteria.description) {
      desc = this._data.assistance.selectionCriteria.description;
    }

    return desc;
  }

  set selCriteriaDesc(desc) {
    _.set(this._data, 'assistance.selectionCriteria.description', desc);
  }

  get awardProcDesc() {
    let desc = '';
    if (this._data.assistance && this._data.assistance.awardProcedure && this._data.assistance.awardProcedure.description) {
      desc = this._data.assistance.awardProcedure.description;
    }

    return desc;
  }

  set awardProcDesc(desc) {
    _.set(this._data, 'assistance.awardProcedure.description', desc);
  }

  get approvalInterval() {
    let interval = 'na';
    if (this._data.assistance && this._data.assistance.approval && this._data.assistance.approval.interval)
      interval = this._data.assistance.approval.interval;

    return interval;
  }

  set approvalInterval(interval) {
    _.set(this._data, 'assistance.approval.interval', interval);
  }

  get approvalDesc() {
    let desc = '';
    if (this._data.assistance && this._data.assistance.approval && this._data.assistance.approval.description) {
      desc = this._data.assistance.approval.description;
    }

    return desc;
  }

  set approvalDesc(desc) {
    _.set(this._data, 'assistance.approval.description', desc);
  }

  get appealInterval() {
    let interval = 'na';
    if (this._data.assistance && this._data.assistance.appeal && this._data.assistance.appeal.interval)
      interval = this._data.assistance.appeal.interval;

    return interval;
  }

  set appealInterval(interval) {
    _.set(this._data, 'assistance.appeal.interval', interval);
  }

  get appealDesc() {
    let desc = '';
    if (this._data.assistance && this._data.assistance.appeal && this._data.assistance.appeal.description) {
      desc = this._data.assistance.appeal.description;
    }

    return desc;
  }

  set appealDesc(desc) {
    _.set(this._data, 'assistance.appeal.description', desc);
  }

  get renewalInterval() {
    let interval = 'na';
    if (this._data.assistance && this._data.assistance.renewal && this._data.assistance.renewal.interval)
      interval = this._data.assistance.renewal.interval;

    return interval;
  }

  set renewalInterval(interval) {
    _.set(this._data, 'assistance.renewal.interval', interval);
  }

  get renewalDesc() {
    let desc = '';
    if (this._data.assistance && this._data.assistance.renewal && this._data.assistance.renewal.description) {
      desc = this._data.assistance.renewal.description;
    }

    return desc;
  }

  set renewalDesc(desc) {
    _.set(this._data, 'assistance.renewal.description', desc);
  }

  // data.financial

  get financialDescription() {
    let description = null;

    if (this._data.financial && this._data.financial.description) {
      description = this._data.financial.description;
    }

    return description || '';
  }

  set financialDescription(description) {
    _.set(this._data, 'financial.description', description);
  }

  get accomplishments() {
    let accomplishments = {
      isApplicable: true,
      list: []
    };

    if (this._data.financial && this._data.financial.accomplishments) {
      accomplishments = this._data.financial.accomplishments;
    }

    return accomplishments;
  }

  set accomplishments(accomplishments) {
    _.set(this._data, 'financial.accomplishments', accomplishments);
  }

  get accounts() {
    let accounts = [];

    if (this._data.financial && this._data.financial.accounts) {
      accounts = this._data.financial.accounts;
    }

    return accounts;
  }

  set accounts(accounts) {
    _.set(this._data, 'financial.accounts', accounts);
  }

  get tafs() {
    let tafs = [];

    if (this._data.financial && this._data.financial.treasury && this._data.financial.treasury.tafs) {
      tafs = this._data.financial.treasury.tafs;
    }

    return tafs;
  }

  set tafs(tafs) {
    _.set(this._data, 'financial.treasury.tafs', tafs);
  }

  //Authorization fields
  get authList() {
    let list = [];
    if (this._data.authorizations && this._data.authorizations.list) {
      list = this._data.authorizations.list;
    }
    return list;
  }

  set authList(list) {
    _.set(this._data, 'authorizations.list', list);
  }

  get authDesc() {
    let desc = '';
    if (this._data.authorizations && this._data.authorizations.description) {
      desc = this._data.authorizations.description;
    }

    return desc;
  }

  set authDesc(desc) {
    _.set(this._data, 'authorizations.description', desc);
  }

  /*Criteria-Information Model*/

  get eligibility() {
    return this._data.eligibility ? this._data.eligibility : {};
  }

  set eligibility(eligibility) {
    this._data.eligibility = eligibility;
  }

  get documentation() {
    let documentationObj = {
      isApplicable: true,
      description: null
    };
    if (this._data.eligibility && this._data.eligibility.documentation) {
      documentationObj = this._data.eligibility.documentation;
    }
    return documentationObj;
  }

  set documentation(documentationObj) {
    _.set(this._data, 'eligibility.documentation', documentationObj);
  }

  get applicantDesc() {
    let applicantDesc = null;
    if (this._data.eligibility && this._data.eligibility.applicant && this._data.eligibility.applicant.description) {
      applicantDesc = this._data.eligibility.applicant.description;
    }
    return applicantDesc || '';
  }

  set applicantDesc(applicantDesc) {
    _.set(this._data, 'eligibility.applicant.description', applicantDesc);
  }

  get appListDisplay() {
    let appListDisplay = [];
    if ((this._data.eligibility !== undefined && this._data.eligibility.applicant !== undefined) && appListDisplay.length === 0) {
      if (this._data.eligibility.applicant && this._data.eligibility.applicant.types && this._data.eligibility.applicant.types.length > 0) {
        appListDisplay = this._data.eligibility.applicant.types;
      }
    }
    return appListDisplay;
  }

  set appListDisplay(appListDisplay) {
    _.set(this._data, 'eligibility.applicant.types', appListDisplay);
  }

  get isSameAsApplicant() {
    let flag = false;
    if (this._data.eligibility && this._data.eligibility.beneficiary && this._data.eligibility.beneficiary.isSameAsApplicant) {
      flag = this._data.eligibility.beneficiary.isSameAsApplicant;
      if (flag) {
        flag = flag;
      }
    }
    return flag;
  }

  set isSameAsApplicant(flag) {
    _.set(this._data, 'eligibility.beneficiary.isSameAsApplicant', flag);
  }

  get benListDisplay() {
    let benListDisplay = [];
    if (this._data.eligibility !== undefined && this._data.eligibility.beneficiary !== undefined) {
      if (this._data.eligibility.beneficiary && this._data.eligibility.beneficiary.types && this._data.eligibility.beneficiary.types.length > 0) {
        benListDisplay = this._data.eligibility.beneficiary.types;
      }
    }
    return benListDisplay;
  }

  set benListDisplay(benListDisplay) {
    _.set(this._data, 'eligibility.beneficiary.types', benListDisplay);
  }


  get benDesc() {
    let benDesc = null;
    if (this._data.eligibility && this._data.eligibility.beneficiary && this._data.eligibility.beneficiary.description) {
      benDesc = this._data.eligibility.beneficiary.description;
    }
    return benDesc || '';
  }

  set benDesc(benDesc) {
    _.set(this._data, 'eligibility.beneficiary.description', benDesc);
  }

  get lengthTimeDesc() {
    let lengthTimeDesc = null;
    if (this._data.eligibility && this._data.eligibility.limitation && this._data.eligibility.limitation.description) {
      lengthTimeDesc = this._data.eligibility.limitation.description;
    }
    return lengthTimeDesc || '';
  }

  set lengthTimeDesc(lengthTimeDesc) {
    _.set(this._data, 'eligibility.limitation.description', lengthTimeDesc);
  }

  get awardedType() {
    let awardedType = 'na';
    if (this._data.eligibility && this._data.eligibility.limitation && this._data.eligibility.limitation.awarded) {
      awardedType = this._data.eligibility.limitation.awarded;
    }
    return awardedType;
  }

  set awardedType(awardedType) {
    if (!this._data.eligibility) {
      this._data.eligibility = {};
    }
    if (!this._data.eligibility.limitation) {
      this._data.eligibility.limitation = {};
    }
    this._data.eligibility.limitation.awarded = awardedType === 'na' ? null : awardedType;
  }

  get awardedDesc() {
    let awardedDesc = null;
    if (this._data.eligibility && this._data.eligibility.limitation && this._data.eligibility.limitation.awardedDescription) {
      awardedDesc = this._data.eligibility.limitation.awardedDescription;
    }
    return awardedDesc;
  }

  set awardedDesc(awardedDesc) {
    _.set(this._data, 'eligibility.limitation.awardedDescription', awardedDesc);
  }

  get assUsageDesc() {
    let assUsageDesc = null;
    if (this._data.eligibility && this._data.eligibility.assistanceUsage && this._data.eligibility.assistanceUsage.description) {
      assUsageDesc = this._data.eligibility.assistanceUsage.description;
    }
    return assUsageDesc || '';
  }

  set assUsageDesc(assUsageDesc) {
    _.set(this._data, 'eligibility.assistanceUsage.description', assUsageDesc);
  }

  get assListDisplay() {
    let assListDisplay = [];
    if (this._data.eligibility !== undefined && this._data.eligibility.assistanceUsage !== undefined) {
      if (this._data.eligibility.assistanceUsage && this._data.eligibility.assistanceUsage.types && this._data.eligibility.assistanceUsage.types.length > 0) {
        assListDisplay = this._data.eligibility.assistanceUsage.types;
      }
    }
    return assListDisplay;
  }

  set assListDisplay(assListDisplay) {
    _.set(this._data, 'eligibility.assistanceUsage.types', assListDisplay);
  }

  get usageRes() {
    let usageResObj = {
      isApplicable: true,
      description: null
    };
    if (this._data.eligibility && this._data.eligibility.usage && this._data.eligibility.usage.restrictions) {
      usageResObj = this._data.eligibility.usage.restrictions;
    }
    return usageResObj;
  }

  set usageRes(usageResObj) {
    _.set(this._data, 'eligibility.usage.restrictions', usageResObj);
  }

  get useDisFunds() {
    let useDisFundsObj = {
      isApplicable: true,
      description: null
    };
    if (this._data.eligibility && this._data.eligibility.usage && this._data.eligibility.usage.discretionaryFund) {
      useDisFundsObj = this._data.eligibility.usage.discretionaryFund;
    }
    return useDisFundsObj;
  }

  set useDisFunds(useDisFundsObj) {
    _.set(this._data, 'eligibility.usage.discretionaryFund', useDisFundsObj);
  }

  get useLoanTerms() {
    let useLoanTermsObj = {
      isApplicable: true,
      description: null
    };
    if (this._data.eligibility && this._data.eligibility.usage && this._data.eligibility.usage.loanTerms) {
      useLoanTermsObj = this._data.eligibility.usage.loanTerms;
    }
    return useLoanTermsObj;
  }

  set useLoanTerms(useLoanTermsObj) {
    _.set(this._data, 'eligibility.usage.loanTerms', useLoanTermsObj);
  }

  /*Financial-Obligation Model*/

  get isFundedCurrentFY() {
    let flag = false;
    if (this._data.financial && this._data.financial.isFundedCurrentFY) {
      flag = this._data.financial.isFundedCurrentFY;
      if (flag) {
        flag = flag;
      }
    }
    return flag;
  }

  set isFundedCurrentFY(flag) {
    _.set(this._data, 'financial.isFundedCurrentFY', flag);
  }

  get obligations() {
    let obligations = null;
    if (this._data.financial && this._data.financial.obligations) {
      obligations = this._data.financial.obligations;
    }
    return obligations;
  }

  set obligations(obligations) {
    _.set(this._data, 'financial.obligations', obligations);
  }

  // data.compliance
  get CFR200Requirements() {
    let CFR200 = null;

    if (this._data.compliance && this._data.compliance.CFR200Requirements) {
      CFR200 = this._data.compliance.CFR200Requirements;
    }

    return CFR200;
  }

  set CFR200Requirements(requirements) {
    _.set(this.data, 'compliance.CFR200Requirements', requirements);
  }

  get complianceReports() {
    let reports = null;

    if (this._data.compliance && this._data.compliance.reports) {
      reports = this._data.compliance.reports;
    }

    return reports;
  }

  set complianceReports(reports) {
    _.set(this.data, 'compliance.reports', reports);
  }

  get audit() {
    let audit = null;

    if (this._data.compliance && this._data.compliance.audit) {
      audit = this._data.compliance.audit;
    }

    return audit;
  }

  set audit(audit) {
    _.set(this.data, 'compliance.audit', audit);
  }

  get records() {
    let records = null;

    if (this._data.compliance && this._data.compliance.records) {
      records = this._data.compliance.records;
    }

    return records;
  }

  set records(records) {
    _.set(this.data, 'compliance.records', records);
  }

  get documents() {
    let documents = null;

    if (this._data.compliance && this._data.compliance.documents) {
      documents = this._data.compliance.documents;
    }

    return documents;
  }

  set documents(documents) {
    _.set(this.data, 'compliance.documents', documents);
  }

  get formulaAndMatching() {
    let formulaAndMatching = null;

    if (this._data.compliance && this._data.compliance.formulaAndMatching) {
      formulaAndMatching = this._data.compliance.formulaAndMatching;
    }

    return formulaAndMatching;
  }

  set formulaAndMatching(formulaAndMatching) {
    _.set(this.data, 'compliance.formulaAndMatching', formulaAndMatching);
  }

  /*  workflow submitting to OMB model*/
  get reason() {
    return this._reason;
  }

  set reason(reason) {
    this._reason = reason;
  }
}
