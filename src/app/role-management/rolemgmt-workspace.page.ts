import {Component, OnInit} from '@angular/core';
import { UserAccessService } from "../../api-kit/access/access.service";

@Component({
  templateUrl: './rolemgmt-workspace.page.html'
})
export class RoleMgmtWorkspace implements OnInit{
  autocompleteInput : string = '';
  statusKey : string = '';
  domainKey: string = '';
  order : string = 'desc';
  page : number = 1;
  pages : number = 0;

  Details : any;
  totalRequest : number = 0;
  currCount : number = 0;
  pendingCount: number = 0;
  escalatedCount: number = 0;

  constructor(private role: UserAccessService){

  }

  ngOnInit(){
    this.getStatusIds();

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
    if(this.autocompleteInput !== event.value){
      this.autocompleteInput = event.value;
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

  getRequestAccess(){
    //console.log("Access " + this.page);
    this.role.getRequestAccess(this.autocompleteInput, this.statusKey,this.domainKey,this.order,this.page).subscribe(res => {
      //console.log(res);
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
        //console.log("Now " + this.statusKey);
        this.getRequestAccess();
      });
    }

}
