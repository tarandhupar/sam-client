import { Component,OnInit, ViewChild } from '@angular/core';
import { Router,NavigationExtras,ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import { SearchService } from 'api-kit';
import { CapitalizePipe } from '../app-pipes/capitalize.pipe';
import {WageDeterminationService} from "../../api-kit/wage-determination/wage-determination.service";
import { AlertFooterService } from '../alerts/alert-footer';
import {OpportunityService} from "../../api-kit/opportunity/opportunity.service";
import {SortArrayOfObjects} from "../app-pipes/sort-array-object.pipe";

@Component({
  moduleId: __filename,
  selector: 'search',
  providers: [CapitalizePipe],
  templateUrl: 'search.template.html'
})

export class SearchPage implements OnInit{
  keyword: string = "";
  index: string = "";
  organizationId:string = '';
  previousStringList:string = '';
  pageNum = 0;
  totalCount: any= 0;
  totalPages: any= 0;
  showPerPage = 10;
  data = [];
  featuredData = [];
  oldKeyword: string = "";
  initLoad = true;
  showOptional:any = (SHOW_OPTIONAL=="true");
  qParams:any = {};
  isActive: boolean = true;
  isStandard: string = '';
  showRegionalOffices: boolean = false;
  ro_keyword: string = "";

  @ViewChild('agencyPicker') agencyPicker;

  // Active Checkbox config
  checkboxModel: any = ['true'];
  checkboxConfig = {
    options: [
      {value: 'true', label: 'Active', name: 'checkbox-active'},
    ],
    name: 'active-filter'
  };

  // Wage Determination Radio Component
  wdTypeModel = '';
  wdTypeConfig = {
    options:  [
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
      {value:'', label: 'Default option', name: 'empty', disabled: true},
    ],
    disabled: false,
    label: 'Select State',
    name: 'state',
  };

  // Select County Component
  wdCountyModel = '';
  selectCountyConfig = {
    options: [
      {value:'', label: 'Default option', name: 'empty', disabled: true},
    ],
    disabled: false,
    label: 'Select County',
    name: 'county',
  };

  // Select Construct Type Component drop-down
  wdConstructModel = '';
  selectConstructConfig = {
    options: [
      {value:'', label: 'Default option', name: 'empty', disabled: true},
    ],
    disabled: false,
    label: 'Select Construction Type',
    name: 'constructionType',
  };

  // Select SCA Previously Performed Radio Buttons
  wdPreviouslyPerformedModel = '';
  wdPreviouslyPerformedConfig = {
    options:  [
      {value: 'prevPerfYesLocality', label: 'Yes, in the same locality', name: 'prevYesLocality'},
      {value: 'prevPerfYesDifferentLocality', label: 'Yes, but in a different locality', name: 'prevYesDifferentLocality'},
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
    options:  [
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
    options:  [
      {value: 'yesNSS', label: 'Yes', name: '6'},
      {value: 'true', label: 'No, and the SCA WD ends in an even number', name: 'noEven'},
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
      {value:'', label: 'Default option', name: 'empty', disabled: true},
    ],
    disabled: false,
    label: 'If a service is chosen, "Yes" will automatically be selected',
    name: 'constructionType',
  };

  scaSearchDescription: string = "The Wage Determination filter asks a series of questions to determine if a WDOL is available based on your selected criteria. <br/><br/>Please note that using the keyword search with these WD type-specific filters may limit your search results.<br/><br/> If you cannot locate a Wage Determination, try searching with no keywords and use the Wage Determination filters to find your result. <br><br><b>If you would like to request a SCA contract action, click <a href='https://www.dol.gov/whd/govcontracts/sca/sf98/index.asp'>here</a> to submit an e98 form.</b>"
  wdSearchDescription: string = "The Wage Determination filter asks a series of questions to determine if a WDOL is available based on your selected criteria. <br/><br/>Please note that using the keyword search with these WD type-specific filters may limit your search results.<br/><br/> If you cannot locate a Wage Determination, try searching with no keywords and use the Wage Determination filters to find your result."

  //Select Award Types
  awardIDVModel: string = '';
  awardIDVRadConfig = {
    options:  [
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
    "name": "Award-IDV Type",
    "placeholder": "Search Award-IDV Types",
    "selectedLabel": "Award - IDV Types Selected",
    "options": [
      { label: 'BOA (IDV)', value: 'D_IDV', name: 'BOA' },
      { label: 'BPA CALL', value: 'A_AWARD', name: 'BPA CALL' },
      { label: 'BPA (IDV)', value: 'E_IDV', name: 'BPA' },
      { label: 'COOPERATIVE AGREEMENT', value: 'F_AWARD', name: 'COOPERATIVE AGREEMENT' },
      { label: 'DELIVERY ORDER', value: 'C_AWARD', name: 'DELIVERY ORDER' },
      { label: 'DEFINITIVE CONTRACT', value: 'D_AWARD', name: 'DEFINITIVE CONTRACT' },
      { label: 'FUNDED SPACE ACT AGREEMENT', value: 'S_AWARD', name: 'FUNDED SPACE ACT AGREEMENT' },
      { label: 'FSS (IDV)', value: 'C_IDV', name: 'FSS' },
      { label: 'GRANT FOR RESEARCH', value: 'G_AWARD', name: 'GRANT FOR RESEARCH' },
      { label: 'GWAC (IDV)', value: 'A_IDV', name: 'GWAC' },
      { label: 'IDC (IDV)', value: 'B_IDV', name: 'IDC' },
      { label: 'OTHER TRANSACTION ORDER', value: 'O_AWARD', name: 'OTHER TRANSACTION ORDER' },
      { label: 'OTHER TRANSACTION AGREEMENT', value: 'R_AWARD', name: 'OTHER TRANSACTION AGREEMENT' },
      { label: 'OTHER TRANSACTION (IDV)', value: 'O_IDV', name: 'OTHER TRANSACTION IDV' },
      { label: 'PURCHASE ORDER', value: 'B_AWARD', name: 'PURCHASE ORDER' },
      { label: 'TRAINING GRANT', value: 'T_AWARD', name: 'TRAINING GRANT' }
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
    "name": "Contract Type",
    "placeholder": "Search Contract Types",
    "selectedLabel": "Contract Types Selected",
    "options": [
      { label: 'COST NO FEE', value: 'S', name: 'COST NO FEE' },
      { label: 'COST PLUS AWARD FEE', value: 'R', name: 'COST PLUS AWARD FEE' },
      { label: 'COST PLUS FIXED FEE', value: 'U', name: 'COST PLUS FIXED FEE' },
      { label: 'COST PLUS INCENTIVE FEE', value: 'V', name: 'COST PLUS INCENTIVE FEE' },
      { label: 'COST SHARING', value: 'T', name: 'COST SHARING' },
      { label: 'FIRM FIXED PRICE', value: 'J', name: 'FIRM FIXED PRICE' },
      { label: 'FIXED PRICE', value: 'J', name: 'FIXED PRICE' },
      { label: 'FIXED PRICE AWARD FEE', value: 'M', name: 'FIXED PRICE AWARD FEE' },
      { label: 'FIXED PRICE INCENTIVE', value: 'L', name: 'FIXED PRICE INCENTIVE' },
      { label: 'FIXED PRICE LEVEL OF EFFORT', value: 'B', name: 'FIXED PRICE LEVEL OF EFFORT' },
      { label: 'FIXED PRICE REDETERMINATION', value: 'A', name: 'FIXED PRICE REDETERMINATION' },
      { label: 'FIXED PRICE WITH ECONOMIC PRICE ADJUSTMENT', value: 'K', name: 'FIXED PRICE WITH ECONOMIC PRICE ADJUSTMENT' },
      { label: 'LABOR HOURS', value: 'Z', name: 'LABOR HOURS' },
      { label: 'ORDER DEPENDENT (IDV ALLOWS PRICING ARRANGEMENT TO BE DETERMINED SEPARATELY FOR EACH ORDER)', value: '1', name: 'ORDER DEPENDENT (IDV ALLOWS PRICING ARRANGEMENT TO BE DETERMINED SEPARATELY FOR EACH ORDER)'},
      { label: 'TIME AND MATERIALS', value: 'Y', name: 'TIME AND MATERIALS'},
      { label: 'OTHER (APPLIES TO AWARDS WHERE NONE OF THE ABOVE APPLY)', value: '3', name: 'OTHER (APPLIES TO AWARDS WHERE NONE OF THE ABOVE APPLY)' },
      { label: 'COMBINATION (APPLIES TO AWARDS WHERE TWO OR MORE OF THE ABOVE APPLY)', value: '2', name: 'COMBINATION (APPLIES TO AWARDS WHERE TWO OR MORE OF THE ABOVE APPLY)' }
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

  regionalType = {
    "placeholder": "Regional Agency Location",
    "addOnIconClass": "fa fa-search"
  }

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private searchService: SearchService,
              private wageDeterminationService: WageDeterminationService,
              private opportunityService: OpportunityService,
              private alertFooterService: AlertFooterService) { }
  ngOnInit() {
    if(window.location.pathname.localeCompare("/search/fal/regionalOffices") === 0){
      this.showRegionalOffices = true;
    } else{
      this.showRegionalOffices = false;
    }

    this.activatedRoute.queryParams.subscribe(
      data => {
        this.keyword = typeof data['keyword'] === "string" ? decodeURI(data['keyword']) : this.keyword;
        this.index = typeof data['index'] === "string" ? decodeURI(data['index']) : this.index;
        this.pageNum = typeof data['page'] === "string" && parseInt(data['page'])-1 >= 0 ? parseInt(data['page'])-1 : this.pageNum;
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

        this.runSearch();
        this.loadParams();
      });
  }

  loadParams(){
    var qsobj = this.setupQS(false);
    this.searchService.loadParams(qsobj);
  }

  // handles 'organization' emmitted event from agency picker
  onOrganizationChange(orgId:any){

    let organizationStringList = '';

    let stringBuilderArray = orgId.map(function (organizationItem) {
      if(organizationStringList === ''){
        organizationStringList += organizationItem.value;
      }
      else{
        organizationStringList += ',' + organizationItem.value;
      }

      return organizationStringList;
    });

    this.previousStringList = this.organizationId;

    // storing current organization string list
    this.organizationId = organizationStringList;

    // we only want to change page number when the organization list has changed
    if(this.previousStringList !== this.organizationId){
      this.pageNum = 0;
    }

    this.searchResultsRefresh();

  }

  setupQS(newsearch){
    var qsobj = {};
    if(this.keyword.length>0){
      qsobj['keyword'] = this.keyword;
    } else {
      qsobj['keyword'] = '';
    }

    if(this.index.length>0){
      qsobj['index'] = this.index;
    } else {
      qsobj['index'] = '';
    }

    if(!newsearch && this.pageNum>=0){
      qsobj['page'] = this.pageNum+1;
    }
    else {
      qsobj['page'] = 1;
    }
    qsobj['isActive'] = this.isActive;

    //wd or sca type param
    if(this.wdTypeModel.length>0) {
      qsobj['wdType'] = this.wdTypeModel;
    }

    //wd dba construction type param
    if(this.wdConstructModel.length>0){
      qsobj['conType'] = this.wdConstructModel;
    }

    //wd state param
    if(this.wdStateModel.length>0){
      qsobj['state'] = this.wdStateModel;
    }

    //wd county param
    if(this.wdCountyModel.length>0){
      qsobj['county'] = this.wdCountyModel;
    }

    if(this.organizationId.length>0){
      qsobj['organizationId'] = this.organizationId;
    }

    //wd Non Standard drop down param
    if(this.wdNonStandardSelectModel.length>0){
      qsobj['service'] = this.wdNonStandardSelectModel;
    }

    //wd Non Standard radio button param
    if(this.wdNonStandardRadModel.length>0){
      qsobj['isEven'] = this.wdNonStandardRadModel;
      // this rad button determins isStandard as well
      qsobj["isStandard"] = this.isStandard;
    }

    //wd subject to cba param
    if(this.wdSubjectToCBAModel.length>0){
      qsobj['cba'] = this.wdSubjectToCBAModel;
    }

    //wd previously performed param
    if(this.wdPreviouslyPerformedModel.length>0){
      qsobj['prevP'] = this.wdPreviouslyPerformedModel;
    }

    //awardType param
    if(this.awardIDVModel.length>0){
      qsobj['awardOrIdv'] = this.awardIDVModel;
    }

    if(this.awardTypeModel.length>0){
      qsobj['awardType'] = this.awardTypeModel;
    }

    if(this.contractTypeModel.length>0){
      qsobj['contractType'] = this.contractTypeModel;
    }

    if(this.naicsTypeModel.length>0){
      qsobj['naics'] = this.naicsTypeModel;
    }

    if(this.pscTypeModel.length>0){
      qsobj['psc'] = this.pscTypeModel;
    }

    if(this.ro_keyword.length>0){
      qsobj['ro_keyword'] = this.ro_keyword;
    }

    return qsobj;
  }

	runSearch(){
    switch(this.index) {
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
      case 'ent':
      case 'fpds':
            this.getAwardsDictionaryData('naics_code');
            this.getAwardsDictionaryData('classification_code');
    }

    //make featuredSearch api call only for first page
    if(this.pageNum<=0 && this.keyword!=='') {
      this.searchService.featuredSearch({
        keyword: this.keyword
      }).subscribe(
        data => {
          if(data._embedded && data._embedded.featuredResult) {
            for(var i=0; i<data._embedded.featuredResult.length; i++) {
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
      wdType : this.wdTypeModel,
      conType : this.wdConstructModel,
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
      ro_keyword: this.ro_keyword
    }).subscribe(
      data => {
        if(data._embedded && data._embedded.results){
          for(var i=0; i<data._embedded.results.length; i++) {
            //Modifying FAL data
            if(data._embedded.results[i].fhNames){
              if(!(data._embedded.results[i].fhNames instanceof Array)){
                data._embedded.results[i].fhNames = [data._embedded.results[i].fhNames];
              }
            }
            //Modifying FH data
            if(data._embedded.results[i].parentOrganizationHierarchy) {
              if(data._embedded.results[i].parentOrganizationHierarchy.name.indexOf(".")>-1) {
                data._embedded.results[i].parentOrganizationHierarchy.name = data._embedded.results[i].parentOrganizationHierarchy.name.substring(0, data._embedded.results[i].parentOrganizationHierarchy.name.indexOf("."))
              }
              data._embedded.results[i].parentOrganizationHierarchy.name = new CapitalizePipe().transform(data._embedded.results[i].parentOrganizationHierarchy.name.replace(/[_-]/g, " "));
            }
            if(data._embedded.results[i]._type=="federalOrganization" && data._embedded.results[i].type) {
              data._embedded.results[i].type = new CapitalizePipe().transform(data._embedded.results[i].type);
            }
          }
          this.data = data._embedded;
          this.totalCount = data.page['totalElements'];
          var maxAllowedPages = data.page['maxAllowedRecords']/this.showPerPage;
          this.totalPages = data.page['totalPages']>maxAllowedPages?maxAllowedPages:data.page['totalPages'];
        } else{
          this.data['results'] = null;
          this.totalCount = 0;
        }

        this.oldKeyword = this.keyword;
        this.initLoad = false;
      },
      error => {
        console.error("Error!!", error);
      }
    );
    //construct qParams to pass parameters to object view pages
    this.qParams = this.setupQS(false);
  }

  // get dictionary data from dictionary API for samselects and map the response array to properly set config options
  getDictionaryData(id){
    this.wageDeterminationService.getWageDeterminationFilterData({
     ids: id
    }).subscribe(
        data => {

          let defaultSelection = {value:'', label: 'Default option', name: 'empty', disabled: false};

          // formatting the array data according to api type to match what UI elements expect
          // state data
          if(id === 'wdStates'){
            var reformattedArray = data._embedded.dictionaries[0].elements.map(function(stateItem){
              let newObj = {label:'', value:''};

              newObj.label = stateItem.value;
              newObj.value = stateItem.elementId;
              return newObj;
            });
            // adding the default selection row to the array
            reformattedArray.unshift(defaultSelection);
            this.selectStateConfig.options = reformattedArray;
          }

          // construction type data
          else if(id === 'dbraConstructionTypes'){
            var reformattedArray = data._embedded.dictionaries[0].elements.map(function(constructionItem){
              let newObj = {label:'', value:''};

              newObj.label = constructionItem.value;
              newObj.value = constructionItem.value;
              return newObj;
            });
            // adding the default selection row to the array
            reformattedArray.unshift(defaultSelection);
            this.selectConstructConfig.options = reformattedArray;
          }

          // scaServices type data
          else if(id === 'scaServices'){
            var reformattedArray = data._embedded.dictionaries[0].elements.map(function(serviceItem){
              let newObj = {label:'', value:''};

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
  getCountyByState(state){


    this.wageDeterminationService.getWageDeterminationFilterCountyData({
      state: state
    }).subscribe(
      data => {
        // county data
        let defaultSelection = {value:'', label: 'Default option', name: 'empty', disabled: false};

        var reformattedArray = data._embedded.dictionaries[0].elements.map(function(countyItem){
          let newObj = {label:'', value:''};
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
        if(id === 'naics_code'){
          var reformattedArray = data._embedded.dictionaries[0].elements.map(function(naicsItem){
            let newObj = {label:'', value:'', type:'naics'};

            newObj.label = naicsItem.value;
            newObj.value = naicsItem.code;
            return newObj;
          });

          this.naicsType.options = reformattedArray;
          this.naicsType = Object.assign({}, this.naicsType);
        }

        if(id === 'classification_code'){
          var reformattedArray = data._embedded.dictionaries[0].elements.map(function(pscItem){
            let newObj = {label:'', value:'', type:'psc'};

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

  // event for wdFilter Change
  wdFilterChange(event){

    // set the models equal to empty if the opposite wd type is selected
    if(this.wdTypeModel === 'sca'){
      this.wdConstructModel = '';
    }
    else{
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
  constructionTypeChange(event){
    this.pageNum = 0;

    if(this.wdConstructModel){
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
  stateChange(event){

    // reset county model on state change
    this.wdCountyModel = '';
    this.pageNum = 0;

    // enable county select if needed
    this.determineEnableCountySelect();

    // call method to get county data per state
    this.getCountyByState(this.wdStateModel);

    this.searchResultsRefresh()
  }

  countyChange(event){
    this.pageNum = 0;

    this.searchResultsRefresh()
  }

  // determines if state is populated and if not disables county select
  determineEnableCountySelect(){
    if(this.wdStateModel !== ''){
      this.selectCountyConfig.disabled = false;
    }
    else{
      this.selectCountyConfig.disabled = true;
    }
  }

  // determines if non standard rad selected, if not disables nonstandard select
  determineEnableServicesSelect(){
    if(this.wdNonStandardRadModel === 'yesNSS' || this.wdNonStandardRadModel === ''){
      this.wdNonStandardSelectConfig.disabled = false;
    }
    else{
      this.wdNonStandardSelectConfig.disabled = true;
    }
  }

  // previously performed selection
  wdPreviouslyPerformedChanged(event){
    // if previously performed is no, we must set subject to cba model to empty
    if(this.wdPreviouslyPerformedModel === 'prevPerfNo'){
      this.wdSubjectToCBAModel = '';
    }

    // only for updating the url here
    this.searchResultsRefresh();
  }

  // subject to change selection
  wdSubjectToCBAChanged(event){
    // if the subject to change selection is based or unbased yes show modal success message
    if(this.wdSubjectToCBAModel === 'yesBasedCBA' || this.wdSubjectToCBAModel === 'yesUnbasedCBA'){
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
  wdNonStandardRadChanged(event){
    // check if services should be disabled/enabled
    this.determineEnableServicesSelect();

    // if the non standard rad selection does not equal yes, services filter must be removed
    if(this.wdNonStandardRadModel !== 'yesNSS'){
      this.wdNonStandardSelectModel = '';
    }

    // determine isStandard filter
    if(this.wdNonStandardRadModel === 'yesNSS'){
      this.isStandard = 'false';
    }
    else if(this.wdNonStandardRadModel === 'true' || this.wdNonStandardRadModel === 'false'){
      this.isStandard = 'true';
    }
    else{
      this.isStandard = '';
    }

    // show end of filters notification
    if(this.wdNonStandardRadModel){
      if(this.alertFooterService.getAlerts().length < 1){
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
  wdNonStandardSelectChanged(event){
    // if drop down selection made, auto-select yes rad button
    if(this.wdNonStandardSelectModel !== ''){
      this.wdNonStandardRadModel = 'yesNSS'
    }

    // show end of filters notification
    if(this.wdNonStandardSelectModel){
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
  awardIDVRadChanged(evt){
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

  // this calls function to set up ES query params again and re-call the search endpoint with updated params
  searchResultsRefresh(){
    var qsobj = this.setupQS(false);
    let navigationExtras: NavigationExtras = {
      queryParams: qsobj
    };
    if(this.showRegionalOffices){
      this.router.navigate(['/search/fal/regionalOffices'],navigationExtras);
    } else{
      this.router.navigate(['/search'],navigationExtras);
    }
  }

  wdTypeRadClear(){
    this.wdTypeModel = '';

    this.wdPreviouslyPerformedClear();
    this.wdConstructionClear();
    this.pageNum = 0;
  }

  wdConstructionClear(){
    this.wdConstructModel = '';
    this.pageNum = 0;

    this.searchResultsRefresh()
  }

  wdPreviouslyPerformedClear(){
    this.wdPreviouslyPerformedModel = '';
    this.pageNum = 0;

    // cba should also be cleared if prev performed is cleared
    this.wdSubjectToCBAClear();
  }

  wdSubjectToCBAClear(){
    this.wdSubjectToCBAModel = '';
    this.pageNum = 0;

    // non standard services should also be cleared if cba is
    this.wdNonStandardServicesSelectClear();
  }

  wdNonStandardServicesSelectClear(){
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

  clearAllFilters(){

    // clear/reset all top level filters
    this.isActive = true;

    // call wd clear filters
    this.wdStateModel = '';
    this.wdCountyModel = '';

    // each clear calls the clear method beneath it, so all depencies are cleared
    this.wdTypeRadClear();

    // call clear for agency picker
    if(this.agencyPicker){
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
    this.ro_keyword='';

    this.searchResultsRefresh();

  }

  regionalOfficeSearchEvent(evt) {
    this.ro_keyword = evt;
    this.pageNum = 0;
    this.searchResultsRefresh();
  }

}
