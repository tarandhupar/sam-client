import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup } from "@angular/forms";
import { OpportunityFormViewModel } from "../../framework/data-model/opportunity-form/opportunity-form.model";
import { OpportunityFormService } from "../../framework/service/opportunity-form/opportunity-form.service";
import { UserAccessService } from "../../../../../api-kit/access/access.service";
import { UserService } from "../../../../role-management/user.service";
import { OpportunityFieldNames } from '../../framework/data-model/opportunity-form-constants';
import { OppNoticeTypeMapService } from '../../framework/service/notice-type-map/notice-type-map.service';
import { OpportunitySectionNames } from "../../framework/data-model/opportunity-form-constants";
import { OpportunityFormErrorService } from "../../opportunity-form-error.service";

@Component({
  providers: [UserService],
  selector: 'opp-form-header-information',
  templateUrl: 'opp-form-header-info.template.html'
})

export class OpportunityHeaderInfoComponent implements OnInit {
  @Input() public viewModel: OpportunityFormViewModel;
  @Output() public showErrors = new EventEmitter();
  public oppHeaderInfoForm: FormGroup;
  public oppHeaderInfoViewModel: any;

  public readonly oppTypeConfig = {
    id: OpportunityFieldNames.OPPORTUNITY_TYPE,
    label: 'Type',
    name: OpportunityFieldNames.OPPORTUNITY_TYPE + '-select',
    required: true,
    hint: null,
    options: [
      // loaded asynchronously
    ],
  };

  public readonly titleConfig = {
    id: OpportunityFieldNames.TITLE,
    label: 'Title',
    name: OpportunityFieldNames.TITLE + '-input',
    required: true,
    hint: 'Brief title description of services, supplies, or project required by the posting agency. Note: 256 character limit.',
    maxLength: 256,
  };

  public readonly idConfig = {
    id: OpportunityFieldNames.PROCUREMENT_ID,
    label: 'Procurement ID',
    name: OpportunityFieldNames.PROCUREMENT_ID + '-input',
    required: true,
    hint: 'Agency assigned number for control, tracking, and identification. Please use ONLY alphanumeric and - _ ( ) { } characters (no spaces).',
    maxLength: null,
  };

  public readonly agencyPickerConfig = {
    id: OpportunityFieldNames.CONTRACTING_OFFICE,
    label: 'Contracting Office',
    required: true,
    hint: null,
    type: 'single',
    orgRoots: [],
    levelLimit: 3,
  };
  noticeTypes = ['o', 'p', 'k', 'r', 'g', 's', 'a'];

  constructor(private errorService: OpportunityFormErrorService, private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private userAccessService: UserAccessService,
    private userService: UserService,
    private router: Router,
    private oppFormService: OpportunityFormService,
    private oppNoticeTypeMapService: OppNoticeTypeMapService) {

      Object.freeze(this.oppTypeConfig);
      Object.freeze(this.titleConfig);
      Object.freeze(this.idConfig);
      Object.freeze(this.agencyPickerConfig);
  }

  ngOnInit() {
    this.oppHeaderInfoViewModel = this.viewModel.oppHeaderInfoViewModel;
    this.createForm();
    this.loadTypeOptions();

    if (!this.viewModel.isNew) {
      this.updateForm();
    } else if (this.viewModel.isNew) {
      //init FH dropdown
      this.initFHDropdown();
    }

    this.subscribeToChanges();
  }

  private initFHDropdown() {
    try {
      let user: any = this.userService.getUser();
      if (user != null && user.email != null) {
        this.userAccessService.getAllUserRoles(this.userService.getUser().email).subscribe(api => {
          if (api != null && api.access != null && Array.isArray(api.access) && api.access.length> 0 && api.access[0].organization != null && api.access[0].organization.id != null){
//            this.agencyPickerConfig.orgRoots = [api.access[0].organization.id];
            this.agencyPickerConfig.orgRoots.push(api.access[0].organization.id);
          } else { //failed to get user associated organization. Redirect to signin
            this.router.navigate(['signin']);
          }
        }, error => { //failed to get user associated organization. Redirect to signin
          this.router.navigate(['signin']);
        });
      } else { //failed to get user associated organization. Redirect to signin
        this.router.navigate(['signin']);
      }
    } catch (exception) { //failed to get user associated organization. Redirect to signin
      this.router.navigate(['signin']);
    }
  }

  private createForm(): void {
    this.oppHeaderInfoForm = this.formBuilder.group({
      opportunityType: null,
      relatedNotice: null,
      title: '',
      procurementId: '',
      office: null,
    });
    this.cdr.detectChanges();
    if (this.viewModel.getSectionStatus(OpportunitySectionNames.HEADER) === 'updated') {
      this.oppHeaderInfoForm.markAsPristine({onlySelf: true});
      this.oppHeaderInfoForm.get('title').markAsDirty({onlySelf: true});
      this.oppHeaderInfoForm.get('title').updateValueAndValidity();
      this.oppHeaderInfoForm.get('procurementId').markAsDirty({onlySelf: true});
      this.oppHeaderInfoForm.get('procurementId').updateValueAndValidity();
      this.oppHeaderInfoForm.get('office').markAsDirty({onlySelf: true});
      this.oppHeaderInfoForm.get('office').updateValueAndValidity();
    }
  }

