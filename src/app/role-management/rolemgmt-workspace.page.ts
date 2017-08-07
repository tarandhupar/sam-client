import {Component, OnInit, ViewChild} from '@angular/core';
import { UserAccessService } from "../../api-kit/access/access.service";
import {RoleMgmtSidenav} from "./rolemgmt-sidenav/rolemgmt-sidenav.component";
import { ActivatedRouteSnapshot, ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { IBreadcrumb, OptionsType } from "sam-ui-kit/types";
import { CapitalizePipe } from "../app-pipes/capitalize.pipe";

@Component({
  templateUrl: './rolemgmt-workspace.page.html',
})
export class RoleMgmtWorkspace implements OnInit{
  autocompleteInput : string = '';
  statusKey : string = '';
  domainKey: string = '';
  order : string = 'asc';
  page : number = 1;
  pages : number = 0;

  Details : any;
  totalRequest : number = 0;
  currCount : number = 0;
  pendingCount: number = 0;
  escalatedCount: number = 0;

  private crumbs: Array<IBreadcrumb> = [
      { url: '/workspace', breadcrumb: 'Workspace' },
      { breadcrumb: 'Role Requests' }
    ];

  @ViewChild('sideNav') sideNav: RoleMgmtSidenav;

  constructor(
    private role: UserAccessService,
    private route: ActivatedRoute,
    private router: Router,
    private capitalize: CapitalizePipe,
  ){

  }

  ngOnInit(){
    let qp = this.route.snapshot.queryParams;
    let status = qp['status'];

    if (qp['domain']) {
      this.domainKey = qp['domain'];
    }
    if (qp['page']) {
      this.page = +qp['page'];
    }
    if (qp['status']) {
      this.statusKey = qp['status'];
      let e = this.statusKey.split(',').map(s => +s);
      this.sideNav.statusCheckboxes.value = e;
      this.sideNav.StatusCheckboxModel = e;
    }
    if (qp['q']) {
      this.autocompleteInput = qp['q'];
    }
    if (qp['order']) {
      this.order = qp['order'];
    }
    this.getRequestAccess();
  }

  StatusValue(event){
    this.statusKey = event.join(',');
    this.page =1;
    this.getRequestAccess();

  }

  DomainValue(event){
    this.domainKey = event.join(',');
    this.page =1;
    this.getRequestAccess();
  }

  AutoCompleteValue(event){
    if(this.autocompleteInput !== event){
      this.autocompleteInput = event;
      this.page = 1;
      this.getRequestAccess();
    }
  }

  SortValue(event){
    this.order = event;
    this.page = 1;
    this.getRequestAccess();
  }

  PageValue(event){
    this.page = event;
    this.getRequestAccess();
  }

  onClickEscalated() {
    let e = [4];
    this.sideNav.statusCheckboxes.value = e;
    this.sideNav.StatusCheckboxModel = e;
    this.StatusValue("4");
  }

  onClickPending() {
    let e = [1];
    this.sideNav.statusCheckboxes.value = e;
    this.sideNav.StatusCheckboxModel = e;
    this.StatusValue("1");
  }

  getRequestAccess(){
    this.role.getRequestAccess(this.autocompleteInput, this.statusKey,this.domainKey,this.order,this.page).subscribe(res => {
      let extras: NavigationExtras = {
        queryParams: {
          q: this.autocompleteInput,
          page: this.page,
          status: this.statusKey,
          domain: this.domainKey,
          order: this.order,
        }
      };
      this.router.navigate(['access/requests'], extras);

      this.Details = res.userAccessRequestList;
      this.totalRequest = res.count;
      this.currCount = res.userAccessRequestList.length;
      this.pages = Math.ceil(res.count/10);
      this.pendingCount = res.pendingCount;
      this.escalatedCount = res.escalatedCount;
    });

  }
}
