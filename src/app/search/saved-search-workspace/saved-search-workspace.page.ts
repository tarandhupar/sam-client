import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {Router, ActivatedRoute, NavigationExtras} from '@angular/router';
import * as Cookies from 'js-cookie';
import {IBreadcrumb} from "sam-ui-elements/src/ui-kit/types";
import {AlertFooterService} from "../../app-components/alert-footer/alert-footer.service";
import {SavedSearchService} from "../../../api-kit/search/saved-search.service";
import {DictionaryService} from "../../../api-kit/dictionary/dictionary.service";
import {FHService} from "../../../api-kit/fh/fh.service";
import * as _ from 'lodash';
import {SearchDictionariesService} from "../../../api-kit/search/search-dictionaries.service";

@Component({
  moduleId: __filename,
  templateUrl: 'saved-search-workspace.template.html',
  providers: []
})

export class SavedSearchWorkspacePage implements OnInit, OnDestroy {
  @ViewChild('selectDateFilter') selectDateFilter;
  private LAST_SAVED = 'last_saved';
  private LAST_RAN = 'last_ran';

  totalCount: any = 0;
  totalPages: any = 0;
  pageNum = 0;
  data = [];
  initLoad = true;
  qParams: any = {};
  size: any = {};
  cookieValue: string;
  runSearchSub: any;
  crumbs: Array<IBreadcrumb> = [
    {breadcrumb: 'Home', url: '/',},
    {breadcrumb: 'My Workspace', url: '/workspace'},
    {breadcrumb: 'Saved Search Workspace'}
  ];
  serviceErrorFooterAlertModel = {
    title: "Error",
    description: "",
    type: "error"
  };
  orgMap = new Map();
  applicantMap = new Map();
  beneficiaryMap = new Map();
  assistanceMap = new Map();
  naicsMap = new Map();
  pscMap = new Map();
  setAsideMap = new Map();
  noticeTypeMap = new Map();
  awardOrIDVMap = new Map();
  awardTypeMap = new Map();
  contractTypeMap = new Map();
  dunsMap = new Map();
  wdTypeMap = new Map();
  statesMap = new Map();
  countiesMap = new Map();
  constructionMap = new Map();
  servicesMap = new Map();
  dictionaries = {
    "applicant_type": this.applicantMap,
    "beneficiary_type": this.beneficiaryMap,
    "assistance_type": this.assistanceMap,
    "naics": this.naicsMap,
    "psc": this.pscMap,
    "notice_type": this.noticeTypeMap,
    "set_aside": this.setAsideMap,
    "award_or_idv": this.awardOrIDVMap,
    "award_type": this.awardTypeMap,
    "contract_type": this.contractTypeMap,
    "duns": this.dunsMap,
    "wdType": this.wdTypeMap,
    "state": this.statesMap,
    "county": this.countiesMap,
    "construction_type": this.constructionMap,
    "service": this.servicesMap,
    "organization_id": this.orgMap
  };

  setAsideAwardsOptions = [
    {value: '8AN', label: '8(A) SOLE SOURCE'},
    {value: 'HS3', label: '8(A) WITH HUB ZONE PREFERENCE'},
    {value: '8A', label: '8A COMPETED'},
    {value: 'BI', label: 'BUY INDIAN'},
    {value: 'EDWOSB', label: 'ECONOMICALLY DISADVANTAGED WOMEN OWNED SMALL BUSINESS'},
    {value: 'EDWOSBSS', label: 'ECONOMICALLY DISADVANTAGED WOMEN OWNED SMALL BUSINESS SOLE SOURCE'},
    {value: 'ESB', label: 'EMERGING SMALL BUSINESS SET ASIDE'},
    {value: 'HMP', label: 'HBCU OR MI SET-ASIDE -- PARTIAL'},
    {value: 'HMT', label: 'HBCU OR MI SET-ASIDE -- TOTAL'},
    {value: 'HZC', label: 'HUBZONE SET-ASIDE'},
    {value: 'HZS', label: 'HUBZONE SOLE SOURCE'},
    {value: 'IEE', label: 'INDIAN ECONOMIC ENTERPRISE'},
    {value: 'ISBEE', label: 'INDIAN SMALL BUSINESS ECONOMIC ENTERPRISE'},
    {value: 'NONE', label: 'NO SET ASIDE USED.'},
    {value: 'RSB', label: 'RESERVED FOR SMALL BUSINESS'},
    {value: 'SDVOSBS', label: 'SDVOSB SOLE SOURCE'},
    {value: 'SDVOSBC', label: 'SERVICE DISABLED VETERAN OWNED SMALL BUSINESS SET-ASIDE'},
    {value: 'SBP', label: 'SMALL BUSINESS SET ASIDE - PARTIAL'},
    {value: 'SBA', label: 'SMALL BUSINESS SET ASIDE - TOTAL'},
    {value: 'VSB', label: 'VERY SMALL BUSINESS'},
    {value: 'VSA', label: 'VETERAN SET ASIDE'},
    {value: 'VSS', label: 'VETERAN SOLE SOURCE'},
    {value: 'WOSB', label: 'WOMEN OWNED SMALL BUSINESS'},
    {value: 'WOSBSS', label: 'WOMEN OWNED SMALL BUSINESS SOLE SOURCE'}
  ];

