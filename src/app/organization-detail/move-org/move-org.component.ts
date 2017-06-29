import { Component, ViewChild } from "@angular/core";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { AACRequestService } from 'api-kit/aac-request/aac-request.service.ts';
import { FHService } from "api-kit/fh/fh.service";
import { Location } from "@angular/common";
import * as moment from 'moment/moment';
import { LabelWrapper } from 'sam-ui-kit/wrappers/label-wrapper/label-wrapper.component';
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

  constructor(private route: ActivatedRoute,
              private _router: Router,
              private iamService: IAMService,
              private fhService: FHService){}

  ngOnInit(){
    this.route.parent.params.subscribe(
      params => {
        this.orgKey = params['orgId'];
        // this.iamService.iam.checkSession(this.checkAccess, this.redirectToSignin);
        this.iamService.iam.checkSession(this.checkAccess, this.checkAccess);
        this.setupOrg(params['orgId']);
      });
  }

  checkAccess = (user) => {
    this.fhService.getAccess(this.orgKey).subscribe(
      (data)=> {
        this.fhService.getOrganizationById(this.orgKey,false,true).subscribe(
          val => {
            this.fhRoleModel = FHRoleModel.FromResponse(val);
            if(!this.fhRoleModel.hasPermissionType("PUT",this.orgKey)) this.redirectToForbidden();
          });
      },
      (error) => { if(error.status === 403) this.redirectToForbidden();}
    );
  };

  redirectToSignin = () => { this._router.navigateByUrl('/signin')};
  redirectToForbidden = () => {this._router.navigateByUrl('/403')};

  setupOrg(orgId){
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
