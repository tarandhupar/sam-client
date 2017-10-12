import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup } from "@angular/forms";
import { OpportunityFormViewModel } from "../../framework/data-model/opportunity-form/opportunity-form.model";
import { OpportunityFormService } from "../../framework/service/opportunity-form/opportunity-form.service";
import {UserAccessService} from "../../../../../api-kit/access/access.service";
import {UserService} from "../../../../role-management/user.service";

@Component({
  selector: 'opp-form-header-information',
  templateUrl: 'opp-form-header-info.template.html'
})

export class OpportunityHeaderInfoComponent implements OnInit {
  @Input() public viewModel: OpportunityFormViewModel;
  public oppHeaderInfoForm: FormGroup;
  public oppHeaderInfoViewModel: any;

  public readonly agencyPickerConfig = {
    id: 'opp-office',
    label: 'Contracting Office',
    required: true,
    hint: null,
    type: 'single',
    orgRoots: [],
    levelLimit: 3,
  };

  public readonly oppTypeConfig = {
    id: 'opp-type',
    label: 'Type',
    name: 'opp-type-select',
    required: true,
    hint: null,
    options: [
      // loaded asynchronously
    ],
  };

  public readonly idConfig = {
    id: 'opp-id',
    label: 'Procurement ID',
    name: 'opp-id-input',
    required: true,
    hint: 'Agency assigned number for control, tracking, and identification. Please use ONLY alphanumeric and - _ ( ) { } characters (no spaces).',
    maxLength: null,
  };

  public readonly titleConfig = {
    id: 'opp-title',
    label: 'Title',
    name: 'opp-title-input',
    required: true,
    hint: 'Brief title description of services, supplies, or project required by the posting agency. Note: 256 character limit.',
    maxLength: 256,
  };

  constructor(private formBuilder: FormBuilder, private cdr: ChangeDetectorRef,
    private userAccessService: UserAccessService,
    private userService: UserService,
    private router: Router,
    private oppFormService: OpportunityFormService) {
    Object.freeze(this.agencyPickerConfig);
    Object.freeze(this.oppTypeConfig);
    Object.freeze(this.idConfig);
    Object.freeze(this.titleConfig);
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
      title: '',
      procurementId: '',
      office: null,
    });
  }

  private updateForm(): void {
    this.oppHeaderInfoForm.patchValue({
      opportunityType: this.oppHeaderInfoViewModel.opportunityType,
      title: this.viewModel.title,
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
  }

  private loadTypeOptions() {
    this.oppFormService.getOpportunityDictionary('procurement_type').subscribe((dict) => {
      if (dict['procurement_type'] && dict['procurement_type'].length > 0) {
        for (let type of dict['procurement_type']) {
          if(type.code == 'o'){
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
  }

  private linkControlTo(control: AbstractControl, callback: (value: any) => void): void {
    let boundCallback = callback.bind(this);
    control.valueChanges.subscribe(value => {
      boundCallback(value);
    });
    // actions to take after any field is updated
  }

  private saveOffice(office) {
    if(typeof office === 'object' && office !== null) {
      this.oppHeaderInfoViewModel.office = office.orgKey;
    } else {
      this.oppHeaderInfoViewModel.office = office;
    }
  }

  private saveOpportunityType(type) {
    this.oppHeaderInfoViewModel.opportunityType = type;
  }

  private saveProcurementId(id) {
    this.oppHeaderInfoViewModel.procurementId = id;
  }

  private saveTitle(title) {
    this.viewModel.title = title;
  }
}
