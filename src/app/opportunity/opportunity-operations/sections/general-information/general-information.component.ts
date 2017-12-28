import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { SamDateComponent } from 'sam-ui-elements/src/ui-kit/form-controls/date'
import { AutocompleteConfig } from "../../../../../sam-ui-elements/src/ui-kit/types";
import { OpportunityFieldNames, OpportunitySectionNames } from '../../framework/data-model/opportunity-form-constants';
import { OpportunityFormViewModel } from '../../framework/data-model/opportunity-form/opportunity-form.model';
import { OpportunityFormService } from '../../framework/service/opportunity-form/opportunity-form.service';
import { OpportunityFormErrorService } from "../../opportunity-form-error.service";

@Component({
  selector: 'opp-form-general-information',
  templateUrl: 'general-information.template.html'
})

export class OpportunityGeneralInfoComponent implements OnInit {
  @Input() public viewModel: OpportunityFormViewModel;
  @Output() public showErrors = new EventEmitter();
  public generalInfoForm: FormGroup;
  public oppGeneralInfoViewModel: any;

  public readonly archiveTypeConfig = {
    id: OpportunityFieldNames.ARCHIVE_POLICY,
    label: 'Archiving Policy',
    name: OpportunityFieldNames.ARCHIVE_POLICY + '-radio',
    required: true,
    hint: 'Archiving policy Synopsis and associated documents may be scheduled for archiving fifteen days after the response date or upon a user-specified date subsequent to the posting date.',
    options: [ // loaded asynchronously
             ]
  };

  public readonly archiveDateConfig = {
    id: OpportunityFieldNames.ARCHIVE_DATE,
    label: 'Archiving Specific Date',
    name: OpportunityFieldNames.ARCHIVE_DATE + '-date',
    required: false,
  };
  public readonly archiveTimeConfig = {
    id: OpportunityFieldNames.ARCHIVE_TIME,
    name: OpportunityFieldNames.ARCHIVE_TIME + '-time'
  };

  public readonly vendorsCDIvlConfig = {
    id: OpportunityFieldNames.VENDORS_CD_IVL,
    label: 'Allow Vendors to Add/remove from IVL',
    name: OpportunityFieldNames.VENDORS_CD_IVL + '-radio',
    required: true,
    hint: 'Choose "yes" if you want vendors to be able to add/remove themselves.',
    options: [ // loaded asynchronously
    ]
  };

  public readonly vendorsVIvlConfig = {
    id: OpportunityFieldNames.VENDORS_V_IVL,
    label: 'Allow Vendors to View IVL',
    name: OpportunityFieldNames.VENDORS_V_IVL + '-radio',
    required: true,
    hint: 'Choose "yes" if you want vendors to be able to view the interested vendors list.',
    options: [ // loaded asynchronously
    ]
  };

  /*Additional Reporting Types Config*/
  addiReportingObj = [];
  addiReportingTypes = [];
  public readonly addiReportingConfig = {
    id: OpportunityFieldNames.ADDITIONAL_REPORTING,
    label: 'Additional Reporting',
    name: OpportunityFieldNames.ADDITIONAL_REPORTING + '-multilist',
    hint: null,
    required: false,
    options: [{
      code: 'isRecoveryRelated',
      name: 'Recovery and Reinvestment Act'
    }],
    placeholder: 'None'
  };
  addiAutocompleteConfig: AutocompleteConfig = {
    keyValueConfig: {keyProperty: 'code', valueProperty: 'name'},
    placeholder: 'None Selected',
  };


