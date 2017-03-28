import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  providers: [ ],
  templateUrl: './award-data.template.html',
})
export class AwardDataComponent {

  isEdit: boolean = false;

  opportunityConfig: any = {
    heading:'Opportunities',
    legacyWebsiteContent:' Federal Business Opportunities (FBO)',
    splashContent:`Find Available Contract Opportunities`,
    subHeader:"Sub Header",
    subContent:`Contracting organizations across the federal government post information about upcoming and current contracting opportunities as well as award notices. Key word searches or search filters enable you to narrow your search to your particular areas of interest. Solicitations and information about how to submit an offer or proposal is provided. You also can find additional notifications related to a procurement prior to the actual posting of the solicitation. Anyone interested in doing business with the government will find this data an invaluable resource for business development.`,
  };
  opportunityFeatures = ['Search/Display', 'Data Entry'];
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
  opportunityTypes = {
    label: 'Types',
    options:   [
      { label: 'Search/Display', value: 'Search/Display', name: 'Search/Display' },
      { label: 'Reporting', value: 'Reporting', name: 'Reporting' },
      { label: 'Data Entry', value: 'Data Entry', name: 'Data Entry' },
      { label: 'Administration', value: 'Administration', name: 'Administration' },
      { label: 'Online Help', value: 'Online Help', name: 'Online Help' },
      { label: "API's", value: "API's", name: "API's" }
    ]
  };

  awardsConfig: any = {
    heading:'Procurement Awards ',
    legacyWebsiteContent:' Federal Procurement Data System (FPDS)',
    splashContent:`Find data on Federal contract awards`,
    subHeader:"Sub Header",
    subContent:`The capturing of individual contract actions provides transparency and visibility into government contracting. Award data is used by business development to plan their business pipelines. Self-service reporting tools assist in demystifying government spending by rolling up data based on a multitude of factors. Single authoritative source of contracting data. Provides the information needed to manage federal contracting activities more effectively.`
  };
  awardsFeatures = ['Search/Display', 'Data Entry'];
  awardsCommonTerms = [
    {termName:"Term1", termContent:"Term definition lipsum"},
    {termName:"Term2", termContent:"Term definition lipsum"},
    {termName:"Term3", termContent:"Term definition lipsum"}
  ];
  awardsTypes = {
    label: 'Types',
    options:   [
      { label: 'Search/Display', value: 'Search/Display', name: 'Search/Display' },
      { label: 'Reporting', value: 'Reporting', name: 'Reporting' },
      { label: 'Data Entry', value: 'Data Entry', name: 'Data Entry' },
      { label: 'Interfaces with Contract Writing Systems', value: 'Interfaces with Contract Writing Systems', name: 'Interfaces with Contract Writing Systems' },
      { label: 'Atom Feed', value: 'Atom Feed', name: 'Atom Feed' },
      { label: "API of contracting data", value: "API of contracting data", name: "API of contracting data" }
    ]
  };

  subAwardsConfig: any = {
    heading:'Sub Awards',
    legacyWebsiteContent:' Federal Funding Accountability and Transparency Act (FFATA) Subaward Reporting System (FSRS)',
    splashContent:`Capture and Report sub-awards`,
    subHeader:"Sub Header",
    subContent:`Federal prime awardees (i.e. prime contractors and prime grants recipients) report against sub-contracts awarded and prime grant awardees will report against sub-grants awarded. `
  };
  subAwardsFeatures = ['Search/Display', 'Data Entry'];
  subAwardsCommonTerms = [
    {termName:"Solicitation", termContent:"Term definition lipsum"},
    {termName:"Award Notice", termContent:"Term definition lipsum"},
    {termName:"Combined Synopsis/Solicitation", termContent:"Term definition lipsum"},
  ];
  subAwardsTypes = {
    label: 'Types',
    options:   [
      { label: 'Search/Display', value: 'Search/Display', name: 'Search/Display' },
      { label: 'Reporting', value: 'Reporting', name: 'Reporting' },
      { label: 'Data Entry', value: 'Data Entry', name: 'Data Entry' },
      { label: 'Administration', value: 'Administration', name: 'Administration' },
      { label: 'Online Help', value: 'Online Help', name: 'Online Help' },
      { label: "API's", value: "API's", name: "API's" }
    ]
  };

  entityConfig: any = {
    heading:'Entity Information',
    legacyWebsiteContent:' System for Award Management - Entity Registration',
    splashContent:`Register to do business with the U.S. government, update or renew your entity registration, and check status of an entity registration.`,
    subHeader:"Sub Header",
    subContent:`This information is critical for the government contracting and financial assistance officers to improve decision making during the award process. SAM.gov provides a single data collection point for entities to submit the information reducing burden on organizations wishing to do business with the government.  `
  };
  entityFeatures = ['Search/Display', 'Data Entry'];
  entityCommonTerms = [
    {termName:"Term1", termContent:"Term definition lipsum"},
    {termName:"Term2", termContent:"Term definition lipsum"},
    {termName:"Term3", termContent:"Term definition lipsum"}
  ];
  entityTypes = {
    label: 'Types',
    options:   [
      { label: 'Search/Display', value: 'Search/Display', name: 'Search/Display' },
      { label: 'Reporting', value: 'Reporting', name: 'Reporting' },
      { label: 'Data Entry', value: 'Data Entry', name: 'Data Entry' },
      { label: 'Administration', value: 'Administration', name: 'Administration' },
      { label: 'Online Help', value: 'Online Help', name: 'Online Help' },
      { label: "API's", value: "API's", name: "API's" }
    ]
  };