  awardOrIDV = [
    {value: 'AWARD', label: 'Contract', name: 'Contract'},
    {value: 'IDV', label: 'Interagency Contract Delivery (ICD)', name: 'ICD'}
  ];

  awardType = [
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
  ];

  contractType = [
    {label: 'COST NO FEE', value: 'S', name: 'COST NO FEE'},
    {label: 'COST PLUS AWARD FEE', value: 'R', name: 'COST PLUS AWARD FEE'},
    {label: 'COST PLUS FIXED FEE', value: 'U', name: 'COST PLUS FIXED FEE'},
    {label: 'COST PLUS INCENTIVE FEE', value: 'V', name: 'COST PLUS INCENTIVE FEE'},
    {label: 'COST SHARING', value: 'T', name: 'COST SHARING'},
    {label: 'FIRM FIXED PRICE', value: 'J', name: 'FIRM FIXED PRICE'},
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
  ];

  wdType = [
    {value: 'sca', label: 'Service Contract Act (SCA)', name: 'radio-sca'},
    {value: 'dbra', label: 'Davis-Bacon Act (DBA)', name: 'radio-dba'}
  ];

  @ViewChild('autocomplete') autocomplete: any;

  keyword: string;

  oldKeyword: string;

  keywordsModel: any = [];

  keywordsConfiguration = {
    placeholder: "Keyword Search",
    selectedLabel: "Keywords",
    allowAny: true,
    keyValueConfig: {
      keyProperty: 'value',
      valueProperty: 'label'
    },
    dropdownLimit: 10
  };

  workspaceSearchConfig: any = {
    placeholder: "Search Workspace"
  };

  defaultDomains: string[] = ['cfda', 'opp', 'fpds', 'ei', 'fh', 'wd'];

  domainCheckboxModel: string[] = this.defaultDomains;

  domainCheckboxConfig = {
    options: [
      {value: 'cfda', label: 'Assistance Listing', name: 'checkbox-cfda'},
      {value: 'opp', label: 'Contract Opportunities', name: 'checkbox-opp'},
      {value: 'fpds', label: 'Contract Data', name: 'checkbox-fpds'},
      {value: 'ei', label: 'Entity Information', name: 'checkbox-ei'},
      {value: 'fh', label: 'Federal Hierarchy', name: 'checkbox-draft'},
      {value: 'wd', label: 'Wage Determination', name: 'checkbox-wd'}
    ],
    name: 'saved-search-domain-filter',
    label: '',
    hasSelectAll: 'true'
  };

  filterDisabled: boolean = true;

  dateFilterIndex = 0;

  dateFilterModel: any = {};

  dateRadio: string = 'date';

  dateRangeConfig = [
    {
      title: 'Date Saved',
      dateFilterConfig: {
        options: [
          {name: 'saved_date', label: 'Date', value: 'date'},
          {name: 'saved_date_range', label: 'Date Range', value: 'dateRange'}
        ],
        radSelection: 'date'
      }
    },
    {
      title: 'Date Last Ran',
      dateFilterConfig: {
        options: [
          {name: 'last_ran_date', label: 'Date', value: 'date'},
          {name: 'last_ran_range', label: 'Date Range', value: 'dateRange'}
        ],
        radSelection: 'date'
      }
    }
  ];
  internalDateModel : any  = {};
  dateTypeOptions = [this.LAST_SAVED, this.LAST_RAN];

