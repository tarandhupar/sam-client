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
  assUsageValueKey = [];
  assUsageIntialSelection = [];
  assUsageMultiArrayValues = [];
  assUsageSelectedOption: any;
  //Awarded Dropdown
  awardedTextarea: boolean = false;
  awardedTypeOptions = [{value: 'na', label: "None Selected"}];
  //Applicant Multiselect
  applicantTypeOptions = [];
  applicantKeyValue = [];
  applicantValueKey = [];
  appIntialSelection = [];
  applicantMultiArrayValues = [];
  appSelectedOption: any;
  //Beneficiary Multiselect
  benTypeOptions = [];
  benKeyValue = [];
  benValueKey = [];
  benIntialSelection = [];
  benMultiArrayValues = [];
  benSelectedOption: any;
  toggleBeneficiarySection: boolean = false;
  //Error Message configuration
  @ViewChild('applicantTypeWrapper') applicantTypeWrapper;
  @ViewChild('benTypeWrapper') benTypeWrapper;
  @ViewChild ('assUsageTypeWrapper') assUsageTypeWrapper;

  // Checkboxes Component
  benSameAsApplicantConfig = {options: [{value: 'isSameAsApplicant', label: 'Beneficiary eligibility is the same as applicant eligibility', name: 'checkbox-isa'},],};
  autocompleteConfig: AutocompleteConfig = {keyValueConfig: {keyProperty: 'code', valueProperty: 'name'}};

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
          this.assUsageValueKey[autData.value] = autData.element_id;
        }
        for (let atData of data['applicant_types']) {
          this.applicantTypeOptions.push({code: atData.element_id, name: atData.value});
          this.applicantKeyValue[atData.element_id] = atData.value;
          this.applicantValueKey[atData.value] = atData.element_id;
        }
        for (let btData of data['beneficiary_types']) {
          this.benTypeOptions.push({code: btData.element_id, name: btData.value});
          this.benKeyValue[btData.element_id] = btData.value;
          this.benValueKey[btData.value] = btData.element_id;
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

  createForm() {
    this.falCriteriaForm = this.fb.group({
      'documentation': '',
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
      'usageResDesc': ''
    });
  }

  getData() {
    this.getProgSub = this.programService.getProgramById(this.sharedService.programId, this.sharedService.cookieValue)
      .subscribe(api => {
          this.program = api;
          this.programTitle = api.data.title;
          let documentation = '';
          let applicantType = '';
          let applicantDesc = '';
          let isSameAsApplicant = '';
          let benType = '';
          let benDesc = '';
          let lengthTimeDesc = '';
          let awardedType = '';
          let awardedDesc = '';
          let assUsageType = '';
          let assUsageDesc = '';
          let usageResDesc = '';
          if (api.data) {
            if (api.data.eligibility) {
              if (api.data.eligibility.beneficiary) {
                if (api.data.eligibility.beneficiary.isSameAsApplicant) {
                  isSameAsApplicant = api.data.eligibility.beneficiary.isSameAsApplicant;
                }
                this.populateMultiSelect(api.data.eligibility.beneficiary.types, this.benIntialSelection, this.benMultiArrayValues, this.benKeyValue);
                benDesc = api.data.eligibility.beneficiary.description;
              }
              documentation = api.data.eligibility.documentation.description;
              if (api.data.eligibility.applicant) {
                this.populateMultiSelect(api.data.eligibility.applicant.types, this.appIntialSelection, this.applicantMultiArrayValues, this.applicantKeyValue);
                applicantDesc = api.data.eligibility.applicant.description;
              }
              if (api.data.eligibility.limitation) {
                lengthTimeDesc = api.data.eligibility.limitation.description;
                awardedType = api.data.eligibility.limitation.awarded !== '' ? api.data.eligibility.limitation.awarded : ['na'];
                if (awardedType === 'other') {
                  awardedDesc = api.data.eligibility.limitation.awardedDescription;
                  this.awardedTextarea = true;
                } else {
                  this.awardedTextarea = false;
                }
              }
              if (api.data.eligibility.assistanceUsage) {
                this.populateMultiSelect(api.data.eligibility.assistanceUsage.types, this.assUsageIntialSelection, this.assUsageMultiArrayValues, this.assUsageKeyValue);
                assUsageDesc = api.data.eligibility.assistanceUsage.description;
              }
              if (api.data.eligibility.usage) {
                usageResDesc = api.data.eligibility.usage.restrictions.description;
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
            documentation: documentation,
            applicantTypes: {
              name: this.applicantMultiArrayValues.length !== 0 ? 'Multiple Types Selected' : 'None Selected'
            },
            applicantDesc: applicantDesc,
            isSameAsApplicant: [isSameAsApplicant],
            benTypes:  {
              name: this.benMultiArrayValues.length !== 0 ? 'Multiple Types Selected' : 'None Selected'
            },
            benDesc: benDesc,
            lengthTimeDesc: lengthTimeDesc,
            awardedTypes: awardedType,
            assUsageTypes: { name : this.assUsageMultiArrayValues.length !== 0 ? 'Multiple Types Selected' : 'None Selected'},
            awardedDesc: awardedDesc,
            assUsageDesc: assUsageDesc,
            usageResDesc: usageResDesc
          });
        },
        error => {
          console.error('Error Retrieving Program!!', error);
        });//end of subscribe

  }

  populateMultiSelect(data: any, intialSelections: any, multiarrayValues: any, keyValueArray: any) {
  /*  if (applicantTypes.length > 0) {
      for (let appType of applicantTypes) {
        this.appIntialSelection.push(this.applicantKeyValue[appType]);
        this.applicantMultiArrayValues.push(appType);
      }
    }*/
    if (data.length > 0) {
      for (let item of data) {
        intialSelections.push(keyValueArray[item]);
        multiarrayValues.push(item);
      }
    }
  }

  multiselectMsg(control: any, multiArrayValues: any) {
    /* let name: any;
     const control = this.falCriteriaForm.controls['applicantTypes'];
     name = {name: this.applicantMultiArrayValues.length !== 0 ? 'Multiple Types Selected' : 'None Selected'}
     control.patchValue(name);*/
    let name: any;
    name = {name: multiArrayValues.length !== 0 ? 'Multiple Types Selected' : 'None Selected'}
    control.patchValue(name);
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
    const control = this.falCriteriaForm.controls['benTypes'];
    this.benMultiArrayValues = this.benMultiArrayValues.filter(val => val !== control.value.code);
    this.benMultiArrayValues.push(control.value.code);
    this.benSelectedOption = this.benKeyValue[control.value.code];
    this.multiselectMsg(control, this.benMultiArrayValues);
    this.benTypeWrapper.formatErrors(this.falCriteriaForm.controls['benTypes'])
  }

  benlistChange(event) {
    const control = this.falCriteriaForm.controls['benTypes'];
    let removeItem: string;
    removeItem = this.benValueKey[event];
    this.benMultiArrayValues = this.benMultiArrayValues.filter(val => val !== removeItem);
    this.multiselectMsg(control, this.benMultiArrayValues);
  }


  applicantTypeChange(event) {
    const control = this.falCriteriaForm.controls['applicantTypes'];
    this.applicantMultiArrayValues = this.applicantMultiArrayValues.filter(val => val !== control.value.code);
    this.applicantMultiArrayValues.push(control.value.code);
    this.appSelectedOption = this.applicantKeyValue[control.value.code];
    this.multiselectMsg(control, this.applicantMultiArrayValues);
    this.applicantTypeWrapper.formatErrors(this.falCriteriaForm.controls['applicantTypes'])
  }

  applicantlistChange(event) {
    const control = this.falCriteriaForm.controls['applicantTypes'];
    let removeItem: string;
    removeItem = this.applicantValueKey[event];
    this.applicantMultiArrayValues = this.applicantMultiArrayValues.filter(val => val !== removeItem);
    this.multiselectMsg(control, this.applicantMultiArrayValues);
  }

  assUsageTypeChange(event) {
    const control = this.falCriteriaForm.controls['assUsageTypes'];
    this.assUsageMultiArrayValues = this.assUsageMultiArrayValues.filter(val => val !== control.value.code);
    this.assUsageMultiArrayValues.push(control.value.code);
    this.assUsageSelectedOption = this.assUsageKeyValue[control.value.code];
    this.multiselectMsg(control, this.assUsageMultiArrayValues);
    this.assUsageTypeWrapper.formatErrors(this.falCriteriaForm.controls['assUsageTypes'])
  }

  assUsagelistChange(event) {
    const control = this.falCriteriaForm.controls['assUsageTypes'];
    let removeItem: string;
    removeItem = this.assUsageValueKey[event];
    this.assUsageMultiArrayValues = this.assUsageMultiArrayValues.filter(val => val !== removeItem);
    this.multiselectMsg(control, this.assUsageMultiArrayValues);
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
    this.redirectToViewPg = true;
    this.saveData();
  }

  saveData() {
    let criteriaData = {};
    let data = {};
    let applicantDesc = this.falCriteriaForm.value.applicantDesc;
    this.assUsageMultiArrayValues = this.assUsageMultiArrayValues.filter(val => val !== null || '' || undefined);
    let assUsageDesc = this.falCriteriaForm.value.assUsageDesc;
    let isSameAsApplicant: boolean;
    if (this.falCriteriaForm.value.isSameAsApplicant) {
      isSameAsApplicant = this.falCriteriaForm.value.isSameAsApplicant.indexOf('isSameAsApplicant') !== -1;
    }
    let benTypes = this.benMultiArrayValues.filter(val => val !== null || '' || undefined);
    let benDesc = this.falCriteriaForm.value.benDesc;
    let documentation = this.falCriteriaForm.value.documentation;
    let lengthTimeDesc = this.falCriteriaForm.value.lengthTimeDesc;
    let awardedType = this.falCriteriaForm.value.awardedTypes;
    let awardedDesc = this.falCriteriaForm.value.awardedDesc;
    let usageResDesc = this.falCriteriaForm.value.usageResDesc;
    this.applicantMultiArrayValues = this.applicantMultiArrayValues.filter(val => val !== null || '' || undefined);

    criteriaData = this.buildJson(this.applicantMultiArrayValues, applicantDesc, this.assUsageMultiArrayValues, assUsageDesc, isSameAsApplicant, this.benMultiArrayValues, benDesc,
      documentation, lengthTimeDesc, awardedType, awardedDesc, usageResDesc);

    data = {
      "eligibility": criteriaData
    }
    console.log('save data', data);
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

  buildJson(applicantTypes: any, applicantDesc: string, assUsageType: any, assUsageDesc: string,
            isSameAsApplicant: boolean, benTypes: any, benDesc: string, documentation: string,
            lengthTimeDesc: string, awardedType: string, awardedDesc: string, usageResDesc: string): any {

    let data = {
      "applicant": {
        "types": applicantTypes,
        "description": applicantDesc
      },
      "assistanceUsage": {
        "types": assUsageType,
        "description": assUsageDesc
      },
      "beneficiary": {
        "isSameAsApplicant": isSameAsApplicant,
        "types": isSameAsApplicant ? null : benTypes,
        "description": isSameAsApplicant ? null : benDesc
      },
      "documentation": {
        "description": documentation
      },
      "limitation": {
        "description": lengthTimeDesc,
        "awarded": awardedType,
        "awardedDescription": awardedType === 'other' ? awardedDesc : null
      },
      "usage": {
        "restrictions": {
          "description": usageResDesc
        }
      }
    };
    return data;
  }
}
