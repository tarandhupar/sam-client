import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  providers: [ ],
  templateUrl: './award-data.template.html',
})
export class AwardDataComponent {

  isAdmin: boolean = false;
  isEdit: boolean = false;

  opportunityConfig: any = {
    heading:'Opportunities',
    legacyWebsiteContent:' Federal Business Opportunities (FBO)',
    splashContent:`Find Available Contract Opportunities`,
    subContent:`Contracting organizations across the federal government post information about upcoming and current contracting opportunities as well as award notices. Key word searches or search filters enable you to narrow your search to your particular areas of interest. Solicitations and information about how to submit an offer or proposal is provided. You also can find additional notifications related to a procurement prior to the actual posting of the solicitation. Anyone interested in doing business with the government will find this data an invaluable resource for business development.`,
  };
  opportunityFeatures = [];
  opportunityCommonTerms = [
    {termName:"Solicitation", termContent:"Term definition lipsum"},
    {termName:"Award Notice", termContent:"Term definition lipsum"},
    {termName:"Combined Synopsis/Solicitation", termContent:"Term definition lipsum"},
    {termName:"Pre-solicitation", termContent:"Term definition lipsum"},
    {termName:"Sources Sought", termContent:"Term definition lipsum"},
    {termName:"Intent to Bundle", termContent:"Term definition lipsum"},
    {termName:"Fair Opportunity/Limited Sources", termContent:"Term definition lipsum"},
    {termName:"J&A", termContent:"Term definition lipsum"},
    {termName:"NAICs", termContent:"Term definition lipsum"},
    {termName:"PSC", termContent:"Term definition lipsum"},
    {termName:"Place of Performance", termContent:"Term definition lipsum"},
    {termName:"Interested Vendor List", termContent:"Term definition lipsum"},
    {termName:"Document Package", termContent:"Term definition lipsum"}
  ];
  opportunityFAQs = [];
  opportunityTypes = {
    label: 'Types',
    options:   []
  };

  wageConfig: any = {
    heading:'Wage Determinations',
    legacyWebsiteContent:'Wage Determinations On-Line (WDOL)',
    splashContent:`Find minimal wage rates and benefits paid to Federal contractors.`,
    subContent:`SAM.gov provides a powerful search engine to locate applicable wage determinations required for your contracts. As updates are provided by the Department of Labor, the site is updated. You may sign up to follow wage determinations as they are updated.`
  };
  wageFeatures = ['Search', 'View', 'Request form for wage determination'];
  wageCommonTerms = [
    {termName:"Service Contract Act", termContent:"Term definition lipsum"},
    {termName:"Davis-Bacon Act", termContent:"Term definition lipsum"}
  ];
  wageFAQs = [];
  wageTypes = {
    label: 'Types',
    options:   [
      { label: 'Search', value: 'Search', name: 'Search' },
      { label: 'View', value: 'View', name: 'View' },
      { label: 'Request form for wage determination', value: 'Request form for wage determination', name: 'Request form for wage determination' }
    ]
  };

  awardsConfig: any = {
    heading:'Procurement Awards ',
    legacyWebsiteContent:' Federal Procurement Data System (FPDS)',
    splashContent:`Find data on Federal contract awards`,
    subContent:`The capturing of individual contract actions provides transparency and visibility into government contracting. Award data is used by business development to plan their business pipelines. Self-service reporting tools assist in demystifying government spending by rolling up data based on a multitude of factors. Single authoritative source of contracting data. Provides the information needed to manage federal contracting activities more effectively.`
  };
  awardsFeatures = ['Search/Display', 'Data Entry', 'Reports', 'Interfaces with Contract Writing Systems', 'Atom Feed', 'API of contracting data'];
  awardsCommonTerms = [
    {termName:"Action Obligation", termContent:"Term definition lipsum"},
    {termName:"Period of Performance", termContent:"Term definition lipsum"},
    {termName:"Current Contract Value", termContent:"Term definition lipsum"},
    {termName:"Place of Performance", termContent:"Term definition lipsum"},
    {termName:"PSC", termContent:"Term definition lipsum"},
    {termName:"NAICs", termContent:"Term definition lipsum"},
    {termName:"Atom Feed", termContent:"Term definition lipsum"},
    {termName:"CO Size determination", termContent:"Term definition lipsum"},
    {termName:"Estimated Ultimate Completion Date", termContent:"Term definition lipsum"}
  ];
  awardsFAQs = [
    {question:"How is the data reported?", answer:"Contracting Officers enter the procurement data or the data is fed from 90+ agency contract writing systems."},
    {question:"How often is the data updated?", answer:" Data is entered upon completion of the award and updated if contracts are modified."},
    {question:"How can I run reports using the data?", answer:" The only step you need to take to access the reporting tool is that you must create an account in SAM.gov."}
  ];
  awardsTypes = {
    label: 'Types',
    options:   [
      { label: 'Search/Display', value: 'Search/Display', name: 'Search/Display' },
      { label: 'Data Entry', value: 'Data Entry', name: 'Data Entry' },
      { label: 'Reports', value: 'Reports', name: 'Reports' },
      { label: 'Interfaces with Contract Writing Systems', value: 'Interfaces with Contract Writing Systems', name: 'Interfaces with Contract Writing Systems' },
      { label: 'Atom Feed', value: 'Atom Feed', name: 'Atom Feed' },
      { label: "API of contracting data", value: "API of contracting data", name: "API of contracting data" }
    ]
  };

