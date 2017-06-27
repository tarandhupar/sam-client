import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { SearchService } from 'api-kit';
import { CapitalizePipe } from '../app-pipes/capitalize.pipe';
import { WageDeterminationService } from "../../api-kit/wage-determination/wage-determination.service";
import { AlertFooterService } from '../alerts/alert-footer';
import { OpportunityService } from "../../api-kit/opportunity/opportunity.service";
import { SortArrayOfObjects } from "../app-pipes/sort-array-object.pipe";
import { SearchDictionariesService } from "../../api-kit/search/search-dictionaries.service";
import { DictionaryService } from "../../api-kit/dictionary/dictionary.service";

@Component({
  moduleId: __filename,
  selector: 'search',
  providers: [CapitalizePipe],
  templateUrl: 'search.template.html'
})

export class SearchPage implements OnInit {

  keyword: string = "";
  index: string = "";
  organizationId: string = '';
  previousStringList: string = '';
  pageNum = 0;
  totalCount: any = 0;
  totalPages: any = 0;
  showPerPage = 10;
  data = [];
  featuredData = [];
  oldKeyword: string = "";
  initLoad = true;
  showOptional: any = (SHOW_OPTIONAL == "true");
  qParams: any = {};
  isActive: boolean = true;
  isStandard: string = '';
  showRegionalOffices: boolean = false;
  ro_keyword: string = "";
  isSearchComplete: boolean = false;

  // duns entity objects
  dunsModel: any = '';
  dunsModelList: any = [];
  dunsListString = '';
  myOptions: any = [];


  @ViewChild('agencyPicker') agencyPicker;

  // Active Checkbox config
  checkboxModel: any = ['true'];
  checkboxConfig = {
    options: [
      {value: 'true', label: 'Active Only', name: 'checkbox-active'},
    ],
    name: 'active-filter'
  };

  registrationExclusionCheckboxModel: any = [];
  registrationExclusionCheckboxConfig ={
    options: [
      {value: 'ent', label: 'Registrations', name: 'checkbox-registrations'},
      {value: 'ex', label: 'Exclusions', name:'checkbox-exclusions'}
    ],
    name: 'registration-exclusion-filter'

  };



  // Wage Determination Radio Component
  wdTypeModel = '';
  wdTypeConfig = {
    options: [
      {value: 'sca', label: 'Service Contract Act (SCA)', name: 'radio-sca'},
      {value: 'dbra', label: 'Davis-Bacon Act (DBA)', name: 'radio-dba'}
    ],
    name: 'wageDeterminationRad',
    label: '',
    errorMessage: '',
    hint: ''
  };

  // Select State Component
  wdStateModel = '';
  selectStateConfig = {
    options: [
      {value: '', label: 'Default option', name: 'empty', disabled: true},
    ],
    disabled: false,
    label: 'Select State',
    name: 'state',
  };

  // Select County Component
  wdCountyModel = '';
  selectCountyConfig = {
    options: [
      {value: '', label: 'Default option', name: 'empty', disabled: true},
    ],
    disabled: false,
    label: 'Select County',
    name: 'county',
  };

  // Select Construct Type Component drop-down
  wdConstructModel = '';
  selectConstructConfig = {
    options: [
      {value: '', label: 'Default option', name: 'empty', disabled: true},
    ],
    disabled: false,
    label: 'Select Construction Type',
    name: 'constructionType',
  };

  // Select SCA Previously Performed Radio Buttons
  wdPreviouslyPerformedModel = '';
  wdPreviouslyPerformedConfig = {
    options: [
      {value: 'prevPerfYesLocality', label: 'Yes, in the same locality', name: 'prevYesLocality'},
      {
        value: 'prevPerfYesDifferentLocality',
        label: 'Yes, but in a different locality',
        name: 'prevYesDifferentLocality'
      },
      {value: 'prevPerfNo', label: 'No, not performed before', name: 'prevNo'}
    ],
    name: 'previousPerformedRad',
    label: 'Were these services previously performed under an SCA-Covered contract?',
    errorMessage: '',
    hint: ''
  };

  // Select SCA Subject to CBA - Radio Buttons
  wdSubjectToCBAModel = '';
  wdSubjectToCBAConfig = {
    options: [
      {value: 'yesBasedCBA', label: 'Yes, and the current contract is based on a CBA', name: 'cbaYesBased'},
      {value: 'yesUnbasedCBA', label: 'Yes, but the current contract is not based on a CBA', name: 'cbaYesUnbased'},
      {value: 'noCBA', label: 'No', name: 'cbaNo'}
    ],
    name: 'cbaRad',
    label: 'Were the employees working subject to a CBA?',
    errorMessage: '',
    hint: ''
  };


  // Select NonStandard Services - Radio Buttons
  wdNonStandardRadModel: any = [''];
  wdNonStandardRadConfig = {
    optionsWithEven: [
      {value: 'yesNSS', label: 'Yes', name: '6'},
      {value: 'true', label: 'No, and the SCA WD ends in an even number', name: 'noEven'},
      {value: 'false', label: 'No, and the SCA WD ends in an odd number', name: 'noOdd'}
    ],

    optionsWithoutEven: [
      {value: 'yesNSS', label: 'Yes', name: '6'},
      {value: 'false', label: 'No, and the SCA WD ends in an odd number', name: 'noOdd'}
    ],

    name: 'radio-component4',
    label: 'Are the contract services to be performed listed in the drop-down below as a Non-Standard Service?',
    errorMessage: '',
    hint: ''
  };

  // Select NonStandard Service, Service - drop down
  wdNonStandardSelectModel = '';
  wdNonStandardSelectConfig = {
    options: [
      {value: '', label: 'Default option', name: 'empty', disabled: true},
    ],
    disabled: false,
    label: 'If a service is chosen, "Yes" will automatically be selected',
    name: 'constructionType',
  };

