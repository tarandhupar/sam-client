import { Component } from "@angular/core";
import { FHService } from "api-kit/fh/fh.service";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import * as moment from 'moment';
import { Observable } from "rxjs";
import { IAMService } from "api-kit";
import { AlertFooterService } from '../app-components/alert-footer/alert-footer.service';

@Component ({
  templateUrl: 'federal-hierarchy.template.html'
})
export class FederalHierarchyPage {

  recordsPerPage:number = 10;

  limit : number = 10;
  myOrg : boolean = false;
  sortBy : string = 'asc';
  orderBy : string = 'name';
  status : string = 'Active';
  pageNum : number = 1;
  links : any;

  newOrgList:any = [];
  deptList : any = [];
  agencyList : any = [];
  officeList : any = [];
  featuredOrg: any;
  totalCounts : number;
  btnName : string = '';

  user:any;
  orgList:any = [];
  adminOrg:any = {};

  curPageOrgs:any = [];
  curPage:number = 0;
  curStart:number = 0;
  curEnd:number = 0;
  totalPages:number = 0;
  totalRecords:number = 0;
  altName:string = '';

  orgSearchStatusModel = ['allActive'];
  orgStatusModel = ['Active'];
  orgStatusOptions = [
    { label: 'Active', value: 'Active', name: 'Active' },
    { label: 'Inactive', value: 'Inactive', name: 'Inactive' },
  ];

  accessOrgID = "";
  userRole = "";
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

  typeMap = {'DEPARTMENT':'Dept/Ind Agency (L1)','AGENCY':'Sub-Tier (L2)', 'OFFICE' : 'Office'};

  dodTypeLevelMap = {'Dept/Ind Agency':1, 'Sub-Tier':2, 'Maj Command':3, 'Sub-Command 1':4, 'Sub-Command 2':5, 'Sub-Command 3':6, 'Office':7};
  nondodTypeLevelMap = {'Dept/Ind Agency':1, 'Sub-Tier':2, 'Office':3};

  filterTypes: any = [];
  searchText:string = "";
  searchType:string = "general";
  searchOrgType:any = [];
  resultType:string = "default";

  constructor(private fhService: FHService,
              private route: ActivatedRoute,
              private _router:Router,
              private iamService: IAMService,
              private alertFooter: AlertFooterService){}

  ngOnInit(){
    //this.route.queryParams.subscribe( queryParams => {
      // if(!this.dataLoaded){
      //   this.iamService.iam.checkSession(
      //     (user) => {
      //       this.user = user;
      //       this.deptOrgKey = user.departmentID && user.departmentID !== "" ? user.departmentID : "";
      //       this.fhService.getAccess("", false).subscribe(
      //         (data) => {
      //           this.userRole = "superAdmin";
      //           this.loadInitResult(queryParams);
      //         },
      //         (error) => {
      //           if (error.status === 403) {
      //             this.fhService.getAccess(this.deptOrgKey, false).subscribe(
      //               (data) => {
      //                 this.loadInitResult(queryParams);
      //               },
      //               (error) => {
      //                 if (error.status === 403) this.redirectToForbidden()
      //               }
      //             );
      //           }
      //         }
      //       );
      //     }, this.redirectToSignin
      //   );
      // }

   // });
   this.getOrgDetails(this.myOrg,this.status,this.orderBy,this.sortBy,this.pageNum,this.limit,true);
   
   
  }

  getOrgDetails(myOrg?:boolean,status?:String,orderBy?:String,sortBy?:String,pageNum?:number,limit?:number,initLoad?:boolean){
    this.fhService.getLandingPage(myOrg,status,orderBy,sortBy,pageNum,limit).subscribe(res =>{
      //console.log(res);
      this.resultType = "default";  
      if(res.orgList)this.newOrgList = res.orgList;
      if(res.orgCount)this.totalCounts = res.orgCount;
      if(res.featuredOrg)this.featuredOrg = res.featuredOrg;
      if(res.deptAdminList)this.deptList = res.deptAdminList;
      if(res.agencyAdminList)this.agencyList = res.agencyAdminList;
      if(res.officeAdminList)this.officeList = res.officeAdminList;
      if(res._links)this.links = res._links;
      if(!myOrg) this.updateRecordsText();

      if(initLoad && !myOrg){
        this.initPageload();
      } 
       //this.initPageload();
    },error=>{
      this.showErrorAlertFooter('Failed to obtain organization details');
    });
  }
  
