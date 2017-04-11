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
  assUsageInitialSelection = [];
  assUsageMultiArrayValues = [];
  assUsageSelectedOption: any;
  //Awarded Dropdown
  awardedTextarea: boolean = false;
  awardedTypeOptions = [{value: 'na', label: "None Selected"}];
  //Applicant Multiselect
  applicantTypeOptions = [];
  applicantKeyValue = [];
  applicantValueKey = [];
  appInitialSelection = [];
  applicantMultiArrayValues = [];
  appSelectedOption: any;
  //Beneficiary Multiselect
  benTypeOptions = [];
  benKeyValue = [];
  benValueKey = [];
  benInitialSelection = [];
  benMultiArrayValues = [];
  benSelectedOption: any;
  toggleBeneficiarySection: boolean = false;
  //Error Message configuration
  @ViewChild('applicantTypeWrapper') applicantTypeWrapper;
  @ViewChild('benTypeWrapper') benTypeWrapper;
  @ViewChild('assUsageTypeWrapper') assUsageTypeWrapper;

  // Checkboxes Component
  benSameAsApplicantConfig = {
    options: [{
      value: 'isSameAsApplicant',
      label: 'Beneficiary eligibility is the same as applicant eligibility',
      name: 'checkbox-isa'
    },],
  };
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
      appInitialSelection: '',
      benInitialSelection: '',
      assUsageInitialSelection: '',
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
          let applicantDesc = '';
          let isSameAsApplicant = '';
          let benDesc = '';
          let lengthTimeDesc = '';
          let awardedType = ['na'];
          let awardedDesc = '';
          let assUsageDesc = '';
          let usageResDesc = '';
          if (api.data) {
            if (api.data.eligibility) {
              if (api.data.eligibility.beneficiary) {
                isSameAsApplicant = api.data.eligibility.beneficiary.isSameAsApplicant;
                if (api.data.eligibility.beneficiary.types) {
                  for (let item of api.data.eligibility.beneficiary.types) {
                    this.benInitialSelection.push(this.benKeyValue[item]);
                    this.benMultiArrayValues.push(item);
                  }
                }
                if (api.data.eligibility.beneficiary.description) {
                  benDesc = api.data.eligibility.beneficiary.description;
                }
              }
              if(api.data.eligibility.documentation.description) {
                documentation = api.data.eligibility.documentation.description;
              }

              if (api.data.eligibility.applicant) {
                if (api.data.eligibility.applicant.types) {
                  for (let item of api.data.eligibility.applicant.types) {
                    this.appInitialSelection.push(this.applicantKeyValue[item]);
                    this.applicantMultiArrayValues.push(item);
                  }
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
                  for (let item of api.data.eligibility.assistanceUsage.types) {
                    this.assUsageInitialSelection.push(this.assUsageKeyValue[item]);
                    this.assUsageMultiArrayValues.push(item);
                  }
                }
                if(api.data.eligibility.assistanceUsage.description) {
                  assUsageDesc = api.data.eligibility.assistanceUsage.description;
                }
              }
              if (api.data.eligibility.usage) {
                if(api.data.eligibility.usage.restrictions.description) {
                  usageResDesc = api.data.eligibility.usage.restrictions.description;
                }
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
            appInitialSelection: this.appInitialSelection,
            benInitialSelection: this.benInitialSelection,
            assUsageInitialSelection: this.assUsageInitialSelection,
            applicantTypes: {
              name: this.applicantMultiArrayValues.length !== 0 ? 'Multiple Types Selected' : 'None Selected'
            },
            applicantDesc: applicantDesc,
            isSameAsApplicant: [isSameAsApplicant],
            benTypes: {
              name: this.benMultiArrayValues.length !== 0 ? 'Multiple Types Selected' : 'None Selected'
            },
            benDesc: benDesc,
            lengthTimeDesc: lengthTimeDesc,
            awardedTypes: awardedType,
            assUsageTypes: {name: this.assUsageMultiArrayValues.length !== 0 ? 'Multiple Types Selected' : 'None Selected'},
            awardedDesc: awardedDesc,
            assUsageDesc: assUsageDesc,
            usageResDesc: usageResDesc
          });
        },
        error => {
          console.error('Error Retrieving Program!!', error);
        });//end of subscribe

  }

  multiselectMsg(control: any, multiArrayValues: any) {
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
    if (event.code) {
      //if control value isn't up to date, manually set it
      if (control.value.code != event.code) {
        control.setValue(event);
        return;
      }
      this.benMultiArrayValues = this.benMultiArrayValues.filter(val => val !== control.value.code);
      this.benMultiArrayValues.push(control.value.code);
      this.benSelectedOption = this.benKeyValue[control.value.code];
      this.multiselectMsg(control, this.benMultiArrayValues);
      this.benTypeWrapper.formatErrors(this.falCriteriaForm.controls['benTypes']);
    }
  }

  benlistChange(event) {
    const control = this.falCriteriaForm.controls['benTypes'];
    let removeItem: string;
    removeItem = this.benValueKey[event];
    this.benMultiArrayValues = this.benMultiArrayValues.filter(val => val !== removeItem || 'undefined');
    this.multiselectMsg(control, this.benMultiArrayValues);
  }

  applicantTypeChange(event) {

    const control = this.falCriteriaForm.controls['applicantTypes'];
    if (event.code) {
      //if control value isn't up to date, manually set it
      if (control.value.code != event.code) {
        control.setValue(event);
        return;
      }
      this.applicantMultiArrayValues = this.applicantMultiArrayValues.filter(val => (val !== control.value.code));
      this.applicantMultiArrayValues.push(control.value.code);
      this.appSelectedOption = this.applicantKeyValue[control.value.code];
      this.multiselectMsg(control, this.applicantMultiArrayValues);
      this.applicantTypeWrapper.formatErrors(this.falCriteriaForm.controls['applicantTypes'])
    }

  }

  applicantlistChange(event) {
    const control = this.falCriteriaForm.controls['applicantTypes'];
    if (event !== 'undefined') {
      let removeItem: string;
      removeItem = this.applicantValueKey[event];
      this.applicantMultiArrayValues = this.applicantMultiArrayValues.filter(val => (val !== removeItem) || (val !== 'undefined'));
      this.multiselectMsg(control, this.applicantMultiArrayValues);
    }

  }

  assUsageTypeChange(event) {
    const control = this.falCriteriaForm.controls['assUsageTypes'];
    if (event.code) {
      //if control value isn't up to date, manually set it
      if (control.value.code != event.code) {
        control.setValue(event);
        return;
      }
      this.assUsageMultiArrayValues = this.assUsageMultiArrayValues.filter(val => val !== control.value.code);
      this.assUsageMultiArrayValues.push(control.value.code);
      this.assUsageSelectedOption = this.assUsageKeyValue[control.value.code];
      this.multiselectMsg(control, this.assUsageMultiArrayValues);
      this.assUsageTypeWrapper.formatErrors(this.falCriteriaForm.controls['assUsageTypes']);
    }
  }

  assUsagelistChange(event) {
    const control = this.falCriteriaForm.controls['assUsageTypes'];
    let removeItem: string;
    removeItem = this.assUsageValueKey[event];
    this.assUsageMultiArrayValues = this.assUsageMultiArrayValues.filter(val => val !== removeItem || 'undefined');
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
    this.assUsageMultiArrayValues = this.assUsageMultiArrayValues.filter(val => (val !== null) || (val !== '') || (val !== 'undefined'));
    let assUsageDesc = this.falCriteriaForm.value.assUsageDesc;
    let isSameAsApplicant: boolean;
    if (this.falCriteriaForm.value.isSameAsApplicant) {
      isSameAsApplicant = this.falCriteriaForm.value.isSameAsApplicant.indexOf('isSameAsApplicant') !== -1;
    }
    this.benMultiArrayValues = this.benMultiArrayValues.filter(val => (val !== null) || (val !== '') || (val !== 'undefined'));
    let benDesc = this.falCriteriaForm.value.benDesc;
    let documentation = this.falCriteriaForm.value.documentation;
    let lengthTimeDesc = this.falCriteriaForm.value.lengthTimeDesc;
    let awardedType = this.falCriteriaForm.value.awardedTypes;
    let awardedDesc = this.falCriteriaForm.value.awardedDesc;
    let usageResDesc = this.falCriteriaForm.value.usageResDesc;
    this.applicantMultiArrayValues = this.applicantMultiArrayValues.filter(val => (val !== null) || (val !== '') || (val !== 'undefined'));

    criteriaData = this.buildJson(this.applicantMultiArrayValues, applicantDesc, this.assUsageMultiArrayValues, assUsageDesc, isSameAsApplicant, this.benMultiArrayValues, benDesc,
      documentation, lengthTimeDesc, awardedType, awardedDesc, usageResDesc);

    data = {
      "eligibility": criteriaData
    }
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
      "documentation": {
        "description": documentation !== '' ? documentation : null
      },
      "limitation": {
        "description": lengthTimeDesc !== '' ? lengthTimeDesc : null,
        "awarded": awardedType !== '' ? awardedType : null,
        "awardedDescription": awardedType !== 'other' ? null : (awardedDesc !== '' ? awardedDesc : null)
      },
      "usage": {
        "restrictions": {
          "description": usageResDesc !== '' ? usageResDesc : null
        }
      }
    };
    return data;
  }
}