  subAwardsConfig: any = {
    heading:'Sub Awards',
    legacyWebsiteContent:' Federal Funding Accountability and Transparency Act (FFATA) Subaward Reporting System (FSRS)',
    splashContent:`Capture and Report sub-awards`,
    subContent:`Federal prime awardees (i.e. prime contractors and prime grants recipients) report against sub-contracts awarded and prime grant awardees will report against sub-grants awarded. `
  };
  subAwardsFeatures = [];
  subAwardsCommonTerms = [];
  subAwardsFAQs = [];
  subAwardsTypes = {
    label: 'Types',
    options:   []
  };

  entityConfig: any = {
    heading:'Entity Information',
    legacyWebsiteContent:' System for Award Management - Entity Registration',
    splashContent:`Register to do business with the U.S. government, update or renew your entity registration, and check status of an entity registration.`,
    subContent:`This information is critical for the government contracting and financial assistance officers to improve decision making during the award process. SAM.gov provides a single data collection point for entities to submit the information reducing burden on organizations wishing to do business with the government.  `
  };
  entityFeatures = ['Search', 'Display', 'Create', 'Edit', 'Delete', 'Manage roles', 'Create reports', 'Download data'];
  entityCommonTerms = [
    {termName:"Entities", termContent:"Contractors, federal assistance recipients, and other potential award recipients"},
    {termName:"DUNS Number", termContent:"Unique number assignment and validation process for entities for which each entity must register independently before they register in SAM.gov"},
    {termName:"Awards", termContent:"Contracts, orders, grants, loans, loan guarantees, scholarships, mortgage loans, insurance, and other types of financial assistance, including cooperative agreements; property, technical assistance, counseling, statistical, and other expert information; and service activities of regulatory agencies."}
  ];
  entityFAQs = [
    {question:"How often is the data updated?", answer:"Entities can update their information at any time but are required to update annually to remain in the active status."},
    {question:"How much does it cost to register in SAM?", answer:"It is free to register in SAM and to obtain a DUNS number. "},
    {question:"What are reps and certs?", answer:"For an entity wishing to compete for federal contracts, SAM captures responses required by the Federal Acquisition Regulations  and, if applicable, Defense Federal Acquisition Regulations and SF 330 Part II (A-E work) requirements. Some of the data prepopulates from data provided in other areas of SAM (e.g. Core Data and Assertions), while other data is captured from responses to the Representations and Certifications Questionnaire."},
  ];
  entityTypes = {
    label: 'Types',
    options:   [
      { label: 'Search', value: 'Search', name: 'Search' },
      { label: 'Display', value: 'Display', name: 'Display' },
      { label: 'Create', value: 'Create', name: 'Create' },
      { label: 'Edit', value: 'Edit', name: 'Edit' },
      { label: 'Delete', value: 'Delete', name: 'Delete' },
      { label: 'Manage roles', value: 'Manage roles', name: 'Manage roles' },
      { label: 'Create reports', value: 'Create reports', name: 'Create reports' },
      { label: "Download data", value: "Download data", name: "Download data" }
    ]
  };

