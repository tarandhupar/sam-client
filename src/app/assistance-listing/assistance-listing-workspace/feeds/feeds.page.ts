import {Component, OnInit, Input, ViewChild} from "@angular/core";
import {Router, ActivatedRoute, NavigationExtras} from '@angular/router';
import {ProgramService} from 'api-kit';
import * as Cookies from 'js-cookie';
import {ActionHistoryLabelPipe} from "../../pipes/action-history-label.pipe";
import {RequestTypeLabelPipe} from "../../pipes/request-type-label.pipe";
import { IBreadcrumb } from "sam-ui-kit/types";
import {FALAuthGuard} from "../../components/authguard/authguard.service";

@Component({
  providers: [ActionHistoryLabelPipe, RequestTypeLabelPipe],
  templateUrl: 'feeds.template.html'
})

export class FeedsPage implements OnInit {
  cookieValue: string;
  requests: any;
  programRequestList: any;
  public permissions: any;
  public userPermissions: any;
  domainLabel: any = "";
  isAL:boolean = false;
  isRequest: boolean = false;
  isPendingRequest:boolean;
  currentPage = 0;
  requestType:any;
  keyword:any = '';
  size:any = 4;
  totalPages: any;
  totalElements: any;
  initLoad = true;
  defaultDomainOption: any;
  defaultEventOption: any;
  defaultPendingRequestsOption: any;
  hasPermissions: boolean;
  crumbs: Array<IBreadcrumb> = [
    { breadcrumb:'Home', url:'/',},
    { breadcrumb: 'Workspace', url: '/workspace' },
    { breadcrumb: 'My feed'}
  ];


  constructor(private activatedRoute: ActivatedRoute, private router: Router, private programService: ProgramService , private authGuard: FALAuthGuard) {
  }

  ngOnInit(){
    this.cookieValue = Cookies.get('iPlanetDirectoryPro');

    this.activatedRoute.queryParams.subscribe(params => {
      this.defaultDomainOption = params['domain'];
      this.defaultEventOption = params['event'];
      this.defaultPendingRequestsOption = params['pending'];
    });
    this.getUserPermissions();
  }
  
  getUserPermissions() {
    this.programService.getPermissions(this.cookieValue, 'ORG_LEVELS').subscribe(res => {
      this.permissions = res;
    });
    this.userPermissions = this.authGuard._falLinks;
    this.hasPermissions = this.authGuard.checkPermissions('feeds', null);
    if(this.hasPermissions) {
      this.activatedRoute.queryParams.subscribe(
        params => {
          this.isPendingRequest = this.defaultPendingRequestsOption;
          this.getRequests();
        });
    }
  }

  getRequests(){
    this.requests = this.programService.getRequests({
      Cookie: this.cookieValue,
      programId: '',
      pageNum: this.currentPage,
      type: this.requestType,
      keyword : this.keyword,
      isCompleted: !this.isPendingRequest,
      size: this.size,
      includeCount: true
    }).subscribe(
      data => {
        if(data.page){
          this.totalPages = data.page.totalPages;
          this.totalElements = data.page.totalElements;
        }
        if (data._embedded && data._embedded.programRequestList) {
          this.programRequestList = data._embedded.programRequestList;
        } else {
          this.programRequestList = [];
        }
        this.initLoad = false;
      },
      error => {
        console.error('Error!!', error);
      }
    );
  }

  domainFilterModelChangeHandler(event){
    this.currentPage = 0;
    if(event.indexOf('al') < 0){
      this.isAL = false;
    }else{
      this.isAL = true;
      this.domainLabel = "Assistance Listings";
    }
  }

  eventFilterModelChangeHandler(event){
    this.currentPage = 0;
    if(event.indexOf('request') < 0){
      this.isRequest = false;
    }else{
      this.isRequest = true;
    }
  }

  pendingRequestsModelChangeHandler(event){
    this.currentPage = 0;
    if(event.indexOf('pending-requests') < 0){
      this.isPendingRequest = false;
    }else{
      this.isPendingRequest = true;
    }
    this.getRequests();
  }

  requestTypeFilterModelChangeHandler(event) {
    this.requestType = '';
    event.forEach((res: any) => {
        this.requestType += res +',';
    });
    this.currentPage = 0;
    this.getRequests();
  }

  onFeedSearchClick(){
    this.getRequests();
  }

  pageChangeHandler(event){
    this.currentPage = event-1;
    this.getRequests();
  }


}
