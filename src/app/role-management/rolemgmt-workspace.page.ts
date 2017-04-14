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
  
  Details : any;
  totalRequest : number = 0;
  currCount : number = 0;
  constructor(private role: UserAccessService){
     
  }

  ngOnInit(){
    this.getStatusIds();
    //console.log(this.statusKey);
    //this.getRequestAccess();    
  }

  StatusValue(event){
    this.statusKey = event;
    this.getRequestAccess();

  }

  DomainValue(event){
    this.domainKey = event;
    this.getRequestAccess();
  }

  AutoCompleteValue(event){
    if(this.autocompleteInput !== event.value){
      this.autocompleteInput = event.value;
      this.getRequestAccess();  
    }
  }

  SortValue(event){
    this.order = event;
    this.getRequestAccess();
  }

  PageValue(event){
    this.page = event;
    this.getRequestAccess();
  }

  getRequestAccess(){
    this.role.getRequestAccess(this.autocompleteInput, this.statusKey,this.domainKey,this.order,this.page).subscribe(res => {
      //console.log(res);
      this.Details = res.userAccessRequestList;
      this.totalRequest = res.count;
      this.currCount = res.userAccessRequestList.length;
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
        console.log("Now " + this.statusKey);
        this.getRequestAccess();
      });
    }
  
}
