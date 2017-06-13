import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from "@angular/core";
import {FALFormService} from "../../fal-form.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import {FALFormViewModel} from "../../fal-form.model";
import {AutocompleteConfig} from "sam-ui-kit/types";
import {falCustomValidatorsComponent} from "../../../validators/assistance-listing-validators";

@Component({
  providers: [FALFormService],
  selector: 'fal-form-criteria-info',
  templateUrl: 'fal-form-criteria-info.template.html'
})

export class FALFormCriteriaInfoComponent implements OnInit {
  @Input() viewModel: FALFormViewModel;
  @Output() public onError = new EventEmitter();

  private formErrors = new Set();

  @ViewChild('appauto') appauto;
  @ViewChild('documentationComp') documentationComp;
  @ViewChild('usageResComp') usageResComp;
  @ViewChild('useDisFundsComp') useDisFundsComp;
  @ViewChild('useLoanTermsComp') useLoanTermsComp;

  falCriteriaForm: FormGroup;
  programTitle: string;

  //Assistance Usage Multiselect
  assMultiArrayValues = [];
  assUsageTypeOptions = [];
  assUsageKeyValue = [];
  assListDisplay = [];
  assUsageNGModel: any;

  //Awarded Dropdown
  awardedTextarea: boolean = false;
  awardedTypeOptions = [{value: 'na', label: "None Selected"}];

  //Applicant Multiselect
  appMultiArrayValues = [];
  applicantTypeOptions = [];
  applicantKeyValue = [];
  appListDisplay = [];
  appNGModel: any;

  //Beneficiary Multiselect
  benMultiArrayValues = [];
  benTypeOptions = [];
  benKeyValue = [];
  benListDisplay = [];
  benNGModel: any;
  toggleBenSection: boolean = false;


  // Checkboxes Component
  benSameAsApplicantConfig = {
    options: [{
      value: 'isSameAsApplicant',
      label: 'Beneficiary eligibility is the same as applicant eligibility',
      name: 'checkbox-isa'
    },],
  };

  public useResConfig: Object = {
    name: 'use-restrictions',
    label: 'Use Restrictions ',
    hint: 'List any restrictions on how assistance may be used. Only provide restrictions specific to your organization or this listing.',
    required: true,

    checkbox: {
      options: [
        {value: 'na', label: 'Not Applicable', name: 'useRestrictions-checkbox-na'}
      ]
    },

    textarea: {
      showWhenCheckbox: 'unchecked'
    }
  };
  public useDisFundsConfig: Object = {
    name: 'use-Discretionary-Funds',
    label: 'Are there discretionary funds available?',
    required: true,

    checkbox: {
      options: [
        {value: 'na', label: 'Not Applicable', name: 'use-Discretionary-Funds-checkbox-na'}
      ]
    },

    textarea: {
      showWhenCheckbox: 'unchecked'
    }
  };
  public useLoanTermsConfig: Object = {
    name: 'use-Loan-Terms',
    label: 'Are loans a type of assistance in this program?',
    required: true,

    checkbox: {
      options: [
        {value: 'na', label: 'Not Applicable', name: 'use-Loan-Terms-checkbox-na'}
      ]
    },

    textarea: {
      showWhenCheckbox: 'unchecked'
    }
  };

  public documentationConfig: Object = {
    name: 'documentation',
    label: 'Credentials and Documentation',
    hint: 'Please describe credentials or documentation required for applying. Do not include anything covered in 2 CFR 200.',
    required: true,

    checkbox: {
      options: [
        {value: 'na', label: 'No Credentials or documentation required', name: 'documentation-credentials-checkbox-na'}
      ]
    },

    textarea: {
      showWhenCheckbox: 'unchecked'
    }
  };

  appAutocompleteConfig: AutocompleteConfig = {
    keyValueConfig: {keyProperty: 'code', valueProperty: 'name'},
    placeholder: 'None Selected', clearOnSelection: true, showOnEmptyInput: true
  };
  benAutocompleteConfig: AutocompleteConfig = {
    keyValueConfig: {keyProperty: 'code', valueProperty: 'name'},
    placeholder: 'None Selected', clearOnSelection: true, showOnEmptyInput: true
  };
  assUsageAutocompleteConfig: AutocompleteConfig = {
    keyValueConfig: {keyProperty: 'code', valueProperty: 'name'},
    placeholder: 'None Selected', clearOnSelection: true, showOnEmptyInput: true
  };

  constructor(private fb: FormBuilder, private service: FALFormService) {
  }

  ngOnInit() {
    this.service.getCriteria_Info_Dictionaries().subscribe(
      data => this.parseDictionariesList(data),
      error => {
        console.error('error retrieving dictionary data', error);
      });
    this.createForm();
    if (!this.viewModel.isNew) {
      this.updateForm();
    }
  }

