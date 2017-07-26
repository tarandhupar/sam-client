import { Component } from "@angular/core";
import { FHService } from "api-kit/fh/fh.service";
import { ActivatedRoute, Router } from "@angular/router";
import { IAMService } from "api-kit";
import { FlashMsgService } from "./flash-msg-service/flash-message.service";

@Component ({
  templateUrl: 'organization-detail.template.html'
})
export class OrgDetailPage {

  orgName: string = "";
  orgId: string = "";
  orgType: string = "";
  orgHierarchyTypes: any = [];
  deptLogo: any;
  level;
  hierarchyPath: any = [];
  hierarchyPathMap: any = [];
  currentSection: string = "Profile";
  dataLoaded:boolean = false;

  orgStatusCbxModel: any = ['allActive'];
  orgStatusCbxConfig = {
    options: [
      {value: 'allActive', label: 'Active', name: 'Active'},
      {value: 'inactive', label: 'Inactive', name: 'Inactive'},
    ],
    name: 'organization status',
    label: '',
  };

  constructor(private fhService: FHService, private route: ActivatedRoute, private _router: Router, private iamService: IAMService, public flashMsgService: FlashMsgService){}

  ngOnInit(){

    this.route.params.subscribe(
      params => {
        this.orgId = params['orgId'];
        // this.iamService.iam.checkSession(this.checkAccess, this.redirectToSignin);


        this.setupOrgName(this.orgId);
      });
  }


  setupOrgName(orgId){
    this.fhService.getOrganizationById(this.orgId,false,true).subscribe(
      res => {
        this.orgName = res._embedded[0].org.name;
        this.orgType = res._embedded[0].org.type;
        this.orgHierarchyTypes = res._embedded[0].orgTypes;
        this.level = res._embedded[0].org.level;
        this.setupHierarchyPathMap(res._embedded[0].org.fullParentPath, res._embedded[0].org.fullParentPathName);
        this.deptLogo = "src/assets/img/logo-not-found.png";
        if(!this.deptLogo) this.updateNoLogoUrl();
        this.dataLoaded = true;

      });
  }

  checkAccess = (user) => {
    this.fhService.getAccess(this.orgId).subscribe(
      (data)=> {this.setupOrgName(this.orgId);},
      (error)=> {if(error.status === 403) this.redirectToForbidden();}
    );
  };

  redirectToSignin = () => { this._router.navigateByUrl('/signin')};
  redirectToForbidden = () => {this._router.navigateByUrl('/403')};

  getSectionClass(sectionValue){
    return this.currentSection === sectionValue? "usa-current":"";
  }

  selectCurrentSection(sectionValue){
    this.currentSection = sectionValue;
  }

  updateNoLogoUrl(){
    this.deptLogo = {href:"src/assets/img/logo-not-found.png"};
  }

  isMoveOffice(){
    return this.level === 3 && this.orgType.toLowerCase() === "office";
  }

  setupHierarchyPathMap(fullParentPath:string, fullParentPathName:string){
    this.hierarchyPath = fullParentPathName.split('.').map( e => {
      return e.split('_').join(' ');
    });
    let parentOrgIds = fullParentPath.split('.');
    this.hierarchyPathMap = [];
    parentOrgIds.forEach((elem,index) => {
      this.hierarchyPathMap[this.hierarchyPath[index]] = elem;
    });

  }

  onChangeOrgDetail(hierarchyName){
    this._router.navigate(['organization-detail', this.hierarchyPathMap[hierarchyName],'profile'])
  }

  getLastHierarchyClass(index){
    return index === this.hierarchyPath.length-1? "current-hierarchy-link":"";
  }

  orgHierarchyStatusChange(val){
    this.orgStatusCbxModel = val;
    this.flashMsgService.setHierarchyStatus(val);
  }
}
