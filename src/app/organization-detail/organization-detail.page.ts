import { Component } from "@angular/core";
import { FHService } from "api-kit/fh/fh.service";
import { ActivatedRoute, Router, NavigationCancel } from "@angular/router";
import { IAMService } from "api-kit";
import { FlashMsgService } from "./flash-msg-service/flash-message.service";
import { Location } from '@angular/common';
import { CapitalizePipe } from "../app-pipes/capitalize.pipe";
import { IBreadcrumb, OptionsType } from "sam-ui-kit/types";

@Component ({
  templateUrl: 'organization-detail.template.html'
})
export class OrgDetailPage {

  private crumbs: Array<IBreadcrumb> = [];

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

  orgStatusCbxModel: any = ['allactive'];
  orgStatusCbxConfig = {
    options: [
      {value: 'allactive', label: 'Active', name: 'Active'},
      {value: 'inactive', label: 'Inactive', name: 'Inactive'},
    ],
    name: 'organization status',
    label: '',
  };

  currentUrl: string = "";
  baseUrl: string = "/organization-detail/";
  orgKeyLength = 9;

  constructor(private fhService: FHService,
              private route: ActivatedRoute,
              private _router: Router,
              private iamService: IAMService,
              public flashMsgService: FlashMsgService,
              private location:Location,
              private capitalize: CapitalizePipe){}

  ngOnInit(){

    this.route.params.subscribe(
      params => {
        this.orgId = params['orgId'];
        this.setupOrgName(this.orgId);
      });

    this._router.events.subscribe(
      value => {
        if(!(value instanceof  NavigationCancel)){
          let val = <NavigationCancel>value;
          this.currentUrl = val.url.indexOf("#") > 0? val.url.substr(0,val.url.indexOf("#")):val.url;
          this.currentUrl = this.currentUrl.indexOf("?") > 0? this.currentUrl.substr(0,this.currentUrl.indexOf("?")):this.currentUrl;

          let section = this.currentUrl.substr(this.baseUrl.length + this.orgKeyLength + 1);
          section = section.length === 0? 'profile':section;
          this.currentSection = section;
        }else{
          this.currentSection = this.location.path(false).substr(this.baseUrl.length);
        }

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
        this.setupCrumbs(res._embedded[0].org.fullParentPath, res._embedded[0].org.fullParentPathName);

        this.deptLogo = {href:"src/assets/img/logo-not-found.png"};
        this.setDeptLogo();

        this.dataLoaded = true;

      });
  }

  getSectionClass(sectionValue){
    return this.currentSection === sectionValue? "usa-current":"";
  }

  selectCurrentSection(sectionValue){
    this.currentSection = sectionValue;
  }

  setDeptLogo(){
    this.fhService.getOrganizationLogo(this.fhService.getOrganizationById(this.orgId, false),
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

  updateNoLogoUrl(){
    this.deptLogo = {href:"src/assets/img/logo-not-found.png"};
  }

  isMoveOffice(){
    return this.level === 3 && this.orgType.toLowerCase() === "office";
  }

  setupHierarchyPathMap(fullParentPath:string, fullParentPathName:string){
    this.hierarchyPath = fullParentPathName.split('.').map( e => {
      return this.capitalize.transform(e.split('_').join(' '));
    });
    let parentOrgIds = fullParentPath.split('.');
    this.hierarchyPathMap = [];
    parentOrgIds.forEach((elem,index) => {
      this.hierarchyPathMap[this.hierarchyPath[index]] = elem;
    });

  }

  setupCrumbs(fullParentPath:string, fullParentPathName:string){
    this.crumbs = [];
    let parentOrgNames = fullParentPathName.split('.').map( e => {
      return this.capitalize.transform(e.split('_').join(' '));
    });
    let parentOrgIds = fullParentPath.split('.');
    parentOrgIds.forEach((e, i) => {
      if(e != this.orgId){
        this.crumbs.push({ url: '/organization-detail/'+e, breadcrumb: parentOrgNames[i]} );
      }else{
        this.crumbs.push({ breadcrumb: parentOrgNames[i]} );
      }
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
