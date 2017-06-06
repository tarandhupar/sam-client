import { Component } from "@angular/core";
import { FHService } from "api-kit/fh/fh.service";
import { ActivatedRoute } from "@angular/router";
import * as moment from 'moment';

@Component ({
  templateUrl: 'federal-hierarchy.template.html'
})
export class FederalHierarchyPage {

  recordsPerPage:number = 7;

  orgList:any = [];

  curPageOrgs:any = [];
  curPage:number = 0;
  curStart:number = 0;
  curEnd:number = 0;
  totalPages:number = 0;

  orgStatusModel = ['Active'];
  orgStatusOptions = [
    { label: 'Active', value: 'Active', name: 'Active' },
    { label: 'Inactive', value: 'Inactive', name: 'Inactive' },
  ];

  userRole = "superAdmin";
  adminOrg:any;

  dataLoaded:boolean = false;
  constructor(private fhService: FHService, private route: ActivatedRoute){}

  ngOnInit(){
    this.route.queryParams.subscribe(
      queryParams => {
        if(queryParams['userRole'] !== undefined && queryParams['userRole'] !== null){
          this.userRole = queryParams['userRole'];
        }
        switch (this.userRole){
          case "superAdmin":
            this.fhService.getActiveDepartments().subscribe( data => {
              this.initiatePage(data._embedded);
              this.dataLoaded = true;
            });
            break;
          case "deptAdmin":
            this.fhService.getDepartmentAdminLanding().subscribe( data => {
              this.adminOrg = data._embedded[0].org;
              this.initiatePage(data._embedded[0].org.hierarchy);
              console.log(this.adminOrg.name);
              this.dataLoaded = true;
            });
            break;
        }
      });


  }

  initiatePage(orgList){
    this.orgList = orgList;
    this.totalPages = Math.ceil(this.orgList.length/this.recordsPerPage);
    this.updateRecordsText();
    this.updateRecordsPage();
  }

  pageChange(val){
    this.curPage = val;
    this.updateRecordsText();
    this.updateRecordsPage();
  }

  updateRecordsText(){
    this.curStart = this.curPage * this.recordsPerPage + 1;
    this.curEnd = (this.curPage + 1) * this.recordsPerPage;
    if( this.curEnd > this.orgList.length) this.curEnd = this.orgList.length;
  }

  updateRecordsPage(){
    this.curPageOrgs = this.orgList.slice(this.curStart, this.curEnd + 1);
  }

  onOrgStatusChange(){

  }

  isOrgActive(org):boolean{
    if(!!org.endDate){
      let endDate = moment(org.endDate);
      if (endDate.diff(moment()) > 0) {
        return false;
      }
    }
    return true;
  }

  getStartDate(org):String{
    return moment(org.createdDate).format('MM/DD/YYYY');
  }
}
