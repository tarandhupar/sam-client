import { Component, ViewChild } from "@angular/core";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { AACRequestService } from 'api-kit/aac-request/aac-request.service.ts';
import { FHService } from "api-kit/fh/fh.service";
import { Location } from "@angular/common";
import * as moment from 'moment/moment';
import { LabelWrapper } from 'sam-ui-elements/src/ui-kit/wrappers/label-wrapper/label-wrapper.component';
import { IAMService } from "api-kit";
import { FHRoleModel } from "../../fh/fh-role-model/fh-role-model.model";

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
  fhRoleModel:FHRoleModel;

  level;
  orgType:string = "";

  constructor(private route: ActivatedRoute,
              private _router: Router,
              private iamService: IAMService,
              private fhService: FHService){}

  ngOnInit(){
    this.route.parent.params.subscribe(
      params => {
        this.orgKey = params['orgId'];
        this.fhService.getOrganizationDetail(this.orgKey).subscribe(
          val => {
            this.fhRoleModel = FHRoleModel.FromResponse(val);
            if(!this.fhRoleModel.canMoveOffice() ) {
              this._router.navigateByUrl('/403');
            } else {
              this.setupOrg(this.orgKey);
            }
          });
      });
  }

  setupOrg(orgId){
    this.fhService.getOrganizationById(this.orgKey,false,true).subscribe(
      res => {
        this.org = res._embedded[0].org;
        this.orgFormConfig = {
          mode: 'update',
          org: this.org
        };
        this.level = res._embedded[0].org.level;
        this.orgType = res._embedded[0].org.type;
        if(!this.isMoveOffice()) this._router.navigateByUrl('/403');
        this.dataLoaded = true;
      });
  }

  onUpdateDetailClick(){
    //check end date and new parent sub-tier
    this.agencyPickerMsg = !!this.targetParentOrg?'':'This field cannot be empty';

    let isValidDate = this.isValidEndDate();
    if(this.targetParentOrg && isValidDate){
      this.updateDetail = true;
    }
  }

  getFederalOrgName(org){
    this.targetParentOrg = org;
    this.orgFormConfig['parentId'] = org.value;
  }

  setOrgEndDate(endDate){
    this.endDate = endDate;
    this.startDate = this.endDate;
    this.orgFormConfig['endDate'] = endDate;
  }

  isMoveOffice(){
    return this.level === 3 && this.orgType.toLowerCase() === "office";
  }

  isValidEndDate(){

    if(!!this.endDate) {
      this.orgEndDateWrapper.errorMessage = "";
      // End date should be the date count from today to a year from today
      if (this.endDate && moment(this.endDate, 'Y-M-D').isValid()) {
        if (moment().isSameOrBefore(moment(this.endDate), 'day') && moment().add(1, "years").diff(moment(this.endDate)) > 0) {
          return true;
        }

        if(!moment().isSameOrBefore(moment(this.endDate), 'day')){
          this.orgEndDateWrapper.errorMessage = "Please do not enter a past date";
        }else{
          this.orgEndDateWrapper.errorMessage = "Please provide end date up to one year from today";
        }
        return false;
      }

      this.orgEndDateWrapper.errorMessage = "Date is invalid";
    }else{
      this.orgEndDateWrapper.errorMessage = 'This field cannot be empty';
    }
    return false;
  }
}