  assisListingConfig: any = {
    heading:'Assistance Listings',
    legacyWebsiteContent:' Catalog of Federal Domestic Assistance (CFDA) ',
    splashContent:` Understand Available Financial Assistance.`,
    subHeader:"Sub Header",
    subContent:`The federal government makes financial assistance available to state and local governments (including the District of Columbia); federally-recognized Indian tribal governments; Territories (and possessions) of the United States; domestic public, quasi- public, and private profit and nonprofit organizations and institutions; specialized groups; and individuals. The financial assistance is used to support education, health care, research, infrastructure, economic development, etc. through grants, loans, loan guarantees, scholarships, mortgage loans, insurance, and other types of financial assistance, including cooperative agreements; property, technical assistance, counseling, statistical, and other expert information; and service activities of regulatory agencies.`
  };
  assisListingFeatures = ['Search/Display', 'Data Entry'];
  assisListingCommonTerms = [
    {termName:"Term1", termContent:"Term definition lipsum"},
    {termName:"Term2", termContent:"Term definition lipsum"},
    {termName:"Term3", termContent:"Term definition lipsum"}
  ];
  assisListingTypes = {
    label: 'Types',
    options:   [
      { label: 'Search/Display', value: 'Search/Display', name: 'Search/Display' },
      { label: 'Reporting', value: 'Reporting', name: 'Reporting' },
      { label: 'Data Entry', value: 'Data Entry', name: 'Data Entry' },
      { label: 'Administration', value: 'Administration', name: 'Administration' },
      { label: 'Online Help', value: 'Online Help', name: 'Online Help' },
      { label: "API's", value: "API's", name: "API's" }
    ]
  };

  exclusionsConfig: any = {
    heading:'Exclusions',
    legacyWebsiteContent:'System for Award Management (SAM.gov)',
    splashContent:`Find Parties excluded from Federal contracts`,
    subHeader:"Sub Header",
    subContent:`Exclusions identify parties excluded from receiving federal contracts, certain subcontracts, and certain types of federal financial and non-financial assistance and benefits. SAM keeps the user community aware of administrative and statutory exclusions across the entire government and individuals barred from entering the United States. The more commonly used terms of ‘suspensions’ and ‘debarments’ reflect exclusions.`
  };
  exclusionsFeatures = ['Search/Display', 'Data Entry'];
  exclusionsCommonTerms = [
    {termName:"Term1", termContent:"Term definition lipsum"},
    {termName:"Term2", termContent:"Term definition lipsum"},
    {termName:"Term3", termContent:"Term definition lipsum"}
  ];
  exclusionsTypes = {
    label: 'Types',
    options:   [
      { label: 'Search/Display', value: 'Search/Display', name: 'Search/Display' },
      { label: 'Reporting', value: 'Reporting', name: 'Reporting' },
      { label: 'Data Entry', value: 'Data Entry', name: 'Data Entry' },
      { label: 'Administration', value: 'Administration', name: 'Administration' },
      { label: 'Online Help', value: 'Online Help', name: 'Online Help' },
      { label: "API's", value: "API's", name: "API's" }
    ]
  };

  curConfig;
  curFeatures;
  curCommonTerms;
  curTypes;
  prevConfig;
  prevFeatures;
  prevCommonTerms;

  curSubSection = "opportunities";
  subSectionMap = {
    opportunities: [this.opportunityConfig, this.opportunityFeatures, this.opportunityCommonTerms, this.opportunityTypes],
    awards: [this.awardsConfig, this.awardsFeatures, this.awardsCommonTerms, this.awardsTypes],
    subAwards: [this.subAwardsConfig, this.subAwardsFeatures, this.subAwardsCommonTerms, this.subAwardsTypes],
    entities: [this.entityConfig, this.entityFeatures, this.entityCommonTerms, this.entityTypes],
    assistanceListings: [this.assisListingConfig, this.assisListingFeatures, this.assisListingCommonTerms, this.assisListingTypes],
    exclusions: [this.exclusionsConfig, this.exclusionsFeatures, this.exclusionsCommonTerms, this.exclusionsTypes],
    agencies: [this.opportunityConfig, this.opportunityFeatures, this.opportunityCommonTerms, this.opportunityTypes],
  };


  constructor(private router:Router) {}

  ngOnInit(){
    this.loadSubSectionContent(this.curSubSection);
    this.router.events.subscribe(
      val => {
        let subSection = "";
        if(val.url.indexOf("#") > 0){
          subSection = val.url.substr(val.url.indexOf("#")+1);
        }else{
          subSection = "opportunities";
        }
        if(subSection !== this.curSubSection) {
          this.curSubSection = subSection;
          this.loadSubSectionContent(this.curSubSection);
        }
      }
    );
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
    console.log(subSection);
    this.curConfig = this.subSectionMap[subSection][0];
    this.curFeatures = this.subSectionMap[subSection][1];
    this.curCommonTerms = this.subSectionMap[subSection][2];
    this.curTypes = this.subSectionMap[subSection][3];
    this.updateCopies();
  }

}
