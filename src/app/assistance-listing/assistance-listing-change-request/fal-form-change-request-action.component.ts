import {Component, OnInit, Input, ViewChild} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Location} from "@angular/common";
import {Router, ActivatedRoute} from '@angular/router';
import * as Cookies from 'js-cookie';
import {ChangeRequestService} from "../../../api-kit/program/change-request.service";
import {ProgramService} from "../../../api-kit/program/program.service";
import {falCustomValidatorsComponent} from "../validators/assistance-listing-validators";
import { AlertFooterService } from "../../alerts/alert-footer/alert-footer.service";

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
  programNumber?: string
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
  programRequestAction: any;
  cookieValue: string;
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

  constructor(private fb: FormBuilder,
    private programService: ProgramService,
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

  private loadPermission() {
    this.programService.getPermissions(this.cookieValue, 'FAL_REQUESTS', this.programRequest.program.organizationId).subscribe(res => {
      this.permissions = res;
      this.initPage();
    });
  }

  private loadRequestAction() {
    this.changeRequestService.getRequestActionByRequestId(this.activatedRoute.snapshot.params['id'], this.cookieValue).subscribe(data => {
      this.programRequestAction = data;
      //set up the right requestStatus
      if (this.programRequestAction.actionType == 'archive_cancel' || this.programRequestAction.actionType == 'unarchive_cancel') {
        this.requestStatus = ChangeRequestStatus.CANCELLED;
      } else if (this.programRequestAction.actionType == 'archive_reject' || this.programRequestAction.actionType == 'unarchive_reject') {
        this.requestStatus = ChangeRequestStatus.REJECTED;
      } else if (this.programRequestAction.actionType == 'archive' || this.programRequestAction.actionType == 'unarchive') {
        this.requestStatus = ChangeRequestStatus.APPROVED;
      }
    });
  }

  private initPage() {
    //validate the request type
    if (this.validateRequestType(this.requestType)) {
      if ((this.requestType === 'archive_request' && (this.permissions['INITIATE_CANCEL_ARCHIVE_CR'] || this.permissions['APPROVE_REJECT_ARCHIVE_CR'])) ||
        (this.requestType === 'unarchive_request' && (this.permissions['INITIATE_CANCEL_UNARCHIVE_CR'] || this.permissions['APPROVE_REJECT_UNARCHIVE_CR']))) {
        this.createForm(this.requestType);
        this.pageReady = true;
      } else { //implement the rest of request types
        this.router.navigate(["accessrestricted"]);
      }
    } else {
      this.router.navigate(["accessrestricted"]);
    }
  }

  private createForm(type: string) {
    if (type == 'archive_request') {
      this.pageTitle = "Archive an Assistance Listing";
      this.falChangeRequestActionForm = this.fb.group({
        activeAwards: [[], [falCustomValidatorsComponent.checkboxRequired]],
        comment: ''
      });

      if (this.permissions['APPROVE_REJECT_ARCHIVE_CR']) {
        this.permissionType = ChangeRequestActionPermissionType.APPROVE_REJECT;
      } else if (this.permissions['INITIATE_CANCEL_ARCHIVE_CR']) {
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
      } 
    };

    this.submitChangeRequestAction(actionTypes[this.requestType]);
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
      }
    };

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
      if (this.requestType == 'agency_request') {
        preparedData.programNumber = this.falChangeRequestActionForm.get('programNumber').value;
      }
    }

    return preparedData;
  }

  private validateRequestType(type: string) {
    return (['archive_request', 'unarchive_request', 'agency_request', 'number_request', 'title_request'].indexOf(type) != -1);
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
}
