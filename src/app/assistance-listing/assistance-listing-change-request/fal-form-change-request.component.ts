import {Component, OnInit, Input, ViewChild} from "@angular/core";
import {FormBuilder, FormGroup, AbstractControl} from "@angular/forms";
import {Location} from "@angular/common";
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import {FALFormService} from "../assistance-listing-operations/fal-form.service";
import * as Cookies from 'js-cookie';
import {ProgramService} from "../../../api-kit/program/program.service";
import {ChangeRequestService} from "../../../api-kit/program/change-request.service";
import {falCustomValidatorsComponent} from "../validators/assistance-listing-validators";
import { AlertFooterService } from "../../app-components/alert-footer/alert-footer.service";
import {FHService} from "../../../api-kit/fh/fh.service";
import {IBreadcrumb} from "sam-ui-elements/src/ui-kit/types";

interface ChangeRequestModel {
  programId: string,
  reason: string,
  requestType: string,
  data?: {
    title?: string,
    organizationId?: string,
    programNumber?: string
  }
}

enum ChangeRequestPermissionType {
  REQUEST,
  ACTION
}

@Component({
  providers: [FALFormService, ProgramService, ChangeRequestService],
  templateUrl: 'fal-form-change-request.template.html',
  selector: 'fal-form-change-request'
})
export class FALFormChangeRequestComponent implements OnInit {
  buttonDisabled: boolean = false;
  falChangeRequestForm: FormGroup;
  buttonType: string = 'default';
  requestType: string;
  pageTitle: string;
  submitButtonText: string;
  permissionType: ChangeRequestPermissionType = ChangeRequestPermissionType.REQUEST;
  pageReady: boolean = false;
  program: any;
  currentOrganization: any;
  newOrganization: any; // for agency_request: looking for existing assistance administrator
  cookieValue: string;
  public permissions: any;
  programNumber: any;
  programNumberLow: any;
  programNumberHigh:any;
  cfdaCode: any;
  newOrganizationId: any;
  userOrganization: any;
  agencyChangeAlertShow: any = false;
  public archiveRequestActiveAwardsOptions = [{ label: 'Yes', value: true }];
  notifyFooterAlertModel = {
    title: "Success",
    description: "Successfully sent notification.",
    type: "success",
    timer: 3000
  };
  crumbs: Array<IBreadcrumb> = [];
  agencyPickerConfig = {
    id: 'change-request-organization',
    label: 'New Agency',
    required: true,
    hint: null,
    type: 'single',
    levelLimit: 3
  };
  qParams: any = {};

  constructor(private fb: FormBuilder,
              private service: FALFormService,
              private fhService: FHService,
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
      this.router.navigate(['/401']);
    }

