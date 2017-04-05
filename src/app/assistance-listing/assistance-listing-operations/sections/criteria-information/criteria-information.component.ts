import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormBuilder, FormArray, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UUID} from 'angular2-uuid';
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
  applicantTypes = ['applicant1', 'applicant2', 'applicant3'];
  assiUsageTypes = ['assiatnceuasage1', 'assiatnceuasage2', 'assiatnceuasage3'];
  benTypes = ['ben1', 'ben2', 'ben3'];
  awardedTypesoptions = ['award1', 'award2', 'award3'];

  // Checkboxes Component
  benSameAsApplicantConfig = {
    options: [
      {
        value: 'isSameAsApplicant',
        label: 'Beneficiary eligibility is the same as applicant eligibility',
        name: 'checkbox-sa'
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
              private dictService: DictionaryService) {
    sharedService.setSideNavFocus();
    this.programId = sharedService.programId;
  }

  ngOnInit() {
    this.createForm();
    /* if (this.sharedService.programId) {
     this.getData();
     }*/
  }

  ngOnDestroy() {
    /*    if (this.saveProgSub)
     this.saveProgSub.unsubscribe();

     if (this.getProgSub)
     this.getProgSub.unsubscribe();

     if (this.dictSubState)
     this.dictSubState.unsubscribe();*/

  }

  createForm() {
    this.falCriteriaForm = this.fb.group({
      'documentation': '',
      'applicantTypes': '',
      'applicantDesc': '',
      'benSameAsApplicant': '',
      'benTypes': '',
      'benDescription': '',
      'lengthTimeDesc': '',
      'awardedTypes': '',
      'awardedDesc':'',
      'assiUsageTypes': '',
      'assiUsageDesc': '',
      'usageResDesc':''
    });
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
    console.log('save data', this.falCriteriaForm.value);
  }
}