  // scaSearchDescription: string = "The Wage Determination filter asks a series of questions to determine if a WDOL is available based on your selected criteria. <br/><br/>Please note that using the keyword search with these WD type-specific filters may limit your search results.<br/><br/> If you cannot locate a Wage Determination, try searching with no keywords and use the Wage Determination filters to find your result. <br><br><b>If you would like to request a SCA contract action, click <a href='https://www.dol.gov/whd/govcontracts/sca/sf98/index.asp'>here</a> to submit an e98 form.</b>"
  wdSearchDescription: string = "The Wage Determination filters to the left ask a series of questions to determine if the best WD is available on the site. If any criteria such as a specific location is not present or the non-standard service does not strictly apply, please click <a href='https://www.dol.gov/whd/govcontracts/sca/sf98/index.asp'>here</a> to submit an e98 form. Users should note that the only WDs applicable to a particular solicitation or contract are those that have been incorporated by the contracting officer in that contract action.";
  dismissWdAlert: boolean = false;

  //Select Award Types
  awardIDVModel: string = '';
  awardIDVRadConfig = {
    options: [
      {value: 'AWARD', label: 'Contract', name: 'Contract'},
      {value: 'IDV', label: 'Interagency Contract Delivery (ICD)', name: 'ICD'}
    ],
    name: 'radio-component5',
    label: '',
    errorMessage: '',
    hint: ''
  };

  awardTypeModel: string = '';
  awardType = {
    "label": "Award-IDV Type",
    "name": "Award-IDV Type",
    "placeholder": "Search Award-IDV Types",
    "selectedLabel": "Award - IDV Types Selected",
    "options": [
      {label: 'BOA (IDV)', value: 'D_IDV', name: 'BOA'},
      {label: 'BPA CALL', value: 'A_AWARD', name: 'BPA CALL'},
      {label: 'BPA (IDV)', value: 'E_IDV', name: 'BPA'},
      {label: 'COOPERATIVE AGREEMENT', value: 'F_AWARD', name: 'COOPERATIVE AGREEMENT'},
      {label: 'DELIVERY ORDER', value: 'C_AWARD', name: 'DELIVERY ORDER'},
      {label: 'DEFINITIVE CONTRACT', value: 'D_AWARD', name: 'DEFINITIVE CONTRACT'},
      {label: 'FUNDED SPACE ACT AGREEMENT', value: 'S_AWARD', name: 'FUNDED SPACE ACT AGREEMENT'},
      {label: 'FSS (IDV)', value: 'C_IDV', name: 'FSS'},
      {label: 'GRANT FOR RESEARCH', value: 'G_AWARD', name: 'GRANT FOR RESEARCH'},
      {label: 'GWAC (IDV)', value: 'A_IDV', name: 'GWAC'},
      {label: 'IDC (IDV)', value: 'B_IDV', name: 'IDC'},
      {label: 'OTHER TRANSACTION ORDER', value: 'O_AWARD', name: 'OTHER TRANSACTION ORDER'},
      {label: 'OTHER TRANSACTION AGREEMENT', value: 'R_AWARD', name: 'OTHER TRANSACTION AGREEMENT'},
      {label: 'OTHER TRANSACTION (IDV)', value: 'O_IDV', name: 'OTHER TRANSACTION IDV'},
      {label: 'PURCHASE ORDER', value: 'B_AWARD', name: 'PURCHASE ORDER'},
      {label: 'TRAINING GRANT', value: 'T_AWARD', name: 'TRAINING GRANT'}
    ],
    "config": {
      keyValueConfig: {
        keyProperty: 'value',
        valueProperty: 'label'
      }
    }
  };

  //Select Contract Types
  contractTypeModel: string = '';
  contractType = {
    "label": "Contract Type",
    "name": "Contract Type",
    "placeholder": "Search Contract Types",
    "selectedLabel": "Contract Types Selected",
    "options": [
      {label: 'COST NO FEE', value: 'S', name: 'COST NO FEE'},
      {label: 'COST PLUS AWARD FEE', value: 'R', name: 'COST PLUS AWARD FEE'},
      {label: 'COST PLUS FIXED FEE', value: 'U', name: 'COST PLUS FIXED FEE'},
      {label: 'COST PLUS INCENTIVE FEE', value: 'V', name: 'COST PLUS INCENTIVE FEE'},
      {label: 'COST SHARING', value: 'T', name: 'COST SHARING'},
      {label: 'FIRM FIXED PRICE', value: 'J', name: 'FIRM FIXED PRICE'},
      {label: 'FIXED PRICE', value: 'J', name: 'FIXED PRICE'},
      {label: 'FIXED PRICE AWARD FEE', value: 'M', name: 'FIXED PRICE AWARD FEE'},
      {label: 'FIXED PRICE INCENTIVE', value: 'L', name: 'FIXED PRICE INCENTIVE'},
      {label: 'FIXED PRICE LEVEL OF EFFORT', value: 'B', name: 'FIXED PRICE LEVEL OF EFFORT'},
      {label: 'FIXED PRICE REDETERMINATION', value: 'A', name: 'FIXED PRICE REDETERMINATION'},
      {
        label: 'FIXED PRICE WITH ECONOMIC PRICE ADJUSTMENT',
        value: 'K',
        name: 'FIXED PRICE WITH ECONOMIC PRICE ADJUSTMENT'
      },
      {label: 'LABOR HOURS', value: 'Z', name: 'LABOR HOURS'},
      {
        label: 'ORDER DEPENDENT (IDV ALLOWS PRICING ARRANGEMENT TO BE DETERMINED SEPARATELY FOR EACH ORDER)',
        value: '1',
        name: 'ORDER DEPENDENT (IDV ALLOWS PRICING ARRANGEMENT TO BE DETERMINED SEPARATELY FOR EACH ORDER)'
      },
      {label: 'TIME AND MATERIALS', value: 'Y', name: 'TIME AND MATERIALS'},
      {
        label: 'OTHER (APPLIES TO AWARDS WHERE NONE OF THE ABOVE APPLY)',
        value: '3',
        name: 'OTHER (APPLIES TO AWARDS WHERE NONE OF THE ABOVE APPLY)'
      },
      {
        label: 'COMBINATION (APPLIES TO AWARDS WHERE TWO OR MORE OF THE ABOVE APPLY)',
        value: '2',
        name: 'COMBINATION (APPLIES TO AWARDS WHERE TWO OR MORE OF THE ABOVE APPLY)'
      }
    ],
    "config": {
      keyValueConfig: {
        keyProperty: 'value',
        valueProperty: 'label'
      }
    }
  };

