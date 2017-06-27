import {Component, OnInit, ViewChild} from '@angular/core';
import { UserAccessService } from "../../api-kit/access/access.service";
import {RoleMgmtSidenav} from "./rolemgmt-sidenav/rolemgmt-sidenav.component";
import {ActivatedRouteSnapshot, ActivatedRoute} from "@angular/router";

@Component({
  templateUrl: './rolemgmt-workspace.page.html'
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

  @ViewChild('sideNav') sideNav: RoleMgmtSidenav;

  constructor(private role: UserAccessService, private route: ActivatedRoute){

  }

  ngOnInit(){
    let status = this.route.snapshot.queryParams['status'];
    if (status === 'pending') {
      this.onClickPending()
    } else if (status === 'escalated') {
      this.onClickEscalated();
    } else {
      this.getStatusIds();
    }
  }

  StatusValue(event){
    this.statusKey = event;
    this.page =1;
    this.getRequestAccess();

  }

  DomainValue(event){
    this.domainKey = event;
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
      this.Details = res.userAccessRequestList;
      this.totalRequest = res.count;
      this.currCount = res.userAccessRequestList.length;
      this.pages = Math.ceil(res.count/10);
      this.pendingCount = res.pendingCount;
      this.escalatedCount = res.escalatedCount;
    });

  }

  getStatusIds(){
    this.role.getAccessStatus('Admin').subscribe(res => {
        if(res.length > 0 ){
          res.forEach(status => {
            if(this.statusKey === ''){
              this.statusKey = this.statusKey + status.id;
            }
            else{
              this.statusKey = this.statusKey + "," + status.id;
            }
          });

        }
        this.getRequestAccess();
      });
    }

}
