import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ProgramService} from 'api-kit';
import {FALOpSharedService} from '../../assistance-listing-operations.service';
import {DictionaryService} from 'api-kit';
import {AutocompleteConfig} from "sam-ui-kit/types";

@Component({
  providers: [ProgramService, DictionaryService],
  templateUrl: 'criteria-information.template.html',
})
export class FALCriteriaInfoComponent implements OnInit, OnDestroy {
  programId: any;
  program: any;
  falCriteriaForm: FormGroup;
  redirectToViewPg: boolean;
  redirectToWksp: boolean;
  programTitle: string;

  saveProgSub: any;
  getProgSub: any;
  dictSub: any;

  //Assistance Usage Multiselect
  assUsageTypeOptions = [];
  assUsageKeyValue = [];
  assUsageInitialSelection = [];
  assUsageMultiArrayValues = [];
  assUsageSelectedOption: any;

  //Awarded Dropdown
  awardedTextarea: boolean = false;
  awardedTypeOptions = [{value: 'na', label: "None Selected"}];

  //Applicant Multiselect
  applicantTypeOptions = [];
  applicantKeyValue = [];
  appInitialSelection = [];
  applicantMultiArrayValues = [];
  appSelectedOption: any;

  //Beneficiary Multiselect
  benTypeOptions = [];
  benKeyValue = [];
  benInitialSelection = [];
  benMultiArrayValues = [];
  benSelectedOption: any;
  toggleBeneficiarySection: boolean = false;

  //multiselect placeholders
  appPlaceholder = 'None Selected';
  benPlaceholder = 'None Selected';
  assUsagePlaceholder = 'None Selected';

  //Error Message configuration
  @ViewChild('applicantTypeWrapper') applicantTypeWrapper;
  @ViewChild('benTypeWrapper') benTypeWrapper;
  @ViewChild('assUsageTypeWrapper') assUsageTypeWrapper;

