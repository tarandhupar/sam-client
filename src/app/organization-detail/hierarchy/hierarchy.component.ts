import { Component, Input, ViewChild, ViewChildren, QueryList } from "@angular/core";
import { ActivatedRoute, Router} from "@angular/router";
import { FHService } from "../../../api-kit/fh/fh.service";
import { FlashMsgService } from "../flash-msg-service/flash-message.service";
import { Observable } from 'rxjs';
import { Location } from "@angular/common";
import { IAMService } from "api-kit";
import * as moment from 'moment';

@Component ({
  templateUrl: 'hierarchy.template.html'
})
export class OrgHierarchyPage {

  recordsPerPage:number = 7;

  orgType: string = "";
  orgList: any = [];
  loadData: boolean = false;

  curStart = 0;
  curEnd = 0;
  curPage = 0;
  totalRecords = 0;
  totalPages = 0;
  curPageOrgList: any = [];

  sortField = 'asc';
  sortFields = [
    {label: 'Organization A-Z', value: 'asc'},
    {label: 'Organization Z-A', value: 'dsc'},
  ];
  typeMap = {'DEPARTMENT':'Dept/Ind Agency (L1)','AGENCY':'Sub-Tier (L2)'};

  constructor(private _router: Router,
              private route: ActivatedRoute,
              private fhService: FHService,
              public flashMsgService: FlashMsgService,
              private location: Location,
              private iamService: IAMService) {
  }

  ngOnInit() {
    this.getHierarchyData(this.flashMsgService.hierarchyStatusFilter);
    this.flashMsgService.hierarchyStatusUpdate.subscribe( status => {
      this.getHierarchyData(status);
    });
  }

  getHierarchyData(status){
    this.fhService.getDepartments().subscribe( data => {
      this.orgList = data._embedded;
      this.totalRecords = this.orgList.length;
      this.totalPages = Math.ceil(this.totalRecords/this.recordsPerPage);
      this.updateRecords();

    });
  }

  updateRecords(){
    this.curStart = this.curPage * this.recordsPerPage + 1;
    this.curEnd = (this.curPage + 1) * this.recordsPerPage;
    if( this.curEnd >= this.totalRecords) this.curEnd = this.totalRecords;
    if( this.totalRecords === 0) this.curStart = 0;
    this.updatePageContent(this.curStart, this.curEnd);
  }

  updatePageContent(start, end){
    this.curPageOrgList = this.orgList.slice(start - 1, end);
  }

  pageChange(val){
    this.curPage = val;
    this.updateRecords();
  }

  isOrgActive(org):boolean{
    if(!!org.modStatus){
      return org.modStatus === "active";
    }

    if(!!org.endDate){
      let endDate = moment(org.endDate);
      if (endDate.diff(moment()) < 0) {
        return false;
      }
    }
    return true;
  }

  getOrgTypeText(org):string{
    if(org.type){
      let orgType = org.type.toUpperCase();
      if( this.typeMap[orgType]) return this.typeMap[orgType];
      return orgType.substr(0,1) + orgType.substr(1,orgType.length-1).toLowerCase() + " (L" + org.level + ")";
    }
    return "NA";

  }

  getStartDate(org):String{
    if(org.startDate) {
      return moment(org.startDate).utc().format('MM/DD/YYYY');
    }
    return "";
  }
}
