import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {Router, ActivatedRoute, NavigationExtras} from '@angular/router';
import * as Cookies from 'js-cookie';
import { IBreadcrumb } from "sam-ui-kit/types";
import { AlertFooterService } from "../../app-components/alert-footer/alert-footer.service";
import {SavedSearchService} from "../../../api-kit/search/saved-search.service";
import {DictionaryService} from "../../../api-kit/dictionary/dictionary.service";
import {FilterParamLabel} from "../pipes/filter-label.pipe";
import {FHService} from "../../../api-kit/fh/fh.service";
import * as _ from 'lodash';

@Component({
  moduleId: __filename,
  templateUrl: 'saved-search-workspace.template.html',
  providers: []
})

export class SavedSearchWorkspacePage implements OnInit, OnDestroy {

  totalCount: any = 0;
  totalPages: any = 0;
  pageNum = 0;
  data = [];
  initLoad = true;
  oldKeyword: string = "";
  qParams: any = {};
  size: any = {};
  cookieValue: string;
  runSearchSub: any;
  crumbs: Array<IBreadcrumb> = [
    { breadcrumb:'Home', url:'/',},
    { breadcrumb: 'My Workspace', url: '/workspace' },
    { breadcrumb: 'Saved Search Workspace'}
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
  wdTypeMap = new Map();
  statesMap = new Map();
  constructionMap = new Map();
  servicesMap = new Map();
  filters = {
    "applicant_type": this.applicantMap,
    "beneficiary": this.beneficiaryMap,
    "assistance_type": this.assistanceMap,
    "naics": this.naicsMap,
    "psc": this.pscMap,
    "notice_type": this.noticeTypeMap,
    "set_aside": this.setAsideMap,
    "award_or_idv": this.awardOrIDVMap,
    "award_type": this.awardTypeMap,
    "contract_type": this.contractTypeMap,
    "wdType": this.wdTypeMap,
    "state": this.statesMap,
    "construction_type": this.constructionMap,
    "service": this.servicesMap,
    "organization_id": this.orgMap
  };
  setAsideAwardsOptions = [
    {value:'8AN', label:'8(A) SOLE SOURCE'},
    {value:'HS3', label:'8(A) WITH HUB ZONE PREFERENCE'},
    {value:'8A', label:'8A COMPETED'},
    {value:'BI', label:'BUY INDIAN'},
    {value:'EDWOSB', label:'ECONOMICALLY DISADVANTAGED WOMEN OWNED SMALL BUSINESS'},
    {value:'EDWOSBSS', label:'ECONOMICALLY DISADVANTAGED WOMEN OWNED SMALL BUSINESS SOLE SOURCE'},
    {value:'ESB', label:'EMERGING SMALL BUSINESS SET ASIDE'},
    {value:'HMP', label:'HBCU OR MI SET-ASIDE -- PARTIAL'},
    {value:'HMT', label:'HBCU OR MI SET-ASIDE -- TOTAL'},
    {value:'HZC', label:'HUBZONE SET-ASIDE'},
    {value:'HZS', label:'HUBZONE SOLE SOURCE'},
    {value:'IEE', label:'INDIAN ECONOMIC ENTERPRISE'},
    {value:'ISBEE', label:'INDIAN SMALL BUSINESS ECONOMIC ENTERPRISE'},
    {value:'NONE', label:'NO SET ASIDE USED.'},
    {value:'RSB', label:'RESERVED FOR SMALL BUSINESS'},
    {value:'SDVOSBS', label:'SDVOSB SOLE SOURCE'},
    {value:'SDVOSBC', label:'SERVICE DISABLED VETERAN OWNED SMALL BUSINESS SET-ASIDE'},
    {value:'SBP', label:'SMALL BUSINESS SET ASIDE - PARTIAL'},
    {value:'SBA', label:'SMALL BUSINESS SET ASIDE - TOTAL'},
    {value:'VSB', label:'VERY SMALL BUSINESS'},
    {value:'VSA', label:'VETERAN SET ASIDE'},
    {value:'VSS', label:'VETERAN SOLE SOURCE'},
    {value:'WOSB', label:'WOMEN OWNED SMALL BUSINESS'},
    {value:'WOSBSS', label:'WOMEN OWNED SMALL BUSINESS SOLE SOURCE'}
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

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private savedSearchService: SavedSearchService, private fhService: FHService, private dictionaryService: DictionaryService, private alertFooterService: AlertFooterService) {
  }

  ngOnInit() {
    this.cookieValue = Cookies.get('iPlanetDirectoryPro');
    this.activatedRoute.queryParams.subscribe(
      data => {
        this.pageNum = typeof data['page'] === "string" && parseInt(data['page']) - 1 >= 0 ? parseInt(data['page']) - 1 : 0;

        this.runSavedSearch();
      });
  }

  ngOnDestroy() {
    if (this.runSearchSub) {
      this.runSearchSub.unsubscribe();
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

    return qsobj;
  }

  runSavedSearch() {

    // make api call
    this.runSearchSub = this.savedSearchService.getAllSavedSearches({
      Cookie: this.cookieValue,
      pageNum: this.pageNum
    }).subscribe(data => {
        if(data._embedded && data._embedded.preferences) {
          this.data = data._embedded.preferences;
          this.totalCount = data.page['totalElements'];
          this.size = data.page['size'];
          this.totalPages = data.page['totalPages'];
        } else {
          this.totalCount = 0;
          this.data = [];
        }
        this.initLoad = false;
        this.createOrgNameMap();
        this.getLabelsFromDictionaries();
      },
      error => {
        console.error('Error!!', error);
        let errorRes = error.json();
        if (error && error.status === 404) {
          this.router.navigate(['404']);
        }
        if (error && (error.status === 502 || error.status === 504)) {
          this.serviceErrorFooterAlertModel.description = errorRes.message;
          this.alertFooterService.registerFooterAlert(JSON.parse(JSON.stringify(this.serviceErrorFooterAlertModel)));
        }
      });
  }

  getLabelsFromDictionaries() {
    let indexes = [];
    if(this.data.length > 0) {
      this.data.map(data => {
        if (data.data.index) {
          indexes.push(data.data.index.toString());
        }
      });
    }

    let uniqueIndexList = Array.from(new Set(indexes));
    let ctx = this;

    uniqueIndexList.forEach(function(i) {
      let filteredDictionaries;
      switch(i) {
        case 'cfda':
          filteredDictionaries = ctx.dictionaryService.filterDictionariesToRetrieve('applicant_types,beneficiary_types,assistance_type');
          ctx.getProgramsDictionaryData(filteredDictionaries);
          break;
        case 'opp':
          filteredDictionaries = ctx.dictionaryService.filterDictionariesToRetrieve('procurement_type,naics_code,classification_code,set_aside_type');
          ctx.getCommonDictionaryData(filteredDictionaries);
          break;
        case 'ei':
        case 'fpds':
          filteredDictionaries = ctx.dictionaryService.filterDictionariesToRetrieve('naics_code,classification_code');
          ctx.getCommonDictionaryData(filteredDictionaries);
          // set options for set aside filter to hard coded values if index is fpds
          ctx.setAsideAwardsOptions.forEach(function(item) {
            ctx.setAsideMap.set(item.value, item.label);
          });
          ctx.awardOrIDV.forEach(function(item) {
            ctx.awardOrIDVMap.set(item.value, item.label);
          });
          ctx.awardType.forEach(function(item) {
            ctx.awardTypeMap.set(item.value, item.label);
          });
          ctx.contractType.forEach(function(item) {
            ctx.contractTypeMap.set(item.value, item.label);
          });
          break;
        case 'wd':
          filteredDictionaries = ctx.dictionaryService.filterDictionariesToRetrieve('wdStates,dbraConstructionTypes,scaServices');
          ctx.getWageDeterminationDictionaryData(filteredDictionaries);
          ctx.wdType.forEach(function(item) {
            ctx.wdTypeMap.set(item.value, item.label);
          });
          break;
        default: break;
      }
    });

  }

  createOrgNameMap(){
    let idArray = new Set(this.data.map(data => {
      if(data.data.parameters && data.data.parameters.organization_id) {
        let id = data.data.parameters.organization_id;

        if (typeof id !== 'string') {
          return id.toString();
        }
        return id;
      }
    }));
    let uniqueIdList = Array.from(idArray).join();
    let ctx = this;
    if(uniqueIdList && uniqueIdList.length > 0){
      this.fhService.getOrganizationsByIds(uniqueIdList)
        .subscribe(
          data => {
            data._embedded.orgs.forEach(function(org){
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
    if (id === '') {
      return null;
    } else {
      let ctx = this;
      this.dictionaryService.getProgramDictionaryById(id).subscribe(
        data => {
          data['applicant_types'].forEach(function (item) {
            ctx.applicantMap.set(item.code, item.value);
          });
          data['beneficiary_types'].forEach(function (item) {
            ctx.beneficiaryMap.set(item.code, item.value);
          });
          data['assistance_type'].forEach(function (item) {
            ctx.assistanceMap.set(item.element_id, item.code + '-' + item.value);
            for (var element of item.elements) {
              ctx.assistanceMap.set(element.element_id, item.code + '-' + element.value);
            }
          });
          this.addParameterLabels();
        },
        error => {
          console.error("Error!!", error);
        }
      );
    }
  }

  getCommonDictionaryData(id) {
    if (id === '') {
      return null;
    } else {
      let ctx = this;
      this.dictionaryService.getOpportunityDictionary(id).subscribe(
        data => {
          if(data && data.hasOwnProperty('naics_code')){
            data['naics_code'].forEach(function (item) {
              ctx.naicsMap.set(item.code, item.value);
            });
          }

          if(data && data.hasOwnProperty('classification_code')) {
            data['classification_code'].forEach(function (item) {
              ctx.pscMap.set(item.code, item.value);
            });
          }

          if(data && data.hasOwnProperty('procurement_type')) {
            data['procurement_type'].forEach(function (item) {
              ctx.noticeTypeMap.set(item.code, item.value);
            });
          }

          if(data && data.hasOwnProperty('set_aside_type')) {
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
    }
  }

  getWageDeterminationDictionaryData(id) {
    if (id === ''){
      return null;
    }else{
      let ctx = this;
      this.dictionaryService.getWageDeterminationDictionary(id).subscribe(
        data => {
          data['wdStates'].forEach(function (item) {
            ctx.statesMap.set(item.elementId, item.value);
          });
          data['dbraConstructionTypes'].forEach(function (item) {
            ctx.constructionMap.set(item.value, item.value);
          });
          data['scaServices'].forEach(function (item) {
            ctx.servicesMap.set(item.elementId, item.value);
          });
          this.addParameterLabels();
        },
        error => {
          console.error("Error!!", error);
        }
      );
    }
  }

  //Add label names to data from dictionaries
  addParameterLabels() {
    let ctx = this;
    ctx.data.forEach(function(data) {
      if(data.data.parameters) {
        for (var key in data.data.parameters) {
          if (ctx.filters.hasOwnProperty(key) && ctx.filters[key].get(data.data.parameters[key])!=undefined) {
            data.data.parameters[key] = ctx.filters[key].get(data.data.parameters[key].toString());
          }
        }
      }
  });
    ctx.data = _.cloneDeep(ctx.data);
  }

  pageChange(pagenumber) {
    this.pageNum = pagenumber;
    let qsobj = this.setupQS();
    let navigationExtras: NavigationExtras = {
      queryParams: qsobj
    };
    this.router.navigate(['savedsearches/workspace/'], navigationExtras);
  }

  workspaceRefresh(){
    let qsobj = this.setupQS();
    let navigationExtras: NavigationExtras = {
      queryParams: qsobj
    };
    this.router.navigate(['/savedsearches/workspace/'], navigationExtras);
  }
}