  entityReportConfig: any = {
    heading:'Entity reporting against awarded contracts',
    legacyWebsiteContent:'System for Award Management - Contractor Compliance Reporting and Wages Pilot',
    splashContent:`Find information reported by individual contractors in accordance with the terms of an existing contract.`,
    subContent:`Individual contractors are required to report information against contracts awarded by federal agencies. SAM.gov is the central reporting portal for certain information such as Service Contract Report and Biopreferred Report. Government employees have access to the information and use it to determine contractor compliance with reporting requirements contained in their contracts.`
  };
  entityReportFeatures = ['Search', 'Display', 'Create', 'Edit', 'Delete', 'Entity reporting of data on awarded contracts', 'Download data'];
  entityReportCommonTerms = [
    {termName:"Service Contract Report", termContent:"Term definition lipsum"},
    {termName:"BIOPREFFERED Report", termContent:"Term definition lipsum"},
  ];
  entityReportFAQs = [
    {question:"How often must contractors report?", answer:"It depends on the clause itself.  Biopreffered reporting is continuous but has a cut off date for the previous fiscal year.  Service contract reports are open for reporting on an annual basis."}
  ];
  entityReportTypes = {
    label: 'Types',
    options:   [
      { label: 'Search', value: 'Search', name: 'Search' },
      { label: 'Display', value: 'Display', name: 'Display' },
      { label: 'Create', value: 'Create', name: 'Create' },
      { label: 'Edit', value: 'Edit', name: 'Edit' },
      { label: 'Delete', value: 'Delete', name: 'Delete' },
      { label: 'Entity reporting of data on awarded contracts', value: 'Entity reporting of data on awarded contracts', name: 'Entity reporting of data on awarded contracts' },
      { label: 'Download data', value: 'Download data', name: 'Download data' },
    ]
  };

  assistListingConfig: any = {
    heading:'Assistance Listings',
    legacyWebsiteContent:' Catalog of Federal Domestic Assistance (CFDA) ',
    splashContent:` Understand Available Financial Assistance.`,
    subContent:`The federal government makes financial assistance available to state and local governments (including the District of Columbia); federally-recognized Indian tribal governments; Territories (and possessions) of the United States; domestic public, quasi- public, and private profit and nonprofit organizations and institutions; specialized groups; and individuals. The financial assistance is used to support education, health care, research, infrastructure, economic development, etc. through grants, loans, loan guarantees, scholarships, mortgage loans, insurance, and other types of financial assistance, including cooperative agreements; property, technical assistance, counseling, statistical, and other expert information; and service activities of regulatory agencies.`
  };
  assistListingFeatures = ['Search/Display', 'Data Entry', 'FTP Site', 'Downloadable version of the listings compiled on an annual basis'];
  assistListingCommonTerms = [
    {termName:"Financial assistance", termContent:"Term definition lipsum"}
  ];
  assistListingFAQs = [];
  assistListingTypes = {
    label: 'Types',
    options:   [
      { label: 'Search/Display', value: 'Search/Display', name: 'Search/Display' },
      { label: 'Data Entry', value: 'Data Entry', name: 'Data Entry' },
      { label: 'FTP Site', value: 'FTP Site', name: 'FTP Site' },
      { label: 'Downloadable version of the listings compiled on an annual basis', value: 'Downloadable version of the listings compiled on an annual basis', name: 'Downloadable version of the listings compiled on an annual basis' }
    ]
  };

  exclusionsConfig: any = {
    heading:'Exclusions',
    legacyWebsiteContent:'System for Award Management (SAM.gov)',
    splashContent:`Find Parties excluded from Federal contracts`,
    subContent:`Exclusions identify parties excluded from receiving federal contracts, certain subcontracts, and certain types of federal financial and non-financial assistance and benefits. SAM keeps the user community aware of administrative and statutory exclusions across the entire government and individuals barred from entering the United States. The more commonly used terms of ‘suspensions’ and ‘debarments’ reflect exclusions.`
  };
  exclusionsFeatures = [];
  exclusionsCommonTerms = [
    {termName:"Exclusion", termContent:"Term definition lipsum"},
    {termName:"Individual", termContent:"A person"},
    {termName:"Firm", termContent:"A company with a valid Dun & Bradstreet Data Universal Numbering System (DUNS) number."},
    {termName:"Vessel", termContent:"A mode of transportation capable of transport by water."},
    {termName:"Special Entity Designation", termContent:"Any entity that is not a vessel, individual or firm."},
    {termName:"Special Entity Designation", termContent:"Any entity that is not a vessel, individual or firm."},
    {termName:"Ineligible (Proceedings Pending)", termContent:"Term definition lipsum"},
    {termName:"Ineligible (Proceedings Completed)", termContent:"Term definition lipsum"},
    {termName:"Prohibition/Restriction", termContent:"Term definition lipsum"},
    {termName:"Voluntary Exclusion", termContent:"Term definition lipsum"},
    {termName:"Nature", termContent:"The reason for (nature of) the exclusion—why is the entity excluded"},
    {termName:"Effect", termContent:"What the exclusion means in terms of any restrictions or outcomes of the exclusion; it gives specific, award-related guidance to contracting officers, grants officials, and others when determining how to treat the excluded party, such as what can and can't be awarded to them."}
  ];
  exclusionsFAQs = [];
  exclusionsTypes = {
    label: 'Types',
    options:   []
  };

