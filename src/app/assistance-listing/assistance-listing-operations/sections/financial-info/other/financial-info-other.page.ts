import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ProgramService } from "api-kit";

import * as Cookies from 'js-cookie';

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
              private router: Router) { }

  ngOnInit() {
    let routeParams$ = this.route.params.share();

    routeParams$.subscribe(params => {
      this.programId = params['id'];
      this.cookieValue = Cookies.get('iPlanetDirectoryPro');

      // todo: refactor this
      this.programId != null ? this.loadProgramData() : this.createForm();
    });
  }

  private loadProgramData() {
    let programAPI$ = this.programService.getProgramById(this.programId, this.cookieValue).share();

    programAPI$.subscribe(programData => {
      this.program = programData;
      this.createForm();
    }, err => {
      // todo: handle error
      console.log('Error loading program', err);
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
}
