import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import * as Cookies from 'js-cookie';
import {ReplaySubject} from "rxjs/ReplaySubject";
import {Observable} from "rxjs/Observable";
import { IBreadcrumb } from "sam-ui-kit/types";
import {AlertFooterService} from "../../app-components/alert-footer/alert-footer.service";
import {OpportunityService} from "../../../api-kit/opportunity/opportunity.service";
import {DictionaryService} from "../../../api-kit/dictionary/dictionary.service";
import {FHService} from "../../../api-kit/fh/fh.service";
import {UserService} from "../../role-management/user.service";
import {UserAccessService} from "../../../api-kit/access/access.service";

@Component({
  moduleId: __filename,
  templateUrl: 'opportunity-workspace.template.html',
  providers: []
})

export class OPPWorkspacePage implements OnInit, OnDestroy {
  @ViewChild('autocomplete') autocomplete: any;
  @ViewChild('postedDateRangeFilter') postedDateRangeFilter: any;
  private RESPONSE = 'response';
  private POSTED = 'posted';
  private ARCHIVE = 'archive';
  private START_DAY = '00:00:00';
  private END_DAY = '23:59:59';

  showSpinner: boolean = false;
  keyword: string = '';
  organizationId: string = '';
  pageNum = 0;
  totalCount: any = 0;
  totalPages: any = 0;
  data = [];
  initLoad = true;
  qParams: any = {};
  size: any = {};
  oldKeyword: string = "";
  cookieValue: string;
  runOppSub: any;
  orgMap: any = new Map();
  noticeTypeMap = new Map();
  public permissions: any;

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
  workspaceSearchConfig: any = {
    placeholder: "Search Workspace"
  };
  serviceErrorFooterAlertModel = {
    title: "Error",
    description: "",
    type: "error"
  };
  crumbs: Array<IBreadcrumb> = [
    { breadcrumb:'Home', url:'/',},
    { breadcrumb: 'Workspace', url: '/workspace' },
    { breadcrumb: 'Contract Opportunities'}
  ];

  defaultStatus: any = ['published'];
  statusCheckboxModel: any = this.defaultStatus;
  statusCheckboxConfig = {
    options: [
      {value: 'archived', label: 'Archived', name: 'checkbox-archived'},
      {value: 'draft', label: 'Drafts', name: 'checkbox-draft'},
      {value: 'published', label: 'Active', name: 'checkbox-active'}
    ],
    name: 'opp-status-filter',
    label: '',
    hasSelectAll: 'true'
  };
  filterDisabled: boolean = true;

  noticeTypeCheckboxModel: any = [];
  noticeTypeCheckboxConfig = {
    options: [
      {value: 'a', label: 'Award Notice', name: 'checkbox-award-notice'},
      {value: 'k', label: 'Combined Synopsis/Solicitation', name: 'checkbox-synopsis'},
      {value: 'l', label: 'Fair Opportunity / Limited Sources Justification', name: 'checkbox-fair-opportunity'},
      {value: 'f', label: 'Foreign Government Standard', name: 'checkbox-foreign-govt'},
      {value: 'i', label: 'Intent to Bundle Requirements (DoD-Funded)', name: 'checkbox-bundle-req'},
      {value: 'j', label: 'Justification and Approval (J&A)', name: 'checkbox-justification-approval'},
      {value: 'm', label: 'Modification/Amendment/Cancel', name: 'checkbox-notification-amendment'},
      {value: 'p', label: 'Presolicitation', name: 'checkbox-presolicitation'},
      {value: 'g', label: 'Sale of Surplus Property', name: 'checkbox-sale-surplus'},
      {value: 'o', label: 'Solicitation', name: 'checkbox-solicitation'},
      {value: 'r', label: 'Sources Sought', name: 'checkbox-sources-sought'},
      {value: 's', label: 'Special Notice', name: 'checkbox-special-notice'},
    ],
    name: 'opp-notice-type-filter',
    label: '',
    hasSelectAll: 'true'
  };

  defaultSort: any = {type:'postedDate', sort:'desc'};
  sortModel: any = this.defaultSort;
  oldSortModel: any = this.defaultSort;
  sortOptions = [
    {label:'Posted Date', name:'Posted Date', value:'postedDate'},
    {label:'Response Date', name:'Response Date', value:'responseDate'},
    {label:'Archive Date', name:'Archive Date', value:'archiveDate'},
    {label:'Title', name:'Title', value:'title'}
  ];

