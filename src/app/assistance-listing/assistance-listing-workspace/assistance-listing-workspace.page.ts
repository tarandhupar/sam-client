import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {Router, ActivatedRoute, NavigationExtras} from '@angular/router';
import {ProgramService} from 'api-kit';
import {FHService} from 'api-kit';
import * as Cookies from 'js-cookie';
import {ReplaySubject} from "rxjs/ReplaySubject";
import {Observable} from "rxjs/Observable";
import { IBreadcrumb } from "sam-ui-kit/types";

@Component({
  moduleId: __filename,
  templateUrl: 'assistance-listing-workspace.template.html',
  providers: [
    ProgramService,
    FHService
  ]
})

export class FalWorkspacePage implements OnInit, OnDestroy {
  @ViewChild('autocomplete') autocomplete: any;
  private MODIFIED = 'modified';
  private POSTED = 'posted';
  private START_DAY = '00:00:00';
  private END_DAY = '23:59:59';


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
      {value: 'pending', label: 'Pending', name: 'checkbox-pending'},
      {value: 'rejected', label: 'Rejected', name: 'checkbox-rejected'},
      {value: 'draft', label: 'Draft', name: 'checkbox-draft'},
      {value: 'archived', label: 'Archived', name: 'checkbox-archived'},
    ],
    name: 'fal-status-filter',
    label: '',
    hasSelectAll: 'true'
  };
  defaultSort: any = {type:'programNumber', sort:'asc'};
  sortModel: any = this.defaultSort;
  sortOptions = [
    {label:'Date Published', name:'Date Published', value:'publishedDate'},
    {label:'Date Modified', name:'Date Modified', value:'modifiedDate'},
    {label:'Listing Number', name:'Listing Number', value:'programNumber'},
    {label:'Listing Title', name:'Listing Title', value:'title'}
  ];
  orgMap = new Map();
  postedDateFilterModel: any = {};
  modifiedDateFilterModel: any = {};
  postedFrom: any;
  postedTo: any;
  modifiedFrom: any;
  modifiedTo: any;
  dateFilterConfig = {
    options: [
      {name:'Date',label:'Date',value:'date'},
      {name:'Date Range',label:'Date Range',value:'dateRange'}
    ],
    radSelection: 'date',

  };
  tab = this.POSTED;
  dateRadio = 'date';
  filterDisabled = true;
  crumbs: Array<IBreadcrumb> = [
    { breadcrumb:'Home', url:'/',},
    { breadcrumb: 'Workspace', url: '/workspace' },
    { breadcrumb: 'Assistance Listings'}
  ];

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private programService: ProgramService, private fhService: FHService) {
  }

  ngOnInit() {
    this.cookieValue = Cookies.get('iPlanetDirectoryPro');
    let userPermissionsAPI = this.loadUserPermissions();
    this.loadCountPendingRequest(userPermissionsAPI);
    this.getStatusCounts(this.cookieValue)
  }

  ngOnDestroy() {
    if (this.runProgSub)
      this.runProgSub.unsubscribe();
  }

  // builds object we set into url to persist data
  setupQS() {
    let qsobj = {};
    if(this.keyword.length>0){
      qsobj['keyword'] = this.keyword;
    } else {
      qsobj['keyword'] = '';
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
    if(this.tab){
      qsobj['tab'] = this.tab;
    }
    if(this.tab === this.MODIFIED){
      if(this.modifiedDateFilterModel.hasOwnProperty('date')){
        qsobj['radSelection'] = 'date'
      }
      else if(this.modifiedDateFilterModel.hasOwnProperty('dateRange')){
        qsobj['radSelection'] = 'dateRange'
      }
    }
    if(this.tab === this.POSTED){
      if(this.postedDateFilterModel.hasOwnProperty('date')){
        qsobj['radSelection'] = 'date'
      }
      else if(this.postedDateFilterModel.hasOwnProperty('dateRange')){
        qsobj['radSelection'] = 'dateRange'
      }
    }
    if(this.postedTo){
      qsobj['postedTo'] = this.postedTo;
    }
    if(this.postedFrom){
      qsobj['postedFrom'] = this.postedFrom;
    }
    if(this.modifiedTo){
      qsobj['modifiedTo'] = this.modifiedTo;
    }
    if(this.modifiedFrom){
      qsobj['modifiedFrom'] = this.modifiedFrom;
    }

    return qsobj;
  }

  runProgram() {
    // determines what model to pull data from and formats the dates to meet api requirements
    var dateResult = this.formatDates(this.postedDateFilterModel, this.modifiedDateFilterModel, true);

    // make api call
    this.runProgSub = this.programService.runProgram({
      keyword: this.keyword,
      pageNum: this.pageNum,
      Cookie: this.cookieValue,
      status: this.statusCheckboxModel ? this.statusCheckboxModel.toString() : this.defaultStatus,
      postedFrom: dateResult.postedFrom,
      postedTo: dateResult.postedTo,
      modifiedFrom: dateResult.modifiedFrom,
      modifiedTo: dateResult.modifiedTo,
      sortBy: (this.sortModel['sort'] == 'desc' ? '-' : '')+(this.sortModel['type'])
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
      },
      error => {
        console.error('Error!!', error);
      }
    );
    // construct qParams to pass parameters to object view pages
    this.qParams['keyword'] = this.keyword;
    this.qParams['index'] = this.index;
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
    this.router.navigate(['programs/add']);
  }

  manageAssistanceLocationsClick(){
    this.router.navigate(['fal/myRegionalOffices']);
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
    let qsobj = this.setupQS();
    let navigationExtras: NavigationExtras = {
      queryParams: qsobj
    };
    this.router.navigate(['/fal/workspace/'], navigationExtras);
  }

  private loadUserPermissions(){
    let apiSubject = new ReplaySubject();

    this.programService.getPermissions(this.cookieValue, 'CREATE_FALS, FAL_REQUESTS, CREATE_RAO').subscribe(apiSubject);

    // runs anytime url changes, takes values from url and sets them into our variables
    apiSubject.subscribe(res => {
      this.permissions = res;
        this.activatedRoute.queryParams.subscribe(
          data => {
            this.keyword = typeof data['keyword'] === "string" ? decodeURI(data['keyword']) : '';
            this.pageNum = typeof data['page'] === "string" && parseInt(data['page']) - 1 >= 0 ? parseInt(data['page']) - 1 : 0;
            this.statusCheckboxModel = typeof data['status'] === "string" ? decodeURI(data['status']).split(",") : this.defaultStatus;
            this.tab = data['tab'] && typeof data['tab'] === 'string' ? decodeURI(data['tab']) : this.POSTED;
            this.dateRadio =  data['radSelection'] ? decodeURI(data['radSelection']) : 'date';
            this.dateFilterConfig.radSelection = this.dateRadio;
            this.postedFrom = data['postedFrom'] ? data['postedFrom'] : "";
            this.postedTo = data['postedTo'] ? data['postedTo'] : "";
            this.modifiedFrom = data['modifiedFrom'] ? data['modifiedFrom'] : "";
            this.modifiedTo = data['modifiedTo'] ? data['modifiedTo'] : "";
            // sets the date models accordingly
            this.modelRebuilder(data);
            this.sortModel = typeof data['sortBy'] === "string" ? this.setSortModel(decodeURI(data['sortBy'])) : this.defaultSort;
            this.getStatusCounts(this.cookieValue);
            this.runProgram();
          });
    });

    return apiSubject;
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
    let qsobj = this.setupQS();
    // overwrite the page number to be 1. When filters are changed we do not want to retain page number
    qsobj['page'] = 1;
    let navigationExtras: NavigationExtras = {
      queryParams: qsobj
    };
    this.router.navigate(['/fal/workspace/'], navigationExtras);
  }

  // gets the count of records in each status for filter
  getStatusCounts(passedCookie){
    this.programService.getProgramCountByStatus(passedCookie).subscribe(data => {
      this.statusCheckboxConfig.options = this.buildStatusFilterOptions(data.content);
    },
    error => {
      console.error('error calling program CountByStatus method');
    });
  }

  // builds the options for status filter with counts included from api call -- returns to getStatusCounts()
  buildStatusFilterOptions(data){
    var returnOptions = [];

    for(var property in data){
      var newObj = {};
      var isZero = data[property] === 0 ? true : false;

      switch(property){
        case 'total_archived_listing':
          newObj = {value: 'archived', label: 'Archived (' + data[property] + ')', name: 'checkbox-archived', disabled: isZero ? true : false};
          break;
        case 'total_draft_listing':
          newObj = {value: 'draft', label: 'Draft (' + data[property] + ')', name: 'checkbox-draft', disabled: isZero ? true : false};
          break;
        case 'total_rejected_listing':
          newObj = {value: 'rejected', label: 'Rejected (' + data[property] + ')', name: 'checkbox-rejected', disabled: isZero ? true : false};
          break;
        case 'total_pending_listing':
          newObj = {value: 'pending', label: 'Pending (' + data[property] + ')', name: 'checkbox-pending', disabled: isZero ? true : false};
          break;
        case 'total_published_listing':
          newObj = {value: 'published', label: 'Published (' + data[property] + ')', name: 'checkbox-published', disabled: isZero ? true : false};
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
              ctx.orgMap.set(org.org.orgKey.toString(), org.org.name);
            });
            this.addOrgNameToData();
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
        data['organizationName'] = ctx.orgMap.get(data.data.organizationId.toString());
    });
  }

  // clears date model
  clearDateFilter(){
    this.modifiedDateFilterModel = {};
    this.postedDateFilterModel = {};
    this.modifiedFrom = "";
    this.modifiedTo = "";
    this.postedFrom = "";
    this.postedTo = "";

    this.pageNum = 0;
    let qsobj = this.setupQS();
    let navigationExtras: NavigationExtras = {
      queryParams: qsobj
    };
    this.router.navigate(['/fal/workspace/'], navigationExtras);
  }

  clearAllFilters(){
    // clears the search autocomplete
    this.workspaceSearchModel(null);
    this.statusCheckboxModel = this.defaultStatus;
    this.sortModel = this.defaultSort;
    // this clears all date filters as well as refreshes the data on the page
    this.clearDateFilter();
  }

  // initiates a search with date filter
  filterByDate(){

    // set 4 vars from model here
    var returnObj = this.formatDates(this.postedDateFilterModel, this.modifiedDateFilterModel, false);
    this.modifiedFrom = returnObj.modifiedFrom;
    this.modifiedTo = returnObj.modifiedTo;
    this.postedFrom = returnObj.postedFrom;
    this.postedTo = returnObj.postedTo;

    let qsobj = this.setupQS();
    // overwrite the page number to be 1. When filters are changed we do not want to retain page number
    qsobj['page'] = 1;
    let navigationExtras: NavigationExtras = {
      queryParams: qsobj
    };
    this.router.navigate(['/fal/workspace/'], navigationExtras);
  }


  // FUNCTIONS FOR TABS ON DATE FILTER
  selectTab(type){
    this.tab = type;

    // run validation checks for filter button
    if(this.tab === this.POSTED){
      this.dateChangehandler(this.postedDateFilterModel);
    }
    else if(this.tab === this.MODIFIED){
      this.dateChangehandler(this.modifiedDateFilterModel);
    }
  }

  isCurrentTab(type){
    return this.tab === type;
  }

  getColorClass(type):string{
    if(this.tab === type){
      return "active";
    }
    return "";
  }

  // takes both modified and posted date models and returns an appropriately constructed object for date filtering
  formatDates(postedModel, modifiedModel, appendTime: boolean){
    var returnObj = {
      modifiedFrom: '',
      modifiedTo: '',
      postedFrom: '',
      postedTo: ''
    };

    // check selected tab, based on tab only populate the approriate properties in the constructed object
    if(this.tab === this.MODIFIED){
      // determine if we have been given a single date or a date span
      if(modifiedModel.hasOwnProperty('date')){
        if(modifiedModel.date){
          // if single date generate the "To" date
          // only return time if appendTime is true
          if(appendTime){
            returnObj.modifiedFrom = modifiedModel.date + ' ' + this.START_DAY;
            returnObj.modifiedTo = modifiedModel.date + ' ' + this.END_DAY;
          }else{
            // don't append time if we are sending data for url
            returnObj.modifiedFrom = modifiedModel.date;
            returnObj.modifiedTo = modifiedModel.date;
          }
        }else{
          returnObj.modifiedFrom = "";
          returnObj.modifiedTo = "";
        }
      }
      else if(modifiedModel.hasOwnProperty('dateRange')){
        if(modifiedModel.dateRange){
          if(appendTime){
            returnObj.modifiedFrom = modifiedModel.dateRange.startDate + ' ' + this.START_DAY;
            returnObj.modifiedTo = modifiedModel.dateRange.endDate + ' ' + this.END_DAY;
          }else{
            // only return time if appendTime is true
            returnObj.modifiedFrom = modifiedModel.dateRange.startDate;
            returnObj.modifiedTo = modifiedModel.dateRange.endDate;
          }
        }else{
          returnObj.modifiedFrom = "";
          returnObj.modifiedTo = "";
        }
      }
    }
    else if(this.tab === this.POSTED){
      // determine if we have been given a single date or a date span
      if(postedModel.hasOwnProperty('date')){
        if(postedModel.date){
          // if single date generate the "To" date
          if(appendTime){
            returnObj.postedFrom = postedModel.date + ' ' + this.START_DAY;
            returnObj.postedTo = postedModel.date + ' ' + this.END_DAY;
          }else{
            // only return time if appendTime is true
            returnObj.postedFrom = postedModel.date;
            returnObj.postedTo = postedModel.date;
          }
        }
        else{
          returnObj.postedFrom = "";
          returnObj.postedTo = "";
        }
      }
      else if(postedModel.hasOwnProperty('dateRange')){
        if(postedModel.dateRange){
          if(appendTime){
            returnObj.postedFrom = postedModel.dateRange.startDate + ' ' + this.START_DAY;
            returnObj.postedTo = postedModel.dateRange.endDate + ' ' + this.END_DAY;
          }else{
            // only return time if appendTime is true
            returnObj.postedFrom = postedModel.dateRange.startDate;
            returnObj.postedTo = postedModel.dateRange.endDate;
          }
        }
       else{
          this.postedFrom = "";
          this.postedTo = "";
        }
      }
    }
    return returnObj;
  }

  // this method rebuilds the date models with the provided data in the url - called in activated route subscription
  // takes the data object from activated route
  modelRebuilder(data){
    var newModifiedModel = {};
    var newPostedModel = {};

    if(data.hasOwnProperty('tab')){
      if(data.tab === this.MODIFIED){
        if(data.radSelection === 'date'){
          newModifiedModel['date'] = data.modifiedFrom ? data.modifiedFrom : "";
        }
        else if(data.radSelection === 'dateRange'){
          newModifiedModel['dateRange'] = {};
          newModifiedModel['dateRange']['startDate'] = data.modifiedFrom ? data.modifiedFrom : "";
          newModifiedModel['dateRange']['endDate'] = data.modifiedTo ? data.modifiedTo : "";
        }
        this.modifiedDateFilterModel = newModifiedModel;
    }
      else {
        if(data.radSelection === 'date'){
          newPostedModel['date'] = data.postedFrom ? data.postedFrom : "";
        }
        else if(data.radSelection === 'dateRange'){
          newPostedModel['dateRange'] = {};
          newPostedModel['dateRange']['startDate'] = data.postedFrom ? data.postedFrom : "";
          newPostedModel['dateRange']['endDate'] = data.postedTo ? data.postedTo : "";
        }
        this.postedDateFilterModel = newPostedModel;
      }
    }

  }

  // sortBy model change
  sortModelChange(){
    let qsobj = this.setupQS();
    // overwrite the page number to be 1. When filters are changed we do not want to retain page number
    qsobj['page'] = 0;
    let navigationExtras: NavigationExtras = {
      queryParams: qsobj
    };
    this.router.navigate(['/fal/workspace/'], navigationExtras);
  }

  setSortModel(sortBy) {
    if(sortBy.substring(0, 1) == '-') {
      return {type: sortBy.substring(1), sort: 'desc'};
    } else {
      return {type: sortBy, sort: 'asc'};
    }
  }


  dateChangehandler(event: Object){
    this.filterDisabled = true;

    if(event['date']){
      if(event['date'] !== 'Invalid Date' && event['date'].substring(0,1) !== '0'){
        this.filterDisabled = false;
      }
    }
      else if(event['dateRange']){
        // checks if dateRange exists and does not equal invalid date and that all 4 "year" numbers have been filled in
        if(event['dateRange']['startDate'] && event['dateRange']['endDate'] && event['dateRange']['startDate'] !== 'Invalid date' && event['dateRange']['endDate'] !== 'Invalid date'){
          if(event['dateRange']['startDate'].substring(0,1) !== '0' && event['dateRange']['endDate'].substring(0,1) !== '0'){
            this.filterDisabled = false;
          }
        }
      }
    }




}

