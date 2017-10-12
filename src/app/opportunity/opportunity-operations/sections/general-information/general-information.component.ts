import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from "@angular/forms";
import { OpportunityFormViewModel } from "../../framework/data-model/opportunity-form/opportunity-form.model";
import { OpportunityFormService } from "../../framework/service/opportunity-form/opportunity-form.service";

@Component({
  selector: 'opp-form-general-information',
  templateUrl: 'general-information.template.html'
})

export class OpportunityGeneralInfoComponent implements OnInit {
  @Input() public viewModel: OpportunityFormViewModel;
  public generalInfoForm: FormGroup;
  public oppGeneralInfoViewModel: any;

  public readonly archiveTypeConfig = {
    id: 'opp-archive-policy',
    label: 'Archiving Policy',
    name: 'opp-archive-policy',
    required: true,
    hint: 'Archiving policy Synopsis and associated documents may be scheduled for archiving fifteen days after the response date or upon a user-specified date subsequent to the posting date.',
    options: [ // loaded asynchronously
             ]
  };

  public readonly archiveDateConfig = {
    id: 'opp-archive-date',
    label: 'Archiving Specific Date',
    name: 'opp-archive-date'
  };

  public readonly vendorsCDIvlConfig = {
    id: 'opp-vendor-cd-ivl',
    label: 'Allow Vendors to Add/remove from IVL',
    name: 'opp-vendor-cd-ivl',
    required: true,
    hint: 'Choose "yes" if you want vendors to be able to add/remove themselves.',
    options: [ // loaded asynchronously
    ]
  };

  public readonly vendorsVIvlConfig = {
    id: 'opp-vendor-v-ivl',
    label: 'Allow Vendors to View IVL',
    name: 'opp-vendor-v-ivl',
    required: true,
    hint: 'Choose "yes" if you want vendors to be able to view the interested vendors list.',
    options: [ // loaded asynchronously
    ]
  };

  constructor(private formBuilder: FormBuilder, private cdr: ChangeDetectorRef,
              private oppFormService: OpportunityFormService) {
    Object.freeze(this.archiveTypeConfig);
    Object.freeze(this.archiveDateConfig);
    Object.freeze(this.vendorsCDIvlConfig);
    Object.freeze(this.vendorsVIvlConfig);
  }

  ngOnInit() {
    this.oppGeneralInfoViewModel = this.viewModel.oppGeneralInfoViewModel;
    this.createForm();
    this.loadArchiveTypeOptions();
    this.loadYesNoOptions();

    if (!this.viewModel.isNew) {
      this.updateForm();
    }

    this.subscribeToChanges();
  }

  createForm() {
    this.generalInfoForm = this.formBuilder.group({
      archiveType: null,
      archiveDate: null,
      vendorsCDIvl: null,
      vendorsViewIvl: null
    });
  }

  loadArchiveTypeOptions() {
    this.oppFormService.getOpportunityDictionary('archive_type').subscribe((dict) => {
      if (dict['archive_type'] && dict['archive_type'].length > 0) {
        for (let option of dict['archive_type']) {
          this.archiveTypeConfig.options.push({
            value: option.elementId,
            label: option.value,
            name: 'opp-' + option.elementId + '-archive-policy'
          });
        } //end of for
      } //end of if
    }, (error) => {
      console.error('error loading archive type', error);
    });
  }

  loadYesNoOptions() {
    this.oppFormService.getOpportunityDictionary('yes_no').subscribe((dict) => {
      if (dict['yes_no'] && dict['yes_no'].length > 0) {
        for (let option of dict['yes_no']) {

          this.vendorsCDIvlConfig.options.push({
            value: option.elementId,
            label: option.value,
            name: 'opp-' + option.elementId + '-cd-ivl'
          });

          this.vendorsVIvlConfig.options.push({
            value: option.elementId,
            label: option.value,
            name: 'opp-' + option.elementId + '-v-ivl'
          });

        }//end of for
      }//end of if
    }, (error) => {
      console.error('error loading yes_no type', error);
    });
  }

  updateForm() {
    this.generalInfoForm.patchValue({
      archiveType: this.oppGeneralInfoViewModel.archiveType,
      archiveDate: this.oppGeneralInfoViewModel.archiveDate,
      vendorsCDIvl: this.oppGeneralInfoViewModel.vendorCDIvl,
      vendorsViewIvl: this.oppGeneralInfoViewModel.vendorViewIvl
    }, {
      emitEvent: false
    });
  }

  subscribeToChanges() {
    this.linkControlTo(this.generalInfoForm.get('archiveType'), this.saveArchiveType);
    this.linkControlTo(this.generalInfoForm.get('archiveDate'), this.saveArchiveDate);
    this.linkControlTo(this.generalInfoForm.get('vendorsCDIvl'), this.saveVendorsCDIvl);
    this.linkControlTo(this.generalInfoForm.get('vendorsViewIvl'), this.saveVendorsViewIvl);
  }

  private linkControlTo(control: AbstractControl, callback: (field: any) => void): void {
    let boundCallback = callback.bind(this);
    control.valueChanges.subscribe(value => {
      boundCallback(value);
    });
    // actions to take after any field is updated
  }

  private saveArchiveType(type) {
    this.oppGeneralInfoViewModel.archiveType = type;
  }

  private saveArchiveDate(archiveDate) {
    this.oppGeneralInfoViewModel.archiveDate = archiveDate;
  }

  private saveVendorsCDIvl(vendorOption) {
    this.oppGeneralInfoViewModel.vendorCDIvl = vendorOption;
  }

  private saveVendorsViewIvl(vendorOption) {
    this.oppGeneralInfoViewModel.vendorViewIvl = vendorOption;
  }
}