  postedDateFilterModel: any = {};
  responseDateFilterModel: any = {};
  archiveDateFilterModel: any = {};
  internalDateModel: any = {};
  currDateTab = this.POSTED;
  dateRadio = 'date';
  dateFilterConfig = {
    options: [
      {name:'Date',label:'Date',value:'date'},
      {name:'Date Range',label:'Date Range',value:'dateRange'}
    ],
    radSelection: 'date',
  };

  oppFacets: any = ['status','type'];
  disabled:boolean = true;



  constructor(private activatedRoute: ActivatedRoute, private router: Router, private opportunityService: OpportunityService, private userService: UserService, private userAccessService: UserAccessService, private fhService: FHService, private dictionaryService: DictionaryService, private alertFooterService: AlertFooterService) {
  }

  ngOnInit() {
    this.cookieValue = Cookies.get('iPlanetDirectoryPro');
    this.activatedRoute.queryParams.subscribe(
      data => {
        this.pageNum = typeof data['page'] === "string" && parseInt(data['page']) - 1 >= 0 ? parseInt(data['page']) - 1 : 0;
        this.keywordsModel = data['keywords'] ? this.keywordRebuilder(data['keywords']) : [];
        this.statusCheckboxModel = typeof data['status'] === "string" ? decodeURI(data['status']).split(",") : this.defaultStatus;
        this.noticeTypeCheckboxModel = typeof data['noticeType'] === "string" ? decodeURI(data['noticeType']).split(",") : [];
        this.sortModel = typeof data['sortBy'] === "string" ? this.setSortModel(decodeURI(data['sortBy'])) : this.defaultSort;
        this.organizationId = typeof data['organizationId'] === "string" ? decodeURI(data['organizationId']) : "";
        this.agencyPickerModel = this.setupOrgsFromQS(data['organizationId']);
        this.internalDateModel = data['dateFrom'] && data['dateTo'] ? {'startDate': data['dateFrom'], 'endDate': data['dateTo']} : {};
        this.postedDateFilterModel = data['dateTab'] && data['dateTab'] === this.POSTED ? this.formatDateModel(data) : {};
        this.responseDateFilterModel = data['dateTab'] && data['dateTab'] === this.RESPONSE ? this.formatDateModel(data) : {};
        this.archiveDateFilterModel = data['dateTab'] && data['dateTab'] === this.ARCHIVE ? this.formatDateModel(data) : {};
        this.dateRadio = data['radSelection'] ? decodeURI(data['radSelection']) : 'date';
        this.dateFilterConfig.radSelection = this.dateRadio;
        this.currDateTab = data['dateTab'] ? decodeURI(data['dateTab']) : this.POSTED;
        this.runOpportunity();
      });
    this.initFHDropdown();
  }

