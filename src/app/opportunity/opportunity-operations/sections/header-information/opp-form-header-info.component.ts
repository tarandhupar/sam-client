import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from "@angular/forms";
import { OpportunityFormViewModel } from "../../framework/data-model/opportunity-form.model";
import { OpportunityFormService } from "../../framework/service/opportunity-form.service";

@Component({
  selector: 'opp-form-header-information',
  templateUrl: 'opp-form-header-info.template.html'
})

export class OpportunityHeaderInfoComponent implements OnInit {
  @Input() public viewModel: OpportunityFormViewModel;
  public oppHeaderInfoForm: FormGroup;

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
              private oppFormService: OpportunityFormService) {
    Object.freeze(this.agencyPickerConfig);
    Object.freeze(this.oppTypeConfig);
    Object.freeze(this.idConfig);
    Object.freeze(this.titleConfig);
  }

  ngOnInit() {
    this.createForm();
    this.loadTypeOptions();

    if (!this.viewModel.isNew) {
      this.updateForm();
    }

    this.subscribeToChanges();
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
      opportunityType: this.viewModel.opportunityType,
      title: this.viewModel.title,
      procurementId: this.viewModel.procurementId,
      office: this.viewModel.office,
    }, {
      emitEvent: false,
    });
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

  private linkControlTo(control: AbstractControl, callback: (field: any) => void): void {
    let boundCallback = callback.bind(this);
    control.valueChanges.subscribe(value => {
      boundCallback(value);
    });
    // actions to take after any field is updated
  }

  private saveOffice(office) {
    if(typeof office === 'object' && office !== null) {
      this.viewModel.office = office.orgKey;
    } else {
      this.viewModel.office = office;
    }
  }

  private saveOpportunityType(type) {
    this.viewModel.opportunityType = type;
  }

  private saveProcurementId(id) {
    this.viewModel.procurementId = id;
  }

  private saveTitle(title) {
    this.viewModel.title = title;
  }
}
