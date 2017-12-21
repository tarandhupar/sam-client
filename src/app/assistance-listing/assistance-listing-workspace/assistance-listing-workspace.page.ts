import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {Router, ActivatedRoute, NavigationExtras} from '@angular/router';
import {ProgramService} from 'api-kit';
import {FHService} from 'api-kit';
import { FALFormService } from "../assistance-listing-operations/fal-form.service";
import * as Cookies from 'js-cookie';
import * as _ from 'lodash';
import {ReplaySubject} from "rxjs/ReplaySubject";
import {Observable} from "rxjs/Observable";
import { IBreadcrumb } from "sam-ui-elements/src/ui-kit/types";
import { AlertFooterService } from "../../app-components/alert-footer/alert-footer.service";
import {FALAuthGuard} from "../components/authguard/authguard.service";
import 'rxjs/Rx';
import {Injectable} from 'angular2/core';



@Component({
  moduleId: __filename,
  templateUrl: 'assistance-listing-workspace.template.html',
  providers: [
    ProgramService,
    FHService,
    FALFormService
  ]
})

export class FalWorkspacePage implements OnInit, OnDestroy {
  private selectDateFilter: any;
  @ViewChild('autocomplete') autocomplete: any;
  @ViewChild('agencyPickerV2') agencyPickerV2;
  @ViewChild('selectDateFilter') set content(content: any){
    this.selectDateFilter = content;
  }
  private MODIFIED = 'modified';
  private POSTED = 'posted';
  private START_DAY = '00:00:00';
  private END_DAY = '23:59:59';

