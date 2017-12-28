import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { SearchService } from 'api-kit';
import { CapitalizePipe } from '../app-pipes/capitalize.pipe';
import { WageDeterminationService } from "../../api-kit/wage-determination/wage-determination.service";
import { AlertFooterService } from '../app-components/alert-footer';
import { SortArrayOfObjects } from "../app-pipes/sort-array-object.pipe";
import { SearchDictionariesService } from "../../api-kit/search/search-dictionaries.service";
import { DictionaryService } from "../../api-kit/dictionary/dictionary.service";
import * as Cookies from 'js-cookie';
import * as _ from 'lodash';
import {SavedSearchService} from "../../api-kit/search/saved-search.service";

// Animation
import { trigger, state, style, animate, transition } from '@angular/core';

@Component({
  moduleId: __filename,
  selector: 'search',
  providers: [CapitalizePipe],
  templateUrl: 'search.template.html',
  animations: [
    trigger('dropdown', [
      state('in', style({
        opacity: 1,
        transform: 'translateY(0) scale(1)'
      })),
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateY(-10%) scale(.8)'
        }),
        animate('100ms ease-in')
      ]),
      transition('* => void', [
        animate('100ms ease-out', style({
          opacity: 0,
          transform: 'translateY(-10%) scale(.8)'
        }))
      ])
    ])
  ]
})

export class SearchPage implements OnInit {
  keywords: string ="";
  index: string = "";
  prevIndex: string = "";
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
  showSpinner: boolean = false;
  agencyPickerModel = [];
  showSavedSearches: boolean = false;
  searchName: string = "";
  oppDateFilterModel;
  cfdaDateFilterModel;
  wdDateFilterModel;
  fpdsDateFilterModel;
  dateFilterIndex = 0;
  dateRadSelection = "date";
  builtDateModel;

  // date filter configs
  disableCfdaFilter = true;
  disableOppFilter = true;
  disableWdFilter = true;
  disableFpdsFilter = true;

  defaultDateOptions = [
    {name: 'date', label: 'Date', value: 'date'},
    {name: 'dateRange', label: 'Date Range', value: 'dateRange'}
  ]
  cfdaDateRangeConfig = [
      {title: 'Published Date',
        dateFilterConfig: {
          options: this.defaultDateOptions,
          radSelection: 'date'
        }
        },
      {title: 'Modified Date',
        dateFilterConfig: {
          options: this.defaultDateOptions,
          radSelection: 'date'
        }
      }
    ];
    oppDateRangeConfig = [
      {title: 'Modified',
        dateFilterConfig: {
            options: this.defaultDateOptions,
            radSelection: 'date'
        }
      },
      {title: 'Posted',
        dateFilterConfig: {
          options: this.defaultDateOptions,
          radSelection: 'date'
        }
      },
      {title: 'Response',
      dateFilterConfig: {
        options: this.defaultDateOptions,
        radSelection: 'date',
        rangeType: 'date'
      },
    }
    ];
    wdDateRangeConfig = [
      {title: 'Modified/Revised',
      dateFilterConfig: {
          options: this.defaultDateOptions,
          radSelection: 'date'
      }
    },
    ];
    fpdsDateRangeConfig = [
      {title: 'Modified Date',
        dateFilterConfig: {
          options: this.defaultDateOptions,
          radSelection: 'date'
        }
        },
      {title: 'Signed Date',
        dateFilterConfig: {
          options: this.defaultDateOptions,
          radSelection: 'date'
        }
      }
    ];

  defaultSortModel: any = {type:'modifiedDate', sort:'desc'};
  keywordSortModel: any = {type:'relevance', sort:'desc'};
  entitySortModel: any = {type:'title', sort:'asc'};
  sortModel: any = this.defaultSortModel;
  oldSortModel: any = this.defaultSortModel;
  relevanceSort: any = {label:'Relevance', name:'Relevance', value:'relevance'};
  sortOptions = [
    {label:'Relevance', name:'Relevance', value:'relevance'},
    {label:'Title', name:'Title', value:'title'},
    {label:'Date Modified', name:'Date Modified', value:'modifiedDate'}
  ];
  sortChange: boolean = false;
  blankSearch: boolean = true;
  pageUpdate: boolean = false;

  sortBy: string = "";

  // duns entity objects
  dunsModel: any = '';
  dunsModelList: any = [];
  dunsListString = '';
  myOptions: any = [];


  @ViewChild('agencyPickerV2') agencyPickerV2;

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
  wdStateObject;
  selectStateConfig = {
    options: [],
    disabled: false,
    label: 'Select State',
    name: 'state',
    placeholder: 'Select...',
    keyValueConfig: {
      keyProperty: 'value',
      valueProperty: 'label'
    }
  };

  // Select County Component
  countyObject;
  wdCountyModel = '';
  selectCountyConfig = {
    options: [],
    disabled: false,
    label: 'Select County/Independent City',
    name: 'county',
    placeholder: 'Select...'
  };