  parseDictionariesList(data) {
    if (data['phasing_assistance'] && data['phasing_assistance'].length > 0) {
      for (let paData of data['phasing_assistance']) {
        this.awardedTypeOptions.push({value: paData.element_id, label: paData.value});
      }
    }
    if (data['assistance_usage_types'] && data['assistance_usage_types'].length > 0) {
      for (let autData of data['assistance_usage_types']) {
        this.assUsageTypeOptions.push({code: autData.element_id, name: autData.value});
        this.assUsageKeyValue[autData.element_id] = autData.value;
      }
    }
    if (data['applicant_types'] && data['applicant_types'].length > 0) {
      for (let atData of data['applicant_types']) {
        let id = atData.element_id;
        this.applicantTypeOptions.push({code: id, name: atData.value});
        this.applicantKeyValue[id] = atData.value;
      }
    }
    if (data['beneficiary_types'] && data['beneficiary_types'].length > 0) {
      for (let btData of data['beneficiary_types']) {
        this.benTypeOptions.push({code: btData.element_id, name: btData.value});
        this.benKeyValue[btData.element_id] = btData.value;
      }
    }
    this.populateMultiSelect(this.viewModel.appListDisplay, this.appAutocompleteConfig, this.appListDisplay, this.applicantKeyValue);
    this.populateMultiSelect(this.viewModel.benListDisplay, this.benAutocompleteConfig, this.benListDisplay, this.benKeyValue);
    this.populateMultiSelect(this.viewModel.assListDisplay, this.assUsageAutocompleteConfig, this.assListDisplay, this.assUsageKeyValue)
    this.falCriteriaForm.patchValue({
      appListDisplay: this.appListDisplay.length > 0 ? this.appListDisplay : [],
      benListDisplay: this.benListDisplay.length > 0 ? this.benListDisplay : [],
      assListDisplay: this.assListDisplay.length > 0 ? this.assListDisplay : [],
    }, {
      emitEvent: false
    });

    this.falCriteriaForm.valueChanges.subscribe(data => {
      this.updateViewModel(data);
      this.collectErrors();

    });
  }

    populateMultiSelect(multiTypeData: any, autoCompleteConfig: any, listDisplay: any, keyValueArray: any) {
    if (multiTypeData && multiTypeData.length > 0) {
      for (let id of multiTypeData) {
        listDisplay.push({code: id, name: keyValueArray[id]});
      }
      autoCompleteConfig.placeholder = this.placeholderMsg(multiTypeData);
    }
  }

  createForm() {
    this.falCriteriaForm = this.fb.group({
      documentation: [''],
      appListDisplay: ['', falCustomValidatorsComponent.autoCompleteRequired],
      applicantType: [''],
      applicantDesc: [''],
      isSameAsApplicant: [''],
      benType: [''],
      benListDisplay: ['', falCustomValidatorsComponent.autoCompleteRequired],
      benDesc: [''],
      lengthTimeDesc: [''],
      awardedType: ['na', falCustomValidatorsComponent.selectRequired],
      awardedDesc: [''],
      assUsageType: [''],
      assListDisplay: ['', falCustomValidatorsComponent.autoCompleteRequired],
      assUsageDesc: [''],
      usageRes: [''],
      useDisFunds: [''],
      useLoanTerms: ['']
    });
  }
  updateViewModel(data) {
    let appListDisplay = [];
    let benListDisplay = [];
    let assListDisplay = [];
    for(let appList of data['appListDisplay']){
      appListDisplay.push(appList.code);
    }
    for(let benList of data['benListDisplay']){
      benListDisplay.push(benList.code);
    }
    for(let assList of data['assListDisplay']){
      assListDisplay.push(assList.code);
    }
    this.viewModel.documentation = this.saveChkToggleTextarea(data['documentation']);
    this.viewModel.appListDisplay = appListDisplay;
    this.viewModel.applicantDesc = data['applicantDesc'] || null;
    this.viewModel.isSameAsApplicant = this.saveIsSameasApplicant(data['isSameAsApplicant']);
    this.viewModel.benListDisplay = benListDisplay;
    this.viewModel.benDesc = data['benDesc'] || null;
    this.viewModel.lengthTimeDesc = data['lengthTimeDesc'] || null;
    this.viewModel.awardedType = data['awardedType'];
    this.viewModel.awardedDesc = data['awardedDesc'] || null;
    this.viewModel.assListDisplay = assListDisplay;
    this.viewModel.assUsageDesc = data['assUsageDesc'] || null;
    this.viewModel.usageRes = this.saveChkToggleTextarea(data['usageRes']);
    this.viewModel.useDisFunds = this.saveChkToggleTextarea(data['useDisFunds']);
    this.viewModel.useLoanTerms = this.saveChkToggleTextarea(data['useLoanTerms']);
  }

