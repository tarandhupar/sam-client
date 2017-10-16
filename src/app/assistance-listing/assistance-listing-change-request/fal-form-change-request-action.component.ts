import {Component, OnInit, Input, ViewChild} from "@angular/core";
import {FormBuilder, FormGroup, FormControl, Validators} from "@angular/forms";
import {Location} from "@angular/common";
import {Router, ActivatedRoute} from '@angular/router';
import * as Cookies from 'js-cookie';
import {ChangeRequestService} from "../../../api-kit/program/change-request.service";
import {ProgramService} from "../../../api-kit/program/program.service";
import {falCustomValidatorsComponent} from "../validators/assistance-listing-validators";
import { AlertFooterService } from "../../app-components/alert-footer/alert-footer.service";
import {FHService} from "../../../api-kit/fh/fh.service";
import {IBreadcrumb} from "../../../sam-ui-elements/src/ui-kit/types";

enum ChangeRequestActionPermissionType {
  CANCEL,
  APPROVE_REJECT
}

enum ChangeRequestStatus {
  PENDING,
  APPROVED,
  CANCELLED,
  REJECTED
}

interface ChangeRequestActionModel {
  requestId: string,
  reason: string,
  actionType: string,
  programNumber?: string,
}

@Component({
  providers: [ChangeRequestService],
  templateUrl: 'fal-form-change-request-action.template.html',
  selector: 'fal-form-change-request-action'
})
export class FALFormChangeRequestActionComponent implements OnInit {
  falChangeRequestActionForm: FormGroup;
  buttonType: string = 'default';
  pageReady: boolean = false;
  pageTitle: string;
  permissionType: ChangeRequestActionPermissionType;
  requestType: string;
  requestStatus: ChangeRequestStatus;
  programRequest: any;
  userOrganization:any;
  programRequestAction: any;
  cookieValue: string;
  programNumber: string;
  programNumberLow: number;
  programNumberHigh: number;
  cfdaCode: string;
  federalHierarchy: any[];
  showActiveAwards = false;
  public permissions: any;
  public formOptions = {
    archive: [
      { label: 'Yes', value: true }
    ]
  };
  notifyFooterAlertModel = {
    title: "Success",
    description: "Successfully sent notification.",
    type: "success",
    timer: 3000
  };
  crumbs: Array<IBreadcrumb> = [
    { breadcrumb:'Home', url:'/',},
    { breadcrumb: 'My Workspace', url: '/workspace' },
    { breadcrumb: 'Assistance Workspace', url: '/fal/workspace'},
    { breadcrumb: 'Change Request Action'}
  ];

  constructor(private fb: FormBuilder,
    private programService: ProgramService,
    private fhService: FHService,
    private changeRequestService: ChangeRequestService,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private alertFooterService: AlertFooterService,
    private router: Router) {
  }

  ngOnInit() {
    this.cookieValue = Cookies.get('iPlanetDirectoryPro');

    if (this.cookieValue === null || this.cookieValue === undefined) {
      this.router.navigate(['signin']);
    }
    if (SHOW_HIDE_RESTRICTED_PAGES !== 'true') {
      this.router.navigate(['accessrestricted']);
    }

    this.changeRequestService.getRequest(this.activatedRoute.snapshot.params['id'], this.cookieValue).subscribe(data => {
      this.programRequest = data;
      this.requestType = this.programRequest.requestType.value;
      //load permission
      this.loadPermission();

      //check wether a request is completed -> load requestAction if completed
      if (this.programRequest.completed === true) {
        this.loadRequestAction();
      } else {
        this.requestStatus = ChangeRequestStatus.PENDING;
      }
    });
  }

    private loadOrganizationData(orgId:string){
      this.programService.getFederalHierarchyConfiguration(orgId, this.cookieValue).subscribe(res => {
        this.programNumberHigh = res.programNumberHigh;
        this.programNumberLow = res.programNumberLow;

        //load cfda code
        this.programService.getCfdaCode(orgId).subscribe(code => {
        this.cfdaCode = code.content.cfdaCode;
          if (res.programNumberAuto){
            this.programService.getNextAvailableProgramNumber(orgId, this.cookieValue).subscribe(api => {
              if(!api.content.isProgramNumberOutsideRange){
                this.programNumber = api.content.nextAvailableCode;
                this.falChangeRequestActionForm = this.fb.group({
                  programNumber: new FormControl({value: this.programNumber.split('.')[1], disabled: true}),
                  comment: ''
                });
              } else {
                console.error('CFDA Number is outside of range');
              }
            });
          } else {
            this.falChangeRequestActionForm = this.fb.group({
              programNumber: ['', falCustomValidatorsComponent.isProgramNumberInTheRange(this.programNumberLow, this.programNumberHigh), falCustomValidatorsComponent.isProgramNumberUnique(this.programService, this.cfdaCode, this.programRequest.programId, this.cookieValue, orgId)],
              comment: ''
            });
          }
        });
      });
    }

