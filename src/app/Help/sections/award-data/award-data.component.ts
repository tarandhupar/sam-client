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
    heading:'Contract Opportunities',
    legacyLogo: 'src/assets/img/logos/fbo-black.png',
    legacyWebsiteContent:' Federal Business Opportunities (FBO)',
    splashContent:`Find Available Contract Opportunities`,
    subContent:`
      <p>
        Contracting organizations across the federal government post notices on 
        proposed contract actions (valued at more than $25,000) to SAM. These 
        notices, or “procurement opportunities,” include solicitations, 
        pre-solicitations, sole source justifications, and other notices. Anyone 
        interested in doing business with the government can use SAM to learn 
        about available opportunities.
      </p>
      <p>
        Each procurement opportunity on SAM provides the following information:
      </p>
      <ul class="sam-ui bulleted list">
        <li>The original notice date and any amendments</li>
        <li>An overview of the notice and contracting agency</li>
        <li>Any related attachments or external links</li>
        <li>Instructions on how to submit a response, offer or proposal</li>
        <li>The date on which responses are due</li>
      </ul>
      <p>
        You can search for opportunities in SAM by entering a keyword, 
        solicitation ID, or an agency name into the search field, and use 
        filters to narrow your results. 
      </p>
      <p>
        While you don’t need a user account to view contract opportunities, in 
        future releases you will be able to access additional capabilities—such 
        as saving searches, adding yourself to an opportunity’s Interested 
        Vendors List, and signing up to receive regular updates on 
        opportunities—when logged in. The capability to create user accounts 
        will become available in SAM in the upcoming months.
      </p>
      `,
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
    legacyLogo: 'src/assets/img/logos/wdol-black.png',
    legacyWebsiteContent:'Wage Determinations On-Line (WDOL)',
    splashContent:`Find minimal wage rates and benefits paid to Federal contractors.`,
    subContent:`
      <p>
        A wage determination is a listing of wage rates and fringe benefit rates 
        for each labor category of workers which the U.S. Department of Labor 
        has determined to be prevailing in a given area.
      </p>
      <p>
        Wage determinations fall under two categories: Davis-Bacon Act (DBA) WDs 
        and Service Contract Act (SCA) WDs. The DBA applies to contracts 
        involving the construction, alteration, and/or repair 
        (including painting or decorating) of public buildings or public works. 
        These contracts must specify the minimum wages and fringe benefits to be 
        paid to laborers and mechanics employed under the contract. 
      </p>
      <p>
        The Service Contract Act (SCA) applies to federal and District of 
        Columbia contracts that provide services. It  establishes standards for 
        wage rates and safety and health protections for employees performing 
        work on covered contracts. 
      </p>
      <p>
        You can find the applicable DBA and SCA wage determinations required for 
        each contract action in SAM. Search by wage determination (WD) number, 
        or use the filters to narrow down your results by geographic location.
      </p>
      <p>
        Each wage determination reflects the current data provided by the 
        Department of Labor. In the future, you will be able to sign up to 
        follow wage determinations as they are updated.  
      </p>
    `
  };  
  wageFeatures = [
    ['Search', 'View', 'Request form for wage determination'],
    [
      {feature:'Search', login: 'Yes', interested: 'Procurement'}, 
      {feature:'View', login: 'Yes', interested: 'Procurement'}, 
      {feature:'Request form for wage determination', login: 'Yes', interested: 'Procurement'},
    ]
  ];  
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
    heading:'Contract Awards',
    legacyLogo: 'src/assets/img/logos/fpds-black.png',
    legacyWebsiteContent:' Federal Procurement Data System (FPDS)',
    splashContent:`Find data on Federal contract awards`,
    subContent:`
      <p>
        SAM provides detailed post-solicitation and award data on contracts that 
        have an estimated value of $3,000 or more. It serves as the single 
        authoritative source of contracting data, ensuring transparency and 
        visibility into federal procurement spending. 
      </p>
      <p>
        Contractors often research public award data to find competitive 
        information on other vendors and build their business pipelines. This 
        includes using the data to understand when existing contracts expire and 
        finding potential subcontracting opportunities. Federal agencies use 
        award data to measure, analyze, and report on the effect of federal 
        contracting on the U.S. economy and the success of policy.
      </p>
      <p>
        In the future, agency contracting officers will be able to submit award 
        data through a contract writing system or enter it directly into SAM, as 
        well as report contract modifications. 
      </p>
      `
  };
  awardsFeatures = [
    [
      'Search/Display', 
      'Data Entry', 
      'Reports', 
      'Interfaces with Contract Writing Systems', 
      'Atom Feed', 
      'API of contracting data'
    ],
    [
      {feature:'Search/Display', login: 'Yes', interested: 'Procurement'}, 
      {feature:'Data Entry', login: 'Yes', interested: 'Procurement'}, 
      {feature:'Reports', login: 'Yes', interested: 'Procurement'}, 
      {feature:'Interfaces with Contract Writing Systems', login: 'Yes', interested: 'Procurement'}, 
      {feature:'Atom Feed', login: 'Yes', interested: 'Procurement'}, 
      {feature:'API of contracting data', login: 'Yes', interested: 'Procurement'}
    ]
  ];
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
    heading:'Entity Registrations',
    legacyLogo: 'src/assets/img/logos/sam-black.png',
    legacyWebsiteContent:' System for Award Management (SAM)',
    splashContent:`Register to do business with the U.S. government, update or renew your entity registration, and check status of an entity registration.`,
    subContent:`
      <p>
        Parties looking to do business with the federal government must register 
        as “entities” in SAM. Currently, SAM has more than half a million 
        registered entities from both the procurement and assistance communities. 
        This includes prime and subcontractors from sole proprietors and small 
        businesses through large corporations, and assistance recipients from 
        individuals and small non-profits through state governments. Federal 
        government agencies also register to participate in intra-governmental 
        transactions.
      </p>
      <p>
        To see if an entity is registered in SAM, you can perform a search for 
        records by typing an entity’s name into the search field. The search 
        filter will automatically display “active” entities, but you can also 
        switch to view only inactive results. 
      </p>
      <p>
        If the search displays no results, the entity’s administrator may have 
        chosen to have the registration hidden from public display. In the 
        future, federal government users will be able to log in to see those 
        registrations that have opted out of the public display.
      </p>
      <p>
        In the future, you’ll be able to:
      </p>
      <ul class="sam-ui bulleted list">
        <li>Register as an entity in SAM</li>
        <li>Update or renew your registration</li>
        <li>Check your entity’s registration status</li>
      </ul>
      `
  };
  entityFeatures = [
    [
      'Search', 
      'Display', 
      'Create', 
      'Edit', 
      'Delete', 
      'Manage roles', 
      'Create reports', 
      'Download data'
    ],
    [
      {feature:'Search', login: 'Yes', interested: 'Procurement'}, 
      {feature:'Display', login: 'Yes', interested: 'Procurement'}, 
      {feature:'Create', login: 'Yes', interested: 'Procurement'}, 
      {feature:'Edit', login: 'Yes', interested: 'Procurement'}, 
      {feature:'Delete', login: 'Yes', interested: 'Procurement'}, 
      {feature:'Manage roles', login: 'Yes', interested: 'Procurement'}, 
      {feature:'Create reports', login: 'Yes', interested: 'Procurement'}, 
      {feature:'Download data', login: 'Yes', interested: 'Procurement'}
    ]
  ];
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
  entityReportFeatures = [
    [
      'Search', 
      'Display', 
      'Create', 
      'Edit', 
      'Delete', 
      'Entity reporting of data on awarded contracts', 
      'Download data'
    ],
    [
      {feature:'Search', login: 'Yes', interested: 'Procurement'}, 
      {feature:'Display', login: 'Yes', interested: 'Procurement'}, 
      {feature:'Create', login: 'Yes', interested: 'Procurement'}, 
      {feature:'Edit', login: 'Yes', interested: 'Procurement'}, 
      {feature:'Delete', login: 'Yes', interested: 'Procurement'}, 
      {feature:'Entity reporting of data on awarded contracts', login: 'Yes', interested: 'Procurement'}, 
      {feature:'Download data', login: 'Yes', interested: 'Procurement'}
    ]
  ];
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
    legacyLogo: 'src/assets/img/logos/cfda-black.png',
    legacyWebsiteContent:' Catalog of Federal Domestic Assistance (CFDA) ',
    splashContent:` Understand Available Financial Assistance.`,
    subContent:`
      <p>
        The federal government provides assistance to the American public in the 
        form of projects, services, and activities. It supports a broad range of 
        programs—such as education, health care, research, infrastructure, 
        economic development and other programs—through grants, loans, 
        scholarships, insurance, and other types of financial assistance.
      </p>
      <p>
        SAM provides detailed, public descriptions of federal assistance 
        listings available to State and local governments 
        (including the District of Columbia), federally-recognized Indian tribal 
        governments, Territories (and possessions) of the United States, 
        domestic public, quasi- public, and private profit and nonprofit 
        organizations and institutions, specialized groups, and individuals.
      </p>
      <p>
        As an entity looking for federal assistance, you can conduct your 
        preliminary planning using SAM. Browse assistance listings across all 
        government agencies to form a “big picture” of your funding options. 
      </p>
      <p>
        Each assistance listing is associated with a unique five digit CFDA 
        (Catalogue of Federal Domestic Assistance) number. Once you identify a 
        federal assistance listing that you’re interested in, you can link 
        directly to grant opportunities on Grants.gov or follow up with that 
        specific agency using the contact information provided. 
      </p>
      `
  };
  assistListingFeatures = [
    [
      'Search/Display', 
      'Data Entry', 
      'FTP Site', 
      'Downloadable version of the listings compiled on an annual basis'
    ],
    [
      {feature:'Search/Display', login: 'Yes', interested: 'Procurement'}, 
      {feature:'Data Entry', login: 'Yes', interested: 'Procurement'}, 
      {feature:'FTP Site', login: 'Yes', interested: 'Procurement'}, 
      {feature:'Downloadable version of the listings compiled on an annual basis', login: 'Yes', interested: 'Procurement'},
    ]
  ];
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
    heading:'Entity Exclusions',
    legacyLogo: 'src/assets/img/logos/sam-black.png',
    legacyWebsiteContent:'System for Award Management (SAM)',
    splashContent:`Find Parties excluded from Federal contracts`,
    subContent:`
      <p>
        To protect the interest of the federal government, agencies declare 
        contractors as ineligible from receiving federal contracts, certain 
        subcontracts, and from certain types of federal financial and 
        non-financial assistance and benefits. You can find these exclusion 
        records (also known as “suspensions” and “debarments”) in SAM.
      </p>
      <p>
        To see if an entity is subject to any active exclusions, search for the 
        entity’s name, DUNS number, or CAGE code. To search for an individual 
        person, type in his or her name. Be sure to confirm that you’ve found 
        the correct person—it’s easy to misidentify someone if he or she has a 
        common name. If no exclusion record is found for the entity, the entity 
        does not have an active exclusion in SAM. 
      </p>
      <p>
        You’ll notice that each exclusion is assigned to a particular category. 
        The categories are: Preliminarily Ineligible (Proceedings Pending), 
        Ineligible (Proceedings Complete), Prohibition/Restriction, and 
        Voluntary Exclusion. These categories and additional information, such 
        as the reason for the exclusion and the effect, provide contracting 
        officers and other interested parties guidance as to the eligibility of 
        the debarred party for certain contracts, grants, loans and other 
        government assistance.
      </p>
    `
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

  federalHierarchyConfig: any = {
    heading:'Federal Hierarchy',
    legacyWebsiteContent:'',
    splashContent:``,
    subContent:`
      <p>
        The Federal Hierarchy is the authoritative source for managing and 
        referencing federal funding and awarding organizations. It’s a directory 
        or “family tree” that organizes federal Government users and establishes 
        relationships between each Department/Independent Agency’s sub-tiers and 
        its offices. 
      </p>
      <p>
        Civilian Departments and Independent Agencies in the Federal Hierarchy 
        have 3 levels (Department/Independent Agency, Sub-Tier Agency, and Office), 
        and the Department of Defense has 7 levels. Each federal Agency or 
        Department is responsible for maintaining the Offices within their 
        branch of the hierarchy.
      </p>
      <p>
        You can currently search within the Federal Hierarchy, or filter your 
        broader search results by federal organization.
      </p>
      `
  };
  federalHierarchyFeatures = [
    [
      'Search/Display', 
      'Data Entry', 
      'FTP Site', 
      'Downloadable version of the listings compiled on an annual basis'
    ],
    [
      {feature:'Search/Display', login: 'Yes', interested: 'Procurement'}, 
      {feature:'Data Entry', login: 'Yes', interested: 'Procurement'}, 
      {feature:'FTP Site', login: 'Yes', interested: 'Procurement'}, 
      {feature:'Downloadable version of the listings compiled on an annual basis', login: 'Yes', interested: 'Procurement'},
    ]
  ];
  federalHierarchyCommonTerms = [
    {termName:"Financial assistance", termContent:"Term definition lipsum"}
  ];
  federalHierarchyFAQs = [];
  federalHierarchyTypes = {
    label: 'Types',
    options:   [
      { label: 'Search/Display', value: 'Search/Display', name: 'Search/Display' },
      { label: 'Data Entry', value: 'Data Entry', name: 'Data Entry' },
      { label: 'FTP Site', value: 'FTP Site', name: 'FTP Site' },
      { label: 'Downloadable version of the listings compiled on an annual basis', value: 'Downloadable version of the listings compiled on an annual basis', name: 'Downloadable version of the listings compiled on an annual basis' }
    ]
  };
  
  curConfig;
  curFeatures;
  curCommonTerms;
  curTypes;
  curFAQs;
  prevConfig;
  prevFeatures;
  prevCommonTerms;

  curSubSection = "assistanceListings";
  subSectionMap = {
    opportunities: [this.opportunityConfig, this.opportunityFeatures, this.opportunityCommonTerms, this.opportunityTypes, this.opportunityFAQs],
    awards: [this.awardsConfig, this.awardsFeatures, this.awardsCommonTerms, this.awardsTypes, this.awardsFAQs],
    //subAwards: [this.subAwardsConfig, this.subAwardsFeatures, this.subAwardsCommonTerms, this.subAwardsTypes, this.subAwardsFAQs],
    entities: [this.entityConfig, this.entityFeatures, this.entityCommonTerms, this.entityTypes, this.entityFAQs],
    assistanceListings: [this.assistListingConfig, this.assistListingFeatures, this.assistListingCommonTerms, this.assistListingTypes, this.assistListingFAQs],
    federalHierarchy: [this.federalHierarchyConfig, this.federalHierarchyFeatures, this.federalHierarchyCommonTerms, this.federalHierarchyTypes, this.federalHierarchyFAQs],
    exclusions: [this.exclusionsConfig, this.exclusionsFeatures, this.exclusionsCommonTerms, this.exclusionsTypes, this.exclusionsFAQs],
    wageDeterminations: [this.wageConfig, this.wageFeatures, this.wageCommonTerms, this.wageTypes, this.wageFAQs],
    //entityComplianceReporting: [this.entityReportConfig, this.entityReportFeatures, this.entityReportCommonTerms, this.entityReportTypes, this.entityReportFAQs],
  };

  baseURL = "/help/award";


  constructor(private router:Router, private route:ActivatedRoute) {}

  ngOnInit(){
    this.loadSubSectionContent(this.curSubSection);
    this.router.events.subscribe(
      val => {
        if(val.url.startsWith(this.baseURL)){
          let subSection = "";
          let start = val.url.indexOf("#");
          if(start > 0){
            subSection = val.url.substr(start+1,val.url.length-start-1);
          }else{
            subSection = "assistanceListings";
          }
          if(subSection !== this.curSubSection) {
            this.curSubSection = subSection;
            this.loadSubSectionContent(this.curSubSection);
          }
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
    let featureIndex = this.curFeatures[0].indexOf(featureName);
    this.curFeatures[0].splice(featureIndex,1);
    this.curFeatures[1].splice(featureIndex,1);
  }

  onRemoveTermClick(term){
    let termIndex = this.curCommonTerms.indexOf(term);
    this.curCommonTerms.splice(termIndex,1);
  }

  onAddTermClick(){

  }

  copyCurRecords(val):any{
    let copy;
    
    function isArray(val): boolean{
      return Object.prototype.toString.call(val);
    }
    
    if(Array.isArray(val)){
      copy = val.map( e => {
        if(typeof e === 'object' && !isArray(e) ){
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
