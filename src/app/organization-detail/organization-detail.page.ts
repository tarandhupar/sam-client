import { Component } from "@angular/core";
import { FHService } from "api-kit/fh/fh.service";
import { ActivatedRoute, Router } from "@angular/router";
import { IAMService } from "api-kit";

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

  currentSection: string = "Profile";
  dataLoaded:boolean = false;

  constructor(private fhService: FHService, private route: ActivatedRoute, private _router: Router, private iamService: IAMService){}

  ngOnInit(){

    this.route.params.subscribe(
      params => {
        this.orgId = params['orgId'];
        this.iamService.iam.checkSession(this.checkAccess, this.redirectToSignin);

      });
  }


  setupOrgName(orgId){
    this.fhService.getOrganizationById(this.orgId,false,true).subscribe(
      res => {
        this.orgName = res._embedded[0].org.name;
        this.orgType = res._embedded[0].org.type;
        this.orgHierarchyTypes = res._embedded[0].orgTypes;
        this.level = res._embedded[0].org.level;
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
}
