import {Component, OnInit, Input, ViewChild} from "@angular/core";
import {Router, ActivatedRoute, NavigationExtras} from '@angular/router';
import {ProgramService} from 'api-kit';
import * as Cookies from 'js-cookie';

@Component({
  providers: [],
  templateUrl: 'pending-requests-list.template.html'
})

export class PendingRequestsListPage implements OnInit {
  cookieValue: string;
  requests: any;
  programRequestList: any;
  requestTypeTitle:any;
  public permissions: any;
  domainLabel: any = "";
  isAL:boolean = false;
  isRequest: boolean = false;
  programId:any;
  currentPage = 0;
  requestType:any;
  keyword:any = '';
  size:any = 4;
  includeCount:any;
  totalPages: any;
  totalElements: any;
  initLoad = true;
  defaultDomainOption: any;
  defaultEventOption: any;


  constructor(private activatedRoute: ActivatedRoute, private router: Router, private programService: ProgramService) {
  }

  ngOnInit(){
    this.cookieValue = Cookies.get('iPlanetDirectoryPro');

    if (this.cookieValue === null || this.cookieValue === undefined) {
      this.router.navigate(['signin']);
    }

    if (SHOW_HIDE_RESTRICTED_PAGES !== 'true') {
      this.router.navigate(['accessrestricted']);
    }

    this.activatedRoute.queryParams.subscribe(params => {
      this.defaultDomainOption = params['domain'];
      this.defaultEventOption = params['event'];
    });

    this.programService.getPermissions(this.cookieValue, 'FAL_LISTING').subscribe(res => {
      this.permissions = res;
      if (!this.permissions['FAL_LISTING']) {
        this.router.navigate['accessrestricted'];
      } else {
        this.activatedRoute.queryParams.subscribe(
          data => {
            this.getRequests();
          });
      }
    });
  }

  getRequests(){
    this.requests = this.programService.getRequests({
      Cookie: this.cookieValue,
      programId: this.programId,
      pageNum: this.currentPage,
      type: this.requestType,
      keyword : this.keyword,
      isCompleted: true,
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

  getRequestTypeTitle(type: any){
    switch (type) {
      case "title_request":
        this.requestTypeTitle = "Title Change Request";
        break;
      case "archive_request":
        this.requestTypeTitle = "Archive Change Request";
        break;
      case "unarchive_request":
        this.requestTypeTitle = "Unarchive Change Request";
        break;
      case "agency_request":
        this.requestTypeTitle = "Agency Change Request";
        break;
      case "program_number_request":
        this.requestTypeTitle = "Program Number Change Request";
        break;
      default:
        this.requestTypeTitle = "Change Request";
        break;
    }
    return this.requestTypeTitle;
  }

  domainFilterModelChangeHandler(event){
    if(event.indexOf('al') < 0){
      this.isAL = false;
    }else{
      this.isAL = true;
      this.domainLabel = "Assistance Listings";
    }
  }

  eventFilterModelChangeHandler(event){
    if(event.indexOf('request') < 0){
      this.isRequest = false;
    }else{
      this.isRequest = true;
    }
  }

  requestTypeFilterModelChangeHandler(event) {
    this.requestType = '';
    event.forEach((res: any) => {
        this.requestType += res +',';
    });
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