  private loadPermission() {
    //Important for Agency Request only as we can't distinguish between A.C who submitted vs A.C to approve/Reject it
    var orgId = (this.requestType == 'agency_request') ? null : this.programRequest.program.organizationId;
    this.programService.getPermissions(this.cookieValue, 'FAL_REQUESTS', orgId).subscribe(res => {
      this.permissions = res;
      this.initPage();
    });
  }

  private loadRequestAction() {
    this.changeRequestService.getRequestActionByRequestId(this.activatedRoute.snapshot.params['id'], this.cookieValue).subscribe(data => {
      this.programRequestAction = data;
      //set up the right requestStatus
      if (this.programRequestAction.actionType == 'archive_cancel' || this.programRequestAction.actionType == 'unarchive_cancel' || this.programRequestAction.actionType == 'title_cancel' || this.programRequestAction.actionType == 'program_number_cancel' || this.programRequestAction.actionType == 'agency_cancel') {
        this.requestStatus = ChangeRequestStatus.CANCELLED;
      } else if (this.programRequestAction.actionType == 'archive_reject' || this.programRequestAction.actionType == 'unarchive_reject' || this.programRequestAction.actionType == 'title_reject' || this.programRequestAction.actionType == 'program_number_reject' || this.programRequestAction.actionType == 'agency_reject') {
        this.requestStatus = ChangeRequestStatus.REJECTED;
      } else if (this.programRequestAction.actionType == 'archive' || this.programRequestAction.actionType == 'unarchive' || this.programRequestAction.actionType == 'title' || this.programRequestAction.actionType == 'program_number' || this.programRequestAction.actionType == 'agency') {
        this.requestStatus = ChangeRequestStatus.APPROVED;
      }
    });
  }

  private initPage() {
    //validate the request type
    if (this.validateRequestType(this.requestType)) {
      if ((this.requestType === 'archive_request' && (this.permissions['INITIATE_CANCEL_ARCHIVE_CR'] || this.permissions['APPROVE_REJECT_ARCHIVE_CR'])) ||
        (this.requestType === 'unarchive_request' && (this.permissions['INITIATE_CANCEL_UNARCHIVE_CR'] || this.permissions['APPROVE_REJECT_UNARCHIVE_CR'])) ||
        (this.requestType === 'program_number_request' && (this.permissions['INITIATE_CANCEL_NUMBER_CR'] || this.permissions['APPROVE_REJECT_NUMBER_CR'])) ||
        (this.requestType === 'title_request' && (this.permissions['INITIATE_CANCEL_TITLE_CR'] || this.permissions['APPROVE_REJECT_TITLE_CR'])) ||
        (this.requestType === 'agency_request' && (this.permissions['APPROVE_REJECT_AGENCY_CR'] || this.permissions['INITIATE_CANCEL_AGENCY_CR']))) {
        this.createForm(this.requestType);
        this.pageReady = true;
      } else {
        this.router.navigate(["accessrestricted"]);
      }
    } else {
      this.router.navigate(["accessrestricted"]);
    }
  }