  //Select NAICS Types
  naicsTypeModel: any = '';
  naicsType = {
    "label": "NAICS",
    "name": "NAICS Type",
    "placeholder": "Search NAICS Types",
    "selectedLabel": "Codes Selected",
    "options": [],
    "config": {
      keyValueConfig: {
        keyProperty: 'value',
        valueProperty: 'label'
      }
    }
  };

  //Select PSC Types
  pscTypeModel: any = '';
  pscType = {
    "label": "PSC",
    "name": "PSC Type",
    "placeholder": "Search PSC Types",
    "options": [],
    "config": {
      keyValueConfig: {
        keyProperty: 'value',
        valueProperty: 'label'
      }
    }
  };

  // Beneficiary Eligibility Object
  benElSearchString: any = '';
  benElType = {
    "label": "Beneficiaries",
    "name": "Beneficiary Eligibility",
    "placeholder": "Search Beneficiary",
    "selectedLabel": "Codes Selected",
    "options": [],
    "config": {
      keyValueConfig: {
        keyProperty: 'value',
        valueProperty: 'label'
      }
    }
  };

  // Applicant Eligibility Object
  appElSearchString: any = '';
  appElType = {
    "label": "Applicants",
    "name": "Applicant Eligibility",
    "placeholder": "Search Applicant",
    "options": [],
    "config": {
      keyValueConfig: {
        keyProperty: 'value',
        valueProperty: 'label'
      }
    }
  };

  //Assistance Type Filter
  assistanceTypeFilterModel: any = '';
  assistanceTypeOptions = {
    "label": "Assistance Type",
    "name": "Assistance Type",
    "placeholder": "Search Assistance Type",
    "selectedLabel": "Selected",
    "options": [],
    "config": {
      keyValueConfig: {
        keyProperty: 'value',
        valueProperty: 'label'
      }
    }
  }


  // Functional Codes Object
  functionalCodesModel: any = '';
  functionalCodesType = {
    "name": "Funcitonal Codes",
    "placeholder": "Search Functional Codes",
    "selectedLabel": "Selected",
    "options": [],
    "config": {
      keyValueConfig: {
        keyProperty: 'value',
        valueProperty: 'label'
      }
    }
  };

  regionalType = {
    "placeholder": "Regional Agency Location",
    "addOnIconClass": "fa fa-search"
  };