  initPageload(){
    this.totalPages = Math.ceil(this.totalCounts/this.limit);
    this.pageNum = 1;
  }

  loadInitResult(queryParams){
    if(queryParams['keyword']){
      this.searchText = queryParams['keyword'];
      this.orgSearchStatusModel = queryParams['status'];
      if(this.userRole !== "superAdmin"){
        this.fhService.getDepartmentAdminLanding(status).subscribe( data => {
          //Set up agency admin, dept admin or office admin role
          this.deptOrg = data._embedded[0].org;
          this.deptLogo = {href:"src/assets/img/logo-not-found.png"};
          this.setUserRole(data);
          this.setDeptLogo(data);
          this.setCreateOrgTypes();
          this.searchFH();
          this.dataLoaded = true;
        });
      }else{
        this.setCreateOrgTypes();
        this.searchFH();
        this.dataLoaded = true;

      }
    }else{
      this.loadDefaultData('active');
    }
  }


  redirectToSignin = () => { this._router.navigateByUrl('/signin')};
  redirectToForbidden = () => {this._router.navigateByUrl('/403')};

  loadDefaultData: any = (status) => {
    if(this.userRole === "superAdmin"){
      this.fhService.getDepartmentsByStatus(status).subscribe( data => {
        this.initiatePage(data._embedded,data._embedded.length);
        this.setCreateOrgTypes();
        this.dataLoaded = true;
      });
    }else{
      this.fhService.getDepartmentAdminLanding(status).subscribe( data => {
        //Set up agency admin, dept admin or office admin role
        this.deptOrg = data._embedded[0].org;
        this.deptLogo = {href:"src/assets/img/logo-not-found.png"};
        this.initiatePage(this.deptOrg.hierarchy,this.deptOrg.hierarchy.length);
        this.setUserRole(data);
        this.setDeptLogo(data);
        this.setCreateOrgTypes();
        this.dataLoaded = true;
      });
    }
    this.getFilterTypes();
  };

  initiatePage(orgList,totalCount){
    this.orgList = orgList;
    this.totalRecords = totalCount;
    this.totalPages = Math.ceil(totalCount/this.recordsPerPage);
    this.curPage = 0;
    this.updateRecordsText();
    //this.updateRecordsPage();
  }

  pageChange(val){
    this.pageNum = val;
    if(this.resultType === "search") {
      this.searchFH();
    }else if(this.resultType === "default"){
      this.updateRecordsText();
      this.getOrgDetails(this.myOrg,this.status,this.orderBy,this.sortBy,this.pageNum,this.limit,false);
      //this.updateRecordsPage();
    }
  }

  updateRecordsText(){
    this.curStart = (this.pageNum -1) * this.limit + 1;
    this.curEnd = (this.pageNum) * this.limit;
    if( this.curEnd >= this.totalCounts) this.curEnd = this.totalCounts;
    if( this.totalCounts === 0) this.curStart = 0;
  }

  // updateRecordsPage(){
  //   this.curPageOrgs = this.orgList.slice(this.curStart - 1, this.curEnd);
  // }

  setDeptLogo(data){
    this.fhService.getOrganizationLogo(this.fhService.getOrganizationById(this.adminOrgKey, false),
      (res) => {
        if (res != null) {
          this.deptLogo = {href:res.logo};
        } else {
          this.deptLogo = {href:"src/assets/img/logo-not-found.png"};
        }
      },
      (err) => {this.deptLogo = {href:"src/assets/img/logo-not-found.png"};}
    );
  }

  setCreateOrgTypes(){
    let options = [];
    switch (this.userRole){
      case "superAdmin":
        options.push({value: 'department', label: 'Dep/Ind Agency', name: 'Dep/Ind Agency'});
        break;
      case "deptAdmin":
        options.push({value: 'agency', label: 'Sub-Tier', name: 'Sub-Tier'});
        break;
      case "agencyAdmin":
        options.push({value: 'office', label: 'Office', name: 'Office'});
        break;
    }
    this.selectConfig.options = options;
  }

  setUserRole(raw){
    let createType = raw._embedded[1]._links[1].link.rel;
    this.userRole = "officeAdmin";
    this.adminOrgKey = this.user.agencyID;

    if(createType === "Sub-Tier"){
      this.userRole = "deptAdmin";
      this.adminOrgKey = this.user.departmentID;
    } else if(createType.toLowerCase().includes("office")){
      this.userRole = "agencyAdmin";
      this.adminOrgKey = this.user.agencyID;
    }
  }