  private createForm(type: string) {
    if (type == 'archive_request') {
      this.pageTitle = "Archive an Assistance Listing";
      if (this.permissions['APPROVE_REJECT_ARCHIVE_CR']) {
        this.falChangeRequestActionForm = this.fb.group({
          activeAwards: [[], [falCustomValidatorsComponent.checkboxRequired]],
          comment: ''
        });
        this.showActiveAwards = true;
        this.permissionType = ChangeRequestActionPermissionType.APPROVE_REJECT;
      } else if (this.permissions['INITIATE_CANCEL_ARCHIVE_CR']) {
        this.falChangeRequestActionForm = this.fb.group({
          comment: ''
        });
        this.showActiveAwards = false;
        this.permissionType = ChangeRequestActionPermissionType.CANCEL;
      }
    } else if (type == 'unarchive_request') {
      this.pageTitle = "Unarchive an Assistance Listing";
      this.falChangeRequestActionForm = this.fb.group({
        comment: ''
      });

      if (this.permissions['APPROVE_REJECT_UNARCHIVE_CR']) {
        this.permissionType = ChangeRequestActionPermissionType.APPROVE_REJECT;
      } else if (this.permissions['INITIATE_CANCEL_UNARCHIVE_CR']) {
        this.permissionType = ChangeRequestActionPermissionType.CANCEL;
      }
    } else if (type == 'title_request') {
      this.pageTitle = "Assistance Listing Title Change";
      this.falChangeRequestActionForm = this.fb.group({
        comment: ''
      });

      if (this.permissions['APPROVE_REJECT_TITLE_CR']) {
        this.permissionType = ChangeRequestActionPermissionType.APPROVE_REJECT;
      } else if (this.permissions['INITIATE_CANCEL_TITLE_CR']) {
        this.permissionType = ChangeRequestActionPermissionType.CANCEL;
      }
    } else if (type == 'program_number_request') {
      this.pageTitle = "Change CFDA Number";
      this.falChangeRequestActionForm = this.fb.group({
        comment: ''
      });

      if (this.permissions['APPROVE_REJECT_NUMBER_CR']) {
        this.permissionType = ChangeRequestActionPermissionType.APPROVE_REJECT;
      } else if (this.permissions['INITIATE_CANCEL_NUMBER_CR']) {
        this.permissionType = ChangeRequestActionPermissionType.CANCEL;
      }
    } else if (type == 'agency_request') {
      this.pageTitle = "Change Agency";
      var proposedOrg = JSON.parse(this.programRequest.data).organizationId;

      this.fhService.getOrganizationsByIds(this.programRequest.program.organizationId + ',' + proposedOrg).subscribe(federalHierarchy => {
        this.federalHierarchy = federalHierarchy['_embedded']['orgs'];
      });

      this.programService.getPermissions(this.cookieValue, 'ORG_ID,ORG_LEVELS', this.programRequest.program.organizationId).subscribe(res => {
        this.userOrganization = res['ORG_ID'];
        //check wether this proposed org is within user's associated orgs
        if((this.userOrganization.indexOf(String(proposedOrg)) != -1 || res['ORG_LEVELS']['org'] == 'all') && this.permissions['APPROVE_REJECT_AGENCY_CR']) {
          this.permissionType = ChangeRequestActionPermissionType.APPROVE_REJECT;
          this.loadOrganizationData(proposedOrg);
        } else if(this.userOrganization.indexOf(String(this.programRequest.program.organizationId)) != -1 && this.permissions['INITIATE_CANCEL_AGENCY_CR']) { //Proposed orgId is not within user's assicated orgs
          this.falChangeRequestActionForm = this.fb.group({
            comment: ''
          });
          this.permissionType = ChangeRequestActionPermissionType.CANCEL;
        } else { // unauthorized users shouldn't do anything for this pending request
          this.falChangeRequestActionForm = this.fb.group({});
        }
      });
    }
  }

  public approveRequest() {
    let actionTypes: any = {
      archive_request: {
        action: 'archive',
        success: 'Program Archived'
      },
      unarchive_request: {
        action: 'unarchive',
        success: 'Program Unarchived'
      },
      title_request: {
        action: 'title',
        success: 'Title Changed'
      },
      program_number_request: {
        action: 'program_number',
        success: 'CFDA Number Changed'
      },
      agency_request: {
        action: 'agency',
        success: 'Agency Changed'
      }
    };

    if(actionTypes[this.requestType]['action'] == 'archive'){
      this.falChangeRequestActionForm.controls['activeAwards'].setValidators(falCustomValidatorsComponent.checkboxRequired);
      this.falChangeRequestActionForm.controls['activeAwards'].updateValueAndValidity();
    } else if(actionTypes[this.requestType]['action'] == 'agency') {
      this.falChangeRequestActionForm.controls['programNumber'].setValidators([Validators.required, falCustomValidatorsComponent.isProgramNumberInTheRange(this.programNumberLow, this.programNumberHigh)]);
      this.falChangeRequestActionForm.controls['programNumber'].setAsyncValidators(falCustomValidatorsComponent.isProgramNumberUnique(this.programService, this.cfdaCode, this.programRequest.programId, this.cookieValue, JSON.parse(this.programRequest.data).organizationId));
      this.falChangeRequestActionForm.controls['programNumber'].updateValueAndValidity();
    }

    // async form validators
    if(actionTypes[this.requestType].action == 'agency') {
      this.falChangeRequestActionForm.statusChanges.first().subscribe(status => {
        this.submitChangeRequestAction(actionTypes[this.requestType]);
      });
    } else {// sync form validators
      this.submitChangeRequestAction(actionTypes[this.requestType]);
    }
  }