  updateForm() {
    this.toggleAwardDesc(this.viewModel.awardedType);
    this.falCriteriaForm.patchValue({
      documentation: this.loadChkToggleTextarea(this.viewModel.documentation),
      applicantDesc: this.viewModel.applicantDesc,
      isSameAsApplicant: this.loadIsSameasApplicant(this.viewModel.isSameAsApplicant),
      benDesc: this.viewModel.benDesc,
      lengthTimeDesc: this.viewModel.lengthTimeDesc,
      awardedType: this.viewModel.awardedType,
      awardedDesc: this.viewModel.awardedDesc,
      assUsageDesc: this.viewModel.assUsageDesc,
      usageRes: this.loadChkToggleTextarea(this.viewModel.usageRes),
      useDisFunds: this.loadChkToggleTextarea(this.viewModel.useDisFunds),
      useLoanTerms: this.loadChkToggleTextarea(this.viewModel.useLoanTerms)
    }, {
      emitEvent: false
    });
  }

  private loadIsSameasApplicant(flag: boolean) {
    let isSamasApp = [];
    this.toggleBenSection = false;
    if (flag) {
      this.toggleBenSection = true;
      isSamasApp.push('isSameAsApplicant')
    }
    return isSamasApp;
  }

  private saveIsSameasApplicant(flag: any) {
    let isflag = false;

    if (flag && flag.length > 0) {
      isflag = true;
    }
    return isflag;
  }

  onawardedTypeChange(event) {
    this.toggleAwardDesc(event);
  }

  chkSameAsApp(event) {
    this.toggleBenSection = false;
    let data = event.indexOf('isSameAsApplicant') !== -1;
    if (data) {
      this.toggleBenSection = true;
    }
    this.falCriteriaForm['controls']['benListDisplay'].updateValueAndValidity();
  }

  applicantTypeChange(event) {
    this.appAutocompleteConfig.placeholder = this.placeholderMsg(event);
  }

  applicantlistChange() {
    this.appAutocompleteConfig.placeholder = this.placeholderMsg(this.falCriteriaForm.value.appListDisplay);
  }

  benTypeChange(event) {
    this.benAutocompleteConfig.placeholder = this.placeholderMsg(event);
  }

  benlistChange() {

    this.benAutocompleteConfig.placeholder = this.placeholderMsg(this.falCriteriaForm.value.benListDisplay);
  }

  assUsageTypeChange(event) {
    this.assUsageAutocompleteConfig.placeholder = this.placeholderMsg(event);
  }

  assUsagelistChange() {
    this.assUsageAutocompleteConfig.placeholder = this.placeholderMsg(this.falCriteriaForm.value.assListDisplay);
  }

  placeholderMsg(multiArray: any) {
    let PlaceholderMsg = '';
    if (multiArray.length === 1) {
      PlaceholderMsg = 'One Type Selected';
    } else if (multiArray.length > 1) {
      PlaceholderMsg = 'Multiple Types Selected';
    } else {
      PlaceholderMsg = 'None Selected';
    }
    return PlaceholderMsg;
  }

  toggleAwardDesc(data: any) {
    if (data === 'other') {
      this.awardedTextarea = true;
    } else {
      this.awardedTextarea = false;
    }
  }


  private loadChkToggleTextarea(type: any) {
    let model = {
      checkbox: [],
      textarea: []
    };
    if (type) {
      if ((type.isApplicable === false)) {
        model.checkbox.push('na');
      }

      if (type.description) {
        model.textarea.push(type.description);
      }
    }
    return model;
  }

  private saveChkToggleTextarea(model: any) {
    let data: any = {};

    if (model && model.checkbox) {
      data.isApplicable = model.checkbox.indexOf('na') < 0;
    } else {
      data.isApplicable = false;
    }
    if (model && model['textarea']) {
      data.description = model['textarea'][0];
    }
    return data;
  }

  validateSection(){
    this.documentationComp.markChildrenAsDirty();
    this.usageResComp.markChildrenAsDirty();
    this.useDisFundsComp.markChildrenAsDirty();
    this.useLoanTermsComp.markChildrenAsDirty();

    for(let key of Object.keys(this.falCriteriaForm.controls)) {
      this.falCriteriaForm.controls[key].markAsDirty();
      this.falCriteriaForm.controls[key].updateValueAndValidity();
    }

    //this.collectErrors();
    if(this.formErrors.size > 0)
      this.emitEvent();
  }

  private collectErrors() {
    let size = this.formErrors.size;

    for(let key in this.falCriteriaForm.controls) {
      if(['applicantType', 'benType', 'assUsageType'].indexOf(key) == -1){
        if(this.falCriteriaForm.controls[key].errors && this.falCriteriaForm.controls[key].dirty) {
          this.formErrors.add(key);
        } else {
          this.formErrors.delete(key);
        }
      }
    }

    if(this.formErrors.size !== size) {
      this.emitEvent();
    }
  }

  private emitEvent() {
    this.onError.emit({
      formErrorArr: Array.from(this.formErrors.values()),
      section: 'criteria-information'
    });
  }

}