  // Select Construct Type Component drop-down
  wdConstructObject;
  wdConstructModel = '';
  selectConstructConfig = {
    options: [
      {value: '', label: 'Default option', name: 'empty', disabled: true},
    ],
    disabled: false,
    label: 'Select Construction Type',
    name: 'constructionType',
    placeholder: 'Select...',
    keyValueConfig: {
      keyProperty: 'value',
      valueProperty: 'label'
    }
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
  wdNonStandardSelectObject;
  wdNonStandardSelectModel = '';
  wdNonStandardSelectConfig = {
    options: [],
    disabled: false,
    label: 'If a service is chosen, "Yes" will automatically be selected',
    name: 'constructionType',
    placeholder: 'Select...',
    keyValueConfig: {
      keyProperty: 'value',
      valueProperty: 'label'
    }
  };

  // scaSearchDescription: string = "The Wage Determination filter asks a series of questions to determine if a WDOL is available based on your selected criteria. <br/><br/>Please note that using the keyword search with these WD type-specific filters may limit your search results.<br/><br/> If you cannot locate a Wage Determination, try searching with no keywords and use the Wage Determination filters to find your result. <br><br><b>If you would like to request a SCA contract action, click <a href='https://www.dol.gov/whd/govcontracts/sca/sf98/index.asp'>here</a> to submit an e98 form.</b>"
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
    "placeholder": "Select...",
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
    "placeholder": "Select...",
    "selectedLabel": "Contract Types Selected",
    "options": [
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
    "placeholder": "Select...",
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
    "placeholder": "Select...",
    "options": [],
    "config": {
      keyValueConfig: {
        keyProperty: 'value',
        valueProperty: 'label'
      }
    }
  };

  // Notice Type
  noticeTypeModel: any = '';
  noticeType = {
  "name": "Notice Type",
  "placeholder": 'Select...',
  "options": [],
  "config": {
    keyValueConfig: {
      keyProperty: 'value',
      valueProperty: 'label'
    }
  }
};

  // Set Aside Type
  setAsideModel: any = '';
  setAsideType = {
    "name": "Set Aside Type",
    "placeholder": 'Select...',
    "options": [],
    "config": {
      keyValueConfig: {
        keyProperty: 'value',
        valueProperty: 'label'
      }
    }
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



  // Beneficiary Eligibility Object
  benElSearchString: any = '';
  benElType = {
    "label": "Beneficiaries",
    "name": "Beneficiary Eligibility",
    "placeholder": "Select...",
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
    "placeholder": "Select...",
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
    "label": "",
    "name": "Assistance Type",
    "placeholder": "Select...",
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
    "placeholder": "Regional Assistance Location",
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

  keywordsBuiltString = '';
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

  cookieValue: string;

  @ViewChild("modal1") modal1;
  preferenceId: string;
  savedSearch: any = {};
  savedSearchName: string = '';
  textConfig = {
    label: "Search Name",
    errorMessage: '',
    name: 'saved search',
    disabled: false,
  };
  actionsCallback = () => {
  };
  actions: Array<any> = [
    { name: 'saveAs', label: 'Save Search', icon: 'fa fa-floppy-o', callback: this.actionsCallback }
  ];
  // save search alert obj
  successFooterAlertModel = {
    title: "Success",
    description: "",
    type: "success",
    timer: 3000
  };
  errorFooterAlertModel = {
    title: "Error",
    description: "",
    type: "error",
    timer: 3000
  };

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private searchService: SearchService,
              private savedSearchService: SavedSearchService,
              private wageDeterminationService: WageDeterminationService,
              private alertFooterService: AlertFooterService,
              private searchDictionariesService: SearchDictionariesService,
              private changeDetectorRef: ChangeDetectorRef,
              private dictionaryService: DictionaryService) {
  }

  ngOnInit() {
    let cookie = Cookies.get('iPlanetDirectoryPro');

    if(cookie != null) {
      this.cookieValue = cookie;
      this.savedSearchService.getAllSavedSearches({Cookie: cookie, size: 0}).subscribe(res => {
        this.showSavedSearches = true;
      }, error => {
        if(error && (error.status === 404 || error.status === 401 || error.status === 400)) {
          console.error("Error", error);
        } else {
          this.showSavedSearches = true;
        }
      })
    }


    if (window.location.pathname.localeCompare("/search/fal/regionalAssistanceLocations") === 0) {
      this.showRegionalOffices = true;
    } else {
      this.showRegionalOffices = false;
    }

    this.activatedRoute.queryParams.subscribe(
      data => {
        this.keywords = data['keywords'] ? decodeURI(data['keywords']) : '';
        this.index = typeof data['index'] === "string" ? decodeURI(data['index']) : this.index;
        this.pageNum = typeof data['page'] === "string" && parseInt(data['page']) - 1 >= 0 ? parseInt(data['page']) - 1 : this.pageNum;
        this.organizationId = typeof data['organization_id'] === "string" ? decodeURI(data['organization_id']) : "";
        this.isActive = data['is_active'] && data['is_active'] === "false" ? false : true;
        this.checkboxModel = this.isActive === false ? [] : ['true'];
        this.wdTypeModel = data['wdType'] && data['wdType'] !== null ? data['wdType'] : '';
        this.wdStateModel = data['state'] && data['state'] !== null ? data['state'] : '';
        this.wdCountyModel = data['county'] && data['county'] !== null ? data['county'] : '';
        this.wdConstructModel = data['construction_type'] && data['construction_type'] !== null ? data['construction_type'] : '';
        this.wdNonStandardSelectModel = data['service'] && data['service'] !== null ? data['service'] : '';
        this.wdNonStandardRadModel = data['is_wd_even'] && data['is_wd_even'] !== null ? data['is_wd_even'] : '';
        this.wdSubjectToCBAModel = data['cba'] && data['cba'] !== null ? data['cba'] : '';
        this.wdPreviouslyPerformedModel = data['prevP'] && data['prevP'] !== null ? data['prevP'] : '';
        this.isStandard = data['is_standard'] && data['is_standard'] !== null ? data['is_standard'] : '';
        this.awardIDVModel = data['award_or_idv'] && data['award_or_idv'] !== null ? data['award_or_idv'] : '';
        this.awardTypeModel = data['award_type'] && data['award_type'] !== null ? data['award_type'] : '';
        this.contractTypeModel = data['contract_type'] && data['contract_type'] !== null ? data['contract_type'] : '';
        this.naicsTypeModel = data['naics'] && data['naics'] !== null ? data['naics'] : '';
        this.pscTypeModel = data['psc'] && data['psc'] !== null ? data['psc'] : '';
        this.ro_keyword = typeof data['ro_keyword'] === "string" && this.showRegionalOffices ? decodeURI(data['ro_keyword']) : this.ro_keyword;
        this.dunsListString = data['duns'] && data['duns'] !== null ? data['duns'] : '';
        this.appElSearchString = data['applicant_type'] && data['applicant_type'] !== null ? data['applicant_type'] : '';
        this.benElSearchString = data['beneficiary_type'] && data['beneficiary_type'] !== null ? data['beneficiary_type'] : '';
        this.assistanceTypeFilterModel = data['assistance_type'] && data['assistance_type'] !== null ? data['assistance_type'] : '';
        this.registrationExclusionCheckboxModel = data['entity_type'] && data['entity_type'] !== null ? decodeURI(data['entity_type']).split(",") : [];
        this.agencyPickerModel = this.setupOrgsFromQS(data['organization_id']);
        this.keywordsModel = this.keywords.length>0 ? this.keywordRebuilder(this.keywords) : [];
        this.sortModel = typeof data['sort'] === "string" ? this.setSortModel(decodeURI(data['sort'])) : this.defaultSortModel;
        this.noticeTypeModel = data['notice_type'] && data['notice_type'] !== null ? data['notice_type'] : '';
        this.setAsideModel = data['set_aside'] && data['set_aside'] !== null ? data['set_aside'] : '';
        this.oppDateFilterModel = data['opp_date_filter_model'] && data['opp_date_filter_model'] !== null ? JSON.parse(data['opp_date_filter_model']) : {};
        this.cfdaDateFilterModel = data['cfda_date_filter_model'] && data['cfda_date_filter_model'] !== null ? JSON.parse(data['cfda_date_filter_model']) : {};
        this.wdDateFilterModel = data['wd_date_filter_model'] && data['wd_date_filter_model'] !== null ? JSON.parse(data['wd_date_filter_model']) : {};
        this.fpdsDateFilterModel = data['fpds_date_filter_model'] && data['fpds_date_filter_model'] !== null ? JSON.parse(data['fpds_date_filter_model']) : {};
        this.dateFilterIndex = data.hasOwnProperty('date_filter_index') && data['date_filter_index'] !== null ? parseInt(data['date_filter_index']) : 0;
        this.dateRadSelection = data['date_rad_selection'] && data['date_rad_selection'] !== null ? data['date_rad_selection'] : "date";
        // recheck if date filter button should be disabled on refresh
        this.determineFilterDateDisable(this.determineTempModel());
        // reset date rad selection on appropriate config object (uses dateRadSelection above)
        this.resetRadSelection();
        this.builtDateModel = data['']
        //To display saved search title
        this.preferenceId = data['preference_id'] && data['preference_id'] !== null ? decodeURI(data['preference_id']) : '';
        this.searchName = this.cookieValue != null && data['preference_id'] && data['preference_id'] !== null ? this.getSavedSearch(decodeURI(data['preference_id'])) : '';
        // persist duns filter data
        if(this.dunsListString && this.dunsListString.length > 0){
          this.grabPersistData(this.dunsListString);
        } else {
          this.dunsModelList = [];
        }
        this.isSearchComplete = false;
        this.runSearch();
        this.blankSearch = this.keywordsModel.length === 0;
        this.setupSortOptions(this.blankSearch);
        this.loadParams();
      });

  }

  setupOrgsFromQS(orgsStr){
    if(!orgsStr){
      return [];
    }
    let decodedStr = decodeURIComponent(orgsStr);
    let orgsArray = decodedStr.split(",");
    return orgsArray;
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
  onOrganizationChange(selectedOrgs: any) {
    let organizationStringList = '';
    let stringBuilderArray = selectedOrgs.map(function (organizationItem) {
      if (organizationStringList === '') {
        organizationStringList += organizationItem.orgKey;
      }
      else {
        organizationStringList += ',' + organizationItem.orgKey;
      }

      return organizationStringList;
    });

    this.previousStringList = this.organizationId;

    // storing current organization string list
    this.organizationId = organizationStringList;


    // we only want to change page number when the organization list has changed
    if (this.previousStringList !== this.organizationId) {
      this.pageNum = 0;
      this.pageUpdate = true;
      var qsobj = this.setupQS(false);
      let navigationExtras: NavigationExtras = {
        queryParams: qsobj
      };
      if (this.showRegionalOffices) {
        this.router.navigate(['/search/fal/regionalAssistanceLocations'], navigationExtras);
      } else {
        this.router.navigate(['/search'], navigationExtras);
      }
      //reset sort change checker
      this.sortChange = false;
    }

  }

  setupSortOptions(blankSearch){
    var blankSortOptions = [
      {label:'Title', name:'Title', value:'title'},
      {label:'Date Modified', name:'Date Modified', value:'modifiedDate'}
    ];
    var querySortOptions = [
      {label:'Relevance', name:'Relevance', value:'relevance'},
      {label:'Title', name:'Title', value:'title'},
      {label:'Date Modified', name:'Date Modified', value:'modifiedDate'}
    ];
    var blankEntSortOptions = [
      {label:'Title', name:'Title', value:'title'}
    ];
    var queryEntSortOptions = [
      {label:'Relevance', name:'Relevance', value:'relevance'},
      {label:'Title', name:'Title', value:'title'}
    ];

    if(!blankSearch){
      if(this.index === 'ei'){
        this.sortOptions = queryEntSortOptions;
      }else{
        this.sortOptions = querySortOptions;
      }
    }else{
      if(this.index === 'ei'){
        this.sortOptions = blankEntSortOptions;
      }else{
        this.sortOptions = blankSortOptions;
      }
    }
  }

  setupQS(newsearch) {
    var qsobj = {};
    if(this.preferenceId != '') {
      qsobj['preference_id'] = this.preferenceId;
    }

    if (this.index.length > 0) {
      qsobj['index'] = this.index;
    } else {
      qsobj['index'] = '';
    }

    if (!newsearch && this.pageNum >= 0) {
      qsobj['page'] = this.pageNum + 1;
    } else {
      qsobj['page'] = 1;
    }
    qsobj['is_active'] = this.isActive;

    //wd or sca type param
    if (this.wdTypeModel.length > 0) {
      qsobj['wdType'] = this.wdTypeModel;
    }

    //wd dba construction type param
    if (this.wdConstructModel.length > 0) {
      qsobj['construction_type'] = this.wdConstructModel;
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
      qsobj['organization_id'] = this.organizationId;
    }

    //wd Non Standard drop down param
    if (this.wdNonStandardSelectModel.length > 0) {
      qsobj['service'] = this.wdNonStandardSelectModel;
    }

    //wd Non Standard radio button param
    if (this.wdNonStandardRadModel.length > 0) {
      qsobj['is_wd_even'] = this.wdNonStandardRadModel;
      // this rad button determines isStandard as well
      qsobj["is_standard"] = this.isStandard;
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
      qsobj['award_or_idv'] = this.awardIDVModel;
    }

    if (this.awardTypeModel.length > 0) {
      qsobj['award_type'] = this.awardTypeModel;
    }

    if (this.contractTypeModel.length > 0) {
      qsobj['contract_type'] = this.contractTypeModel;
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
      qsobj['beneficiary_type'] = this.benElSearchString;
    }

    if (this.appElSearchString.length > 0) {
      qsobj['applicant_type'] = this.appElSearchString;
    }

    if (this.assistanceTypeFilterModel.length > 0) {
      qsobj['assistance_type'] = this.assistanceTypeFilterModel;
    }

    if (this.registrationExclusionCheckboxModel.length > 0) {
      qsobj['entity_type'] = this.registrationExclusionCheckboxModel;
    }

    if (this.keywordsModel && this.keywordsModel.length > 0) {
      qsobj['keywords'] = this.keywordSplitter(this.keywordsModel);
      this.blankSearch = false;
    } else {
      qsobj['keywords'] = '';
      this.blankSearch = true;
    }

    if (this.noticeTypeModel && this.noticeTypeModel.length > 0){
      qsobj['notice_type'] = this.noticeTypeModel;
    }

    if (this.setAsideModel && this.setAsideModel.length > 0){
      qsobj['set_aside'] = this.setAsideModel;
    }

    if (this.oppDateFilterModel && !_.isEmpty(this.oppDateFilterModel)){
      qsobj['opp_date_filter_model'] = JSON.stringify(this.oppDateFilterModel);
    }

    if (this.cfdaDateFilterModel && !_.isEmpty(this.cfdaDateFilterModel)){
      qsobj['cfda_date_filter_model'] = JSON.stringify(this.cfdaDateFilterModel);
    }

    if (this.wdDateFilterModel && !_.isEmpty(this.wdDateFilterModel)){
      qsobj['wd_date_filter_model'] = JSON.stringify(this.wdDateFilterModel);
    }

    if (this.fpdsDateFilterModel && !_.isEmpty(this.fpdsDateFilterModel)){
      qsobj['fpds_date_filter_model'] = JSON.stringify(this.fpdsDateFilterModel);
    }

    qsobj['date_filter_index'] = this.dateFilterIndex;

    if (this.dateRadSelection){
      qsobj['date_rad_selection'] = this.dateRadSelection;
    }

    //If changing sort option, reset to default sort order for that option
    if(this.oldSortModel['type'] !== this.sortModel['type']){
      switch(this.sortModel['type']){
          case 'relevance':
            this.sortModel['sort'] = 'desc';
            break;
          case 'modifiedDate':
            this.sortModel['sort'] = 'desc';
            break;
          case 'title':
            this.sortModel['sort'] = 'asc';
            break;
      }
    }

    //Set sort for keyword search and blank search based on sort option change or page change
      if(!this.blankSearch) {
          if(this.sortChange || this.pageUpdate) {
            qsobj['sort'] = (this.sortModel['sort'] == 'desc' ? '-' : '')+(this.sortModel['type']);
            this.pageUpdate = false;
          } else {
            qsobj['sort'] = (this.sortModel['sort'] == 'desc' ? '-' : '')+(this.keywordSortModel['type']);
          }
      } else {
          if(this.sortChange || this.pageUpdate) {
            qsobj['sort'] = (this.sortModel['sort'] == 'desc' ? '-' : '')+(this.sortModel['type']);
            this.pageUpdate = false;
          } else {
            qsobj['sort'] = (this.sortModel['sort'] == 'desc' ? '-' : '')+(this.defaultSortModel['type']);
          }
      }

    return qsobj;
  }

  runSearch() {
    // showing spinner while data fetches
    this.showSpinner = true;
    let filteredDictionaries;
    switch (this.index) {
      // fetching data for drop downs
      case 'wd':
        filteredDictionaries = this.dictionaryService.filterDictionariesToRetrieve('wdStates,dbraConstructionTypes,scaServices');
        this.getWageDeterminationDictionaryData(filteredDictionaries);
        if(this.wdStateModel !== '') {
          this.getCountyByState(this.wdStateModel);
        }
        this.determineEnableCountySelect();
        this.determineEnableServicesSelect();
        break;
      case 'opp':
        filteredDictionaries = this.dictionaryService.filterDictionariesToRetrieve('procurement_type,naics_code,classification_code,set_aside_type');
        this.getAwardsDictionaryData(filteredDictionaries);
        break;
      case 'ei':
      case 'fpds':
        filteredDictionaries = this.dictionaryService.filterDictionariesToRetrieve('naics_code,classification_code');
        this.getAwardsDictionaryData(filteredDictionaries);

        // set options for set aside filter to hard coded values if index is fpds
        this.setAsideType.options = new SortArrayOfObjects().transform(this.setAsideAwardsOptions, "label");

        break;
      case 'cfda':
        filteredDictionaries = this.dictionaryService.filterDictionariesToRetrieve('applicant_types,beneficiary_types,assistance_type');
        this.getProgramsDictionaryData(filteredDictionaries);
        break;
      default:
        this.dismissWdAlert = false;
    }
    //make featuredSearch api call only for first page
    if (this.pageNum <= 0 && this.keywords !== '' && (!this.index || this.index == 'fh' || this.index == 'fpds')) {
      this.searchService.featuredSearch({
        keyword: this.keywords
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
      keyword: this.keywordSplitter(this.keywordsModel),
      index: this.index,
      pageNum: this.pageNum,
      organization_id: this.organizationId,
      is_active: this.isActive,
      wdType: this.wdTypeModel,
      construction_type: this.wdConstructModel,
      state: this.wdStateModel,
      county: this.wdCountyModel,
      service: this.wdNonStandardSelectModel,
      is_wd_even: this.wdNonStandardRadModel,
      is_standard: this.isStandard,
      award_or_idv: this.awardIDVModel,
      award_type: this.awardTypeModel,
      contract_type: this.contractTypeModel,
      naics: this.naicsTypeModel,
      psc: this.pscTypeModel,
      showRO: this.showRegionalOffices,
      ro_keyword: this.ro_keyword,
      duns: this.dunsListString,
      applicant_type: this.appElSearchString,
      beneficiary_type: this.benElSearchString,
      assistance_type: this.assistanceTypeFilterModel,
      entity_type: this.registrationExclusionCheckboxModel,
      notice_type: this.noticeTypeModel,
      set_aside: this.setAsideModel,
      sort: (this.sortModel['sort'] == 'desc' ? '-' : '')+(this.sortModel['type']),
      publish_date: this.dateFilterRequestSorter('publish', 'date'),
      ['publish_date.from']: this.dateFilterRequestSorter('publish', 'from'),
      ['publish_date.to']: this.dateFilterRequestSorter('publish', 'to'),
      modified_date: this.dateFilterRequestSorter('modified', 'date'),
      ['modified_date.from']: this.dateFilterRequestSorter('modified', 'from'),
      ['modified_date.to']: this.dateFilterRequestSorter('modified', 'to'),
      response_date: this.dateFilterRequestSorter('response', 'date'),
      ['response_date.from']: this.dateFilterRequestSorter('response', 'from'),
      ['response_date.to']: this.dateFilterRequestSorter('response', 'to'),
      signed_date: this.dateFilterRequestSorter('signed', 'date'),
      ['signed_date.from']: this.dateFilterRequestSorter('signed', 'from'),
      ['signed_date.to']: this.dateFilterRequestSorter('signed', 'to'),
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
        // set keywords filter with keywords from response
        if(!this.showRegionalOffices && data.hasOwnProperty('_embedded')){
          if(data['_embedded'].hasOwnProperty('stringList')){
            this.keywordsModel = this.keywordRebuilder(data['_embedded']['stringList']);
          }else{
            this.keywordsModel = [];
          }
        }else{
          this.keywordsModel = [];
        }


        this.oldKeyword = this.keywords;
        this.initLoad = false;
        this.isSearchComplete = true;
      },
      error => {
        console.error("Error!!", error);
      },
      () => {
        //hide spinner when call is complete
        this.showSpinner = false;
      }
    );
    //construct qParams to pass parameters to object view pages
    this.qParams = this.setupQS(false);
  }

  // get dictionary data from dictionary API for samselects and map the response array to properly set config options
  getWageDeterminationDictionaryData(id) {
    if (id === ''){
      this.filterWageDeterminationArray(this.dictionaryService.dictionaries);
    }else{
      this.dictionaryService.getWageDeterminationDictionary(id).subscribe(
        data => {
          this.filterWageDeterminationArray(data);
        },
        error => {
          console.error("Error!!", error);
        }
      );
    }
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

        this.selectCountyConfig.options = reformattedArray;

        if (this.wdCountyModel !== "" && this.initLoad) {
          this.countyObject = reformattedArray.filter((option) => {
            if (this.wdCountyModel.toString() === option.value.toString()) {
              return option;
            }
          })[0];
        }
      },
      error => {
        console.error("Error!!", error);
      }
    );
  }

  getAwardsDictionaryData(id) {
    if (id === ''){
      this.filterOpportunityArray(this.dictionaryService.dictionaries);
    }else{
      this.dictionaryService.getOpportunityDictionary(id).subscribe(
        data => {
          this.filterOpportunityArray(data);
        },
        error => {
          console.error("Error!!", error);
        }
      );
    }
  }

  getProgramsDictionaryData(id) {
    if (id === ''){
      this.filterProgramArray(this.dictionaryService.dictionaries);
    }else{
      this.dictionaryService.getProgramDictionaryById(id).subscribe(
        data => {
          this.filterProgramArray(data);
        },
        error => {
          console.error("Error!!", error);
        }
      );
    }
  }

  pageChange(pagenumber) {
    this.pageNum = pagenumber;
    this.pageUpdate = true;
    var qsobj = this.setupQS(false);
    let navigationExtras: NavigationExtras = {
      queryParams: qsobj
    };

    document.getElementById('search-results').getElementsByTagName('div')[0].focus();
    if (this.showRegionalOffices) {
      this.router.navigate(['/search/fal/regionalAssistanceLocations'], navigationExtras);
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
    this.pageNum = 0;
    this.searchResultsRefresh();
  }

  // event for wdFilter Change
  wdFilterChange(event) {

    // set the models equal to empty if the opposite wd type is selected
    if (this.wdTypeModel === 'sca') {
      this.wdConstructModel = '';
      this.wdConstructObject = null;
    }
    else {
      this.wdNonStandardRadModel = '';
      this.wdNonStandardSelectModel = '';
      this.wdNonStandardSelectObject = null;
      this.wdPreviouslyPerformedModel = '';
      this.wdSubjectToCBAModel = '';
    }
    this.pageNum = 0;

    let filteredDictionaries = this.dictionaryService.filterDictionariesToRetrieve('dbraConstructionTypes');
    this.getWageDeterminationDictionaryData(filteredDictionaries);

    this.searchResultsRefresh();
  }

  // event for construction type change
  constructionTypeChange(event) {
    this.wdConstructObject = event;
    this.wdConstructModel = this.wdConstructObject ? this.wdConstructObject.value : '';

    this.pageNum = 0;

    if (this.wdConstructModel) {
      this.alertFooterService.registerFooterAlert({
        title: "Search Criteria Complete",
        description: "",
        type: "success",
        timer: 5000
      });
    }

    this.searchResultsRefresh();
  }

  // event for state change
  stateChange(event) {
    this.wdStateObject = event;
    this.wdStateModel = this.wdStateObject ? this.wdStateObject.value : '';
    // reset county model on state change
    this.wdCountyModel = '';
    this.pageNum = 0;
    // enable county select if needed
    this.determineEnableCountySelect();
    this.searchResultsRefresh();
  }

  countyChange(event) {
    this.countyObject = event;
    this.wdCountyModel = this.countyObject ? this.countyObject.value : '';
    this.pageNum = 0;
    this.searchResultsRefresh();
  }

  // determines if state is populated and if not disables county select
  determineEnableCountySelect() {
    if (this.wdStateModel !== "") {
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
      this.wdNonStandardSelectObject = null;
    }

    // determine isStandard filter
    if (this.wdNonStandardRadModel === 'yesNSS') {
      this.isStandard = 'false';
    }
    else if (this.wdNonStandardRadModel === 'true' || this.wdNonStandardRadModel === 'false') {
      this.isStandard = 'true';
    }

    // show end of filters notification
    if (this.wdNonStandardRadModel !== 'yesNSS' || (this.wdNonStandardRadModel === 'yesNSS' && this.wdNonStandardSelectModel !== '')) {
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
    this.wdNonStandardSelectObject = event;
      this.wdNonStandardSelectModel = this.wdNonStandardSelectObject ? this.wdNonStandardSelectObject.value : '';
    // if drop down selection made, auto-select yes rad button
    if (this.wdNonStandardSelectModel !== '') {
      this.wdNonStandardRadModel = 'yesNSS'
      this.wdNonStandardRadChanged(this.wdNonStandardRadModel);
    }
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

  assistanceTypeFilterSelected(evt) {
    this.assistanceTypeFilterModel = evt.toString();
    this.pageNum = 0;
    this.searchResultsRefresh();
  }

  // type of notice model change
  noticeTypeModelChange(evt){
    this.noticeTypeModel = evt.toString();
    this.pageNum = 0;
    this.searchResultsRefresh();
  }

  // set aside model change
  setAsideModelChange(evt){
    this.setAsideModel = evt.toString();
    this.pageNum = 0;
    this.searchResultsRefresh();
  }

  // this calls function to set up ES query params again and re-call the search endpoint with updated params
  searchResultsRefresh() {
    this.pageUpdate = true;
    var qsobj = this.setupQS(false);
    let navigationExtras: NavigationExtras = {
      queryParams: qsobj
    };
    if (this.showRegionalOffices) {
      this.router.navigate(['/search/fal/regionalAssistanceLocations'], navigationExtras);
    } else {
      this.router.navigate(['/search'], navigationExtras);
    }
    //reset sort change checker
    this.sortChange = false;
  }

  wdTypeRadClear() {
    this.wdTypeModel = '';

    this.wdPreviouslyPerformedClear();
    this.wdConstructionClear();
    this.pageNum = 0;
  }

  wdConstructionClear() {
    this.wdConstructModel = '';
    this.wdConstructObject = null;
    this.pageNum = 0;

    this.searchResultsRefresh();
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
    this.wdNonStandardSelectObject = null;
    this.wdNonStandardRadModel = '';
    this.pageNum = 0;

    this.searchResultsRefresh();
  }

  clearAllFilters() {

    //clear saved search title
    this.searchName = "";

    // clear/reset all top level filters
    this.isActive = true;
    this.keywordsModel = [];
    this.setupSortOptions(true);
    if(this.index === 'ei'){
      this.oldSortModel = this.entitySortModel;
      this.sortModel = this.entitySortModel;
    }else{
      this.oldSortModel = this.defaultSortModel;
      this.sortModel = this.defaultSortModel;
    }


    // call wd clear filters
    this.wdStateObject = null;
    this.wdStateModel = '';
    this.countyObject = null;
    this.wdCountyModel = '';

    // each clear calls the clear method beneath it, so all depencies are cleared
    this.wdTypeRadClear();

    // call clear for agency picker
    if (this.agencyPickerV2) {
      this.agencyPickerModel = [];
      this.organizationId = '';
      this.agencyPickerV2.clearAdvanced();
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

    //set entity type checkbox to default
    if(this.index == 'ei'){
      this.registrationExclusionCheckboxModel=["ent","ex"];
    }

    // clear set aside filter
    this.setAsideModel = '';

    // clear notice type filter
    this.noticeTypeModel = '';

    this.oppDateFilterModel = {};
    this.cfdaDateFilterModel = {};
    this.wdDateFilterModel = {};
    this.fpdsDateFilterModel = {};
    this.dateFilterIndex = 0;

    this.disableAllDateFilter();

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

  filterWageDeterminationArray(data){

    // formatting the array data according to api type to match what UI elements expect
    // state data
      let reformattedArray1 = data['wdStates'].map(function (stateItem) {
        let newObj = {label: '', value: ''};

        newObj.label = stateItem.value;
        newObj.value = stateItem.elementId;
        return newObj;
      });
      // adding the default selection row to the array
      this.selectStateConfig.options = new SortArrayOfObjects().transform(reformattedArray1, "label");

      if (this.wdStateModel !== "" && this.initLoad) {
        this.wdStateObject = reformattedArray1.filter((option) => {
          if (this.wdStateModel.toString() === option.value.toString()) {
            return option;
          }
        })[0];
      }


    // construction type data
      let reformattedArray2 = data['dbraConstructionTypes'].map(function (constructionItem) {
        let newObj = {label: '', value: ''};

        newObj.label = constructionItem.value;
        newObj.value = constructionItem.value;
        return newObj;
      });

      this.selectConstructConfig.options = new SortArrayOfObjects().transform(reformattedArray2, "label");

      if (this.wdConstructModel !== "" && this.initLoad) {
        this.wdConstructObject = reformattedArray2.filter((option) => {
          if (option.value.toString() === this.wdConstructModel.toString()) {
            return option;
          }
        })[0];
      }

    // scaServices type data
      let reformattedArray3 = data['scaServices'].map(function (serviceItem) {
        let newObj = {label: '', value: ''};

        newObj.label = serviceItem.value;
        newObj.value = serviceItem.elementId;
        return newObj;
      });

      this.wdNonStandardSelectConfig.options = new SortArrayOfObjects().transform(reformattedArray3, "label");

      if (this.wdNonStandardSelectModel !== "" && this.initLoad) {
        this.wdNonStandardSelectObject = reformattedArray3.filter((option) => {
          if (parseInt(option.value) === parseInt(this.wdNonStandardSelectModel)) {
            return option;
          }
        })[0];
      }
  }

  filterOpportunityArray(data){
    // formatting the array data according to api type to match what UI elements expect

    if(data && data.hasOwnProperty('naics_code')){
      var reformattedArray1 = data['naics_code'].map(function (naicsItem) {
        let newObj = {label: '', value: '', type: 'naics'};

        newObj.label = naicsItem.value;
        newObj.value = naicsItem.code;
        return newObj;
      });

      this.naicsType.options = new SortArrayOfObjects().transform(reformattedArray1, "label");
      this.naicsType = Object.assign({}, this.naicsType);
    }

    if(data && data.hasOwnProperty('classification_code')) {
      var reformattedArray2 = data['classification_code'].map(function (pscItem) {
        let newObj = {label: '', value: '', type: 'psc'};

        newObj.label = pscItem.value;
        newObj.value = pscItem.code;
        return newObj;
      });

      this.pscType.options = new SortArrayOfObjects().transform(reformattedArray2, "label");
      this.pscType = Object.assign({}, this.pscType);
    }

    // Notice Type Filter Dictionary Data
    if(data && data.hasOwnProperty('procurement_type')) {
      var reformattedArray3 = data['procurement_type'].map(function (noticeItem) {
        let newObj = {label: '', value: ''};

        newObj.label = noticeItem.value=="Modification/Amendment/Cancel" ? "Canceled" : noticeItem.value;
        newObj.value = noticeItem.code=="m" ? "c" : noticeItem.code;
        return newObj;
      });

      this.noticeType.options = new SortArrayOfObjects().transform(reformattedArray3, "label");
      this.noticeType = Object.assign({}, this.noticeType);
    }

    // Set Aside Type Filter Dictionary Data
    if(data && data.hasOwnProperty('set_aside_type')) {
      var reformattedArray3 = data['set_aside_type'].map(function (setAsideItem) {
        let newObj = {label: '', value: ''};

        newObj.label = setAsideItem.value;
        newObj.value = setAsideItem.code;
        return newObj;
      });

      this.setAsideType.options = new SortArrayOfObjects().transform(reformattedArray3, "label");
      this.setAsideType = Object.assign({}, this.setAsideType);
    }
  }
  filterProgramArray(data){
    // formatting the array data according to api type to match what UI elements expect
      var reformattedArray1 = data['applicant_types'].map(function (item) {
        let newObj = {label: '', value: '', type: 'applicant'};

        newObj.label = item.displayValue;
        newObj.value = item.code;
        return newObj;
      });
      this.appElType.options = new SortArrayOfObjects().transform(reformattedArray1, "label");
      this.appElType = Object.assign({}, this.appElType);

      var reformattedArray2 = data['beneficiary_types'].map(function (item) {
        let newObj = {label: '', value: '', type: 'beneficiary'};

        newObj.label = item.displayValue;
        newObj.value = item.code;
        return newObj;
      });
      this.benElType.options = new SortArrayOfObjects().transform(reformattedArray2, "label");
      this.benElType = Object.assign({}, this.benElType);

      let inputArr = [];
      var reformattedArray4 = data['assistance_type'].map(function (item) {
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
      reformattedArray4 = inputArr;
      this.assistanceTypeOptions.options = new SortArrayOfObjects().transform(reformattedArray4, "label");
      this.assistanceTypeOptions = Object.assign({}, this.assistanceTypeOptions);
  }

  keywordsModelChange(value){
    var spaceDelimitedString="";

    this.keywordsModel = value;

    // build space-delimited string
    if(value && value.length > 0){
      spaceDelimitedString = this.keywordSplitter(value);
      this.sortModel = this.keywordSortModel;
    }else{
      if(this.index === 'ei'){
        this.sortModel = this.entitySortModel;
      }else{
        this.sortModel = this.defaultSortModel;
      }
    }

    // set normal keyword param with space delimited string
    this.keywordsBuiltString = spaceDelimitedString;

    // refresh results
    this.pageNum = 0;
    this.searchResultsRefresh();
  }

  // splits array into a space-delimited string
  keywordSplitter(keywordArray){
    var newString = "";

    if(keywordArray && keywordArray !== ""){
      // use reduce to separate items into string: item1 + " " + item2 etc
      newString = keywordArray.reduce(function(accumulator, currentVal){
        if(accumulator === ""){
          return currentVal.value;
        }

        return accumulator + " " + currentVal.value;
      }, "");
    }

    return newString;
  }

  // rebuilds a string or array of values back into a keyword array of objects
  keywordRebuilder(keywordStringOrArray){

    // if passed value is string
    if(typeof(keywordStringOrArray) === "string"){
      // use split to convert string to array
      var tempArray = keywordStringOrArray.split(' ');
      // use map to loop through all items and build objects
      return tempArray.map(function(item){
        var tempObj = {label:"", value:""};
        tempObj.label = item;
        tempObj.value = item;
        return tempObj;
      });
    }

    // if passed value is array
    else if(Array.isArray(keywordStringOrArray)){
      // use map to loop through all items and build objects
      return keywordStringOrArray.map(function(item){
        var tempObj = {label:"", value:""};
        tempObj.label = item;
        tempObj.value = item;
        return tempObj;
      });
    }
  }

    // sortBy model change
    sortModelChange(event) {
      this.sortChange = true;
      this.oldSortModel = this.sortModel;
      this.sortModel = event;
      this.pageNum = 0;
      this.searchResultsRefresh();
    }

    setSortModel(sortBy) {
      if(sortBy.substring(0, 1) === '-') {
        return {type: sortBy.substring(1), sort: 'desc'};
      } else {
        return {type: sortBy, sort: 'asc'};
      }
    }
  
  handleAction(event) {
    if(event.name === 'saveAs') {
      this.modal1.openModal();
    }
    if(event.name === 'save') {
      this.saveSearch();
    }
  }

  onModalClose(event){
    this.savedSearchName = '';
    this.textConfig.errorMessage = '';
  }

  saveNewSearch(event) {
    if(this.savedSearchName != '') {
      let data = {
        'index': this.index.split(" "),
        'key': this.savedSearchName.toLowerCase().replace(/ /g, "-"),
        'parameters': this.getParametersToSave()
      };
      var createSavedSearch = {
        'title': this.savedSearchName,
        'data': data
      };
      this.savedSearchService.createSavedSearch(this.cookieValue, createSavedSearch).subscribe(res => {
        this.preferenceId = res._body;
        this.searchName = this.savedSearchName;

        this.modal1.closeModal();
        this.refreshAfterSave();
      }, error => {
        let errorRes = error.json();
        if(error && error.status === 400 && errorRes.message.indexOf(":")>-1) {
          this.textConfig.errorMessage = errorRes.message.split(":")[1];
        }
      })
    } else {
      this.textConfig.errorMessage = 'Please provide a name';
    }

  }

  saveSearch() {
    this.savedSearch['data']['parameters'] = this.getParametersToSave();
    
    this.savedSearchService.updateSavedSearch(this.cookieValue, this.preferenceId, this.savedSearch).subscribe(res => {
      this.refreshAfterSave();
    }, error => {
      let errorRes = error.json();
      if(error && error.status === 400 && errorRes.message.indexOf(":")>-1) {
        this.errorFooterAlertModel.description = errorRes.message.split(":")[1];
        this.alertFooterService.registerFooterAlert(JSON.parse(JSON.stringify(this.errorFooterAlertModel)));
      }
    })
  }

  getSavedSearch(id) {
    this.preferenceId = id;
    this.savedSearchService.getSavedSearch(this.cookieValue, id).subscribe(data => {
      this.savedSearch['title'] = data['title'];
      this.savedSearch['data'] = data['data'];
      this.savedSearch['lastUsageDate'] = data['lastUsageDate'];
      this.savedSearch['numberOfUsages'] = data['numberOfUsages'];
      this.searchName = data['title'];
      this.actions = [
        { name: 'save', label: 'Save Search', icon: 'fa fa-floppy-o', callback: this.actionsCallback },
        { name: 'saveAs', label: 'Save As New', icon: 'fa fa-files-o', callback: this.actionsCallback }
      ];
    }, error => {
      if(error && (error.status === 404 || error.status === 401 || error.status === 400)) {
        console.error("Error", error);
      }
    });
  }

  getParametersToSave() {
    this.sortChange = true; //this is required to construct selected sort by
    var parameters = this.setupQS(false);
    delete parameters['index'];
    delete parameters['preference_id'];
    return parameters;
  }

  refreshAfterSave() {
    this.successFooterAlertModel.description = 'Search saved.';
    this.searchResultsRefresh();
    this.alertFooterService.registerFooterAlert(JSON.parse(JSON.stringify(this.successFooterAlertModel)));
  }

  filterHandler(evt){
    // setting dateFilterIndex
    if(evt.hasOwnProperty('index')){
      this.dateFilterIndex = evt['index'];
    }else{
      this.dateFilterIndex = 0;
    }
    // determining which model get data from
    var tempModel = this.determineTempModel();

    // determine date radio button selection
    this.dateRadSelection = tempModel && tempModel.hasOwnProperty('dateRange') ? 'dateRange' : 'date';
    // set rad selection in the appropriate config object to persist rad selection
    this.resetRadSelection();
    this.pageNum = 0;
    this.searchResultsRefresh();
  }

  filterClearHandler(evt){
    this.oppDateFilterModel = {};
    this.cfdaDateFilterModel = {};
    this.wdDateFilterModel = {};
    this.fpdsDateFilterModel = {};
    this.dateFilterIndex = 0;
    this.disableAllDateFilter();

    this.pageNum = 0;
    this.searchResultsRefresh();
  }

  // This function determines if a string-built date should be returned (called for every potential date the backend accepts) for the provided param
  dateFilterRequestSorter(param, type){
    // determining which model get data from
    var tempModel = this.determineTempModel();
    var tempMap = this.determineTempMap();

    // check passed param against tempmap[index] to see if they match if they do continue check if not return ""
    if(tempModel && !_.isEmpty(tempModel)){
      if(tempMap){
        // checking if selected date-type matches -- if it doesn't we will return nothing (we only want to send dates to the backend for currently selected tab)
        if(tempMap.get(this.dateFilterIndex) === param){
          // check passed 'type' against radSelection variable
          if(this.dateRadSelection === 'date' && type === 'date'){
            // build 'date' date if it exists in the model
            if(tempModel && tempModel.hasOwnProperty('date')){
              return tempModel['date'] + this.fetchFormattedTimeZoneOffset(tempModel['date'])
            }
          }
          // if radio selection is dateRange then type should be from or to
          else if(this.dateRadSelection === 'dateRange' && (type === 'from' || type === 'to')){
            // if type is 'from' build from date
            if(type === 'from'){
              return tempModel['dateRange']['startDate'] + this.fetchFormattedTimeZoneOffset(tempModel['dateRange']['startDate']);
            }

            // if type is 'to' build to date
            else if(type === 'to'){
              return tempModel['dateRange']['endDate'] + this.fetchFormattedTimeZoneOffset(tempModel['dateRange']['endDate']);
            }
          }
          return "";
        }
      }
      else{
        return "";
      }
    }
  return "";
  }

  // this function fetches time zone offset and formats it as needed for the backend
  fetchFormattedTimeZoneOffset(dateFilter){
    var timezone_offset_min = new Date(dateFilter).getTimezoneOffset(),
    offset_hrs = parseInt(Math.abs(timezone_offset_min/60)),
    offset_min = Math.abs(timezone_offset_min%60),
    timezone_standard;

    if(offset_hrs < 10)
      offset_hrs = '0' + offset_hrs;

    if(offset_min < 10)
      offset_min = '0' + offset_min;

    // Add an opposite sign to the offset
    if(timezone_offset_min < 0)
      timezone_standard = '+' + offset_hrs + ':' + offset_min;
    else if(timezone_offset_min > 0)
      timezone_standard = '-' + offset_hrs + ':' + offset_min;
    else if(timezone_offset_min == 0)
      timezone_standard = 'Z';

    // Timezone difference in hours and minutes
    // String such as +5:30 or -6:00 or Z
    return timezone_standard;
  }

  // this function determines rad selection to select when we are persisting data from the url depending in index
  resetRadSelection(){
    if(this.index === 'cfda'){
      this.cfdaDateRangeConfig[this.dateFilterIndex]['dateFilterConfig']['radSelection'] = this.dateRadSelection;
    }else if(this.index === 'opp'){
      this.oppDateRangeConfig[this.dateFilterIndex]['dateFilterConfig']['radSelection'] = this.dateRadSelection;
    }else if(this.index === 'wd'){
      this.wdDateRangeConfig[this.dateFilterIndex]['dateFilterConfig']['radSelection'] = this.dateRadSelection;
    }else if(this.index === 'fpds'){
      this.fpdsDateRangeConfig[this.dateFilterIndex]['dateFilterConfig']['radSelection'] = this.dateRadSelection;
    }
  }

  // this function eliminates redundant times when the correct model to be used for date filtering must be determined based on index
  determineTempModel(){
    var tempModel;
    // determining which model get data from
    if(this.index === 'cfda'){
      tempModel = this.cfdaDateFilterModel;
    }else if(this.index === 'opp'){
      tempModel = this.oppDateFilterModel;
    }else if(this.index === 'wd'){
      tempModel = this.wdDateFilterModel;
    }else if(this.index === 'fpds'){
      tempModel = this.fpdsDateFilterModel;
    }
    return tempModel;
  }

  // this function builds maps that map to the same indexes as the date component tabs
  // so we can just reference the map using this.dateFilterIndex to pull the appropriate string
  determineTempMap(){
    var tempMap;
    let cfdaStringMap = new Map()
    .set(0, "publish")
    .set(1, "modified");
    let oppStringMap = new Map()
    .set(0, "modified")
    .set(1, "publish")
    .set(2, "response");
    let wdStringMap = new Map()
    .set(0, "modified");
    let fpdsStringMap = new Map()
    .set(0, "modified")
    .set(1, "signed");

    // determining which model get data from
    if(this.index === 'cfda'){
      tempMap = cfdaStringMap;
    }else if(this.index === 'opp'){
      tempMap = oppStringMap;
    }else if(this.index === 'wd'){
      tempMap = wdStringMap;
    }else if(this.index === 'fpds'){
      tempMap = fpdsStringMap;
    }
    return tempMap;
  }

  // this function determines if the appropriate filter button for the different dates should be disabled or not
  determineFilterDateDisable(evt){
    // check the state of the current date[index] thats all that matters
    if(evt){
      // if date range
      if(evt.hasOwnProperty('dateRange') && evt['dateRange'] !== undefined && evt['dateRange'] !== null){
        // if date range has invalid date
        if(evt['dateRange']['startDate'].toLowerCase() === 'invalid date' || evt['dateRange']['endDate'].toLowerCase() === 'invalid date'){
          this.disableAppropriateFilter();
        }
        // if one of the date range dates was not filled out
        else if(evt['dateRange']['startDate'] === '' || evt['dateRange']['endDate'] === ''){
          this.disableAppropriateFilter();
        }
        // if one of the date ranges doesn't have the full year
        else if(evt['dateRange']['startDate'].substring(0,1) === '0' || evt['dateRange']['endDate'].substring(0,1) === '0'){
          this.disableAppropriateFilter();
        }
        else{
          this.enableAppropriateFilter();
        }
      }
      // if date
      else if(evt.hasOwnProperty('date') && evt['date'] !== undefined && evt['date'] !== null){
        // invalid date
        if(evt['date'].toLowerCase() === 'invalid date'){
          this.disableAppropriateFilter();
        }
        // if date doesn't have full year
        else if(evt['date'].substring(0,1) === '0'){
          this.disableAppropriateFilter();
        }else{
          this.enableAppropriateFilter();
        }
      }
      // wasn't date or date range
      else{
        this.disableAllDateFilter();
      }
    }
    // date with date index didn't exist
    else{
      this.disableAllDateFilter();
    }
  }

  // enables the date filter button for the current index sam-tab-date-range
  enableAppropriateFilter(){
    if(this.index === 'cfda'){
      this.disableCfdaFilter = false;
    }else if(this.index === 'opp'){
      this.disableOppFilter = false;
    }else if(this.index === 'wd'){
      this.disableWdFilter = false;
    }else if(this.index === 'fpds'){
      this.disableFpdsFilter = false;
    }
    this.changeDetectorRef.detectChanges();
  }
  // inverse of enable function
  disableAppropriateFilter(){
    if(this.index === 'cfda'){
      this.disableCfdaFilter = true;
    }else if(this.index === 'opp'){
      this.disableOppFilter = true;
    }else if(this.index === 'wd'){
      this.disableWdFilter = true;
    }else if(this.index === 'fpds'){
      this.disableFpdsFilter = true;
    }
    this.changeDetectorRef.detectChanges();
  }
  // disables date filter button for all sam-tab-date-range filter components
  disableAllDateFilter(){
    this.disableCfdaFilter = true;
    this.disableFpdsFilter = true;
    this.disableOppFilter = true;
    this.disableWdFilter = true;
    this.changeDetectorRef.detectChanges();
  }

  // this function just resets the rad selection in each date config to the default 'date'
  resetAllRadSelection(){
    this.cfdaDateRangeConfig.forEach(function(element){
      element['dateFilterConfig']['radSelection'] = 'date';
    });
    this.oppDateRangeConfig.forEach(function(element){
      element['dateFilterConfig']['radSelection'] = 'date';
    });
    this.wdDateRangeConfig.forEach(function(element){
      element['dateFilterConfig']['radSelection'] = 'date';
    });
    this.fpdsDateRangeConfig.forEach(function(element){
      element['dateFilterConfig']['radSelection'] = 'date';
    });
  }

  // handler when date filter tab is changed
  dateTypeChangeHandler(evt){
    this.dateFilterIndex = evt;
    this.determineFilterDateDisable(this.determineTempModel());

    // reset models on dateType change
    this.wdDateFilterModel = {};
    this.cfdaDateFilterModel = {};
    this.fpdsDateFilterModel = {};
    this.oppDateFilterModel = {};

    // reset all radio button selections to date on tab change
    this.resetAllRadSelection();
  }
}
