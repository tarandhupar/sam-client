import { Component, ViewChild } from "@angular/core";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { AACRequestService } from 'api-kit/aac-request/aac-request.service.ts';
import { FHService } from "api-kit/fh/fh.service";
import { Location } from "@angular/common";
import * as moment from 'moment/moment';
import { LabelWrapper } from 'sam-ui-kit/wrappers/label-wrapper/label-wrapper.component';

@Component ({
  templateUrl: 'move-org.template.html'
})
export class OrgMovePage {

  @ViewChild('orgEndDateWrapper') orgEndDateWrapper: LabelWrapper;

  org:any;
  orgKey:string;
  targetParentOrg:any;
  startDate:string = "";
  endDate:string = "";

  message:string = "";
  agencyPickerMsg:string = "";

  updateDetail:boolean = false;
  reviewDetail:boolean = false;
  dataLoaded:boolean = false;

  orgFormConfig:any;

  constructor(private route: ActivatedRoute, private fhService: FHService){}

  ngOnInit(){
    this.route.parent.params.subscribe(
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

        this.startDate = moment(this.org.startDate).format('Y-M-D');
        this.endDate = moment(this.org.endDate).format('Y-M-D');
        this.dataLoaded = true;
      });
  }

  onUpdateDetailClick(){
    //check end date and new parent sub-tier
    this.agencyPickerMsg = !!this.targetParentOrg?'':'This field cannot be empty';
    this.orgEndDateWrapper.errorMessage = !!this.endDate?'':'This field cannot be empty';
    if(this.endDate && !moment(this.endDate,'Y-M-D').isValid()){
      this.orgEndDateWrapper.errorMessage = "Date is invalid";
    }

    if(this.targetParentOrg && this.endDate && moment(this.endDate,'Y-M-D').isValid()){
      this.updateDetail = true;
    }

  }

  getFederalOrgName(org){
    this.targetParentOrg = org;
    this.orgFormConfig['parentId'] = org.value;
  }

  setOrgEndDate(endDate){
    this.endDate = endDate;
  }
}
