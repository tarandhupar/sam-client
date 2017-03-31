import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ProgramService } from "api-kit";
import { FALOpSharedService } from "../../../assistance-listing-operations.service";
import { Observable } from "rxjs";

@Component({
  providers: [ProgramService],
  templateUrl: 'financial-info-other.page.html'
})
export class FinancialInfoFormPage2 implements OnInit {
  public otherFinancialInfoGroup: FormGroup;
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

  public tafsConfig: Object = {
    name: 'tafs',
    label: 'TAFS Codes - Unique Treasury Appropriation Fund Symbols',
    hint: 'Enter as many components as possible. Treasury Dept Code, Allocation Transfer Agency, and Treasury Account main code are required.',
    required: false
  };

  public accomplishmentsModel: Object = {};
  public accountIdentificationModel: Object = {};
  public tafsModel: Object = {};

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

  private saveProgramData(): Observable<any> {
    let data: any = (this.program && this.program.data) || {};
    data.financial = data.financial || {};
    data.financial.description = this.otherFinancialInfoGroup.get('assistanceRange').value;
    data.financial.accomplishments = this.saveAccomplishments();
    data.financial.accounts = this.saveAccountIdentifications();
    data.financial.treasury = data.financial.treasure || {};
    data.financial.treasury.tafs = this.saveTafs();

    return this.programService.saveProgram(this.programId, data, this.cookieValue);
  }

  private saveAccomplishments() {
    let accomplishments: any = {};

    if(this.accomplishmentsModel && this.accomplishmentsModel['checkbox']) {
      accomplishments.isApplicable = this.accomplishmentsModel['checkbox'].indexOf('na') < 0;
    }

    // todo: check what to put for fiscalYear
    if(accomplishments.isApplicable) {
      accomplishments.list = [
        {
          description: this.accomplishmentsModel['textarea']
        }
      ]
    }

    return accomplishments;
  }

  private saveAccountIdentifications() {
    let accounts = [];
    if(this.accountIdentificationModel) { accounts = this.accountIdentificationModel['accounts']; }
    return accounts;
  }

  private saveTafs() {
    let tafs = [];
    if(this.tafsModel) { tafs = this.tafsModel['tafs']; }
    return tafs;
  }

  private createForm() {
    this.otherFinancialInfoGroup = this.fb.group({
      assistanceRange: null,
      accomplishments: null,
      accountIdentification: null,
      tafs: null
    });

    this.otherFinancialInfoGroup.get('accomplishments').valueChanges.subscribe(model => {
      this.accomplishmentsModel = model;
    });

    this.otherFinancialInfoGroup.get('accountIdentification').valueChanges.subscribe(model => {
      this.accountIdentificationModel = model;
    });

    this.otherFinancialInfoGroup.get('tafs').valueChanges.subscribe(model => {
      this.tafsModel = model;
    });
  }

  private populateForm() {
    // todo: implement this...
  }

  public onCancelClick(event) {
    if(this.programId) {
      this.router.navigate(['programs', this.programId, 'view']);
    } else {
      this.router.navigate(['falworkspace']);
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
    this.saveProgramData().subscribe(res => {
      let id = res._body;
      if(this.programId) {
        this.router.navigate(['programs', id, 'view']);
      } else {
        this.router.navigate(['falworkspace']);
      }
    }, err => {
      console.log("Error saving program ", err);
    });
  }

  public onSaveContinueClick(event) {
    this.saveProgramData().subscribe(res => {
      let id = res._body;
      this.router.navigate(['programs', id, 'edit', 'contact-information']);
    }, err => {
      console.log("Error saving program ", err);
    });
  }
}