  ngOnDestroy() {
    if (this.runOppSub)
      this.runOppSub.unsubscribe();
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

    //Date Filter query params
    if(this.currDateTab){
      qsobj['dateTab'] = this.currDateTab;
    }
    if(this.dateFilterConfig){
      qsobj['radSelection'] = this.dateRadio;
    }
    if(this.internalDateModel){
      qsobj['dateFrom'] = this.internalDateModel.startDate;
      qsobj['dateTo'] = this.internalDateModel.endDate;
    }
    //Status and Notice Type query params
    if(this.statusCheckboxModel){
      qsobj['status'] = this.statusCheckboxModel.toString();
    }
    else {
      qsobj['status'] = '';
    }
    if(this.noticeTypeCheckboxModel){
      qsobj['noticeType'] = this.noticeTypeCheckboxModel.toString();
    }else{
      qsobj['noticeType'] = '';
    }
    if(this.organizationId){
      qsobj['organizationId'] = this.organizationId;
    }

    //If changing sort option, reset to default sort order for that option
    if(this.sortModel && this.oldSortModel['type'] !== this.sortModel['type']){
      switch(this.sortModel['type']){
          case 'postedDate':
            this.sortModel['sort'] = 'desc';
            break;
          case 'responseDate':
            this.sortModel['sort'] = 'desc';
            break;
          case 'archiveDate':
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

    if(this.oppFacets){
      qsobj['facets'] = this.oppFacets.toString();
    }else{
      qsobj['facets'] = '';
    }

    return qsobj;
  }

  setupOrgsFromQS(orgsStr){
    if(!orgsStr){
      return [];
    }
    let decodedStr = decodeURIComponent(orgsStr);
    let orgsArray = decodedStr.split(",");
    return orgsArray;
  }

   // initiates a search with date filter
  filterByDate(){
    this.pageNum = 0;
    this.workspaceRefresh();
  }


  // FUNCTIONS FOR TABS ON DATE FILTER
  selectTab(type){
    this.currDateTab = type;

    // run validation checks for filter button
    if(this.currDateTab === this.POSTED){
      this.dateModelChange(this.postedDateFilterModel);
    } else if(this.currDateTab === this.RESPONSE){
      this.dateModelChange(this.responseDateFilterModel);
    } else if(this.currDateTab === this.ARCHIVE){
      this.dateModelChange(this.archiveDateFilterModel);
    }
  }

  isCurrentTab(type){
    return this.currDateTab === type;
  }

  getColorClass(type):string{
    if(this.currDateTab === type){
      return 'active';
    }
    return '';
  }

  formatDateWrapper(tab, appendTime: boolean){
    switch(tab){
      case this.POSTED:
        if(this.postedDateFilterModel.date){
          return this.formatDate(this.postedDateFilterModel, appendTime);
        }
        if(this.postedDateFilterModel.dateRange){
          return this.formatDateRange(this.postedDateFilterModel, appendTime);
        }
        break;
      case this.RESPONSE:
        if(this.responseDateFilterModel.date){
          return this.formatDate(this.responseDateFilterModel, appendTime);
        }
        if(this.responseDateFilterModel.dateRange){
          return this.formatDateRange(this.responseDateFilterModel, appendTime);
        }
        break;
      case this.ARCHIVE:
        if(this.archiveDateFilterModel.date){
          return this.formatDate(this.archiveDateFilterModel, appendTime);
        }
        if(this.archiveDateFilterModel.dateRange){
          return this.formatDateRange(this.archiveDateFilterModel, appendTime);
        }
        break;
    }
  }
  formatDate(model, appendTime){
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
  formatDateRange(model, appendTime){
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

  formatDateModel(data){
    if(data.radSelection === 'date'){
      return data.dateFrom ? {'date': data.dateFrom} : {'date': ''}
    }else if(data.radSelection === 'dateRange'){
      return data.dateFrom && data.dateTo ? {'dateRange': {'startDate' : data.dateFrom, 'endDate': data.dateTo}} : {'dateRange': {'startDate' : '', 'endDate': ''}}
    }
  }

  runOpportunity() {
    this.showSpinner = true;
    var appendTime = this.currDateTab === this.RESPONSE;
    var dateObj = this.formatDateWrapper(this.currDateTab, appendTime);

    // make api call
    this.runOppSub = this.opportunityService.runOpportunity({
      keyword: this.keywordSplitter(this.keywordsModel),
      pageNum: this.pageNum,
      status: this.statusCheckboxModel.toString(),
      noticeType: this.noticeTypeCheckboxModel.toString(),
      sortBy: (this.sortModel['sort'] == 'desc' ? '-' : '')+(this.sortModel['type']),
      organizationId: this.organizationId,
      dateTab: this.currDateTab,
      dateFilter: dateObj,
      facets: this.oppFacets.toString(),
      Cookie: this.cookieValue,
    }).subscribe(
      data => {
        if (data._embedded && data._embedded.opportunity) {
          this.data = data._embedded.opportunity;
          this.totalCount = data.page['totalElements'];
          this.size = data.page['size'];
          this.totalPages = data.page['totalPages'];
          this.createNoticeTypeMap();
          this.createOrgNameMap();
        } else {
          this.totalCount = 0;
          this.data = [];
        }
        this.oldKeyword = this.keyword;
        this.initLoad = false;

        if(data._embedded && data._embedded.facets) {
          for(var facet of data._embedded.facets) {
            switch(facet['name']) {
              case 'status':
                this.statusCheckboxConfig.options = this.buildStatusFilterOptions(facet['buckets']);
                    break;
              case 'type':
                this.noticeTypeCheckboxConfig.options = this.buildStatusFilterOptions(facet['buckets']);
                    break;
            }
          }
        }
        this.disabled = false;
      },
      error => {
        console.error('Error!!', error);
        let errorRes = error.json();
        if (error && error.status === 404) {
          this.router.navigate(['404']);
        } else if (error && error.status === 401) {
          this.serviceErrorFooterAlertModel.description = 'Insufficient privileges to get user permission.'
          this.alertFooterService.registerFooterAlert(JSON.parse(JSON.stringify(this.serviceErrorFooterAlertModel)));
          this.router.navigate(['403']);
        } else if (error && (error.status === 502 || error.status === 504)) {
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
    this.qParams['keyword'] = this.keyword;
  }

  setSortModel(sortBy) {
    if(sortBy.substring(0, 1) == '-') {
      return {type: sortBy.substring(1), sort: 'desc'};
    } else {
      return {type: sortBy, sort: 'asc'};
    }
  }

  pageChange(pagenumber) {
    this.pageNum = pagenumber;
    this.workspaceRefresh();
  }

  public addContractOpportunityClick(): void {
    this.router.navigate(['opp/add']);
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

  //agency picker change handler
  onOrganizationChange(selectedOrgs:any){
    let organizationStringList = '';
    let stringBuilderArray = selectedOrgs.map(function (organizationItem) {
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
      this.workspaceRefresh();
    }

  }

  //TODO: Refactor this with more suitable way. Currently this method only returns single org Id for any user.
  private initFHDropdown() {
    try {
      let user: any = this.userService.getUser();
      if (user != null && user.email != null) {
        this.userAccessService.getAllUserRoles(this.userService.getUser().email).subscribe(api => {
          if (api != null && api.access != null && Array.isArray(api.access) && api.access.length> 0 && api.access[0].organization != null && api.access[0].organization.id != null){
            this.orgRoots.push(api.access[0].organization.id);
          }
        }, error => { //failed to get user associated organization. Redirect to signin
          this.router.navigate(['signin']);
        });
      } else { //failed to get user associated organization. Redirect to signin
        this.router.navigate(['signin']);
      }
    } catch (exception) { //failed to get user associated organization. Redirect to signin
      this.router.navigate(['signin']);
    }
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
    this.pageNum = 0;
    this.workspaceRefresh();
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
            this.addNameToData("office");
          },
          error => {
            console.error('Error!!', error);
          }
        );
    }
  }

  createNoticeTypeMap(){
    let ctx = this;
      this.dictionaryService.getOpportunityDictionary('procurement_type')
        .subscribe(
          data => {
            data['procurement_type'].forEach(function(type){
              ctx.noticeTypeMap.set(type.code, type.value);
            });
            this.addNameToData("notice");
          },
          error => {
            console.error('Error!!', error);
          }
        );
  }

  addNameToData(name: string) {
    let ctx = this;
    ctx.data.forEach(function(data){
      switch(name) {
        case "office": data['officeName'] = ctx.orgMap.get(data.data.organizationId.toString());
          break;
        case "notice": data['noticeType'] = ctx.noticeTypeMap.get(data.data.type.toString());
          break;
      }
    });
  }

  // builds the options for status filter with counts included from api call -- returns to runProgram()
  buildStatusFilterOptions(data){
    var returnOptions = [];

    for(var property in data){
      var newObj = {};
      data[property]['count'] = data[property]['count'] == null ? 0 : data[property]['count'];
      var isZero = data[property]['count'] === 0 ? true : false;
      switch(data[property]['name']){
        case 'total_active':
          newObj = {value: 'published', label: 'Active (' + data[property]['count'] + ')', name: 'checkbox-active', disabled: isZero ? true : false};
          break;
        case 'total_draft':
          newObj = {value: 'draft', label: 'Drafts (' + data[property]['count'] + ')', name: 'checkbox-draft', disabled: isZero ? true : false};
          break;
        case 'total_archived':
          newObj = {value: 'archived', label: 'Archived (' + data[property]['count'] + ')', name: 'checkbox-archived', disabled: isZero ? true : false};
          break;
        case 'total_presolicitation':
          newObj = {value: 'p', label: 'Presolicitation (' + data[property]['count'] + ')', name: 'checkbox-presolicitation', disabled: isZero ? true : false};
          break;
        case 'total_award_notice':
          newObj = {value: 'a', label: 'Award Notice (' + data[property]['count'] + ')', name: 'checkbox-award-notice', disabled: isZero ? true : false};
          break;
        case 'total_notification_amendment':
          newObj = {value: 'm', label: 'Modification/Amendment/Cancel (' + data[property]['count'] + ')', name: 'checkbox-notification-amendment', disabled: isZero ? true : false};
          break;
        case 'total_sources_sought':
          newObj = {value: 'r', label: 'Sources Sought (' + data[property]['count'] + ')', name: 'checkbox-sources-sought', disabled: isZero ? true : false};
          break;
        case 'total_special_notice':
          newObj = {value: 's', label: 'Special Notice (' + data[property]['count'] + ')', name: 'checkbox-special-notice', disabled: isZero ? true : false};
          break;
        case 'total_foreign_government':
          newObj = {value: 'f', label: 'Foreign Government Standard (' + data[property]['count'] + ')', name: 'checkbox-foreign-govt', disabled: isZero ? true : false};
          break;
        case 'total_sale_surplus':
          newObj = {value: 'g', label: 'Sale of Surplus Property (' + data[property]['count'] + ')', name: 'checkbox-sale-surplus', disabled: isZero ? true : false};
          break;
        case 'total_combined_synopsis':
          newObj = {value: 'k', label: 'Combined Synopsis/Solicitation (' + data[property]['count'] + ')', name: 'checkbox-synopsis', disabled: isZero ? true : false};
          break;
        case 'total_justification_approval':
          newObj = {value: 'j', label: 'Justification and Approval (J&A) (' + data[property]['count'] + ')', name: 'checkbox-justification-approval', disabled: isZero ? true : false};
          break;
        case 'total_intent_bundle':
          newObj = {value: 'i', label: 'Intent to Bundle Requirements (DoD-Funded) (' + data[property]['count'] + ')', name: 'checkbox-bundle-req', disabled: isZero ? true : false};
          break;
        case 'total_fair_opportunity':
          newObj = {value: 'l', label: 'Fair Opportunity / Limited Sources Justification (' + data[property]['count'] + ')', name: 'checkbox-fair-opportunity', disabled: isZero ? true : false};
          break;
        case 'total_solicitation':
          newObj = {value: 'o', label: 'Solicitation (' + data[property]['count'] + ')', name: 'checkbox-Solicitation', disabled: isZero ? true : false};
          break;
        default:
          newObj = null;
          break;
      }

      // add new object to our returnOptions
      if(newObj){
        returnOptions.push(newObj);
      }
    }
    return returnOptions;
  }

  // status filter model change
  statusModelChange(event){
    if(this.statusCheckboxModel[0] === ''){
      this.statusCheckboxModel.splice(0, 1);
    }
    this.pageNum = 0;
    this.workspaceRefresh();
  }

  // status filter model change
  noticeTypeModelChange(event){
    if(this.noticeTypeCheckboxModel[0] === ''){
      this.noticeTypeCheckboxModel.splice(0, 1);
    }
    this.pageNum = 0;
    this.workspaceRefresh();
  }

  sortModelChange(event){
    this.pageNum = 0;
    this.oldSortModel = this.sortModel;
    this.sortModel = event;
    this.workspaceRefresh();
  }

  dateModelChange(event){
    this.filterDisabled = true;
    if(event['date']){
      if(event['date'] !== 'Invalid Date' && event['date'].substring(0,1) !== '0'){
        this.internalDateModel['startDate'] = event['date'];
        this.internalDateModel['endDate'] = event['date'];
        this.dateRadio = 'date';
        this.filterDisabled = false;
      }
    } else if(event['dateRange']){
        // checks if dateRange exists and does not equal invalid date and that all 4 "year" numbers have been filled in
        if(event['dateRange']['startDate'] && event['dateRange']['endDate'] && event['dateRange']['startDate'] !== 'Invalid date' && event['dateRange']['endDate'] !== 'Invalid date'){
          if(event['dateRange']['startDate'].substring(0,1) !== '0' && event['dateRange']['endDate'].substring(0,1) !== '0'){
            this.internalDateModel['startDate'] = event['dateRange']['startDate'];
            this.internalDateModel['endDate'] = event['dateRange']['endDate'];
            this.dateRadio = 'dateRange';
            this.filterDisabled = false;
          }
        }
    }
  }

  clearDateFilter(){
    this.postedDateFilterModel = {};
    this.responseDateFilterModel = {};
    this.archiveDateFilterModel = {};
    this.internalDateModel = {};
    this.pageNum = 0;

    this.workspaceRefresh();
  }

  clearAgencyPickerFilter(){
    this.agencyPickerModel = [];
    this.organizationId = "";
  }

  clearAllFilters(){
    //clear status && notice type
    this.statusCheckboxModel = this.defaultStatus;
    this.noticeTypeCheckboxModel = [];

    //clear keyword
    this.keywordsModel = [];

    this.clearAgencyPickerFilter();

    //clear date filter
    this.postedDateFilterModel = {};
    this.responseDateFilterModel = {};
    this.archiveDateFilterModel = {};
    this.internalDateModel = {};
    this.pageNum = 0;

    //reset sort
    this.oldSortModel = this.defaultSort;
    this.sortModel = this.defaultSort;

    this.workspaceRefresh();
  }

  workspaceRefresh(){
    this.disabled = true;
    let qsobj = this.setupQS();
    let navigationExtras: NavigationExtras = {
      queryParams: qsobj
    };
    this.router.navigate(['/opp/workspace/'], navigationExtras);
  }

}