  onDefaultOrgStatusChange(orgStatusModel){
    if(this.resultType == 'default'){
      if(orgStatusModel.length === 2 || orgStatusModel.length === 0){
        this.status = 'all';
      }else if(orgStatusModel.length === 1){
        let status = orgStatusModel[0].toLocaleLowerCase();
        this.status = status;
      }
      this.pageNum = 1;
      this.getOrgDetails(this.myOrg,this.status,this.orderBy,this.sortBy,this.pageNum,this.limit,true);
    }else{
      this.searchFHAdmin(orgStatusModel);
    }
  }

  updateDefaultPage(status){
    if(this.userRole === 'superAdmin') {
      this.fhService.getDepartmentsByStatus(status).subscribe( data => this.initiatePage(data._embedded,data._embedded.length));
    } else{
      this.fhService.getDepartmentAdminLanding(status).subscribe( data => this.initiatePage(data._embedded[0].org.hierarchy,data._embedded[0].org.hierarchy.length));
    }
  }

  onSearchOrgStatusChange(orgStatusModel){
    this.orgSearchStatusModel = orgStatusModel;
    this.curPage = 0;
    this.showAdminOrg? this.searchFHAdmin(this.orgSearchStatusModel):this.searchFH();
  }

  onSelectAdminOrg(val){
    //console.log(val);
    this.showAdminOrg = val;
    this.myOrg = val;
    this.pageNum = 1;
    this.status = 'active';
    this.getOrgDetails(this.myOrg,this.status,this.orderBy,this.sortBy,this.pageNum,this.limit,true);
    
  }

  isOrgActive(org):boolean{
    if(!!org.modStatus){
      return org.modStatus.toLowerCase() === "active";
    }
    return false;
    // if(!!org.endDate){
    //   let endDate = moment(org.endDate);
    //   if (endDate.diff(moment()) < 0) {
    //     return false;
    //   }
    // }
    // return true;
  }

  isDeptAdmin(){
    let depAdmin = false;
    if(this.deptList){
      depAdmin = this.deptList.length > 0;
    }
    return depAdmin;
  }

  isAgencyAdmin(){
    let agAdmin = false;
    if(this.agencyList){
      agAdmin = this.agencyList.length > 0;
    }
    return agAdmin;
  }

  isOfficeAdmin(){
    let ofAdmin = false;
    if(this.officeList){
      ofAdmin = this.officeList.length > 0;
    }
    return ofAdmin;
  }

  isAdminOrg(org):boolean{
    //if(this.userRole === 'superAdmin' || this.userRole === 'deptAdmin') return true;
    //if(this.userRole === 'officeAdmin') return false;
    let isAdmin = false;
    if(org._links){
      isAdmin =
        Object.keys(org._links).filter(e => {
          return e === 'admin';
        }).length > 0;
    }
    return isAdmin;
  }

  isFeaturedOrg(){
    let isFeatured = false;
    if(this.links){
      isFeatured = 
        Object.keys(this.links).filter(e => {
          return e === 'my_org';
        }).length > 0;
    }
    let logoExist = false;
    if(isFeatured){
      let orgNameArr = this.featuredOrg.name.split(",");
      if(orgNameArr.length > 1 && orgNameArr.length <=2){
        this.altName = orgNameArr[1] + " " + orgNameArr[0];
      }else{
        this.altName = this.featuredOrg.name;
      }
      if(this.featuredOrg._links){
        let  logoVal = 
          Object.keys(this.featuredOrg._links).filter(e => {
          return e === 'logo';
        });
        logoExist = logoVal.length > 0;  
        if(logoExist){
           this.deptLogo = {href:logoVal['href']};
         }else{
           this.updateNoLogoUrl();
         }
      }else{
        this.updateNoLogoUrl();
      }
    }
    return isFeatured;
  }

  isFeaturedAdmin(org){
    let featuredAdmin = false;
    if(org._links){
        featuredAdmin =
        Object.keys(org._links).filter(e => {
          return e === 'admin';
        }).length > 0;
    }
    return featuredAdmin;
  }

  isCreate(){
    let isCreateBtn = false;
    if(this.links){
      let createPermission = Object.keys(this.links).filter(e => {
        return e.includes('create');
      });
      isCreateBtn = createPermission.length > 0;
      if (isCreateBtn) this.btnName = createPermission[0].split('_')[1];
    }
    return isCreateBtn;
  }

  getStartDate(org):String{
    if(org.startDate) {
      return moment(org.startDate).utc().format('MM/DD/YYYY');
    }
    return "";
  }