  public rejectRequest() {
    let actionTypes: any = {
      archive_request: {
        action: 'archive_reject',
        success: 'The archive request has been rejected successfully'
      },
      unarchive_request: {
        action: 'unarchive_reject',
        success: 'The unarchive request has been rejected successfully'
      },
      title_request: {
        action: 'title_reject',
        success: 'The title change request has been rejected successfully'
      },
      program_number_request: {
        action: 'program_number_reject',
        success: 'The CFDA number change request has been rejected successfully'
      },
      agency_request: {
        action: 'agency_reject',
        success: 'The agency change request has been rejected successfully'
      }
    };

    if(actionTypes[this.requestType]['action'] == 'archive_reject') {
        this.falChangeRequestActionForm.controls['activeAwards'].setValidators(null);
        this.falChangeRequestActionForm.controls['activeAwards'].updateValueAndValidity();
    } else if(actionTypes[this.requestType]['action'] == 'agency_reject') {
        this.falChangeRequestActionForm.controls['programNumber'].setValidators(null);
        this.falChangeRequestActionForm.controls['programNumber'].setAsyncValidators(null);
        this.falChangeRequestActionForm.controls['programNumber'].updateValueAndValidity();
    }

    this.submitChangeRequestAction(actionTypes[this.requestType]);
  }

  public cancelRequest() {
    let actionTypes: any = {
      archive_request: {
        action: 'archive_cancel',
        success: 'The archive request has been cancelled successfully',
      },
      unarchive_request: {
        action: 'unarchive_cancel',
        success: 'The unarchive request has been cancelled successfully',
      },
      title_request: {
        action: 'title_cancel',
        success: 'The title change request has been cancelled successfully'
      },
      program_number_request: {
        action: 'program_number_cancel',
        success: 'The CFDA number change request has been cancelled successfully'
      },
      agency_request: {
        action: 'agency_cancel',
        success: 'The agency change request has been cancelled successfully'
      }
    };

    this.submitChangeRequestAction(actionTypes[this.requestType]);
  }

  private submitChangeRequestAction(actionType: any) {
    if (this.falChangeRequestActionForm.valid) {
      //disable button's event
      this.buttonType = 'disabled';
      this.changeRequestService.submitRequestAction(this.prepareChangeRequestActionData(actionType.action), this.cookieValue).subscribe(api => {
        this.notifyFooterAlertModel.description = actionType.success;
        this.alertFooterService.registerFooterAlert(JSON.parse(JSON.stringify(this.notifyFooterAlertModel)));
        this.router.navigate(['/fal/workspace']);
      },
        error => {
          console.error('error submitting request', error);
          this.notifyFooterAlertModel.title = "Error";
          this.notifyFooterAlertModel.type = "error";
          this.notifyFooterAlertModel.description = "An error has occurred please contact your administrator.";
          this.alertFooterService.registerFooterAlert(JSON.parse(JSON.stringify(this.notifyFooterAlertModel)));
          this.buttonType = 'default';
        });
    } else {
      for (let control in this.falChangeRequestActionForm.controls) {
        this.falChangeRequestActionForm.controls[control].markAsDirty();
        this.falChangeRequestActionForm.controls[control].updateValueAndValidity();
      }
    }
  }

  public goBack() {
    this.location.back();
  }

  private prepareChangeRequestActionData(actionType: string): ChangeRequestActionModel {
    let preparedData: ChangeRequestActionModel = {
      requestId: this.programRequest.id,
      reason: this.falChangeRequestActionForm.get('comment').value,
      actionType: actionType,
    };
    if (this.falChangeRequestActionForm.valid) {
      if (actionType == 'agency'){
        preparedData.programNumber = this.cfdaCode+'.'+this.falChangeRequestActionForm.get('programNumber').value;
      }
    }
    return preparedData;
  }

  private validateRequestType(type: string) {
    return (['archive_request', 'unarchive_request', 'agency_request', 'number_request', 'title_request', 'program_number_request'].indexOf(type) != -1);
  }

  public isRequestStatus(status: string): boolean {
    if(status == 'approved') {
      return this.requestStatus == ChangeRequestStatus.APPROVED;
    } else if(status == 'pending') {
      return this.requestStatus == ChangeRequestStatus.PENDING;
    } else if(status == 'rejected') {
      return this.requestStatus == ChangeRequestStatus.REJECTED;
    } else if(status == 'cancelled') {
      return this.requestStatus == ChangeRequestStatus.CANCELLED;
    } else {
      return false;
    }
  }

  public isPermissionType(type: string): boolean {
    if(type == 'cancel') {
      return this.permissionType == ChangeRequestActionPermissionType.CANCEL;
    } else if(type == 'approve_reject') {
      return this.permissionType == ChangeRequestActionPermissionType.APPROVE_REJECT;
    } else {
      return false;
    }
  }

  public toJSON(json: string) {
    return JSON.parse(json);
  }
}