  curConfig;
  curFeatures;
  curCommonTerms;
  curTypes;
  curFAQs;
  prevConfig;
  prevFeatures;
  prevCommonTerms;

  curSubSection = "opportunities";
  subSectionMap = {
    opportunities: [this.opportunityConfig, this.opportunityFeatures, this.opportunityCommonTerms, this.opportunityTypes, this.opportunityFAQs],
    awards: [this.awardsConfig, this.awardsFeatures, this.awardsCommonTerms, this.awardsTypes, this.awardsFAQs],
    subAwards: [this.subAwardsConfig, this.subAwardsFeatures, this.subAwardsCommonTerms, this.subAwardsTypes, this.subAwardsFAQs],
    entities: [this.entityConfig, this.entityFeatures, this.entityCommonTerms, this.entityTypes, this.entityFAQs],
    assistanceListings: [this.assistListingConfig, this.assistListingFeatures, this.assistListingCommonTerms, this.assistListingTypes, this.assistListingFAQs],
    exclusions: [this.exclusionsConfig, this.exclusionsFeatures, this.exclusionsCommonTerms, this.exclusionsTypes, this.exclusionsFAQs],
    wageDeterminations: [this.wageConfig, this.wageFeatures, this.wageCommonTerms, this.wageTypes, this.wageFAQs],
    entityComplianceReporting: [this.entityReportConfig, this.entityReportFeatures, this.entityReportCommonTerms, this.entityReportTypes, this.entityReportFAQs],
  };


  constructor(private router:Router, private route:ActivatedRoute) {}

  ngOnInit(){
    this.loadSubSectionContent(this.curSubSection);
    this.router.events.subscribe(
      val => {
        let subSection = "";
        let start = val.url.indexOf("#");
        if(start > 0){
          subSection = val.url.substr(start+1,val.url.length-start-1);
        }else{
          subSection = "opportunities";
        }
        if(subSection !== this.curSubSection) {
          this.curSubSection = subSection;
          this.loadSubSectionContent(this.curSubSection);
        }
      });

    this.fakeOutAdmin();

  }

  fakeOutAdmin(){
    this.route.queryParams.subscribe(queryParams => {
      this.isAdmin = false;
      if (queryParams["admin"] === 'true') {
        this.isAdmin = true;
      }
    });
  }

  onEditPageClick(){
    this.isEdit = true;
  }

  onCancelEditPageClick(){
    this.isEdit = false;
    this.rollBackWithCopies();
  }

  onSaveEditPageClick(){
    this.isEdit = false;
    this.updateCopies();
  }

  onParamChanged(){
  }

  onRemoveFeatureClick(featureName){
    let featureIndex = this.curFeatures.indexOf(featureName);
    this.curFeatures.splice(featureIndex,1);
  }

  onRemoveTermClick(term){
    let termIndex = this.curCommonTerms.indexOf(term);
    this.curCommonTerms.splice(termIndex,1);
  }

  onAddTermClick(){

  }

  copyCurRecords(val):any{
    let copy;
    if(Array.isArray(val)){
      copy = val.map( e => {
        if(typeof e === 'object'){
          return Object.assign({}, e);
        }
        return e;
      });
    }else if(typeof val === 'object'){
      copy = Object.assign({}, val);
    }else {
      copy = val;
    }

    return copy;
  }

  updateCopies(){
    this.prevConfig = this.copyCurRecords(this.curConfig);
    this.prevFeatures = this.copyCurRecords(this.curFeatures);
    this.prevCommonTerms = this.copyCurRecords(this.curCommonTerms);
  }

  rollBackWithCopies(){
    this.curConfig = this.copyCurRecords(this.prevConfig);
    this.curFeatures = this.copyCurRecords(this.prevFeatures);
    this.curCommonTerms = this.copyCurRecords(this.prevCommonTerms);
  }

  loadSubSectionContent(subSection){
    this.curConfig = this.subSectionMap[subSection][0];
    this.curFeatures = this.subSectionMap[subSection][1];
    this.curCommonTerms = this.subSectionMap[subSection][2];
    this.curTypes = this.subSectionMap[subSection][3];
    this.curFAQs = this.subSectionMap[subSection][4];
    this.updateCopies();
  }

}
