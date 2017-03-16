import { Component } from "@angular/core";
import { FHService } from "api-kit/fh/fh.service";
import { ActivatedRoute } from "@angular/router";


@Component ({
  templateUrl: 'organization-detail.template.html'
})
export class OrgDetailPage {

  orgName: string = "";
  orgId: string = "";

  currentSection: string = "Profile";

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
      });
  }

  getSectionClass(sectionValue){
    return this.currentSection === sectionValue? "usa-current":"";
  }

  selectCurrentSection(sectionValue){
    this.currentSection = sectionValue;
  }
}
