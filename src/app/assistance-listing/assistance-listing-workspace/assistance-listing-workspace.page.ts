import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {Router, ActivatedRoute, NavigationExtras} from '@angular/router';
import {ProgramService} from 'api-kit';
import {FHService} from 'api-kit';
import * as Cookies from 'js-cookie';
import {ReplaySubject} from "rxjs/ReplaySubject";
import {Observable} from "rxjs/Observable";

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
  }
  orgMap = new Map();

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
    return qsobj;
  }

  runProgram() {
    // make api call
    this.runProgSub = this.programService.runProgram({
      keyword: this.keyword,
      pageNum: this.pageNum,
      Cookie: this.cookieValue,
      status: this.statusCheckboxModel ? this.statusCheckboxModel.toString() : this.defaultStatus

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

    apiSubject.subscribe(res => {
      this.permissions = res;
        this.activatedRoute.queryParams.subscribe(
          data => {
            this.keyword = typeof data['keyword'] === "string" ? decodeURI(data['keyword']) : this.keyword;
            this.pageNum = typeof data['page'] === "string" && parseInt(data['page']) - 1 >= 0 ? parseInt(data['page']) - 1 : this.pageNum;
            this.statusCheckboxModel = typeof data['status'] === "string" ? decodeURI(data['status']).split(",") : this.defaultStatus;
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

  addOrgNameToData() {
    let ctx = this;
    ctx.data.forEach(function(data){
        data['organizationName'] = ctx.orgMap.get(data.data.organizationId.toString());
    });
  }

}

