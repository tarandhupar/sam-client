import { Component } from "@angular/core";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { AACRequestService } from 'api-kit/aac-request/aac-request.service.ts';
import { FHService } from "api-kit/fh/fh.service";
import { Location } from "@angular/common";

@Component ({
  templateUrl: 'move-org.template.html'
})
export class OrgMovePage {

  org:any;
  orgKey:string;

  updateDetail:boolean = false;
  reviewDetail:boolean = false;

  orgFormConfig:any;

  constructor(private route: ActivatedRoute, private fhService: FHService){}

  ngOnInit(){
    this.route.params.subscribe(
      params => {
        this.setupOrg(params['orgId']);
      });
  }


  setupOrg(orgId){
    this.orgKey = orgId;
    this.fhService.getOrganizationById(this.orgKey,false,true).subscribe(
      res => {
        this.org = res._embedded[0].org;
        this.orgFormConfig = {
          mode: 'update',
          org: this.org
        };
      });
  }

  onUpdateDetailClick(){
    this.updateDetail = true;
  }

}