  defaultSort: any = {type:'modified_on', sort:'desc'};
  sortModel: any = this.defaultSort;
  oldSortModel: any = this.defaultSort;
  sortOptions = [
    {label:'Search Title', name:'Search Title', value:'title'},
    {label:'Date Last Saved', name:'Date Last Saved', value:'modified_on'},
    {label:'Date Last Run', name:'Date Last Run', value:'last_usage_date'}
  ];

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private savedSearchService: SavedSearchService,
              private searchDictionariesService: SearchDictionariesService,
              private fhService: FHService,
              private dictionaryService: DictionaryService,
              private alertFooterService: AlertFooterService) {
  }

  ngOnInit() {
    this.cookieValue = Cookies.get('iPlanetDirectoryPro');
    
    this.activatedRoute.queryParams.subscribe(
      data => {
        this.pageNum = typeof data['page'] === "string" && parseInt(data['page']) - 1 >= 0 ? parseInt(data['page']) - 1 : 0;

        this.keywordsModel = data['keyword'] ? SavedSearchWorkspacePage.keywordToArray(data['keyword']) : [];

        this.sortModel = typeof data['sortBy'] === "string" ? this.setSortModel(decodeURI(data['sortBy'])) : this.defaultSort;

        this.domainCheckboxModel = typeof data['domain'] === "string" ? decodeURI(data['domain']).split(",") : this.defaultDomains;

        this.internalDateModel = data['dateFrom'] && data['dateTo'] ? {'startDate': data['dateFrom'], 'endDate': data['dateTo']} : {};
        this.dateFilterModel = data['dateTab'] ? this.formatDateModel(data) : {};
        this.dateRadio = data['radSelection'] ? decodeURI(data['radSelection']) : 'date';
        
        this.dateFilterIndex = data['dateTab'] && this.dateTypeOptions ? _.indexOf(this.dateTypeOptions, decodeURI(data['dateTab'])) : 0;
        this.updateDateFilterConfig(this.dateFilterIndex);
        this.runSavedSearch();
      });
  }

  ngOnDestroy() {
    if (this.runSearchSub) {
      this.runSearchSub.unsubscribe();
    }
  }

  formatDateWrapper(){
    if(!_.isEmpty(this.dateFilterModel)){
      if(this.dateFilterModel.hasOwnProperty('date') && this.dateFilterModel.date){
        return this.formatDate(this.dateFilterModel);
      }else if(this.dateFilterModel.hasOwnProperty('dateRange') && this.dateFilterModel.dateRange){
        return this.formatDateRange(this.dateFilterModel);
      }
    }
  }

  formatDate(model){
    if(!_.isEmpty(model)){      
      return {
        'startDate': model.date + SavedSearchWorkspacePage.fetchFormattedTimeZoneOffset(this.dateFilterModel['date']),
        'endDate': model.date + SavedSearchWorkspacePage.fetchFormattedTimeZoneOffset(this.dateFilterModel['date'])
      }
    }
    
  }
  formatDateRange(model){
    if(!_.isEmpty(model)){
      return {
        'startDate': model.dateRange.startDate + SavedSearchWorkspacePage.fetchFormattedTimeZoneOffset(this.dateFilterModel['dateRange']['startDate']),
        'endDate': model.dateRange.endDate + SavedSearchWorkspacePage.fetchFormattedTimeZoneOffset(this.dateFilterModel['dateRange']['endDate'])
      }
    }
  }

  formatDateModel(data){
    if(data.radSelection === 'date'){
      return data.dateFrom ? {'date': data.dateFrom} : {'date': ''}
    }else if(data.radSelection === 'dateRange'){
      return data.dateFrom && data.dateTo ? {'dateRange': {'startDate' : data.dateFrom, 'endDate': data.dateTo}} : {'dateRange': {'startDate' : '', 'endDate': ''}}
    }
  }

  updateDateFilterConfig(index){
    this.dateRangeConfig[index].dateFilterConfig.radSelection = this.dateRadio;
    if(this.selectDateFilter){
      this.selectDateFilter.setCurrentDateOption(this.dateRangeConfig[index]);      
    }
  }

  // builds object we set into url to persist data
  setupQS() {
    let qsobj = {};
    if (this.pageNum >= 0) {
      qsobj['page'] = this.pageNum + 1;
    } else {
      qsobj['page'] = 1;
    }

    if (this.keywordsModel.length > 0) {
      qsobj['keyword'] = SavedSearchWorkspacePage.keywordToString(this.keywordsModel);
    } else {
      this.keywordsModel = [];
    }

    if (this.domainCheckboxModel) {
      qsobj['domain'] = this.domainCheckboxModel.join();
    }

    //Date Filter query params
    if(!_.isEmpty(this.internalDateModel)){
      qsobj['dateTab'] = this.dateTypeOptions[this.dateFilterIndex];
    }
    if(this.dateRangeConfig && !_.isEmpty(this.internalDateModel)){
      qsobj['radSelection'] = this.dateRadio;
    }
    if(this.internalDateModel && !_.isEmpty(this.internalDateModel)){
      qsobj['dateFrom'] = this.internalDateModel.startDate;
      qsobj['dateTo'] = this.internalDateModel.endDate;
    }

    //If changing sort option, reset to default sort order for that option
    if(this.sortModel && this.oldSortModel['type'] !== this.sortModel['type']){
      switch(this.sortModel['type']){
          case 'modified_on':
            this.sortModel['sort'] = 'desc';
            break;
          case 'last_usage_date':
            this.sortModel['sort'] = 'desc';
            break;
          case 'title':
            this.sortModel['sort'] = 'asc';
            break;
      }
    }

    if(this.sortModel){
      qsobj['sortBy'] = (this.sortModel['sort'] == 'desc' ? '-' : '')+(this.sortModel['type']);
    }
    else {
      qsobj['sortBy'] = '';
    }

    return qsobj;
  }

  runSavedSearch() {
    let dateTab = this.dateTypeOptions[this.dateFilterIndex];
    let dateObj = this.formatDateWrapper();

    let params = {
      Cookie: this.cookieValue,
      pageNum: this.pageNum,
      keyword: SavedSearchWorkspacePage.keywordToString(this.keywordsModel),
      sortBy: (this.sortModel['sort'] == 'desc' ? '-' : '')+(this.sortModel['type']),
      domain: this.domainCheckboxModel.join(','),
      dateTab: dateTab,
      dateFilter: dateObj
    };

    // make api call
    this.runSearchSub = this.savedSearchService.getAllSavedSearches(params).subscribe(data => {
        if (data._embedded && data._embedded.preferences) {
          this.data = data._embedded.preferences;
          this.totalCount = data.page['totalElements'];
          this.size = data.page['size'];
          this.totalPages = data.page['totalPages'];
        } else {
          this.totalCount = 0;
          this.data = [];
        }
        this.oldKeyword = SavedSearchWorkspacePage.keywordToString(this.keywordsModel);
        this.initLoad = false;
        this.createOrgNameMap();
        this.getLabelsFromDictionaries();
        //setup query params to be passed to saved-search-result component
        this.qParams = this.setupQS();
      },
      error => {
        console.error('Error!!', error);
        let errorRes = error.json();
        if (error && error.status === 404) {
          this.router.navigate(['404']);
        } else if (error && error.status === 401) {
          this.router.navigate(['401']);
        } else if (error && error.status === 400) {
          this.serviceErrorFooterAlertModel.description = errorRes.message;
          this.alertFooterService.registerFooterAlert(JSON.parse(JSON.stringify(this.serviceErrorFooterAlertModel)));
        } else if (error && (error.status === 502 || error.status === 504)) {
          this.serviceErrorFooterAlertModel.description = errorRes.message;
          this.alertFooterService.registerFooterAlert(JSON.parse(JSON.stringify(this.serviceErrorFooterAlertModel)));
        }
      });
  }

  getLabelsFromDictionaries() {
    let indexes = [];
    if (this.data.length > 0) {
      this.data.map(data => {
        if (data.data.index) {
          indexes.push(data.data.index.toString());
        }
      });
    }

    let uniqueIndexList = Array.from(new Set(indexes));
    let ctx = this;

    if (uniqueIndexList && uniqueIndexList.length > 0) {
      uniqueIndexList.forEach(function (i) {
        switch (i) {
          case 'cfda':
            ctx.getProgramsDictionaryData('applicant_types,beneficiary_types,assistance_type');
            break;
          case 'opp':
            ctx.getCommonDictionaryData('procurement_type,naics_code,classification_code,set_aside_type');
            break;
          case 'ei':
          case 'fpds':
            ctx.getCommonDictionaryData('naics_code,classification_code');
            // set options for set aside filter to hard coded values if index is fpds
            ctx.setAsideAwardsOptions.forEach(function (item) {
              ctx.setAsideMap.set(item.value, item.label);
            });
            ctx.awardOrIDV.forEach(function (item) {
              ctx.awardOrIDVMap.set(item.value, item.label);
            });
            ctx.awardType.forEach(function (item) {
              ctx.awardTypeMap.set(item.value, item.label);
            });
            ctx.contractType.forEach(function (item) {
              ctx.contractTypeMap.set(item.value, item.label);
            });
            break;
          case 'wd':
            ctx.getWageDeterminationDictionaryData('wdStates,wdCounties,dbraConstructionTypes,scaServices');
            ctx.wdType.forEach(function (item) {
              ctx.wdTypeMap.set(item.value, item.label);
            });
            break;
          default:
            break;
        }
      });
    }

  }

  createOrgNameMap() {
    let idArray = new Set(this.data.map(data => {
      if (data.data.parameters && data.data.parameters.organization_id) {
        let id = data.data.parameters.organization_id;

        if (typeof id !== 'string') {
          return id.toString();
        }
        return id;
      }
    }));
    let uniqueIdList = Array.from(idArray).join();
    let ctx = this;
    if (uniqueIdList && uniqueIdList.length > 0) {
      this.fhService.getOrganizationsByIds(uniqueIdList)
        .subscribe(
          data => {
            data._embedded.orgs.forEach(function (org) {
              ctx.orgMap.set(org.org.orgKey.toString(), org.org.name);
            });
            this.addParameterLabels();
          },
          error => {
            console.error('Error!!', error);
          }
        );
    }

  }

  getProgramsDictionaryData(id) {
    let ctx = this;
    this.dictionaryService.getProgramDictionaryById(id).subscribe(
      data => {
        if (data && data.hasOwnProperty('applicant_types')) {
          data['applicant_types'].forEach(function (item) {
            ctx.applicantMap.set(item.code, item.value);
          });
        }

        if (data && data.hasOwnProperty('beneficiary_types')) {
          data['beneficiary_types'].forEach(function (item) {
            ctx.beneficiaryMap.set(item.code, item.value);
          });
        }

        if (data && data.hasOwnProperty('assistance_type')) {
          data['assistance_type'].forEach(function (item) {
            ctx.assistanceMap.set(item.element_id, item.code + '-' + item.value);
            if (item.elements != null) {
              for (var element of item.elements) {
                ctx.assistanceMap.set(element.element_id, item.code + '-' + element.value);
              }
            }
          });
        }
        this.addParameterLabels();
      },
      error => {
        console.error("Error!!", error);
      }
    );
  }

  getCommonDictionaryData(id) {
    let ctx = this;
    this.dictionaryService.getOpportunityDictionary(id).subscribe(
      data => {
        if (data && data.hasOwnProperty('naics_code')) {
          data['naics_code'].forEach(function (item) {
            ctx.naicsMap.set(item.code, item.value);
          });
        }

        if (data && data.hasOwnProperty('classification_code')) {
          data['classification_code'].forEach(function (item) {
            ctx.pscMap.set(item.code, item.value);
          });
        }

        if (data && data.hasOwnProperty('procurement_type')) {
          data['procurement_type'].forEach(function (item) {
            ctx.noticeTypeMap.set(item.code, item.value);
          });
        }

        if (data && data.hasOwnProperty('set_aside_type')) {
          data['set_aside_type'].forEach(function (item) {
            ctx.setAsideMap.set(item.code, item.value);
          });
        }
        this.addParameterLabels();
      },
      error => {
        console.error("Error!!", error);
      }
    );

    let idArray = new Set(this.data.map(data => {
      if (data.data.parameters && data.data.parameters.duns) {
        let id = data.data.parameters.duns;

        if (typeof id !== 'string') {
          return id.toString();
        }
        return id;
      }
    }));
    let uniqueIdList = Array.from(idArray).join();
    if (uniqueIdList && uniqueIdList.length > 0) {
      this.searchDictionariesService.dunsPersistGrabber(uniqueIdList)
        .subscribe((duns: [{ value: string, label: string }]) => {
            duns.forEach(function (item) {
              ctx.dunsMap.set(item.value, item.label);
            });
          },
          error => {
            console.error("Error!!", error);
          }
        );
    }
  }

  getWageDeterminationDictionaryData(id) {
    let ctx = this;
    this.dictionaryService.getWageDeterminationDictionary(id).subscribe(
      data => {
        if (data && data.hasOwnProperty('wdStates')) {
          data['wdStates'].forEach(function (item) {
            ctx.statesMap.set(item.elementId, item.value);
          });
        }
        if (data && data.hasOwnProperty('wdCounties')) {
          data['wdCounties'].forEach(function (item) {
            ctx.countiesMap.set(item.elementId, item.value);
          });
        }
        if (data && data.hasOwnProperty('dbraConstructionTypes')) {
          data['dbraConstructionTypes'].forEach(function (item) {
            ctx.constructionMap.set(item.value, item.value);
          });
        }
        if (data && data.hasOwnProperty('scaServices')) {
          data['scaServices'].forEach(function (item) {
            ctx.servicesMap.set(item.elementId, item.value);
          });
        }
        this.addParameterLabels();
      },
      error => {
        console.error("Error!!", error);
      }
    );
  }

  workspaceSearchModel(event) {
    if (event == null) {
      this.autocomplete.inputValue = '';
      this.keyword = '';
    } else {
      this.keyword = event;
    }
  }

  static keywordToArray(keywordStringOrArray) {
    if (typeof(keywordStringOrArray) === 'string') {
      let tempArray = keywordStringOrArray.split(',');
      return tempArray.map(function (item) {
        return {label: item, value: item};
      });
    } else if (Array.isArray(keywordStringOrArray)) {
      return keywordStringOrArray.map(function (item) {
        return {label: item, value: item};
      });
    }
  }

  static keywordToString(keywordArray) {
    let newString = '';

    if (keywordArray && keywordArray !== '') {
      newString = keywordArray.reduce(function (accumulator, currentVal) {
        if (accumulator === '') {
          return currentVal.value;
        }

        return accumulator + ',' + currentVal.value;
      }, '');
    }

    return newString;
  }

  keywordsModelChange(value) {
    if (value.length === 1) {
      this.keywordsModel = value;
    } else if (value.length > 1) {
      this.keywordsModel = [value[value.length - 1]];
    } else {
      this.keywordsModel = [];
    }

    this.pageNum = 0;
    this.workspaceRefresh();
  }

  workspaceSearchClick() {
    this.pageNum = 0;
    // build a new keywords model with keyword
    this.keywordsModel = SavedSearchWorkspacePage.keywordToArray(this.keyword);
    this.workspaceRefresh();
    this.keyword = '';
    this.autocomplete.inputValue = '';
  }

  setSortModel(sortBy) {
    if(sortBy.substring(0, 1) == '-') {
      return {type: sortBy.substring(1), sort: 'desc'};
    } else {
      return {type: sortBy, sort: 'asc'};
    }
  }

  sortModelChange(event){
    this.pageNum = 0;
    this.oldSortModel = this.sortModel;
    this.sortModel = event;
    this.workspaceRefresh();
  }

  domainModelChanged(event) {
    this.pageNum = 0;
    this.workspaceRefresh();
  }

  // initiates a search with date filter
  filterByDate(event){
    // setting dateFilterIndex
    if(event){
      if(event.index){
        this.dateFilterIndex = event.index;    
      }
    }else{
      this.dateFilterIndex = 0;
    }

    this.pageNum = 0;
    this.workspaceRefresh();
  }
  
  dateModelChange(event){
    this.filterDisabled = true;
    if(event['date']){
      if(event['date'] !== 'Invalid Date' && event['date'].substring(0,1) !== '0'){
        this.internalDateModel['startDate'] = event['date'];
        this.internalDateModel['endDate'] = event['date'];
        this.dateFilterModel = event;
        this.dateRadio = 'date';
        this.filterDisabled = false;
      }
    } else if(event['dateRange']){
        // checks if dateRange exists and does not equal invalid date and that all 4 "year" numbers have been filled in
        if(event['dateRange']['startDate'] && event['dateRange']['endDate'] && event['dateRange']['startDate'] !== 'Invalid date' && event['dateRange']['endDate'] !== 'Invalid date'){
          if(event['dateRange']['startDate'].substring(0,1) !== '0' && event['dateRange']['endDate'].substring(0,1) !== '0'){
            this.internalDateModel['startDate'] = event['dateRange']['startDate'];
            this.internalDateModel['endDate'] = event['dateRange']['endDate'];
            this.dateFilterModel = event;
            this.dateRadio = 'dateRange';
            this.filterDisabled = false;
          }
        }
    }
  }

  clearDateFilter(event){
    this.dateFilterModel = {};
    this.internalDateModel = {};
    this.pageNum = 0;

    this.workspaceRefresh();
  }

  //  TODO: Pull to Date Utility Service
  static fetchFormattedTimeZoneOffset(date) {
    let timezone_offset_min = new Date(date).getTimezoneOffset();
    let offset_hrs: any = Math.abs(timezone_offset_min / 60);
    let offset_min: any = Math.abs(timezone_offset_min % 60);
    let timezone_standard;

    if (offset_hrs < 10) {
      offset_hrs = '0' + offset_hrs;
    }

    if (offset_min < 10) {
      offset_min = '0' + offset_min;
    }

    // Add an opposite sign to the offset
    if (timezone_offset_min < 0) {
      timezone_standard = '+' + offset_hrs + ':' + offset_min;
    } else if (timezone_offset_min > 0) {
      timezone_standard = '-' + offset_hrs + ':' + offset_min;
    } else if (timezone_offset_min == 0) {
      timezone_standard = 'Z';
    }

    // Timezone difference in hours and minutes
    // String such as +5:30 or -6:00 or Z
    return timezone_standard;
  }

  //Add label names to data from dictionaries
  addParameterLabels() {
    let ctx = this;
    ctx.data.forEach(function (data) {
      if (data.data.parameters) {
        let params = data.data.parameters;
        for (var key in params) {
          if (ctx.dictionaries.hasOwnProperty(key)) {
            let items = [];
            if (params[key].indexOf(",") > -1) {
              items = params[key].split(",");
            } else {
              items.push(params[key]);
            }
            let array = [];
            for (var i = 0; i < items.length; i++) {
              if (ctx.dictionaries[key].get(items[i]) != undefined) {
                array.push(ctx.dictionaries[key].get(items[i].toString()));
              } else {
                array.push(items[i].toString());
              }
            }
            data.data.parameters[key] = array.join();
          }
        }
      }
    });
    ctx.data = _.cloneDeep(ctx.data);
  }

  clearAllFilters() {
    //clear keyword
    this.keywordsModel = [];

    //clear date filter
    this.dateFilterModel = {};
    this.internalDateModel = {};
    this.pageNum = 0; 

    //reset sort
    this.oldSortModel = this.defaultSort;
    this.sortModel = this.defaultSort;

    this.workspaceRefresh();
  }

  pageChange(page) {
    this.pageNum = page;
    this.workspaceRefresh();
  }

  workspaceRefresh() {
    let qsobj = this.setupQS();
    let navigationExtras: NavigationExtras = {
      queryParams: qsobj
    };
    this.router.navigate(['/savedsearches/workspace/'], navigationExtras);
  }

  dateTypeChangeHandler(evt){
    this.dateFilterModel = {};
  }
}