  @ViewChild('appListDisplay') appListDisplay;
  @ViewChild('benListDisplay') benListDisplay;
  @ViewChild('assUsageListDisplay') assUsageListDisplay;
  @ViewChild('appAutoComplete') appAutoComplete;

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
        { value: 'na', label: 'Not Applicable', name: 'useRestrictions-checkbox-na' }
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
      { value: 'na', label: 'Not Applicable', name: 'use-Discretionary-Funds-checkbox-na' }
    ]
  },

  textarea: {
    showWhenCheckbox: 'unchecked'
  }
};
  public useLoanTermsConfig: Object = {
    name: 'use-Loan-Terms',
    label: 'Are loans a type of assistance in this program',
    required: true,

    checkbox: {
      options: [
        { value: 'na', label: 'Not Applicable', name: 'use-Loan-Terms-checkbox-na' }
      ]
    },

    textarea: {
      showWhenCheckbox: 'unchecked'
    }
  };

  public documentationConfig: Object = {
    name: 'documentation',
    label: 'Credentials and Documentation',
    hint: 'Please describe credentials or documentation required for applying. Do not include anything covered in 2 CFR 200',
    required: true,

    checkbox: {
      options: [
        { value: 'na', label: 'No Credentials or documentation required', name: 'documentation-credentials-checkbox-na' }
      ]
    },

    textarea: {
      showWhenCheckbox: 'unchecked'
    }
  };

  public useResModel: Object = {};
  public useDisFundsModel: Object = {};
  public useLoanTermsModel: Object = {};
  public documentationModel: Object = {};

  appAutocompleteConfig: AutocompleteConfig = {keyValueConfig: {keyProperty: 'code', valueProperty: 'name'}, placeholder: 'None Selected'};
  benAutocompleteConfig: AutocompleteConfig = {keyValueConfig: {keyProperty: 'code', valueProperty: 'name'}, placeholder: 'None Selected'};
  assUsageAutocompleteConfig: AutocompleteConfig = {keyValueConfig: {keyProperty: 'code', valueProperty: 'name'}, placeholder: 'None Selected'};
  listConfig: AutocompleteConfig = {keyValueConfig: {keyProperty: 'code', valueProperty: 'name'}};

  constructor(private fb: FormBuilder,
              private programService: ProgramService,
              private router: Router,
              private sharedService: FALOpSharedService,
              private dictionaryService: DictionaryService) {
    sharedService.setSideNavFocus();
    this.programId = sharedService.programId;
    // declare dictionaries to load
    let dictionaries = ['applicant_types', 'beneficiary_types', 'phasing_assistance', 'assistance_usage_types'
    ];
    this.dictSub = dictionaryService.getDictionaryById(dictionaries.join(','))
      .subscribe(data => {
        for (let paData of data['phasing_assistance']) {
          this.awardedTypeOptions.push({value: paData.element_id, label: paData.value});
        }
        for (let autData of data['assistance_usage_types']) {
          this.assUsageTypeOptions.push({code: autData.element_id, name: autData.value});
          this.assUsageKeyValue[autData.element_id] = autData.value;
        }
        for (let atData of data['applicant_types']) {
          this.applicantTypeOptions.push({code: atData.element_id, name: atData.value});
          this.applicantKeyValue[atData.element_id] = atData.value;
        }
        for (let btData of data['beneficiary_types']) {
          this.benTypeOptions.push({code: btData.element_id, name: btData.value});
          this.benKeyValue[btData.element_id] = btData.value;
        }
      });
  }

  ngOnInit() {
    this.createForm();
    if (this.sharedService.programId) {
      this.getData();
    }
  }

  ngOnDestroy() {
    if (this.saveProgSub)
      this.saveProgSub.unsubscribe();

    if (this.getProgSub)
      this.getProgSub.unsubscribe();

    if (this.dictSub)
      this.dictSub.unsubscribe();

  }

  placeholderMsg(multiArray: any) {
    let PlaceholderMsg = '';
    if(multiArray.length === 1) {
      PlaceholderMsg = 'One Type Selected';
    } else if(multiArray.length > 1) {
      PlaceholderMsg = 'Multiple Types Selected';
    } else {
      PlaceholderMsg = 'None Selected';
    }
    return PlaceholderMsg;
  }

  createForm() {
    this.falCriteriaForm = this.fb.group({
      'appInitialSelection': '',
      'benInitialSelection': '',
      'assUsageInitialSelection': '',
      'applicantTypes': '',
      'applicantDesc': '',
      'isSameAsApplicant': '',
      'benTypes': '',
      'benDesc': '',
      'lengthTimeDesc': '',
      'awardedTypes': ['na'],
      'awardedDesc': '',
      'assUsageTypes': '',
      'assUsageDesc': '',
      usageRes: null,
      useDisFunds: null,
      useLoanTerms: null,
      documentation: null
    });
    this.falCriteriaForm.get('documentation').valueChanges.subscribe(model => {
      this.documentationModel = model;
    });
    this.falCriteriaForm.get('usageRes').valueChanges.subscribe(model => {
      this.useResModel = model;
    });
    this.falCriteriaForm.get('useDisFunds').valueChanges.subscribe(model => {
      this.useDisFundsModel = model;
    });
    this.falCriteriaForm.get('useLoanTerms').valueChanges.subscribe(model => {
      this.useLoanTermsModel = model;
    });
  }

  getData() {
    this.getProgSub = this.programService.getProgramById(this.sharedService.programId, this.sharedService.cookieValue)
      .subscribe(api => {
          this.program = api;
          this.programTitle = api.data.title;
          let applicantDesc = '';
          let isSameAsApplicant = '';
          let benDesc = '';
          let lengthTimeDesc = '';
          let awardedType = ['na'];
          let awardedDesc = '';
          let assUsageDesc = '';
          if (api.data) {
            if (api.data.eligibility) {
              if (api.data.eligibility.beneficiary) {
                isSameAsApplicant = api.data.eligibility.beneficiary.isSameAsApplicant;
                if (api.data.eligibility.beneficiary.types) {
                  this.populateMultiSelect(this.benInitialSelection, this.benMultiArrayValues,api.data.eligibility.beneficiary.types, this.benKeyValue)
                 this.benAutocompleteConfig.placeholder = this.placeholderMsg(this.benMultiArrayValues);
                }
                if (api.data.eligibility.beneficiary.description) {
                  benDesc = api.data.eligibility.beneficiary.description;
                }
              }
              if(api.data.eligibility.documentation) {
                this.falCriteriaForm.get('documentation').setValue(this.loadToggleCheckboxText(api.data.eligibility.documentation));
              }

              if (api.data.eligibility.applicant) {
                if (api.data.eligibility.applicant.types) {
                   this.populateMultiSelect(this.appInitialSelection, this.applicantMultiArrayValues,api.data.eligibility.applicant.types, this.applicantKeyValue)
                  this.appAutocompleteConfig.placeholder = this.placeholderMsg(this.applicantMultiArrayValues);
                }
                if(api.data.eligibility.applicant.description) {
                  applicantDesc = api.data.eligibility.applicant.description;
                }
              }
              if (api.data.eligibility.limitation) {
                if(api.data.eligibility.limitation.description) {
                  lengthTimeDesc = api.data.eligibility.limitation.description;
                }

                if (api.data.eligibility.limitation.awarded) {
                  awardedType = api.data.eligibility.limitation.awarded;
                  if (awardedType.toString() === 'other') {
                    awardedDesc = api.data.eligibility.limitation.awardedDescription;
                    this.awardedTextarea = true;
                  } else {
                    this.awardedTextarea = false;
                  }
                }
              }
              if (api.data.eligibility.assistanceUsage) {
                if (api.data.eligibility.assistanceUsage.types) {
                  this.populateMultiSelect(this.assUsageInitialSelection, this.assUsageMultiArrayValues,api.data.eligibility.assistanceUsage.types, this.assUsageKeyValue)
                  this.assUsageAutocompleteConfig.placeholder = this.placeholderMsg(this.assUsageMultiArrayValues);
                }
                if(api.data.eligibility.assistanceUsage.description) {
                  assUsageDesc = api.data.eligibility.assistanceUsage.description;
                }
              }
              if (api.data.eligibility.usage) {
                this.falCriteriaForm.get('usageRes').setValue(this.loadToggleCheckboxText(api.data.eligibility.usage.restrictions));
                this.falCriteriaForm.get('useDisFunds').setValue(this.loadToggleCheckboxText(api.data.eligibility.usage.discretionaryFund));
                this.falCriteriaForm.get('useLoanTerms').setValue(this.loadToggleCheckboxText(api.data.eligibility.usage.loanTerms));
              }
            }
          }

          if (isSameAsApplicant) {
            isSameAsApplicant = 'isSameAsApplicant';
            this.toggleBeneficiarySection = false;
            this.falCriteriaForm.value.benDesc = '';
          } else {
            this.toggleBeneficiarySection = true;
          }
          this.falCriteriaForm.patchValue({
            appInitialSelection: this.appInitialSelection,
            benInitialSelection: this.benInitialSelection,
            assUsageInitialSelection: this.assUsageInitialSelection,
            applicantDesc: applicantDesc,
            isSameAsApplicant: [isSameAsApplicant],
            benDesc: benDesc,
            lengthTimeDesc: lengthTimeDesc,
            awardedTypes: awardedType,
            awardedDesc: awardedDesc,
            assUsageDesc: assUsageDesc
          });
        },
        error => {
          console.error('Error Retrieving Program!!', error);
        });//end of subscribe

  }
  loadToggleCheckboxText(obj: any) {
    let model: any = {
      checkbox: [],
      textarea: []
    };
console.log(obj,'obj');
    if(obj) {
      if(!obj.isApplicable) {
        model.checkbox.push('na');
      }

      if(obj.description) {
        model.textarea.push(obj.description);
      }
    }

    return model;
  }


  populateMultiSelect(intialSelection: any, multiArrayValues: any, appTypes: any,keyValueArray: any) {
      for (let id of appTypes) {
        intialSelection.push({code:id, name:keyValueArray[id]});
        multiArrayValues.push(id);
      }
  }
  removeDuplicates(obj: any, list: any) {
    for (let i = 0; i < list.length; i++) {
      if (list[i].code === obj.code) {
        return true;
        //break;
      } else {
        return false;
      }

    }
  }

  onawardedTypeChange(event) {
    if (event === 'other') {
      this.awardedTextarea = true;
    } else {
      this.awardedTextarea = false;
    }
  }

  chkSameAsApp(event) {
    if (event.indexOf('isSameAsApplicant') !== -1) {
      this.toggleBeneficiarySection = false;
      this.falCriteriaForm.value.benDesc = '';
    } else {
      this.toggleBeneficiarySection = true;
    }

  }

  benTypeChange(event) {
    let isDuplicate: boolean;
    const control = this.falCriteriaForm.controls['benTypes'];
    if (event.code) {
      //if control value isn't up to date, manually set it
      if (control.value.code != event.code) {
        control.setValue(event);
        return;
      }
      isDuplicate = this.removeDuplicates(control.value, this.benListDisplay.selectedItems);
      if(!isDuplicate) {
        this.benSelectedOption = control.value;
        this.benMultiArrayValues.push(control.value.code);
        this.benAutocompleteConfig.placeholder = this.placeholderMsg(this.benMultiArrayValues);
      }
    }
  }

  benlistChange(event) {
    this.benMultiArrayValues = [];
    for (let selItem of this.benListDisplay.selectedItems) {
      this.benMultiArrayValues.push(selItem.code);
    }
    this.benAutocompleteConfig.placeholder = this.placeholderMsg(this.benListDisplay.selectedItems);
  }

  applicantTypeChange(event) {

    let isDuplicate: boolean;
    const control = this.falCriteriaForm.controls['applicantTypes'];
    if (event.code) {
      //if control value isn't up to date, manually set it
      if (control.value.code != event.code) {
        control.setValue(event);
        return;
      }
      isDuplicate = this.removeDuplicates(control.value, this.appListDisplay.selectedItems);
      if(!isDuplicate) {
        this.appSelectedOption = control.value;
        this.applicantMultiArrayValues.push(control.value.code);
        this.appAutocompleteConfig.placeholder = this.placeholderMsg(this.applicantMultiArrayValues);
        //this.appAutoComplete.clearInput();
        //this.appAutoComplete.checkForFocus();
      }

    }
  }

  applicantlistChange(event) {
    this.applicantMultiArrayValues = [];
    for (let selItem of this.appListDisplay.selectedItems) {
      this.applicantMultiArrayValues.push(selItem.code);
    }
    this.appAutocompleteConfig.placeholder = this.placeholderMsg(this.appListDisplay.selectedItems);
  }

  assUsageTypeChange(event) {
    let isDuplicate: boolean;
    const control = this.falCriteriaForm.controls['assUsageTypes'];
    if (event.code) {
      //if control value isn't up to date, manually set it
      if (control.value.code != event.code) {
        control.setValue(event);
        return;
      }
      isDuplicate = this.removeDuplicates(control.value, this.assUsageListDisplay.selectedItems);
      if(!isDuplicate) {
        this.assUsageSelectedOption = control.value;
        this.assUsageMultiArrayValues.push(control.value.code);
        this.assUsageAutocompleteConfig.placeholder = this.placeholderMsg(this.assUsageMultiArrayValues);
      }
    }
  }

  assUsagelistChange(event) {
    this.assUsageMultiArrayValues = [];
    for (let selItem of this.assUsageListDisplay.selectedItems) {
      this.assUsageMultiArrayValues.push(selItem.code);
    }
    this.assUsageAutocompleteConfig.placeholder = this.placeholderMsg(this.assUsageListDisplay.selectedItems);
  }


  onCancelClick(event) {
    if (this.sharedService.programId)
      this.router.navigate(['/programs', this.sharedService.programId, 'view']);
    else
      this.router.navigate(['/falworkspace']);
  }

  onPreviousClick(event) {
    if (this.sharedService.programId)
      this.router.navigate(['programs/' + this.sharedService.programId + '/edit/financial-information/other-financial-info']);
    else
      this.router.navigate(['programs/add/financial-information/other-financial-info']);

  }

  onSaveExitClick(event) {
    this.redirectToWksp = true;
    this.saveData();
  }

  onSaveContinueClick(event) {
    this.saveData();
  }

  saveData() {
    let criteriaData = {};
    let data = {};
    let applicantDesc = this.falCriteriaForm.value.applicantDesc;
    //this.assUsageMultiArrayValues = this.assUsageMultiArrayValues.filter(val => (val !== null) || (val !== '') || (val !== 'undefined'));
    let assUsageDesc = this.falCriteriaForm.value.assUsageDesc;
    let isSameAsApplicant: boolean;
    if (this.falCriteriaForm.value.isSameAsApplicant) {
      isSameAsApplicant = this.falCriteriaForm.value.isSameAsApplicant.indexOf('isSameAsApplicant') !== -1;
    }
    //this.benMultiArrayValues = this.benMultiArrayValues.filter(val => (val !== null) || (val !== '') || (val !== 'undefined'));
    let benDesc = this.falCriteriaForm.value.benDesc;
    let lengthTimeDesc = this.falCriteriaForm.value.lengthTimeDesc;
    let awardedType = this.falCriteriaForm.value.awardedTypes === 'na' ? null : this.falCriteriaForm.value.awardedTypes;
    let awardedDesc = this.falCriteriaForm.value.awardedDesc;
    //this.applicantMultiArrayValues = this.applicantMultiArrayValues.filter(val => (val !== null) || (val !== '') || (val !== 'undefined'));

    criteriaData = this.buildJson(this.applicantMultiArrayValues, applicantDesc, this.assUsageMultiArrayValues, assUsageDesc, isSameAsApplicant, this.benMultiArrayValues, benDesc,
      this.saveDocumentaiton(), lengthTimeDesc, awardedType, awardedDesc, this.saveUseRestrictions(), this.saveUseDisFunds(), this.saveUseLoanTerms());

    data = {
      "eligibility": criteriaData
    }
    console.log(data);
 this.saveProgSub = this.programService.saveProgram(this.sharedService.programId, data, this.sharedService.cookieValue)
  .subscribe(api => {
      this.sharedService.programId = api._body;
      console.log('AJAX Completed Criteria Information', api);

      if (this.redirectToWksp)
        this.router.navigate(['falworkspace']);
      else if (this.redirectToViewPg) {
        this.router.navigate(['/programs', this.sharedService.programId, 'view']);
      }
      else
        this.router.navigate(['/programs/' + this.sharedService.programId + '/edit/compliance-requirements']);

    },
    error => {
      console.error('Error saving Program - Criteria Information Section!!', error);
    });
}

  private saveDocumentaiton() {
    let documentation: any = {};
    if(this.documentationModel&& this.documentationModel['checkbox']) {
      documentation.isApplicable = this.documentationModel['checkbox'].indexOf('na') < 0;
    } else {
      documentation.isApplicable = true;
    }

    if(this.documentationModel && this.documentationModel['textarea']) {
      documentation.description = documentation.isApplicable ? this.documentationModel['textarea'][0] : null
    }

    return documentation;
  }
  private saveUseRestrictions() {
    let useRes: any = {};

    if(this.useResModel && this.useResModel['checkbox']) {
      useRes.isApplicable = this.useResModel['checkbox'].indexOf('na') < 0;
    } else {
      useRes.isApplicable = true;
    }

    if(this.useResModel && this.useResModel['textarea']) {
      useRes.description = useRes.isApplicable ? this.useResModel['textarea'][0] : null
    }
    return useRes;
  }
  private saveUseDisFunds() {
    let useDisFunds: any = {};

    if(this.useDisFundsModel && this.useDisFundsModel['checkbox']) {
      useDisFunds.isApplicable = this.useDisFundsModel['checkbox'].indexOf('na') < 0;
    } else {
      useDisFunds.isApplicable = true;
    }

    if(this.useDisFundsModel && this.useDisFundsModel['textarea']) {
      useDisFunds.description = useDisFunds.isApplicable ? this.useDisFundsModel['textarea'][0] : null
    }
    return useDisFunds;
  }

  private saveUseLoanTerms() {
    let useLoanTerms: any = {};

    if(this.useLoanTermsModel && this.useLoanTermsModel['checkbox']) {
      useLoanTerms.isApplicable = this.useLoanTermsModel['checkbox'].indexOf('na') < 0;
    } else {
      useLoanTerms.isApplicable = true;
    }

    if(this.useLoanTermsModel && this.useLoanTermsModel['textarea']) {
      useLoanTerms.description = useLoanTerms.isApplicable ? this.useLoanTermsModel['textarea'][0] : null
    }
    return useLoanTerms;
  }

  buildJson(applicantTypes: any, applicantDesc: string, assUsageType: any, assUsageDesc: string,
            isSameAsApplicant: boolean, benTypes: any, benDesc: string, documentation: any,
            lengthTimeDesc: string, awardedType: string, awardedDesc: string, usageRes: any, usageDisFunds: any, usageLoanTerms: any): any {

    let data = {
      "applicant": {
        "types": applicantTypes.length > 0 ? applicantTypes : null,
        "description": applicantDesc !== '' ? applicantDesc : null
      },
      "assistanceUsage": {
        "types": assUsageType.length > 0 ? assUsageType : null,
        "description": assUsageDesc !== '' ? assUsageDesc : null
      },
      "beneficiary": {
        "isSameAsApplicant": isSameAsApplicant,
        "types": isSameAsApplicant ? null : (benTypes.length > 0 ? benTypes : null),
        "description": isSameAsApplicant ? null : (benDesc !== '' ? benDesc : null)
      },
      "documentation":documentation,
      "limitation": {
        "description": lengthTimeDesc !== '' ? lengthTimeDesc : null,
        "awarded": awardedType,
        "awardedDescription": awardedType !== 'other' ? null : (awardedDesc !== '' ? awardedDesc : null)
      },
      "usage": {
        "restrictions": usageRes,
        "discretionaryFund": usageDisFunds,
        "loanTerms": usageLoanTerms
      }
    };
    return data;
  }
}
