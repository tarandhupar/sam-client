import { Component, Input, ViewChild, ViewChildren, QueryList } from "@angular/core";
import { ActivatedRoute, Router} from "@angular/router";
import { FHService } from "../../../api-kit/fh/fh.service";
import { FlashMsgService } from "../flash-msg-service/flash-message.service";
import { Location } from "@angular/common";
import { IAMService } from "api-kit";
import * as moment from 'moment';

@Component ({
  templateUrl: 'hierarchy.template.html'
})
export class OrgHierarchyPage {

  recordsPerPage:number = 10;

  orgId: string = "";
  orgType: string = "";
  orgList: any = [];
  loadData: boolean = false;
  status: any = [];

  curStart = 0;
  curEnd = 0;
  curPage = 0;
  totalRecords = 0;
  totalPages = 0;

  sortField = 'asc';
  sortFields = [
    {label: 'Organization A-Z', value: 'asc'},
    {label: 'Organization Z-A', value: 'desc'},
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
    this.status = this.flashMsgService.hierarchyStatusFilter;

    this.route.parent.params.subscribe(
      params => {
        this.orgId = params['orgId'];
        this.iamService.iam.checkSession(this.checkAccess, this.redirectToSignin);
      });

    this.flashMsgService.hierarchyStatusUpdate.subscribe( status => {
      this.status = status;
      this.curPage = 0;
      this.getHierarchyData(status, this.sortField);
    });
  }

  checkAccess = (user) => {
    this.fhService.getAccess(this.orgId).subscribe(
      (data)=> {this.getHierarchyData(this.status, this.sortField);},
      (error)=> {if(error.status === 403) this.redirectToForbidden();}
    );
  };

  redirectToSignin = () => { this._router.navigateByUrl('/signin')};
  redirectToForbidden = () => {this._router.navigateByUrl('/403')};
  redirectToNotFound = () => { this._router.navigateByUrl('/404')};

  getHierarchyData(status, sort){
    let statusStr = 'all';
    if(status.length === 1) statusStr = status[0];

    this.fhService.getOrganizationById(this.orgId, true, true, statusStr, this.recordsPerPage, this.curPage+1, this.sortField).subscribe( data => {
      if(data._embedded[0].org.type.toLowerCase() === 'office'){
        this.redirectToNotFound();
      }
      this.orgList = data._embedded[0].org.hierarchy;
      this.totalRecords = data._embedded[0].count;
      this.totalPages = Math.ceil(this.totalRecords/this.recordsPerPage);
      this.updateRecords();

    });
  }

  updateRecords(){
    this.curStart = this.curPage * this.recordsPerPage + 1;
    this.curEnd = (this.curPage + 1) * this.recordsPerPage;
    if( this.curEnd >= this.totalRecords) this.curEnd = this.totalRecords;
    if( this.totalRecords === 0) this.curStart = 0;
  }

  pageChange(val){
    this.curPage = val;
    this.getHierarchyData(this.status, this.sortField);
  }

  isOrgActive(org):boolean{
    if(!!org.modStatus){
      return org.modStatus.toLowerCase() === "active";
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

  onSortChanged(){
    this.curPage = 0;
    this.getHierarchyData(this.status, this.sortField);
  }
}