  // duns config
  dunsConfiguration = {
    placeholder: "Search Entity/UEI",
    selectedLabel: "Codes Selected",
    keyValueConfig: {
      keyProperty: 'value',
      valueProperty: 'label'
    },
    dropdownLimit: 10
  };

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private searchService: SearchService,
              private wageDeterminationService: WageDeterminationService,
              private opportunityService: OpportunityService,
              private alertFooterService: AlertFooterService,
              private searchDictionariesService: SearchDictionariesService,
              private programDictionariesService: DictionaryService) {
  }

  ngOnInit() {
    if (window.location.pathname.localeCompare("/search/fal/regionalOffices") === 0) {
      this.showRegionalOffices = true;
    } else {
      this.showRegionalOffices = false;
    }

    this.activatedRoute.queryParams.subscribe(
      data => {
        this.keyword = typeof data['keyword'] === "string" ? decodeURI(data['keyword']) : this.keyword;
        this.index = typeof data['index'] === "string" ? decodeURI(data['index']) : this.index;
        this.pageNum = typeof data['page'] === "string" && parseInt(data['page']) - 1 >= 0 ? parseInt(data['page']) - 1 : this.pageNum;
        this.organizationId = typeof data['organizationId'] === "string" ? decodeURI(data['organizationId']) : "";
        this.isActive = data['isActive'] && data['isActive'] === "false" ? false : true;
        this.checkboxModel = this.isActive === false ? [] : ['true'];
        this.wdTypeModel = data['wdType'] && data['wdType'] !== null ? data['wdType'] : '';
        this.wdStateModel = data['state'] && data['state'] !== null ? data['state'] : '';
        this.wdCountyModel = data['county'] && data['county'] !== null ? data['county'] : '';
        this.wdConstructModel = data['conType'] && data['conType'] !== null ? data['conType'] : '';
        this.wdNonStandardSelectModel = data['service'] && data['service'] !== null ? data['service'] : '';
        this.wdNonStandardRadModel = data['isEven'] && data['isEven'] !== null ? data['isEven'] : '';
        this.wdSubjectToCBAModel = data['cba'] && data['cba'] !== null ? data['cba'] : '';
        this.wdPreviouslyPerformedModel = data['prevP'] && data['prevP'] !== null ? data['prevP'] : '';
        this.isStandard = data['isStandard'] && data['isStandard'] !== null ? data['isStandard'] : '';
        this.awardIDVModel = data['awardOrIdv'] && data['awardOrIdv'] !== null ? data['awardOrIdv'] : '';
        this.awardTypeModel = data['awardType'] && data['awardType'] !== null ? data['awardType'] : '';
        this.contractTypeModel = data['contractType'] && data['contractType'] !== null ? data['contractType'] : '';
        this.naicsTypeModel = data['naics'] && data['naics'] !== null ? data['naics'] : '';
        this.pscTypeModel = data['psc'] && data['psc'] !== null ? data['psc'] : '';
        this.ro_keyword = typeof data['ro_keyword'] === "string" && this.showRegionalOffices ? decodeURI(data['ro_keyword']) : this.ro_keyword;
        this.dunsListString = data['duns'] && data['duns'] !== null ? data['duns'] : '';
        this.appElSearchString = data['applicant'] && data['applicant'] !== null ? data['applicant'] : '';
        this.benElSearchString = data['beneficiary'] && data['beneficiary'] !== null ? data['beneficiary'] : '';
        this.functionalCodesModel = data['functionalCodes'] && data['functionalCodes'] !== null ? data['functionalCodes'] : '';
        this.assistanceTypeFilterModel = data['assistanceType'] && data['assistanceType'] !== null ? data['assistanceType'] : '';
        this.registrationExclusionCheckboxModel = data['entityType'] && data['entityType'] !== null ? data['entityType'].split(",") : [];
        // persist duns filter data
        this.grabPersistData(this.dunsListString);
        this.isSearchComplete = false;
        this.runSearch();
        this.loadParams();
      });

  }

  findInactiveResults() {
    this.isActive = false;
    this.searchResultsRefresh();
  }

  loadParams() {
    var qsobj = this.setupQS(false);
    this.searchService.loadParams(qsobj);
  }

  // handles 'organization' emmitted event from agency picker
  onOrganizationChange(orgId: any) {

    let organizationStringList = '';

    let stringBuilderArray = orgId.map(function (organizationItem) {
      if (organizationStringList === '') {
        organizationStringList += organizationItem.value;
      }
      else {
        organizationStringList += ',' + organizationItem.value;
      }

      return organizationStringList;
    });

    this.previousStringList = this.organizationId;

    // storing current organization string list
    this.organizationId = organizationStringList;

    // we only want to change page number when the organization list has changed
    if (this.previousStringList !== this.organizationId) {
      this.pageNum = 0;
    }

    this.searchResultsRefresh();

  }

  setupQS(newsearch) {
    var qsobj = {};
    if (this.keyword.length > 0) {
      qsobj['keyword'] = this.keyword;
    } else {
      qsobj['keyword'] = '';
    }

    if (this.index.length > 0) {
      qsobj['index'] = this.index;
    } else {
      qsobj['index'] = '';
    }

    if (!newsearch && this.pageNum >= 0) {
      qsobj['page'] = this.pageNum + 1;
    }
    else {
      qsobj['page'] = 1;
    }
    qsobj['isActive'] = this.isActive;

    //wd or sca type param
    if (this.wdTypeModel.length > 0) {
      qsobj['wdType'] = this.wdTypeModel;
    }

    //wd dba construction type param
    if (this.wdConstructModel.length > 0) {
      qsobj['conType'] = this.wdConstructModel;
    }

    //wd state param
    if (this.wdStateModel.length > 0) {
      qsobj['state'] = this.wdStateModel;
    }

    //wd county param
    if (this.wdCountyModel.length > 0) {
      qsobj['county'] = this.wdCountyModel;
    }

    if (this.organizationId.length > 0) {
      qsobj['organizationId'] = this.organizationId;
    }

    //wd Non Standard drop down param
    if (this.wdNonStandardSelectModel.length > 0) {
      qsobj['service'] = this.wdNonStandardSelectModel;
    }

    //wd Non Standard radio button param
    if (this.wdNonStandardRadModel.length > 0) {
      qsobj['isEven'] = this.wdNonStandardRadModel;
      // this rad button determins isStandard as well
      qsobj["isStandard"] = this.isStandard;
    }

    //wd subject to cba param
    if (this.wdSubjectToCBAModel.length > 0) {
      qsobj['cba'] = this.wdSubjectToCBAModel;
    }

    //wd previously performed param
    if (this.wdPreviouslyPerformedModel.length > 0) {
      qsobj['prevP'] = this.wdPreviouslyPerformedModel;
    }

    //awardType param
    if (this.awardIDVModel.length > 0) {
      qsobj['awardOrIdv'] = this.awardIDVModel;
    }

    if (this.awardTypeModel.length > 0) {
      qsobj['awardType'] = this.awardTypeModel;
    }

    if (this.contractTypeModel.length > 0) {
      qsobj['contractType'] = this.contractTypeModel;
    }

    if (this.naicsTypeModel.length > 0) {
      qsobj['naics'] = this.naicsTypeModel;
    }

    if (this.pscTypeModel.length > 0) {
      qsobj['psc'] = this.pscTypeModel;
    }

    if (this.ro_keyword.length > 0) {
      qsobj['ro_keyword'] = this.ro_keyword;
    }

    if (this.dunsModelList.length > 0) {
      qsobj['duns'] = this.dunsListString;
    }

    if (this.benElSearchString.length > 0) {
      qsobj['beneficiary'] = this.benElSearchString;
    }

    if (this.appElSearchString.length > 0) {
      qsobj['applicant'] = this.appElSearchString;
    }

    if (this.functionalCodesModel && this.functionalCodesModel.length > 0) {
      qsobj['functionalCodes'] = this.functionalCodesModel;
    }

    if (this.assistanceTypeFilterModel.length > 0) {
      qsobj['assistanceType'] = this.assistanceTypeFilterModel;
    }

    if (this.registrationExclusionCheckboxModel.length > 0) {
      qsobj['entityType'] = this.registrationExclusionCheckboxModel;
    }


    return qsobj;
  }

  runSearch() {
    switch (this.index) {
      // fetching data for drop downs
      case 'wd':
        this.getDictionaryData('wdStates');
        this.getCountyByState(this.wdStateModel);
        this.determineEnableCountySelect();
        this.determineEnableServicesSelect();
        this.getDictionaryData('dbraConstructionTypes');
        this.getDictionaryData('scaServices');
        break;
      case 'opp':
      case 'ei':
      case 'fpds':
        this.getAwardsDictionaryData('naics_code');
        this.getAwardsDictionaryData('classification_code');
        break;
      case 'cfda':
        this.getProgramsDictionaryData('applicant_types');
        this.getProgramsDictionaryData('beneficiary_types');
        this.getProgramsDictionaryData('functional_codes');
        this.getProgramsDictionaryData('assistance_type');
        break;
      default:
        this.dismissWdAlert = false;
    }

    //make featuredSearch api call only for first page
    if (this.pageNum <= 0 && this.keyword !== '' && (!this.index || this.index == 'fh' || this.index == 'fpds')) {
      this.searchService.featuredSearch({
        keyword: this.keyword
      }).subscribe(
        data => {
          if (data._embedded && data._embedded.featuredResult) {
            for (var i = 0; i < data._embedded.featuredResult.length; i++) {
              if (data._embedded.featuredResult[i].parentOrganizationHierarchy) {
                data._embedded.featuredResult[i].parentOrganizationHierarchy.name = new CapitalizePipe().transform(data._embedded.featuredResult[i].parentOrganizationHierarchy.name.replace(/[_-]/g, " "));
              }
              if (data._embedded.featuredResult[i].type) {
                data._embedded.featuredResult[i].type = new CapitalizePipe().transform(data._embedded.featuredResult[i].type);
              }
            }
            this.featuredData = data._embedded;
          } else {
            this.featuredData['featuredResult'] = null;
          }
        },
        error => {
          this.featuredData = [];
          console.error("No featured results", error);
        }
      );
    } else {
      this.featuredData['featuredResult'] = null;
    }

    //make api call
    this.searchService.runSearch({
      keyword: this.keyword,
      index: this.index,
      pageNum: this.pageNum,
      organizationId: this.organizationId,
      isActive: this.isActive,
      wdType: this.wdTypeModel,
      conType: this.wdConstructModel,
      state: this.wdStateModel,
      county: this.wdCountyModel,
      service: this.wdNonStandardSelectModel,
      isEven: this.wdNonStandardRadModel,
      isStandard: this.isStandard,
      awardOrIdv: this.awardIDVModel,
      awardType: this.awardTypeModel,
      contractType: this.contractTypeModel,
      naics: this.naicsTypeModel,
      psc: this.pscTypeModel,
      showRO: this.showRegionalOffices,
      ro_keyword: this.ro_keyword,
      duns: this.dunsListString,
      applicant: this.appElSearchString,
      beneficiary: this.benElSearchString,
      functionalCodes: this.functionalCodesModel,
      assistanceType: this.assistanceTypeFilterModel,
      entityType: this.registrationExclusionCheckboxModel
    }).subscribe(
      data => {
        if (data._embedded && data._embedded.results) {
          for (var i = 0; i < data._embedded.results.length; i++) {
            //Modifying FAL data
            if (data._embedded.results[i].fhNames) {
              if (!(data._embedded.results[i].fhNames instanceof Array)) {
                data._embedded.results[i].fhNames = [data._embedded.results[i].fhNames];
              }
            }
            //Modifying FH data
            if (data._embedded.results[i].parentOrganizationHierarchy) {
              if (data._embedded.results[i].parentOrganizationHierarchy.name.indexOf(".") > -1) {
                data._embedded.results[i].parentOrganizationHierarchy.name = data._embedded.results[i].parentOrganizationHierarchy.name.substring(0, data._embedded.results[i].parentOrganizationHierarchy.name.indexOf("."))
              }
              data._embedded.results[i].parentOrganizationHierarchy.name = new CapitalizePipe().transform(data._embedded.results[i].parentOrganizationHierarchy.name.replace(/[_-]/g, " "));
            }
            if (data._embedded.results[i]._type == "federalOrganization" && data._embedded.results[i].type) {
              data._embedded.results[i].type = new CapitalizePipe().transform(data._embedded.results[i].type);
            }
          }
          this.data = data._embedded;
          this.totalCount = data.page['totalElements'];
          var maxAllowedPages = data.page['maxAllowedRecords'] / this.showPerPage;
          this.totalPages = data.page['totalPages'] > maxAllowedPages ? maxAllowedPages : data.page['totalPages'];
        } else {
          this.data['results'] = null;
          this.totalCount = 0;
        }

        if (this.wdNonStandardRadModel === 'true' && this.wdPreviouslyPerformedModel === 'prevPerfNo') {
          this.data['results'] = null;
          this.totalCount = 0;
        }

        this.oldKeyword = this.keyword;
        this.initLoad = false;
        this.isSearchComplete = true;
      },
      error => {
        console.error("Error!!", error);
      }
    );
    //construct qParams to pass parameters to object view pages
    this.qParams = this.setupQS(false);
  }

  // get dictionary data from dictionary API for samselects and map the response array to properly set config options
  getDictionaryData(id) {
    this.wageDeterminationService.getWageDeterminationFilterData({
      ids: id
    }).subscribe(
      data => {

        let defaultSelection = {value: '', label: 'Default option', name: 'empty', disabled: false};

        // formatting the array data according to api type to match what UI elements expect
        // state data
        if (id === 'wdStates') {
          var reformattedArray = data._embedded.dictionaries[0].elements.map(function (stateItem) {
            let newObj = {label: '', value: ''};

            newObj.label = stateItem.value;
            newObj.value = stateItem.elementId;
            return newObj;
          });
          // adding the default selection row to the array
          reformattedArray.unshift(defaultSelection);
          this.selectStateConfig.options = reformattedArray;
        }

        // construction type data
        else if (id === 'dbraConstructionTypes') {
          var reformattedArray = data._embedded.dictionaries[0].elements.map(function (constructionItem) {
            let newObj = {label: '', value: ''};

            newObj.label = constructionItem.value;
            newObj.value = constructionItem.value;
            return newObj;
          });
          // adding the default selection row to the array
          reformattedArray.unshift(defaultSelection);
          this.selectConstructConfig.options = reformattedArray;
        }

        // scaServices type data
        else if (id === 'scaServices') {
          var reformattedArray = data._embedded.dictionaries[0].elements.map(function (serviceItem) {
            let newObj = {label: '', value: ''};

            newObj.label = serviceItem.value;
            newObj.value = serviceItem.elementId;
            return newObj;
          });
          // adding the default selection row to the array
          reformattedArray.unshift(defaultSelection);
          this.wdNonStandardSelectConfig.options = reformattedArray;
        }

      },
      error => {
        console.error("Error!!", error);
      }
    );
  }

  // gets county data back depending on state provided
  getCountyByState(state) {


    this.wageDeterminationService.getWageDeterminationFilterCountyData({
      state: state
    }).subscribe(
      data => {
        // county data
        let defaultSelection = {value: '', label: 'Default option', name: 'empty', disabled: false};

        var reformattedArray = data._embedded.dictionaries[0].elements.map(function (countyItem) {
          let newObj = {label: '', value: ''};
          newObj.label = countyItem.value;
          newObj.value = countyItem.elementId;
          return newObj;
        });

        reformattedArray = new SortArrayOfObjects().transform(reformattedArray, 'label');

        // adding the default selection row to the array
        reformattedArray.unshift(defaultSelection);
        this.selectCountyConfig.options = reformattedArray;
      },
      error => {
        console.error("Error!!", error);
      }
    );
  }

  getAwardsDictionaryData(id) {
    this.opportunityService.getOpportunityDictionary(id).subscribe(
      data => {
        // formatting the array data according to api type to match what UI elements expect
        if (id === 'naics_code') {
          var reformattedArray = data._embedded.dictionaries[0].elements.map(function (naicsItem) {
            let newObj = {label: '', value: '', type: 'naics'};

            newObj.label = naicsItem.value;
            newObj.value = naicsItem.code;
            return newObj;
          });

          this.naicsType.options = reformattedArray;
          this.naicsType = Object.assign({}, this.naicsType);
        }

        if (id === 'classification_code') {
          var reformattedArray = data._embedded.dictionaries[0].elements.map(function (pscItem) {
            let newObj = {label: '', value: '', type: 'psc'};

            newObj.label = pscItem.value;
            newObj.value = pscItem.code;
            return newObj;
          });

          this.pscType.options = reformattedArray;
          this.pscType = Object.assign({}, this.pscType);
        }

      },
      error => {
        console.error("Error!!", error);
      }
    );
  }

  getProgramsDictionaryData(id) {
    this.programDictionariesService.getDictionaryById(id).subscribe(
      data => {
        // formatting the array data according to api type to match what UI elements expect
        if (id === 'applicant_types') {
          var reformattedArray = data['applicant_types'].map(function (item) {
            let newObj = {label: '', value: '', type: 'applicant'};

            newObj.label = item.displayValue;
            newObj.value = item.code;
            return newObj;
          });

          this.appElType.options = reformattedArray;
          this.appElType = Object.assign({}, this.appElType);
        }

        if (id === 'beneficiary_types') {
          var reformattedArray = data['beneficiary_types'].map(function (item) {
            let newObj = {label: '', value: '', type: 'beneficiary'};

            newObj.label = item.displayValue;
            newObj.value = item.code;
            return newObj;
          });

          this.benElType.options = reformattedArray;
          this.benElType = Object.assign({}, this.benElType);
        }

        if (id === 'functional_codes') {
          let finalArray = [];

          for (let dataItem of data['functional_codes']) {
            var reformattedArray = dataItem['elements'].map(function (item) {
              let newObj = {label: '', value: ''};

              newObj.label = item.displayValue;
              newObj.value = item.element_id;
              return newObj;
            });
            finalArray = finalArray.concat(reformattedArray);
          }

          this.functionalCodesType.options = finalArray;
          this.functionalCodesType = Object.assign({}, this.functionalCodesType);
        }

        if (id === 'assistance_type') {

          let inputArr = [];
          var reformattedArray = data['assistance_type'].map(function (item) {

            let newObj = {label: '', value: '', type: 'assistance_type'};
            for (var elements of item.elements) {
              newObj.label = item.code + " - " + elements.value;
              newObj.value = elements.element_id;
              inputArr.push({
                label: newObj.label,
                value: newObj.value
              });
            }

          });
          reformattedArray = inputArr;
          this.assistanceTypeOptions.options = reformattedArray;
          this.assistanceTypeOptions = Object.assign({}, this.assistanceTypeOptions);
        }

      },
      error => {
        console.error("Error!!", error);
      }
    )
  }

  pageChange(pagenumber) {
    this.pageNum = pagenumber;
    var qsobj = this.setupQS(false);
    let navigationExtras: NavigationExtras = {
      queryParams: qsobj
    };

    document.getElementById('search-results').getElementsByTagName('div')[0].focus();
    if (this.showRegionalOffices) {
      this.router.navigate(['/search/fal/regionalOffices'], navigationExtras);
    } else {
      this.router.navigate(['/search'], navigationExtras);
    }

  }

  // FILTER SELECTION CHANGE FUNCTIONS

  activeFilter(event) {
    this.isActive = !this.isActive;
    this.pageNum = 0;
    this.searchResultsRefresh()
  }

  registrationExclusionCheckboxFilter(event){
    this.registrationExclusionCheckboxModel = event;
    this.pageNum=0;
    this.searchResultsRefresh();
  }

  checkValidEntityTypeFilter(){
    return this.checkValidRegistrationFilter() || this.checkValidExclusionFilter() || this.checkMultipleFiltersEntityType();
  }

  checkValidExclusionFilter(){
    return this.registrationExclusionCheckboxModel.indexOf('ex') > -1 && this.registrationExclusionCheckboxModel.length == 1 && this.checkValidFilterExists();
  }

  checkValidRegistrationFilter(){
    return this.registrationExclusionCheckboxModel.indexOf('ent') > -1 && this.registrationExclusionCheckboxModel.length == 1 && this.organizationId.length > 0;
  }

  checkMultipleFiltersEntityType(){
    if(this.registrationExclusionCheckboxModel.length == 0 || this.registrationExclusionCheckboxModel.length ==2){
      return this.organizationId.length > 0 && (this.pscTypeModel.length > 0 || this.naicsTypeModel.length > 0 || this.dunsListString.length > 0);
    }
    return false;
  }


  checkValidFilterExists(){
    return this.dunsListString.length > 0 || this.naicsTypeModel.length >0 || this.pscTypeModel.length > 0;

  }
  // event for wdFilter Change
  wdFilterChange(event) {

    // set the models equal to empty if the opposite wd type is selected
    if (this.wdTypeModel === 'sca') {
      this.wdConstructModel = '';
    }
    else {
      this.wdNonStandardRadModel = '';
      this.wdNonStandardSelectModel = '';
      this.wdPreviouslyPerformedModel = '';
      this.wdSubjectToCBAModel = '';
    }
    this.pageNum = 0;
    this.getDictionaryData('dbraConstructionTypes');

    this.searchResultsRefresh()
  }

  // event for construction type change
  constructionTypeChange(event) {
    this.pageNum = 0;

    if (this.wdConstructModel) {
      this.alertFooterService.registerFooterAlert({
        title: "Search Criteria Complete",
        description: "",
        type: "success",
        timer: 5000
      });
    }

    this.searchResultsRefresh()
  }

  // event for state change
  stateChange(event) {

    // reset county model on state change
    this.wdCountyModel = '';
    this.pageNum = 0;

    // enable county select if needed
    this.determineEnableCountySelect();

    // call method to get county data per state
    this.getCountyByState(this.wdStateModel);

    this.searchResultsRefresh()
  }

  countyChange(event) {
    this.pageNum = 0;

    this.searchResultsRefresh()
  }

  // determines if state is populated and if not disables county select
  determineEnableCountySelect() {
    if (this.wdStateModel !== '') {
      this.selectCountyConfig.disabled = false;
    }
    else {
      this.selectCountyConfig.disabled = true;
    }
  }

  // determines if non standard rad selected, if not disables nonstandard select
  determineEnableServicesSelect() {
    if (this.wdNonStandardRadModel === 'yesNSS' || this.wdNonStandardRadModel === '') {
      this.wdNonStandardSelectConfig.disabled = false;
    }
    else {
      this.wdNonStandardSelectConfig.disabled = true;
    }
  }

  // previously performed selection
  wdPreviouslyPerformedChanged(event) {
    // if previously performed is no, we must set subject to cba model to empty
    if (this.wdPreviouslyPerformedModel === 'prevPerfNo') {
      this.wdSubjectToCBAModel = '';
    }

    // only for updating the url here
    this.searchResultsRefresh();
  }

  // subject to change selection
  wdSubjectToCBAChanged(event) {
    // if the subject to change selection is based or unbased yes show modal success message
    if (this.wdSubjectToCBAModel === 'yesBasedCBA' || this.wdSubjectToCBAModel === 'yesUnbasedCBA') {
      this.alertFooterService.registerFooterAlert({
        title: "Search Criteria Complete",
        description: "",
        type: "success",
        timer: 3000
      });
    }

    // only for updating the url here
    this.searchResultsRefresh();
  }

  // non standard services radio button selection
  wdNonStandardRadChanged(event) {
    // check if services should be disabled/enabled
    this.determineEnableServicesSelect();

    // if the non standard rad selection does not equal yes, services filter must be removed
    if (this.wdNonStandardRadModel !== 'yesNSS') {
      this.wdNonStandardSelectModel = '';
    }

    // determine isStandard filter
    if (this.wdNonStandardRadModel === 'yesNSS') {
      this.isStandard = 'false';
    }
    else if (this.wdNonStandardRadModel === 'true' || this.wdNonStandardRadModel === 'false') {
      this.isStandard = 'true';
    }
    else {
      this.isStandard = '';
    }

    // show end of filters notification
    if (this.wdNonStandardRadModel) {
      if (this.alertFooterService.getAlerts().length < 1) {
        // show end of filters notification
        this.alertFooterService.registerFooterAlert({
          title: "Search Criteria Complete",
          description: "",
          type: "success",
          timer: 3000
        });
      }
    }

    this.pageNum = 0;
    this.searchResultsRefresh();

  }

  // non standard services drop down selection
  wdNonStandardSelectChanged(event) {
    // if drop down selection made, auto-select yes rad button
    if (this.wdNonStandardSelectModel !== '') {
      this.wdNonStandardRadModel = 'yesNSS'
    }

    // show end of filters notification
    if (this.wdNonStandardSelectModel) {
      // show end of filters notification
      this.alertFooterService.registerFooterAlert({
        title: "Search Criteria Complete",
        description: "",
        type: "success",
        timer: 3000
      });
    }

    this.pageNum = 0;
    this.searchResultsRefresh();
  }

  //Award model change events
  awardIDVRadChanged(evt) {
    this.awardIDVModel = evt;
    this.pageNum = 0;
    this.searchResultsRefresh();
  }

  awardTypeSelected(evt) {
    this.awardTypeModel = evt.toString();
    this.pageNum = 0;
    this.searchResultsRefresh();
  }

  contractTypeSelected(evt) {
    this.contractTypeModel = evt.toString();
    this.pageNum = 0;
    this.searchResultsRefresh();
  }

  naicsTypeSelected(evt) {
    this.naicsTypeModel = evt.toString();
    this.pageNum = 0;
    this.searchResultsRefresh();
  }

  pscTypeSelected(evt) {
    this.pscTypeModel = evt.toString();
    this.pageNum = 0;
    this.searchResultsRefresh();
  }

  benElSelected(evt) {
    this.benElSearchString = evt.toString();
    this.pageNum = 0;
    this.searchResultsRefresh();
  }

  appElSelected(evt) {
    this.appElSearchString = evt.toString();
    this.pageNum = 0;
    this.searchResultsRefresh();
  }

  functionalCodeSelected(evt) {
    this.functionalCodesModel = evt.toString();
    this.pageNum = 0;
    this.searchResultsRefresh();
  }

  assistanceTypeFilterSelected(evt) {
    this.assistanceTypeFilterModel = evt.toString();
    this.pageNum = 0;
    this.searchResultsRefresh();
  }

  // this calls function to set up ES query params again and re-call the search endpoint with updated params
  searchResultsRefresh() {
    var qsobj = this.setupQS(false);
    let navigationExtras: NavigationExtras = {
      queryParams: qsobj
    };
    if (this.showRegionalOffices) {
      this.router.navigate(['/search/fal/regionalOffices'], navigationExtras);
    } else {
      this.router.navigate(['/search'], navigationExtras);
    }
  }

  wdTypeRadClear() {
    this.wdTypeModel = '';

    this.wdPreviouslyPerformedClear();
    this.wdConstructionClear();
    this.pageNum = 0;
  }

  wdConstructionClear() {
    this.wdConstructModel = '';
    this.pageNum = 0;

    this.searchResultsRefresh()
  }

  wdPreviouslyPerformedClear() {
    this.wdPreviouslyPerformedModel = '';
    this.pageNum = 0;

    // cba should also be cleared if prev performed is cleared
    this.wdSubjectToCBAClear();
  }

  wdSubjectToCBAClear() {
    this.wdSubjectToCBAModel = '';
    this.pageNum = 0;

    // non standard services should also be cleared if cba is
    this.wdNonStandardServicesSelectClear();
  }

  wdNonStandardServicesSelectClear() {
    this.wdNonStandardSelectModel = '';
    this.wdNonStandardRadModel = '';
    this.pageNum = 0;

    this.searchResultsRefresh();
  }

  wdStateCountyClear() {
    this.wdStateModel = '';
    this.wdCountyModel = '';
    this.searchResultsRefresh();
  }

  awardIdvFilterClear() {
    this.awardIDVModel = '';
    this.awardTypeModel = '';
    this.contractTypeModel = '';
    this.searchResultsRefresh();
  }

  naicsPscFilterClear() {
    this.naicsTypeModel = '';
    this.pscTypeModel = '';
    this.searchResultsRefresh();
  }

  dunsFilterClear() {
    this.dunsModelList = [];
    this.dunsModel = '';
    this.dunsListString = '';
    this.searchResultsRefresh();
  }

  eligibilityFilterClear() {
    this.appElSearchString = '';
    this.benElSearchString = '';
    this.searchResultsRefresh();
  }

  assistanceTypeFilterClear() {
    this.assistanceTypeFilterModel = '';
    this.searchResultsRefresh();
  }

  functionalCodesFilterClear() {
    this.functionalCodesModel = '';
    this.searchResultsRefresh();
  }

  clearAllFilters() {

    // clear/reset all top level filters
    this.isActive = true;

    // call wd clear filters
    this.wdStateModel = '';
    this.wdCountyModel = '';

    // each clear calls the clear method beneath it, so all depencies are cleared
    this.wdTypeRadClear();

    // call clear for agency picker
    if (this.agencyPicker) {
      this.agencyPicker.resetBrowse();

      // clear the selected organizations
      this.agencyPicker.onResetClick();

      // clear the keyword search
      this.agencyPicker.clearSelectedOrgs();
    }

    // call awards clear filters
    this.awardIDVModel = '';
    this.awardTypeModel = '';
    this.contractTypeModel = '';
    this.naicsTypeModel = '';
    this.pscTypeModel = '';

    //clear regional office filter
    this.ro_keyword = '';

    // clear duns filter
    this.dunsModelList = [];
    this.dunsModel = '';
    this.dunsListString = '';

    // clear eligibility filter
    this.appElSearchString = '';
    this.benElSearchString = '';

    //clear assistance type filter
    this.assistanceTypeFilterModel = '';

    // clear functional codes filter
    this.functionalCodesModel = '';

    //set entity type checkbox to default
    if(this.index == 'ei'){
      this.registrationExclusionCheckboxModel=["ent","ex"];
    }


    this.searchResultsRefresh();

  }

  regionalOfficeSearchEvent(evt) {
    if (!evt) {
      this.ro_keyword = "";
    } else {
      this.ro_keyword = evt;
    }
    this.pageNum = 0;
    this.searchResultsRefresh();
  }

  dunsModelChange(event) {
    this.dunsModelList = event;
    this.dunsListString = this.dunsModelList.map((dunsObj) => {
      return dunsObj.value;
    }).join(',');
    this.pageNum = 0;
    this.searchResultsRefresh();
  }

  grabPersistData(dunsString: string) {
    let builtString = '';

    // check if persist data needs to make an api call or not
    if (this.dunsModelList.length > 0) {

      // build comma separated list of strings from dunsModelList
      builtString = this.dunsModelList.reduce((acc, curr) => {
        return acc === '' ? curr.value : acc + ',' + curr.value;
      }, '');

      // compare built list against list from url if they aren't the same, make an api call
      if (this.dunsListString !== builtString) {
        // api call to grab entities for filter list
        this.searchDictionariesService.dunsPersistGrabber(dunsString)
          .subscribe(
            data => {
              this.dunsModelList = data;
            },
            error => {
              console.error("Error!!", error);
            }
          );
      }

    }
    else {
      this.searchDictionariesService.dunsPersistGrabber(dunsString)
        .subscribe(
          data => {
            this.dunsModelList = data;
          },
          error => {
            console.error("Error!!", error);
          }
        );
    }
  }


}