  constructor(private errorService: OpportunityFormErrorService,
              private cdr: ChangeDetectorRef,
              private formBuilder: FormBuilder,
              private oppFormService: OpportunityFormService) {
    Object.freeze(this.archiveTypeConfig);
    Object.freeze(this.archiveDateConfig);
    Object.freeze(this.vendorsCDIvlConfig);
    Object.freeze(this.vendorsVIvlConfig);
    Object.freeze(this.addiReportingConfig);
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
      archiveTime: null,
      vendorsCDIvl: null,
      vendorsViewIvl: null,
      addiReportingTypes: null
    });
    this.cdr.detectChanges();
    if (this.viewModel.getSectionStatus(OpportunitySectionNames.GENERAL) === 'updated') {
      this.generalInfoForm.markAsPristine({onlySelf: true});
      this.generalInfoForm.get('archiveType').markAsDirty({onlySelf: true});
      this.generalInfoForm.get('archiveType').updateValueAndValidity();
      this.generalInfoForm.get('archiveDate').markAsDirty({onlySelf: true});
      this.generalInfoForm.get('archiveDate').updateValueAndValidity();
      this.generalInfoForm.get('vendorsCDIvl').markAsDirty({onlySelf: true});
      this.generalInfoForm.get('vendorsCDIvl').updateValueAndValidity();
      this.generalInfoForm.get('vendorsViewIvl').markAsDirty({onlySelf: true});
      this.generalInfoForm.get('vendorsViewIvl').updateValueAndValidity();
    }
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
    let addiReportingObj = [];
    addiReportingObj = this.populateMultiList(this.oppGeneralInfoViewModel.addiReportingTypes);
    console.log(addiReportingObj,'addiReportingObj');
    this.generalInfoForm.patchValue({
      archiveType: this.oppGeneralInfoViewModel.archiveType,
      archiveDate: this.oppGeneralInfoViewModel.archiveDate,
      archiveTime: this.oppGeneralInfoViewModel.archiveTime,
      vendorsCDIvl: this.oppGeneralInfoViewModel.vendorCDIvl,
      vendorsViewIvl: this.oppGeneralInfoViewModel.vendorViewIvl,
      addiReportingTypes: addiReportingObj && addiReportingObj.length > 0 ? addiReportingObj : null,
    }, {
      emitEvent: false
    });
    this.cdr.detectChanges();
    this.updateErrors();
  }

  public populateMultiList(data) {
    let types = [];
    if (data && data.length > 0) {
      for (let item of data) {
        if (item && item.isSelected === true) {
          types.push({code: item.code, name: 'Recovery and Reinvestment Act'});
        }
      }
    }
    return types;
  }

  subscribeToChanges() {
    this.linkControlTo(this.generalInfoForm.get('archiveType'), this.saveArchiveType);
    this.linkControlTo(this.generalInfoForm.get('archiveDate'), this.saveArchiveDate);
    this.linkControlTo(this.generalInfoForm.get('archiveTime'), this.saveArchiveTime);
    this.linkControlTo(this.generalInfoForm.get('vendorsCDIvl'), this.saveVendorsCDIvl);
    this.linkControlTo(this.generalInfoForm.get('vendorsViewIvl'), this.saveVendorsViewIvl);
    this.linkControlTo(this.generalInfoForm.get('addiReportingTypes'), this.saveAddiReportingTypes);
  }

  private linkControlTo(control: AbstractControl, callback: (field: any) => void): void {
    let boundCallback = callback.bind(this);
    control.valueChanges
      .debounceTime(10)
      .distinctUntilChanged()
      .subscribe(value => {
      boundCallback(value);
    });
    // actions to take after any field is updated
  }

  private saveArchiveType(type) {
    this.oppGeneralInfoViewModel.archiveType = type;
    this.cdr.detectChanges();
    this.updateArchiveTypeError();
  }

  private saveArchiveDate(date) {
    this.oppGeneralInfoViewModel.archiveDate = date;
    this.cdr.detectChanges();
    this.updateArchiveDateError();
  }

  private saveArchiveTime(date) {
    this.oppGeneralInfoViewModel.archiveTime = date;
    this.cdr.detectChanges();
  }


  private saveVendorsCDIvl(vendorOption) {
    this.oppGeneralInfoViewModel.vendorCDIvl = vendorOption;
    this.cdr.detectChanges();
    this.updateIvlAddError();
  }

  private saveVendorsViewIvl(vendorOption) {
    this.oppGeneralInfoViewModel.vendorViewIvl = vendorOption;
    this.cdr.detectChanges();
    this.updateIvlViewError();
  }

  private saveAddiReportingTypes(addiReportingOptions) {
    let flags = [];
    let code = null;
    if(addiReportingOptions && addiReportingOptions.length > 0) {
      for (let addiReportingOption of addiReportingOptions) {
        code = addiReportingOption.code;
        if (code !== null) {
          flags.push({code: code, isSelected: true});
        }
      }
    } else {
      flags.push({code: 'isRecoveryRelated', isSelected: false});
    }
    this.oppGeneralInfoViewModel.addiReportingTypes = flags;
  }

  public updateErrors() {
    this.errorService.viewModel = this.viewModel;
    this.updateArchiveTypeError();
    this.updateArchiveDateError();
    this.updateIvlAddError();
    this.updateIvlViewError();
  }
  private updateArchiveTypeError() {
    this.generalInfoForm.get('archiveType').clearValidators();
    this.generalInfoForm.get('archiveType').setValidators((control) => {
      return control.errors
    });
    this.generalInfoForm.get('archiveType').setErrors(this.errorService.validateArchiveType().errors);
    this.markAndUpdateFieldStat('archiveType');
    this.emitErrorEvent();
    this.updateArchiveDateError();
  }

  private updateArchiveDateError() {
    this.generalInfoForm.get('archiveDate').clearValidators();
    this.generalInfoForm.get('archiveDate').setValidators((control) => {
      return control.errors
    });
    this.generalInfoForm.get('archiveDate').setErrors(this.errorService.validateArchiveDate().errors);
    this.markAndUpdateFieldStat('archiveDate');
    this.emitErrorEvent();
  }


  private updateIvlAddError() {
    this.generalInfoForm.get('vendorsCDIvl').clearValidators();
    this.generalInfoForm.get('vendorsCDIvl').setValidators((control) => {
      return control.errors
    });
    this.generalInfoForm.get('vendorsCDIvl').setErrors(this.errorService.validateIvlAdd().errors);
    this.markAndUpdateFieldStat('vendorsCDIvl');
    this.emitErrorEvent();
  }

  private updateIvlViewError() {
    this.generalInfoForm.get('vendorsViewIvl').clearValidators();
    this.generalInfoForm.get('vendorsViewIvl').setValidators((control) => {
      return control.errors
    });
    this.generalInfoForm.get('vendorsViewIvl').setErrors(this.errorService.validateIvlView().errors);
    this.markAndUpdateFieldStat('vendorsViewIvl');
    this.emitErrorEvent();
  }

  private markAndUpdateFieldStat(fieldName) {
    this.generalInfoForm.get(fieldName).updateValueAndValidity({onlySelf: true, emitEvent: true});
  }

  private emitErrorEvent() {
    this.showErrors.emit(this.errorService.applicableErrors);
  }

  public toggleArchiveType(value){
    if(value == "manual"){
      this.generalInfoForm.get('archiveDate').setValue(null);
      this.generalInfoForm.get('archiveTime').setValue(null);

    }else if(value == "autocustom"){
      this.generalInfoForm.get('archiveDate').setValue(null);
      this.generalInfoForm.get('archiveTime').setValue(null);

    }
  }
}
