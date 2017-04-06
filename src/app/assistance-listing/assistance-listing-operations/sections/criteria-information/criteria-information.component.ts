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
  falCriteriaForm: FormGroup;
  redirectToViewPg: boolean;
  redirectToWksp: boolean;
  saveProgSub: any;
  getProgSub: any;
  assUasageDictSub: any;
  programTitle: string;
  assUsageOptions = [];
  assUsageTypeArray = [];
  toggleBeneficiarySection: boolean = false;
  awardedTextarea: boolean = false;


  applicantTypes = ['applicant1', 'applicant2', 'applicant3'];
  assiUsageTypes = ['assiatnceuasage1', 'assiatnceuasage2', 'assiatnceuasage3'];
  benTypes = ['ben1', 'ben2', 'ben3'];
  awardedTypesOptions = [];
  awardedTypesArray = [];

  @ViewChild('awardedTypeWrapper') awardedTypeWrapper;
  @ViewChild('assiUsageTypeWrapper') assiUsageTypeWrapper;


  // Checkboxes Component
  benSameAsApplicantConfig = {
    options: [
      {
        value: 'isSameAsApplicant',
        label: 'Beneficiary eligibility is the same as applicant eligibility',
        name: 'checkbox-isa'
      },
    ],
  };
  awardedTypesConfig: AutocompleteConfig = {
    keyValueConfig: {
      keyProperty: 'code',
      valueProperty: 'name'
    }
  };
  assiUsageTypesConfig: AutocompleteConfig = {
    keyValueConfig: {
      keyProperty: 'code',
      valueProperty: 'name'
    }
  };

  constructor(private fb: FormBuilder,
              private programService: ProgramService,
              private router: Router,
              private sharedService: FALOpSharedService,
              private dictionaryService: DictionaryService) {
    sharedService.setSideNavFocus();
    this.programId = sharedService.programId;
    // declare dictionaries to load
    let dictionaries = [
      'applicant_types',
      'beneficiary_types',
      'phasing_assistance',
      'assistance_usage_types'
    ];
    this.assUasageDictSub = dictionaryService.getDictionaryById(dictionaries.join(','))
      .subscribe(data => {
     /*   let applicantTypesDicData=[];
        let beneficiaryTypesDicData=[];*/
        let phasingAssDicData = [];
        //let assUsageTypesDicData= [];
        phasingAssDicData = data['phasing_assistance'];
        for (let phasingAssData of phasingAssDicData) {
            let elementId = phasingAssData.element_id;
            let value = phasingAssData.value;
            this.awardedTypesOptions.push({
              code: elementId,
              name: value
            });
            console.log(this.assUsageOptions,'this.assUsageOptions');
            this.awardedTypesArray[elementId] = value;
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

    if (this.assUasageDictSub)
     this.assUasageDictSub.unsubscribe();

  }

  createForm() {
    this.falCriteriaForm = this.fb.group({
      'documentation': '',
      // 'applicantTypes': '',
      'applicantDesc': '',
      'isSameAsApplicant': '',
      //'benTypes': '',
      'benDesc': '',
      'lengthTimeDesc': '',
      'awardedTypes': ['', Validators.required],
      'awardedDesc': '',
      //'assUsageTypes': '',
      'assUsageDesc': '',
      'usageResDesc': ''
    });
  }

  getData() {
    this.getProgSub = this.programService.getProgramById(this.sharedService.programId, this.sharedService.cookieValue)
      .subscribe(api => {
          this.programTitle = api.data.title;
          let documentation = '';
          let applicantDesc = '';
          let isSameAsApplicant = '';
          let benDesc = '';
          let lengthTimeDesc = '';
          let awardedType = '';
          let awardedDesc = '';
          let assUsageDesc = '';
          let usageResDesc = '';
          if (api.data) {
            if (api.data.eligibility) {
              if (api.data.eligibility.beneficiary) {
                if (api.data.eligibility.beneficiary.isSameAsApplicant) {
                  isSameAsApplicant = (api.data.eligibility.beneficiary.isSameAsApplicant ? api.data.eligibility.beneficiary.isSameAsApplicant : '');
                }
                benDesc = api.data.eligibility.beneficiary.description ? api.data.eligibility.beneficiary.description : '';
              }
              documentation = api.data.eligibility.documentation.description ? api.data.eligibility.documentation.description : '';
              applicantDesc = api.data.eligibility.applicant.description ? api.data.eligibility.applicant.description : '';
              lengthTimeDesc = api.data.eligibility.limitation.description ? api.data.eligibility.limitation.description : '';
              awardedType = api.data.eligibility.limitation.awarded ? api.data.eligibility.limitation.awarded : '';
              awardedDesc = api.data.eligibility.limitation.awardedDescription ? api.data.eligibility.limitation.awardedDescription : '';
              assUsageDesc = api.data.eligibility.assistanceUsage.description ? api.data.eligibility.assistanceUsage.description : '';
              usageResDesc = api.data.eligibility.usage.restrictions.description ? api.data.eligibility.usage.restrictions.description : '';
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
            applicantDesc: applicantDesc,
            isSameAsApplicant: [isSameAsApplicant],
            benDesc: benDesc,
            lengthTimeDesc: lengthTimeDesc,
            awardedTypes: {
              code: awardedType,
              name:this.awardedTypesArray[awardedType]
            },
            awardedDesc: awardedDesc,
            assUsageDesc: assUsageDesc,
            usageResDesc: usageResDesc
          });
        },
        error => {
          console.error('Error Retrieving Program!!', error);
        });//end of subscribe

  }

  awardedTypeChange(event) {
    console.log(this.falCriteriaForm.controls['awardedTypes'], '');
    this.awardedTypeWrapper.formatErrors(this.falCriteriaForm.controls['awardedTypes']);

    if(this.falCriteriaForm.value.awardedTypes==='other') {
      this.awardedTextarea = true;
    } else {
      this.awardedTextarea = false;
    }

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

  chkSameAsApp(event) {
    if (event.indexOf('isSameAsApplicant') !== -1) {
      this.toggleBeneficiarySection = false;
      this.falCriteriaForm.value.benDesc = '';
    } else {
      this.toggleBeneficiarySection = true;
    }

  }

  saveData() {
    let criteriaData = {};
    let data = {};
    let applicantTypes = this.falCriteriaForm.value.applicantTypes;
    let applicantDesc = this.falCriteriaForm.value.applicantDesc;
    let assUsageTypes = this.falCriteriaForm.value.assUsageTypes;
    let assUsageDesc = this.falCriteriaForm.value.assUsageDesc;
    let isSameAsApplicant: boolean;
    if (this.falCriteriaForm.value.isSameAsApplicant) {
      isSameAsApplicant = this.falCriteriaForm.value.isSameAsApplicant.indexOf('isSameAsApplicant') !== -1;
    }
    let benTypes = this.falCriteriaForm.value.benTypes;
    let benDesc = this.falCriteriaForm.value.benDesc;
    let documentation = this.falCriteriaForm.value.documentation;
    let lengthTimeDesc = this.falCriteriaForm.value.lengthTimeDesc;
    let awardedType = this.falCriteriaForm.value.awardedTypes.code;
    console.log();
    let awardedDesc = this.falCriteriaForm.value.awardedDesc;
    let usageResDesc = this.falCriteriaForm.value.usageResDesc;

    criteriaData = this.buildJson(applicantTypes, applicantDesc, assUsageTypes, assUsageDesc, isSameAsApplicant, benTypes, benDesc,
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

  buildJson(applicantTypes: any, applicantDesc: string, assUsageTypes: any, assUsageDesc: string,
            isSameAsApplicant: boolean, benTypes: any, benDesc: string, documentation: string,
            lengthTimeDesc: string, awardedType: string, awardedDesc: string, usageResDesc: string): any {

    let data = {
      "applicant": {
        "types": applicantTypes,
        "description": applicantDesc
      },
      "assistanceUsage": {
        "types": assUsageTypes,
        "description": assUsageDesc
      },
      "beneficiary": {
        "isSameAsApplicant": isSameAsApplicant,
        "types": isSameAsApplicant ? '' : benTypes,
        "description": isSameAsApplicant ? '' : benDesc
      },
      "documentation": {
        "description": documentation
      },
      "limitation": {
        // 102 (Length and Time Phasing)
        "description": lengthTimeDesc,
        "awarded": awardedType,
        "awardedDescription": awardedDesc
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
