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

  constructor(private fhService: FHService){}

  ngOnInit(){
    this.fhService.getActiveDepartments().subscribe( data => {
      this.orgList = data._embedded;
      this.setupPagination();
      console.log(this.curPageOrgs);
    });
  }

  setupPagination(){
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
      if (endDate.isBefore(moment().format('MM/DD/YYYY'))) {
        return false;
      }
    }
    return true;
  }

  getStartDate(org):String{
    return moment(org.createdDate).format('MM/DD/YYYY');
  }
}