  showSpinner: boolean = false;
  keyword: string = '';
  index: string = '';
  organizationId: string = '';
  pageNum = 0;
  totalCount: any = 0;
  totalPages: any = 0;
  data = [];
  initLoad = true;
  oldKeyword: string = "";
  qParams: any = {};
  size: any = {};
  addFALButtonText: string = 'Add Assistance Listing';
  cookieValue: string;
  runProgSub: any;
  getTemplateSub: any;
  public permissions: any;
  pendingRequestCount: any;
  workspaceSearchConfig: any = {
    placeholder: "Search Workspace"
  };
  defaultStatus: any = ['published'];
  statusCheckboxModel: any = this.defaultStatus;
  statusCheckboxConfig = {
    options: [
      {value: 'published', label: 'Published', name: 'checkbox-published'},
      {value: 'pending', label: 'Pending - OMB', name: 'checkbox-pending'},
      {value: 'rejected', label: 'Rejected', name: 'checkbox-rejected'},
      {value: 'draft', label: 'Draft', name: 'checkbox-draft'},
      {value: 'draft_review', label: 'Draft Review', name: 'checkbox-draft-review'},
      {value: 'archived', label: 'Archived', name: 'checkbox-archived'},
    ],
    name: 'fal-status-filter',
    label: '',
    hasSelectAll: 'true'
  };
  requestTypeCheckboxModel: any = [];
  requestTypeCheckboxConfig = {
    options: [
      {value: 'archive_request', label: 'Archive', name: 'checkbox-archive'},
      {value: 'unarchive_request', label: 'Unarchive', name: 'checkbox-unarchive'},
      {value: 'title_request', label: 'Title Change', name: 'checkbox-title'},
      {value: 'agency_request', label: 'Agency Change', name: 'checkbox-agency'},
      {value: 'program_number_request', label: 'Number Change', name: 'checkbox-program-number'},
    ],
    name: 'fal-change-request-filter',
    label: '',
    hasSelectAll: false
  };
  defaultSort: any = {type:'programNumber', sort:'asc'};
  sortModel: any = this.defaultSort;
  sortOptions = [
    {label:'Date Published', name:'Date Published', value:'publishedDate'},
    {label:'Date Modified', name:'Date Modified', value:'modifiedDate'},
    {label:'CFDA Number', name:'CFDA Number', value:'programNumber'},
    {label:'Listing Title', name:'Listing Title', value:'title'}
  ];
  orgNameMap = new Map();
  orgTypeMap = new Map();
  postedDateFilterModel: any = {};
  modifiedDateFilterModel: any = {};
  postedFrom: any;
  postedTo: any;
  modifiedFrom: any;
  modifiedTo: any;
  dateFilterModel: any = {};
  internalDateModel: any = {};
  dateTypeOptions = [this.POSTED, this.MODIFIED];
  dateRangeConfig = [
    {
      title: 'Posted',
      dateFilterConfig: {
        options: [
          {name: 'posted_date', label: 'Date', value: 'date'},
          {name: 'posted_date_range', label: 'Date Range', value: 'dateRange'}
        ],
        radSelection: 'date'
      }
    },
    {
      title: 'Modified',
      dateFilterConfig: {
        options: [
          {name: 'modified_date', label: 'Date', value: 'date'},
          {name: 'modified_date_range', label: 'Date Range', value: 'dateRange'}
        ],
        radSelection: 'date'
      }
    }
  ];
  dateRadio = 'date';
  filterDisabled = true;
  dateFilterIndex = 0;
  crumbs: Array<IBreadcrumb> = [
   // { breadcrumb:'Home', url:'/',},
    { breadcrumb: 'Workspace', url: '/workspace' },
    { breadcrumb: 'Assistance Listings'}
  ];
  agencyPickerModel = [];
  previousStringList: string = '';
  public organizationData: any;
  public orgLevels: any;
  public orgRoots: any = [];

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
  serviceErrorFooterAlertModel = {
    title: "Error",
    description: "",
    type: "error"
  };
  disabled:boolean = false;
  userPermissions:any;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private programService: ProgramService, private fhService: FHService,
              private falFormService: FALFormService, private alertFooterService: AlertFooterService, private authGuard: FALAuthGuard,
              ) {
  }

  ngOnInit() {
    this.cookieValue = Cookies.get('iPlanetDirectoryPro');
    let userPermissionsAPI = this.loadUserPermissions();
    this.getUserPermissions()
    this.loadCountPendingRequest(userPermissionsAPI);
    this.getOrganizationLevels();
  }

  ngOnDestroy() {
    if (this.runProgSub)
      this.runProgSub.unsubscribe();
    if(this.getTemplateSub)
      this.getTemplateSub.unsubscribe();
  }

  // builds object we set into url to persist data
  setupQS() {
    let qsobj = {};
    if(this.keywordsModel.length > 0){
      qsobj['keywords'] = this.keywordSplitter(this.keywordsModel);
    } else {
      this.keywordsModel = [];
    }
    if (this.pageNum >= 0) {
      qsobj['page'] = this.pageNum + 1;
    } else {
      qsobj['page'] = 1;
    }
    if(this.statusCheckboxModel){
      qsobj['status'] = this.statusCheckboxModel.toString()
    }
    else {
      qsobj['status'] = '';
    }
    if(this.sortModel){
      qsobj['sortBy'] = (this.sortModel['sort'] == 'desc' ? '-' : '')+(this.sortModel['type']);
    }
    else {
      qsobj['sortBy'] = '';
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
    if(this.organizationId){
      qsobj['organizationId'] = this.organizationId;
    }
    if(this.requestTypeCheckboxModel){
      qsobj['requestType'] = this.requestTypeCheckboxModel.toString()
    }
    else {
      qsobj['requestType'] = '';
    }

    return qsobj;
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

  formatDateWrapper(appendTime: boolean){
     if(!_.isEmpty(this.dateFilterModel)){
       if(this.dateFilterModel.hasOwnProperty('date') && this.dateFilterModel.date){
         return this.formatDate(this.dateFilterModel, appendTime);
       }else if(this.dateFilterModel.hasOwnProperty('dateRange') && this.dateFilterModel.dateRange){
         return this.formatDateRange(this.dateFilterModel, appendTime);
       }
     }
   }

  formatDate(model, appendTime){
    if(!_.isEmpty(model)){
      if(appendTime){
        return {
          'startDate': model.date + ' ' + this.START_DAY,
          'endDate': model.date + ' ' + this.END_DAY
        }
      }
      return {
        'startDate': model.date,
        'endDate': model.date
      }
    }

  }
  formatDateRange(model, appendTime){
    if(!_.isEmpty(model)){
      if(appendTime){
        return {
          'startDate': model.dateRange.startDate + ' ' + this.START_DAY,
          'endDate': model.dateRange.endDate + ' ' + this.END_DAY
        }
      }
      return {
        'startDate': model.dateRange.startDate,
        'endDate': model.dateRange.endDate
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

  updateDateFilterConfig(index){
    this.dateRangeConfig[index].dateFilterConfig.radSelection = this.dateRadio;
    if(this.selectDateFilter){
      this.selectDateFilter.setCurrentDateOption(this.dateRangeConfig[index]);
    }
  }

  runProgram() {
    this.showSpinner = true;
    let dateTab = this.dateTypeOptions[this.dateFilterIndex];
    let appendTime = true;
    let dateObj = this.formatDateWrapper(appendTime);

    // make api call
    this.runProgSub = this.programService.runProgram({
      keyword: this.keywordSplitter(this.keywordsModel),
      pageNum: this.pageNum,
      Cookie: this.cookieValue,
      status: this.statusCheckboxModel ? this.statusCheckboxModel.toString() : this.defaultStatus,
      dateTab: dateTab,
      dateFilter: dateObj,
      sortBy: (this.sortModel['sort'] == 'desc' ? '-' : '')+(this.sortModel['type']),
      organizationId: this.organizationId,
      requestType: this.requestTypeCheckboxModel ? this.requestTypeCheckboxModel.toString() : ''
    }).subscribe(
      data => {
        if (data._embedded && data._embedded.program) {
          this.data = data._embedded.program;
          this.totalCount = data.page['totalElements'];
          this.size = data.page['size'];
          this.totalPages = data.page['totalPages'];

        } else {
          this.totalCount = 0;
          this.data = [];
        }
        this.oldKeyword = this.keyword;
        this.initLoad = false;
        //retrieving org names from fhservice by orgids and mapping org.orgKey to org.name
        this.createOrgNameMap();

        if(data._embedded && data._embedded.facets) {
          for(var facet of data._embedded.facets) {
            switch(facet['name']) {
              case 'status':
                this.statusCheckboxConfig.options = this.buildStatusFilterOptions(facet['buckets']);
                    break;
              case 'pendingChangeRequest':
                this.requestTypeCheckboxConfig.options = this.buildStatusFilterOptions(facet['buckets']);
                    break;
            }
          }
        }
        this.disabled = false;
      },
      error => {
        console.error('Error!!', error);
        let errorRes = error.json();
        if (error && (error.status === 502 || error.status === 504)) {
          this.serviceErrorFooterAlertModel.description = errorRes.message;
          this.alertFooterService.registerFooterAlert(JSON.parse(JSON.stringify(this.serviceErrorFooterAlertModel)));
        }
        this.disabled = false;
      },
      () => {
        //hide spinner when call is complete
        this.showSpinner = false;
      }
    );
    // construct qParams to pass parameters to object view pages
    this.qParams = this.setupQS();
  }


  pageChange(pagenumber) {
    this.pageNum = pagenumber;
    let qsobj = this.setupQS();
    let navigationExtras: NavigationExtras = {
      queryParams: qsobj
    };
    this.router.navigate(['fal/workspace/'], navigationExtras);
  }

  addAssistanceListingClick() {
    this.router.navigate(['fal/add']);
  }

  manageAssistanceLocationsClick(){
    this.router.navigate(['fal/myRegionalAssistanceLocations']);
  }

  workspaceSearchModel(event) {
    if(event == null) {
      this.autocomplete.inputValue = "";
      this.keyword = "";
    } else {
      this.keyword = event;
    }
  }

  workspaceSearchClick() {
    this.pageNum = 0;
    // build a new keywords model with keyword
    this.keywordsModel = this.keywordRebuilder(this.keyword);
    this.workspaceRefresh();
    this.keyword = '';
    this.autocomplete.inputValue = '';
  }

  keywordsModelChange(value){
    if(value.length === 1){
      this.keywordsModel = value;
    }
    // TODO: replace this code that removes additonal keywords from filter whenever tier 2 switches to searches against multiple keywords
    else if(value.length > 1){
      var tempArray = [];
      tempArray.push(value[value.length - 1]);
      this.keywordsModel = tempArray;
    }
    else{
      this.keywordsModel = [];
    }

    // refresh results
    this.disabled = true;
    this.pageNum = 0;
    this.workspaceRefresh();
  }

  private loadUserPermissions(): ReplaySubject<any>{
    let apiSubject = new ReplaySubject(1);
    this.programService.getPermissions(this.cookieValue, 'FAL_REQUESTS, ORG_LEVELS').subscribe(apiSubject);
    // runs anytime url changes, takes values from url and sets them into our variables
    apiSubject.subscribe(res => {
      this.permissions = res;
        this.activatedRoute.queryParams.subscribe(
          data => {
            this.pageNum = typeof data['page'] === "string" && parseInt(data['page']) - 1 >= 0 ? parseInt(data['page']) - 1 : 0;
            this.statusCheckboxModel = typeof data['status'] === "string" ? decodeURI(data['status']).split(",") : this.defaultStatus;
            this.requestTypeCheckboxModel = typeof data['requestType'] === "string" ? decodeURI(data['requestType']).split(",") : [];
            this.organizationId = typeof data['organizationId'] === "string" ? decodeURI(data['organizationId']) : "";
            this.agencyPickerModel = this.setupOrgsFromQS(data['organizationId']);
            this.keywordsModel = data['keywords'] ? this.keywordRebuilder(data['keywords']) : [];
            this.internalDateModel = data['dateFrom'] && data['dateTo'] ? {'startDate': data['dateFrom'], 'endDate': data['dateTo']} : {};
            this.dateFilterModel = data['dateTab'] ? this.formatDateModel(data) : {};
            this.dateRadio = data['radSelection'] ? decodeURI(data['radSelection']) : 'date';

            this.dateFilterIndex = data['dateTab'] && this.dateTypeOptions ? _.indexOf(this.dateTypeOptions, decodeURI(data['dateTab'])) : 0;
            this.updateDateFilterConfig(this.dateFilterIndex);

            this.sortModel = typeof data['sortBy'] === "string" ? this.setSortModel(decodeURI(data['sortBy'])) : this.defaultSort;
            this.runProgram();
          });
    }, error => {
      let errorRes = error.json();
      if (error && error.status === 401) {
        this.serviceErrorFooterAlertModel.description = 'Insufficient privileges to get user permission.'
        this.alertFooterService.registerFooterAlert(JSON.parse(JSON.stringify(this.serviceErrorFooterAlertModel)));
        this.router.navigate(['403']);
      } else if (error && (error.status === 502 || error.status === 504)) {
        this.serviceErrorFooterAlertModel.description = errorRes.message;
        this.alertFooterService.registerFooterAlert(JSON.parse(JSON.stringify(this.serviceErrorFooterAlertModel)));
      }
      this.disabled = false;
    });

    return apiSubject;
  }

  getUserPermissions() {
      this.userPermissions = this.authGuard._falLinks;
  }

  setupOrgsFromQS(orgsStr){
    if(!orgsStr){
      return [];
    }
    let decodedStr = decodeURIComponent(orgsStr);
    let orgsArray = decodedStr.split(",");
    return orgsArray;
  }

  private loadCountPendingRequest(apiSource: Observable<any>){
    let apiSubject = new ReplaySubject(1);

    // construct a stream of federal hierarchy data
    let apiStream = apiSource.switchMap(api => {
      if (this.permissions != null && (this.permissions.APPROVE_REJECT_AGENCY_CR == true ||
        this.permissions.APPROVE_REJECT_ARCHIVE_CR == true ||
        this.permissions.APPROVE_REJECT_NUMBER_CR == true ||
        this.permissions.APPROVE_REJECT_TITLE_CR == true ||
        this.permissions.APPROVE_REJECT_UNARCHIVE_CR == true ||
        this.permissions.INITIATE_CANCEL_AGENCY_CR == true ||
        this.permissions.INITIATE_CANCEL_ARCHIVE_CR == true ||
        this.permissions.INITIATE_CANCEL_NUMBER_CR == true ||
        this.permissions.INITIATE_CANCEL_TITLE_CR == true ||
        this.permissions.INITIATE_CANCEL_UNARCHIVE_CR == true)) {
        return this.programService.getCountPendingRequests(this.cookieValue);
      }
      return Observable.empty<number>();
    });

    apiStream.subscribe(apiSubject);

    apiSubject.subscribe(res => {
      this.pendingRequestCount = res;
    });
  }

  // status filter model change
  statusModelChanged(){
    this.disabled = true;
    this.pageNum = 0;
    this.workspaceRefresh();
  }

  // change request filter model change
  requestTypeModelChanged(){
    this.disabled = true;
    this.pageNum = 0;
    this.workspaceRefresh();
  }

  // builds the options for status filter with counts included from api call -- returns to runProgram()
  buildStatusFilterOptions(data){
    var returnOptions = [];

    for(var property in data){
      var newObj = {};
      data[property]['count'] = data[property]['count'] == null ? 0 : data[property]['count'];
      var isZero = data[property]['count'] === 0 ? true : false;

      switch(data[property]['name']){
        case 'total_archived_listing':
          newObj = {value: 'archived', label: 'Archived (' + data[property]['count'] + ')', name: 'checkbox-archived', disabled: isZero ? true : false};
          break;
        case 'total_draft_listing':
          newObj = {value: 'draft', label: 'Draft (' + data[property]['count'] + ')', name: 'checkbox-draft', disabled: isZero ? true : false};
          break;
        case 'total_draft_review_listing':
          newObj = {value: 'draft_review', label: 'Draft Review (' + data[property]['count'] + ')', name: 'checkbox-draft-review', disabled: isZero ? true : false};
          break;
        case 'total_rejected_listing':
          newObj = {value: 'rejected', label: 'Rejected (' + data[property]['count'] + ')', name: 'checkbox-rejected', disabled: isZero ? true : false};
          break;
        case 'total_pending_listing':
          newObj = {value: 'pending', label: 'Pending - OMB (' + data[property]['count'] + ')', name: 'checkbox-pending', disabled: isZero ? true : false};
          break;
        case 'total_published_listing':
          newObj = {value: 'published', label: 'Published (' + data[property]['count'] + ')', name: 'checkbox-published', disabled: isZero ? true : false};
          break;
        case 'archive_request':
          newObj = {value: 'archive_request', label: 'Archive (' + data[property]['count'] + ')', name: 'checkbox-archive', disabled: isZero ? true : false};
          break;
        case 'unarchive_request':
          newObj = {value: 'unarchive_request', label: 'Unarchive (' + data[property]['count'] + ')', name: 'checkbox-unarchive', disabled: isZero ? true : false};
          break;
        case 'title_request':
          newObj = {value: 'title_request', label: 'Title Change (' + data[property]['count'] + ')', name: 'checkbox-title', disabled: isZero ? true : false};
          break;
        case 'agency_request':
          newObj = {value: 'agency_request', label: 'Agency Change (' + data[property]['count'] + ')', name: 'checkbox-agency', disabled: isZero ? true : false};
          break;
        case 'program_number_request':
          newObj = {value: 'program_number_request', label: 'Number Change (' + data[property]['count'] + ')', name: 'checkbox-program-number', disabled: isZero ? true : false};
          break;
        default:
          newObj = null;
          break;
      }
      // add new object to our returnOptions
      if(newObj){
        returnOptions.unshift(newObj);
      }
    }
    return returnOptions;
  }

  createOrgNameMap(){
    let idArray = new Set(this.data.map(data => {
        let id = data.data.organizationId;

        if(typeof id !== 'string'){
            return id.toString();
        }
        return id;
    }));
    let uniqueIdList = Array.from(idArray).join();
    let ctx = this;
    if(uniqueIdList && uniqueIdList.length > 0){
      this.fhService.getOrganizationsByIds(uniqueIdList)
        .subscribe(
          data => {
            data._embedded.orgs.forEach(function(org){
              ctx.orgNameMap.set(org.org.orgKey.toString(), org.org.name);
              ctx.orgTypeMap.set(org.org.orgKey.toString(), org.org.type);
            });
            this.addOrgNameToData();
            this.addOrgTypeToData();
          },
          error => {
            console.error('Error!!', error);
          }
        );
    }

  }

  addOrgNameToData() {
    let ctx = this;
    ctx.data.forEach(function(data){
        data['organizationName'] = ctx.orgNameMap.get(data.data.organizationId.toString());
    });
  }

  addOrgTypeToData() {
    let ctx = this;
    ctx.data.forEach(function(data){
      if(ctx.orgTypeMap.get(data.data.organizationId.toString()))
        data['organizationType'] = ctx.orgTypeMap.get(data.data.organizationId.toString()).trim().toLowerCase();
      else
        data['organizationType'] = null;
    });
  }

  clearDateFilter(event){
    this.dateFilterModel = {};
    this.internalDateModel = {};
    this.pageNum = 0;

    this.workspaceRefresh();
  }

  clearAllFilters(){
    // clears the search autocomplete
    this.workspaceSearchModel(null);
    this.statusCheckboxModel = this.defaultStatus;
    this.requestTypeCheckboxModel = [];
    this.sortModel = this.defaultSort;
    this.keywordsModel = [];
    this.clearAgencyPickerFilter();
    // this clears all date filters as well as refreshes the data on the page

    //clear date filter
    this.dateFilterModel = {};
    this.internalDateModel = {};
    this.dateRadio = 'date';
    this.dateFilterIndex = 0;
    this.pageNum = 0;

    this.workspaceRefresh();
  }

  clearAgencyPickerFilter(){
    this.agencyPickerModel = [];
    this.organizationId = "";
  }

  // sortBy model change
  sortModelChange(){
    this.disabled = true;
    this.pageNum = 0;
    this.workspaceRefresh();
  }

  setSortModel(sortBy) {
    if(sortBy.substring(0, 1) == '-') {
      return {type: sortBy.substring(1), sort: 'desc'};
    } else {
      return {type: sortBy, sort: 'asc'};
    }
  }

    //agency picker change handler
    onOrganizationChange(selectedOrgs:any){
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
        this.disabled = true;
        this.workspaceRefresh();
      }

    }

  getOrganizationLevels() {
    this.falFormService.getFALPermission('ORG_LEVELS').subscribe(res => {
      this.orgLevels = res.ORG_LEVELS;
      if (res && res.ORG_LEVELS) {
        if (res.ORG_LEVELS.level === 'none') {
          this.orgRoots.push(res.ORG_LEVELS.org);
        } else if (res.ORG_LEVELS.org === 'all') {
          this.orgRoots = [];
        } else {
          this.orgRoots.push(res.ORG_LEVELS.org);
        }
        //this.getOrganizationName(this.orgRoots);
      }
      //clone array to update array reference, fire ngOnChanges
      this.orgRoots = this.orgRoots.slice(0);
    });
  }

  getOrganizationName(orgId: any) {
    //set organization name
    this.falFormService.getOrganization(orgId)
      .subscribe(data => {
        this.organizationData = data['_embedded'][0]['org'];
      }, error => {
        console.error('error retrieving organization', error);
      });

  }

  keywordRebuilder(keywordStringOrArray){

    // if passed value is string
    if(typeof(keywordStringOrArray) === "string"){
      // use split to convert string to array
      var tempArray = keywordStringOrArray.split(",");
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

  keywordSplitter(keywordArray){
    var newString = "";

    if(keywordArray && keywordArray !== ""){
      // use reduce to separate items into string: item1 + " " + item2 etc
      newString = keywordArray.reduce(function(accumulator, currentVal){
        if(accumulator === ""){
          return currentVal.value;
        }

        return accumulator + "," + currentVal.value;
      }, "");
    }

    return newString;
  }

  workspaceRefresh(){
    let qsobj = this.setupQS();
    let navigationExtras: NavigationExtras = {
      queryParams: qsobj
    };
    this.router.navigate(['/fal/workspace/'], navigationExtras);
  }

  dateTypeChangeHandler(evt){
    this.dateFilterModel = {};
  }
}