    this.service.getFAL(this.activatedRoute.snapshot.params['id']).subscribe(data => {
      this.program = data;
      this.programService.getCfdaCode(this.program.data.organizationId).subscribe(res =>{
        this.cfdaCode = res['content']['cfdaCode'];
      });
      this.activatedRoute.queryParams.subscribe(params => {
        this.requestType = params['type'];
        for(var param in params) {
          if(param!="type") {
            this.qParams[param] = params[param];
          }
        }
        if(this.requestType === 'program_number_request'){
          this.programService.getFederalHierarchyConfiguration(this.program.data.organizationId, this.cookieValue).subscribe(res => {
            this.programNumberLow = res.programNumberLow;
            this.programNumberHigh = res.programNumberHigh;
            this.loadPermission();
          });
        }else{
          this.loadPermission();
        }
        if(this.requestType === 'archive_request') {
          this.assignbreadcrumb("Archive Listing");
        }
        if(this.requestType=== 'title_request'){
          this.assignbreadcrumb("Title Change");
        }
        if(this.requestType=== 'agency_request'){
          this.assignbreadcrumb("Agency Change");
        }
        if(this.requestType=== 'program_number_request'){
          this.assignbreadcrumb("CFDA Number Change");
        }
        if(this.requestType=== 'unarchive_request'){
          this.assignbreadcrumb("Unarchive Listing");
        }
      });
    });
  }
  private assignbreadcrumb(type: string ){
    this.crumbs = [];
    this.crumbs.push(
      { breadcrumb: 'Workspace', url: '/workspace' },
      { breadcrumb: 'Assistance Listing', url: '/fal/workspace'},
      { breadcrumb: type} );
  }
  private loadPermission() {
    this.programService.getPermissions(this.cookieValue, 'FAL_REQUESTS', this.program.data.organizationId).subscribe(res => {
      this.permissions = res;
      this.createChangeRequestForm();
    });
  }

  createChangeRequestForm() {
    if (this.validateRequestType(this.requestType)) {
      if ((this.requestType === 'archive_request' && (this.permissions['INITIATE_CANCEL_ARCHIVE_CR'] || this.permissions['APPROVE_REJECT_ARCHIVE_CR'])) ||
        (this.requestType === 'unarchive_request' && (this.permissions['INITIATE_CANCEL_UNARCHIVE_CR'] || this.permissions['APPROVE_REJECT_UNARCHIVE_CR'])) ||
        (this.requestType === 'program_number_request' && (this.permissions['INITIATE_CANCEL_NUMBER_CR'] || this.permissions['APPROVE_REJECT_NUMBER_CR'])) ||
        (this.requestType === 'agency_request' && (this.permissions['INITIATE_CANCEL_AGENCY_CR'] || this.permissions['APPROVE_REJECT_AGENCY_CR'])) ||
        (this.requestType === 'title_request' && (this.permissions['INITIATE_CANCEL_TITLE_CR'] || this.permissions['APPROVE_REJECT_TITLE_CR']))
      ) {
        this.createForm(this.requestType);
        this.setTitle(this.requestType);
      } else { //implement the rest of request types
        this.router.navigate(['/403']);
      }
    } else {
      this.router.navigate(['/403']);
    }
  }

  createForm(type: string) {
    this.fhService.getOrganizationById(this.program.data.organizationId, false, false).subscribe(res =>{
      this.currentOrganization = res['_embedded'][0]['org'];
      this.pageReady = true;

      if (type == 'archive_request') {
        this.falChangeRequestForm = this.fb.group({
          activeAwards: [[], [falCustomValidatorsComponent.checkboxRequired]],
          comment: ''
        });
      } else if (type == 'unarchive_request') {
        this.falChangeRequestForm = this.fb.group({
          comment: ''
        });
      }else if (type == 'program_number_request') {
        this.falChangeRequestForm = this.fb.group({
          programNumber: ['', falCustomValidatorsComponent.isProgramNumberInTheRange(this.programNumberLow, this.programNumberHigh), falCustomValidatorsComponent.isProgramNumberUnique(this.programService, this.cfdaCode, this.activatedRoute.snapshot.params['id'], this.cookieValue, null)],
          comment: ''
        });
      } else if (type == 'title_request') {
        this.falChangeRequestForm = this.fb.group({
          newTitle:['',falCustomValidatorsComponent.checkForDifferentTitle(this.program.data.title)],
          comment: ''
        });
      } else if (type == 'agency_request') {
        this.pageReady = false;
        this.programService.getPermissions(this.cookieValue, 'ORG_ID', this.program.data.organizationId).subscribe(res => {
          this.userOrganization = res['ORG_ID'];
          this.falChangeRequestForm = this.fb.group({
            organizationPicker: ['', falCustomValidatorsComponent.isAgencyPickerValueDiff(this.program.data.organizationId)],
            comment: ''
          });
          this.pageReady = true;
          this.subscribeToChanges();
        });
      }
    });
  }

  setTitle(type: string) {
    if (type === 'archive_request') {
      if (this.permissions['APPROVE_REJECT_ARCHIVE_CR']) {
        this.pageTitle = "Archive Listing";
        this.submitButtonText = "Submit";
        this.permissionType = ChangeRequestPermissionType.ACTION;
      } else if (this.permissions['INITIATE_CANCEL_ARCHIVE_CR']) {
        this.pageTitle = "Archive Listing";
        this.submitButtonText = "Submit Request";
        this.permissionType = ChangeRequestPermissionType.REQUEST;
      }
    } else if (type === 'unarchive_request') {
      if (this.permissions['APPROVE_REJECT_UNARCHIVE_CR']) {
        this.pageTitle = "Unarchive Listing";
        this.submitButtonText = "Submit";
        this.permissionType = ChangeRequestPermissionType.ACTION;
      } else if (this.permissions['INITIATE_CANCEL_UNARCHIVE_CR']) {
        this.pageTitle = "Unarchive Listing";
        this.submitButtonText = "Submit Request";
        this.permissionType = ChangeRequestPermissionType.REQUEST;
      }
    }else if (type === 'program_number_request') {
      if (this.permissions['APPROVE_REJECT_NUMBER_CR']) {
        this.pageTitle = "CFDA Number Change";
        this.submitButtonText = "Submit";
        this.permissionType = ChangeRequestPermissionType.ACTION;
      } else if (this.permissions['INITIATE_CANCEL_NUMBER_CR']) {
        this.pageTitle = "CFDA Number Change";
        this.submitButtonText = "Submit Request";
        this.permissionType = ChangeRequestPermissionType.REQUEST;
      }
    } else if (type === 'title_request') {
      if (this.permissions['APPROVE_REJECT_TITLE_CR']) {
        this.pageTitle = "Title Change";
        this.submitButtonText = "Submit";
        this.permissionType = ChangeRequestPermissionType.ACTION;
      } else if (this.permissions['INITIATE_CANCEL_TITLE_CR']) {
        this.pageTitle = "Title Change";
        this.submitButtonText = "Submit Request";
        this.permissionType = ChangeRequestPermissionType.REQUEST;
      }
    }else if (type === 'agency_request') {
      this.pageTitle = "Agency Change";
      this.submitButtonText = "Submit";
      this.permissionType = ChangeRequestPermissionType.REQUEST;
    }
  }

  public submitChangeRequest() {
    if (this.falChangeRequestForm.valid) {
      this.buttonDisabled = true;
      //disable button's event
      this.buttonType = 'disabled';
      let actionTypes: any = {
        archive_request: {
          success: 'Program Archived'
        },
        unarchive_request: {
          success: 'Program Unarchived'
        },
        program_number_request: {
          success: 'CFDA Number Changed'
        },
        title_request: {
          success: 'Title Changed'
        },
        agency_request: {
          success: 'Agency Changed'
        }
      };

      this.changeRequestService.submitRequest(this.prepareChangeRequestData(), this.cookieValue).subscribe(api => {
          this.notifyFooterAlertModel.description = (this.permissionType == ChangeRequestPermissionType.REQUEST) ? "Request Submitted" : actionTypes[this.requestType].success;
          this.alertFooterService.registerFooterAlert(JSON.parse(JSON.stringify(this.notifyFooterAlertModel)));
          let navigationExtras: NavigationExtras = {
              queryParams: this.qParams
            };
          this.router.navigate(['/fal/workspace'], navigationExtras);
        },
        error => {
          this.buttonDisabled = false;
          console.error('error submitting request', error);
          this.notifyFooterAlertModel.title = "Error";
          this.notifyFooterAlertModel.type = "error";
          this.notifyFooterAlertModel.description = "An error has occurred please contact your administrator.";
          this.alertFooterService.registerFooterAlert(JSON.parse(JSON.stringify(this.notifyFooterAlertModel)));
          this.buttonType = 'default';
        });
    } else {
      for (let control in this.falChangeRequestForm.controls) {
        this.falChangeRequestForm.controls[control].markAsDirty();
        this.falChangeRequestForm.controls[control].updateValueAndValidity();
      }
    }
  }

  public cancelChangeRequest() {
    this.location.back();
  }

  private subscribeToChanges(): void {
    this.linkControlTo(this.falChangeRequestForm.get('organizationPicker'), this.saveOrganization);
  }

  private linkControlTo(control: AbstractControl, callback: (value: any) => void): void {
    let boundCallback = callback.bind(this);
    control.valueChanges.subscribe(value => {
      boundCallback(value);
    });
  }

  private saveOrganization(org) {
    var orgId = null;
    if(typeof org === 'object' && org !== null) {
      orgId = org.orgKey;
      this.newOrganization = org;
    } else {
      orgId = org;
    }

    if(orgId != null) {
      this.newOrganizationId = orgId;
    }

    if(this.userOrganization.indexOf(String(orgId)) > -1 || orgId == null || orgId == '') {
      this.agencyChangeAlertShow = false;
    } else {
      this.agencyChangeAlertShow = true;
    }
  }

  private prepareChangeRequestData(): ChangeRequestModel {
    let preparedData: ChangeRequestModel = {
      programId: this.program.id,
      reason: this.falChangeRequestForm.get('comment').value,
      requestType: this.requestType,
      data: {}
    };

    if (this.falChangeRequestForm.valid) {
      if (this.requestType == 'title_request') {
        preparedData.data.title = this.falChangeRequestForm.get('newTitle').value;
      } else if (this.requestType == 'agency_request') {
        preparedData.data.organizationId = this.newOrganizationId;
      } else if (this.requestType == 'program_number_request') {
        preparedData.data.programNumber = this.cfdaCode+'.'+this.falChangeRequestForm.get('programNumber').value;
      }
    }
    return preparedData;
  }

  public isChangeRequestPermissionType(type: string): boolean {
    if(type == 'request') {
      return this.permissionType == ChangeRequestPermissionType.REQUEST;
    } else if(type == 'action') {
      return this.permissionType == ChangeRequestPermissionType.ACTION;
    }
  }

  private validateRequestType(type: string) {
    return (['archive_request', 'unarchive_request', 'agency_request', 'program_number_request', 'title_request'].indexOf(type) != -1);
  }
}