  getFtStartDate(org):String{
    if(org.startDate) {
      return moment(org.startDate).utc().format('MM/DD/YYYY');
    }
    return "N/A";
  }

  getFtEndDate(org):String{
    if(org.endDate) {
      return moment(org.endDate).utc().format('MM/DD/YYYY');
    }
    return "N/A";
  }

  createOrg(){
    let navigationExtras: NavigationExtras = {
      queryParams: {orgType: 'Department'}
    };

    this._router.navigate(["/org/create"],navigationExtras);
  }

  onSelectCreateOrg(orgType){

  }

  updateNoLogoUrl(){
    this.deptLogo = {href:"src/assets/img/logo-not-found.png"};
  }

  updateOrgType(val){
    this.searchOrgType = val;
    this.curPage = 0;
    this.showAdminOrg? this.searchFHAdmin(this.orgSearchStatusModel):this.searchFH();
  }

  newFhTextSearch(){
    //this.curPage = 0;
    //this.searchFH();
  }

  searchFH:any = () => {
    this.getFilterTypes();
    // Search field is required for searching in fh landing page
    if(this.searchText.length > 0){

      // Update query params
      let navigationExtras: NavigationExtras = {
        queryParams: {
          keyword: this.searchText,
          status: this.orgSearchStatusModel
        }
      };
      this._router.navigate(['/federal-hierarchy'], navigationExtras);

      this.resultType = "search";
      let searchTypes = [];
      let searchLevels = [];
      this.searchOrgType.forEach(e => {searchTypes.push(e.split('_')[1]);});
      this.searchOrgType.forEach(e => {searchLevels.push(e.split('_')[0]);});
      Observable.forkJoin(
        this.fhService.fhSearchCount(this.searchText, this.searchType, this.orgSearchStatusModel, searchLevels, searchTypes, false, null, this.userRole !== 'superAdmin'),
        this.fhService.fhSearch(this.searchText, this.curPage + 1, this.recordsPerPage, this.orgSearchStatusModel, searchLevels, searchTypes, false, null, this.userRole !== 'superAdmin')
      ).subscribe( data => {
        this.curPageOrgs = data[1]._embedded;
        this.totalRecords = data[0];
        this.totalPages = Math.ceil(this.totalRecords/this.recordsPerPage);
        this.updateRecordsText();
      });
    }else{
      this.resultType = "default";
      this.loadDefaultData('active');
    }
  };

  searchFHAdmin(orgStatusModel){
    this.fhService.getMyOrganization(this.adminOrgKey, this.searchOrgType).subscribe(data => {
      if(!!data._embedded){
        this.curPageOrgs = [data._embedded[0]];
      }else{
        this.curPageOrgs = [];
      }
      if(orgStatusModel.length === 1 && orgStatusModel[0].toLowerCase() === 'inactive'){
        this.curPageOrgs = [];
      }
      this.totalRecords = this.curPageOrgs.length;
      this.totalPages = Math.ceil(this.totalRecords/this.recordsPerPage);
      this.updateRecordsText();
      }
    );
  }

  isDefaultResult():boolean{ return this.resultType === "default";}
  isDOD():boolean { return this.user.departmentID === "100000000";}
  isOrgDoD(org):boolean{
    return org.fullParentPath.split('.').some(e=> {return e.includes("100000000");})
  }

  getOrgTypeText(org):string{
    if(org.type){
      let orgType = org.type.toUpperCase();
      if( this.typeMap[orgType]) return this.typeMap[orgType];
      return orgType.substr(0,1) + orgType.substr(1,orgType.length-1).toLowerCase() + " (L" + org.level + ")";
    }
    return "NA";

  }

  getFilterTypes(){
    this.fhService.getSearchFilterTypes().subscribe(
      data => {
        let typeOptions = [];
        let typeValueMap = this.isDOD()? this.dodTypeLevelMap: this.nondodTypeLevelMap;
        data.forEach(e => {
          if(this.userRole === "superAdmin" && e === "Office"){
            typeOptions.push({value: '3,7_'+e, label: e, name: e});
          }else {
            typeOptions.push({value: typeValueMap[e]+'_'+e, label: e, name: e});
          }
        });
        this.filterTypes = typeOptions;
      });
  }

  showErrorAlertFooter(desc) {
    this.alertFooter.registerFooterAlert({
      title: '',
      description: desc,
      type: 'error',
      timer: 3200
    });
  }
}
