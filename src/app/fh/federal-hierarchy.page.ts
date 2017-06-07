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
  adminOrg:any = {};

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
  adminOrgKey:any;
  deptOrg:any;

  selectConfig = {
    options:[],
    label: '',
    name: 'Org Types',
  };

  dataLoaded:boolean = false;
  showAdminOrg:boolean = false;
  constructor(private fhService: FHService, private route: ActivatedRoute){}

  ngOnInit(){
    this.route.queryParams.subscribe(
      queryParams => {
        if(queryParams['userRole'] !== undefined && queryParams['userRole'] !== null){
          this.userRole = queryParams['userRole'];
          this.setCreateOrgTypes();
        }

        switch (this.userRole){
          case "superAdmin":
            this.fhService.getActiveDepartments().subscribe( data => {
              this.initiatePage(data._embedded);
              this.dataLoaded = true;
            });
            break;
          case "deptAdmin": case "agencyAdmin": case "officeAdmin":
            this.fhService.getDepartmentAdminLanding().subscribe( data => {
              this.deptOrg = data._embedded[0].org;
              this.initiatePage(this.deptOrg.hierarchy);
              if(this.userRole !== 'deptAdmin') {
                this.adminOrgKey = queryParams['orgId'];
                this.setAdminOrg();
              }
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
    if( this.curEnd >= this.orgList.length) this.curEnd = this.orgList.length - 1;
  }

  updateRecordsPage(){
    this.curPageOrgs = this.orgList.slice(this.curStart - 1, this.curEnd);
  }

  setCreateOrgTypes(){
    switch (this.userRole){
      case "superAdmin":
        this.selectConfig.options.push({value: 'Department', label: 'Dep/Ind Agency', name: 'Dep/Ind Agency'});
        break;
      case "deptAdmin":
        this.selectConfig.options.push({value: 'Agency', label: 'Sub-Tier', name: 'Sub-Tier'});
        break;
      case "agencyAdmin":
        this.selectConfig.options.push({value: 'Office', label: 'Office', name: 'Office'});
        break;
    }
  }

  setAdminOrg(){
    this.adminOrg = this.orgList.find(e => { if(e.org.orgKey == this.adminOrgKey) return e;});
  }

  onOrgStatusChange(){}

  onSelectAdminOrg(val){this.showAdminOrg = val;}

  isOrgActive(org):boolean{
    if(!!org.endDate){
      let endDate = moment(org.endDate);
      if (endDate.diff(moment()) > 0) {
        return false;
      }
    }
    return true;
  }

  isAdminOrg(orgId):boolean{
    if(this.userRole === 'superAdmin' || this.userRole === 'deptAdmin') return true;
    if(this.userRole === 'officeAdmin') return false;
    return this.adminOrgKey == orgId;
  }

  getStartDate(org):String{
    return moment(org.createdDate).format('MM/DD/YYYY');
  }


}