  private updateForm(): void {
    this.oppHeaderInfoForm.patchValue({
      opportunityType: this.oppHeaderInfoViewModel.opportunityType,
      title: this.viewModel.title,
      relatedNotice: this.viewModel.relatedNotice,
      procurementId: this.oppHeaderInfoViewModel.procurementId,
      office: this.oppHeaderInfoViewModel.office,
    }, {
        emitEvent: false,
      });

    //update FH Picker with opportunity's org
    if(this.oppHeaderInfoViewModel.office != null) {
      this.agencyPickerConfig.orgRoots.push(this.oppHeaderInfoViewModel.office);
    } else {
      this.initFHDropdown();
    }
    this.cdr.detectChanges();
    this.updateErrors();
  }

  private loadTypeOptions() {
    this.oppFormService.getOpportunityDictionary('procurement_type').subscribe((dict) => {
      if (dict['procurement_type'] && dict['procurement_type'].length > 0) {
        for (let type of dict['procurement_type']) {
          if (type.code && this.noticeTypes.indexOf(type.code) !== -1) {
            this.oppTypeConfig.options.push({
              value: type.elementId,
              label: type.value,
              name: 'opp-' + type.elementId + '-type',
            });
          }
        }
      }
    }, (error) => {
      console.error('error loading notice types', error);
    });
  }

  private subscribeToChanges(): void {
    this.linkControlTo(this.oppHeaderInfoForm.get('office'), this.saveOffice);
    this.linkControlTo(this.oppHeaderInfoForm.get('opportunityType'), this.saveOpportunityType);
    this.linkControlTo(this.oppHeaderInfoForm.get('procurementId'), this.saveProcurementId);
    this.linkControlTo(this.oppHeaderInfoForm.get('title'), this.saveTitle);
    this.linkControlTo(this.oppHeaderInfoForm.get('relatedNotice'), this.saveRelatedNotice);
  }

  private linkControlTo(control: AbstractControl, callback: (value: any) => void): void {
    let boundCallback = callback.bind(this);
    control.valueChanges
      .debounceTime(10)
      .distinctUntilChanged()
      .subscribe(value => {
      boundCallback(value);
    });
    // actions to take after any field is updated
  }

  private saveOffice(federalAgency) {
    if(federalAgency) {
      let orgId = '';
      if (typeof federalAgency === 'object')
        orgId = federalAgency.orgKey;
      else {
        orgId = federalAgency;
      }
      this.oppHeaderInfoViewModel.office = orgId;
    }
    else {
      this.oppHeaderInfoViewModel.office = null;
    }

    this.cdr.detectChanges();
    this.updateFederalAgencyError();
  }

  private saveOpportunityType(type) {
    this.oppHeaderInfoViewModel.opportunityType = type;
    this.disableSideNavItem(type);
  }

  private saveProcurementId(id) {
    this.oppHeaderInfoViewModel.procurementId = id;
    this.cdr.detectChanges();
    this.updateProcurementIdError();
  }

  private saveTitle(title) {
    this.viewModel.title = title;
    this.cdr.detectChanges();
    this.updateTitleError();
  }

  public updateErrors() {
    this.errorService.viewModel = this.viewModel;
    this.updateTitleError();
    this.updateFederalAgencyError();
    this.updateProcurementIdError();
  }

  private updateTitleError() {
    this.oppHeaderInfoForm.get('title').clearValidators();
    this.oppHeaderInfoForm.get('title').setValidators((control) => {
      return control.errors
    });
    this.oppHeaderInfoForm.get('title').setErrors(this.errorService.validateHeaderTitle().errors);
    this.markAndUpdateFieldStat('title');

    this.emitErrorEvent();
  }

  private updateFederalAgencyError() {
    this.oppHeaderInfoForm.get('office').clearValidators();
    this.oppHeaderInfoForm.get('office').setValidators((control) => {
      return control.errors
    });
    this.oppHeaderInfoForm.get('office').setErrors(this.errorService.validateFederalAgency().errors);
    this.markAndUpdateFieldStat('office');
    this.emitErrorEvent();
  }


  private updateProcurementIdError() {
    this.oppHeaderInfoForm.get('procurementId').clearValidators();
    this.oppHeaderInfoForm.get('procurementId').setValidators((control) => {
      return control.errors
    });
    this.oppHeaderInfoForm.get('procurementId').setErrors(this.errorService.validateProcurementId().errors);
    this.markAndUpdateFieldStat('procurementId');
    this.emitErrorEvent();
  }

  private markAndUpdateFieldStat(fieldName) {
    this.oppHeaderInfoForm.get(fieldName).updateValueAndValidity({onlySelf: true, emitEvent: true});
  }

  private emitErrorEvent() {
    this.showErrors.emit(this.errorService.applicableErrors);
  }

  private saveRelatedNotice(notice: string) {
   this.viewModel.relatedNotice = notice;
  }

  private disableSideNavItem(type) {
    this.oppNoticeTypeMapService.toggleSectionsDisabledProperty(type);
  }
}
