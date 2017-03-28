import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ProgramService } from "api-kit";
import { FALOpSharedService } from "../../../assistance-listing-operations.service";

@Component({
  providers: [ProgramService],
  templateUrl: 'financial-info-other.page.html'
})
export class FinancialInfoFormPage2 implements OnInit {
  public otherFinancialInfoGroup: FormGroup;
  public tafsGroup: FormGroup;
  public program: any;

  private programId;
  private cookieValue;

  public accomplishmentsConfig: Object = {
    name: 'program-accomplishments',
    label: 'Program Accomplishments',
    hint: 'Showcase for public users the achievements associated with this listing. Use clear, plain language and provide compelling examples.',
    required: true,

    checkbox: {
      options: [
        { value: 'na', label: 'Not Applicable', name: 'accomplishments-checkbox-na' }
      ]
    },

    textarea: {
      disabled: false
    }
  };

  public accountIdentificationConfig: Object = {
    name: 'account-identification',
    label: 'Account Identification',
    hint: 'List the 11-digit budget account identification code(s) that funds the program. This code must match the President\'s budget.',
    codeHint: 'Agency supplied 11-digit budget account code',
    required: true
  };

  public accomplishmentsModel: Object = {
    checkbox: [],
    textarea: ''
  };

  public accountIdentificationModel: Object = {
    codeBoxes: [],
    descriptionText: '',

    accounts: [
      {
        code: '',
        description: ''
      }
    ]
  };

  constructor(private fb: FormBuilder,
              private programService: ProgramService,
              private route: ActivatedRoute,
              private router: Router,
              private sharedService: FALOpSharedService) {
    this.sharedService.setSideNavFocus();
    this.programId = this.sharedService.programId;
    this.cookieValue = this.sharedService.cookieValue;
  }

  ngOnInit() {
    this.createForm();

    if(this.programId) {
      this.loadProgramData();
    }
  }

  private loadProgramData() {
    let programAPI$ = this.programService.getProgramById(this.programId, this.cookieValue).share();

    programAPI$.subscribe(programData => {
      this.program = programData;
      this.populateForm();
    }, error => {
      // todo: handle error
      console.log('Error loading program', error);
    });
  }

  private saveProgramData() {
    // todo: understand, fix this
    let data = {};
    this.programService.saveProgram(this.programId, data, this.cookieValue)
      .subscribe(api => {

      }, error => {
        console.error('Error saving program', error);
      });
  }

  private createForm() {
    this.otherFinancialInfoGroup = this.fb.group({
      assistanceRange: '',
      accomplishments: '',
      accountIdentification: '',

      tafs: this.fb.group({
        treasuryDeptCode: ''
      })
    });

    this.tafsGroup = <FormGroup>this.otherFinancialInfoGroup.get('tafs');

    if(this.program) {
      if(this.program.data && this.program.data.financial) {
        if(this.program.data.financial.additionalInfo) {
          this.otherFinancialInfoGroup.get('assistanceRange').setValue(this.program.data.financial.additionalInfo.content || '');
        }
      }
    }

    this.otherFinancialInfoGroup.get('accomplishments').setValue(this.accomplishmentsModel);
    this.otherFinancialInfoGroup.get('accomplishments').valueChanges.subscribe(model => {
      this.accomplishmentsModel = model;
    });

    this.otherFinancialInfoGroup.get('accountIdentification').setValue(this.accountIdentificationModel);
    this.otherFinancialInfoGroup.get('accountIdentification').valueChanges.subscribe(model => {
      this.accountIdentificationModel = model;
    });
  }

  private populateForm() {
    // todo ...
  }

  public onCancelClick(event) {
    if(this.programId) {
      this.router.navigate(['/programs', this.programId, 'view']);
    } else {
      this.router.navigate(['/falworkspace']);
    }
  }

  public onPreviousClick(event){
    if(this.programId) {
      this.router.navigate(['programs', this.programId, 'edit', 'financial-information', 'obligations']);
    } else {
      this.router.navigate(['programs', 'add', 'financial-information', 'obligations']);
    }
  }

  public onSaveExitClick(event) {
    this.saveProgramData();
    // todo: redirect ...
  }

  public onSaveContinueClick(event) {
    this.saveProgramData();
    // todo: redirect ...
  }
}
