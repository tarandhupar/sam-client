import { Component } from "@angular/core";
import { FHService } from "api-kit/fh/fh.service";
import { ActivatedRoute } from "@angular/router";


@Component ({
  templateUrl: 'organization-detail.template.html'
})
export class OrgDetailPage {

  orgName: string = "";
  orgId: string = "";
  deptLogo: any;

  currentSection: string = "Profile";
  dataLoaded:boolean = false;

  constructor(private fhService: FHService, private route: ActivatedRoute){}

  ngOnInit(){

    this.route.params.subscribe(
      params => {
        this.setupOrgName(params['orgId']);
      });
  }


  setupOrgName(orgId){
    this.orgId = orgId;
    this.fhService.getOrganizationById(this.orgId,false,true).subscribe(
      res => {
        this.orgName = res._embedded[0].org.name;
        this.deptLogo = res._embedded[0]._link.logo;
        if(!this.deptLogo) this.updateNoLogoUrl();
        this.dataLoaded = true;
      });
  }

  getSectionClass(sectionValue){
    return this.currentSection === sectionValue? "usa-current":"";
  }

  selectCurrentSection(sectionValue){
    this.currentSection = sectionValue;
  }

  updateNoLogoUrl(){
    this.deptLogo = {href:"src/assets/img/logo-not-found.png"};
  }
}
