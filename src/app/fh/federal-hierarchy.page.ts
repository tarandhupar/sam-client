import { Component } from "@angular/core";
import { FHService } from "api-kit/fh/fh.service";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import * as moment from 'moment';
import { Observable } from "rxjs";

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
  totalRecords:number = 0;

  orgSearchStatusModel = ['allActive'];
  orgStatusModel = ['Active'];
  orgStatusOptions = [
    { label: 'Active', value: 'Active', name: 'Active' },
    { label: 'Inactive', value: 'Inactive', name: 'Inactive' },
  ];

  userRole = "superAdmin";
  adminOrgKey:any;
  deptOrgKey:string;
  deptOrg:any;
  deptLogo:any;
  errorLogo:boolean = false;

  selectConfig = {
    options:[],
    label: '',
    name: 'Org Types',
  };

  dataLoaded:boolean = false;
  showAdminOrg:boolean = false;

  typeMap = {'DEPARTMENT':'Dep/Ind Agency (L1)','AGENCY':'Sub-Tier (L2)'};

  searchText:string = "";
  searchType:string = "general";
  searchOrgType:any = [];
  resultType:string = "default";
  constructor(private fhService: FHService, private route: ActivatedRoute, private _router:Router){}

  ngOnInit(){
    this.route.queryParams.subscribe(
      queryParams => {
        if(queryParams['userRole'] !== undefined && queryParams['userRole'] !== null){
          this.userRole = queryParams['userRole'];
        }
        this.setCreateOrgTypes();
        if(this.userRole !== "superAdmin"){
          this.adminOrgKey = queryParams['orgId'];
          this.deptOrgKey = this.userRole === 'deptAdmin'? this.adminOrgKey:'100000000';
        }
        this.loadDefaultData();

      });
  }

  loadDefaultData(){
    switch (this.userRole){
      case "superAdmin":
        this.fhService.getDepartmentsByStatus('active').subscribe( data => {
          this.initiatePage(data._embedded,data._embedded.length);
          this.dataLoaded = true;
        });
        break;
      case "deptAdmin": case "agencyAdmin": case "officeAdmin":
        this.fhService.getDepartmentAdminLanding('active', this.deptOrgKey).subscribe( data => {
          this.deptOrg = data._embedded[0].org;
          this.deptLogo = data._embedded[0]._link.logo;
          if(!this.deptLogo) this.updateNoLogoUrl();
          this.initiatePage(this.deptOrg.hierarchy,this.deptOrg.hierarchy.length);
          if(this.userRole !== 'deptAdmin') {this.setAdminOrg();}
          this.dataLoaded = true;
        });
      break;
    }
  }

  initiatePage(orgList,totalCount){
    this.orgList = orgList;
    this.totalRecords = totalCount;
    this.totalPages = Math.ceil(totalCount/this.recordsPerPage);
    this.curPage = 0;
    this.updateRecordsText();
    this.updateRecordsPage();
  }

  pageChange(val){
    this.curPage = val;
    if(this.resultType === "search") {
      this.searchFH();
    }else if(this.resultType === "default"){
      this.updateRecordsText();
      this.updateRecordsPage();
    }
  }

  updateRecordsText(){
    this.curStart = this.curPage * this.recordsPerPage + 1;
    this.curEnd = (this.curPage + 1) * this.recordsPerPage;
    if( this.curEnd >= this.totalRecords) this.curEnd = this.totalRecords;
    if( this.totalRecords === 0) this.curStart = 0;
  }

  updateRecordsPage(){
    this.curPageOrgs = this.orgList.slice(this.curStart - 1, this.curEnd);
  }

  setCreateOrgTypes(){
    switch (this.userRole){
      case "superAdmin":
        this.selectConfig.options.push({value: 'department', label: 'Dep/Ind Agency', name: 'Dep/Ind Agency'});
        break;
      case "deptAdmin":
        this.selectConfig.options.push({value: 'agency', label: 'Sub-Tier', name: 'Sub-Tier'});
        break;
      case "agencyAdmin":
        this.selectConfig.options.push({value: 'office', label: 'Office', name: 'Office'});
        break;
    }
  }

  setAdminOrg(){
    this.adminOrg = this.orgList.find(e => { if(e.org.orgKey == this.adminOrgKey) return e;});
  }

  onDefaultOrgStatusChange(orgStatusModel){
    if(orgStatusModel.length === 2 || orgStatusModel.length === 0){
      if(this.userRole === 'superAdmin') this.fhService.getDepartmentsByStatus('all').subscribe( data => this.initiatePage(data._embedded,data._embedded.length));
      if(this.userRole === 'deptAdmin' || this.userRole === 'agencyAdmin') this.fhService.getDepartmentAdminLanding('all', this.deptOrgKey).subscribe( data => this.initiatePage(data._embedded[0].org.hierarchy,data._embedded[0].org.hierarchy.length));
    }else if(orgStatusModel.length === 1){
      let status = orgStatusModel[0].toLocaleLowerCase();
      if(this.userRole === 'superAdmin') this.fhService.getDepartmentsByStatus(status).subscribe( data => this.initiatePage(data._embedded,data._embedded.length));
      if(this.userRole === 'deptAdmin' || this.userRole === 'agencyAdmin') this.fhService.getDepartmentAdminLanding(status, this.deptOrgKey).subscribe( data => this.initiatePage(data._embedded[0].org.hierarchy,data._embedded[0].org.hierarchy.length));

    }
  }

  onSearchOrgStatusChange(orgStatusModel){
    this.orgSearchStatusModel = orgStatusModel;
    this.curPage = 0;
    this.showAdminOrg? this.searchFHAdmin():this.searchFH();
  }

  onSelectAdminOrg(val){
    this.showAdminOrg = val;
    this.curPage = 0;
    if(this.isDefaultResult()){
      this.showAdminOrg? this.searchFHAdmin():this.loadDefaultData();
    }else{
      this.showAdminOrg? this.searchFHAdmin():this.searchFH();
    }
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

  isAdminOrg(orgId):boolean{
    if(this.userRole === 'superAdmin' || this.userRole === 'deptAdmin') return true;
    if(this.userRole === 'officeAdmin') return false;
    return this.adminOrgKey == orgId;
  }

  getStartDate(org):String{
    return moment(org.createdDate).format('MM/DD/YYYY');
  }

  createOrg(){
    let navigationExtras: NavigationExtras = {
      queryParams: {orgType: this.selectConfig.options[0].value}
    };

    if(this.selectConfig.options[0].value !== 'department'){
      navigationExtras.queryParams['parentID'] = this.adminOrgKey;
    }

    this._router.navigate(["/create-organization"],navigationExtras);
  }

  onSelectCreateOrg(orgType){

  }

  updateNoLogoUrl(){
    this.deptLogo = {href:"src/assets/img/logo-not-found.png"};
  }

  updateOrgType(val){
    this.searchOrgType = val;
    this.curPage = 0;
    this.showAdminOrg? this.searchFHAdmin():this.searchFH();
  }

  searchFH(){
    // Search field is required for searching in fh landing page
    if(this.searchText.length > 0){
      this.resultType = "search";
      Observable.forkJoin(
        this.fhService.fhSearchCount(this.searchText, this.searchType, this.orgSearchStatusModel, this.searchOrgType),
        this.fhService.fhSearch(this.searchText, this.curPage+1, this.recordsPerPage, this.orgSearchStatusModel, this.searchOrgType)
      ).subscribe( data => {
        this.curPageOrgs = data[1]._embedded;
        this.totalRecords = data[0];
        this.totalPages = Math.ceil(this.totalRecords/this.recordsPerPage);
        this.updateRecordsText();
      });
    }
  }

  searchFHAdmin(){
    this.fhService.getMyOrganization(this.adminOrgKey, this.searchOrgType).subscribe(data => {
      if(!!data._embedded){
        this.curPageOrgs = [data._embedded[0]];
      }else{
        this.curPageOrgs = [];
      }
      if(this.orgSearchStatusModel.length === 1 && this.orgSearchStatusModel[0] === 'inactive'){
        this.curPageOrgs = [];
      }
      this.totalRecords = this.curPageOrgs.length;
      this.totalPages = Math.ceil(this.totalRecords/this.recordsPerPage);
      this.updateRecordsText();
      }
    );
  }

  isDefaultResult():boolean{ return this.resultType === "default";}

  getOrgTypeText(org):string{
    let orgType = org.type.toUpperCase();
    if( this.typeMap[orgType]) return this.typeMap[orgType];
    return orgType.substr(0,1) + orgType.substr(1,orgType.length-1).toLowerCase() + " (L" + org.level + ")";

  }
}
