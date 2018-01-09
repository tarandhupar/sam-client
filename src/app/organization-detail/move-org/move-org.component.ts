import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { AACRequestService } from 'api-kit/aac-request/aac-request.service.ts';
import { FHService } from 'api-kit/fh/fh.service';
import { Location } from '@angular/common';
import * as moment from 'moment/moment';
import { LabelWrapper } from 'sam-ui-elements/src/ui-kit/wrappers/label-wrapper/label-wrapper.component';
import { IAMService } from 'api-kit';
import { FHRoleModel } from '../../fh/fh-role-model/fh-role-model.model';

@Component({
  templateUrl: 'move-org.template.html'
})
export class OrgMovePage {
  @ViewChild('orgEndDateWrapper') orgEndDateWrapper: LabelWrapper;
  @ViewChild('orgStartDateWrapper') orgStartDateWrapper: LabelWrapper;

  org: any;
  orgKey: string;
  targetParentOrg: any;
  startDate: string = '';
  endDate: string = '';
  defaultDept:any[] = [];

  message: string = '';
  agencyPickerMsg: string = '';

  updateDetail: boolean = false;
  reviewDetail: boolean = false;
  dataLoaded: boolean = false;

  orgFormConfig: any;
  fhRoleModel: FHRoleModel;
  selectedOrg : any;

  level;
  orgType: string = '';

  constructor(
    private route: ActivatedRoute,
    private _router: Router,
    private iamService: IAMService,
    private fhService: FHService
  ) {}

  ngOnInit() {
    this.route.parent.params.subscribe(params => {
      this.orgKey = params['orgId'];
      this.org = this.route.parent.snapshot.data['org'];
      this.setupOrg(this.org);
      if(this.org.fullParentPath){
        let deptOrg = this.org.fullParentPath.split('.')[0];
        this.defaultDept.push(deptOrg);
      }
    });
  }

  setupOrg(org) {
    this.org = org;
    this.orgFormConfig = {
      mode: 'update',
      org: this.org
    };
    this.level = org.level;
    this.orgType = org.type;
    if (!this.isMoveOffice()) this._router.navigateByUrl('/404');
  }


  onUpdateDetailClick() {
    // check end date and new parent sub-tier
    this.orgFormConfig['startDate'] = this.startDate;
    this.orgFormConfig['endDate'] = this.endDate;
    this.agencyPickerMsg = !!this.targetParentOrg
      ? ''
      : 'This field cannot be empty';

    let isValidDate = this.isValidEndDate();
    let isValidStartDate = this.isValidStartDate();
    if (this.targetParentOrg && isValidDate && isValidStartDate) {
      this.updateDetail = true;
    }
  }

  getFederalOrgName(org) {
    this.targetParentOrg = org;
    this.orgFormConfig['parentId'] = org;
  }

  setOrgEndDate(endDate) {
    this.endDate = endDate;
    this.startDate = this.endDate;
  }

  setOrgStartDate(startDate){
    this.startDate = startDate;
  }

  isMoveOffice() {
    return this.level === 3 && this.orgType.toLowerCase() === 'office';
  }

  isValidEndDate() {
    if (!!this.endDate) {
      this.orgEndDateWrapper.errorMessage = '';
      // End date should be the date count from today to a year from today
      
      if (this.endDate && moment(this.endDate, 'Y-M-D').isValid()) {
        if (
          moment().isSameOrBefore(moment().toDate()) &&
          moment()
            .add(1, 'years')
            .diff(moment(this.endDate)) > 0
        ) {
          return true;
        }

        if (!moment().isSameOrBefore(moment().toDate())) {
          this.orgEndDateWrapper.errorMessage =
            'Please do not enter a past date';
        } else {
          this.orgEndDateWrapper.errorMessage =
            'Please provide end date up to one year from today';
        }
        return false;
      }

      this.orgEndDateWrapper.errorMessage = 'Date is invalid';
    } else {
      this.orgEndDateWrapper.errorMessage = 'This field cannot be empty';
    }
    return false;
  }

  isValidStartDate(){
    if(!!this.startDate){
      this.orgStartDateWrapper.errorMessage = '';
      if (this.startDate && moment(this.startDate, 'Y-M-D').isValid()) {
        let today = moment(moment().toDate()).format('YYYY-MM-DD');
        if (!moment(this.startDate).isSameOrAfter(today)) {
          this.orgStartDateWrapper.errorMessage = 'Start date cannot be earlier than today';
          return false;
        }
       if (!moment(this.startDate).isSameOrAfter(moment(this.endDate))) {
          this.orgStartDateWrapper.errorMessage = 'Start date cannot be earlier than end date';
          return false;
        }

      }
      else{
        this.orgStartDateWrapper.errorMessage = 'Date is invalid';
        return false;
      }  
    }
    else{
      this.orgStartDateWrapper.errorMessage = 'This field cannot be empty';
      return false;
    }
    return true;
  }
  
}
