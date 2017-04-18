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
export class FinancialInfoPage2 implements OnInit {
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
      showWhenCheckbox: 'unchecked'
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
    required: true
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

  private populateForm() {
    if(this.program.data && this.program.data.financial) {
      if(this.program.data.financial.description) {
        this.otherFinancialInfoGroup.get('assistanceRange').setValue(this.program.data.financial.description);
      }
      this.otherFinancialInfoGroup.get('accomplishments').setValue(this.loadAccomplishments());
      this.otherFinancialInfoGroup.get('accountIdentification').setValue(this.loadAccounts());
      if(this.program.data.financial.treasury) {
        this.otherFinancialInfoGroup.get('tafs').setValue(this.loadTafs());
      }
    }
  }

  private saveProgramData(): Observable<any> {
    let data: any = (this.program && this.program.data) || {};
    data.financial = data.financial || {};
    data.financial.description = this.otherFinancialInfoGroup.get('assistanceRange').value;
    data.financial.accomplishments = this.saveAccomplishments();
    data.financial.accounts = this.saveAccounts();
    data.financial.treasury = data.financial.treasury || {};
    data.financial.treasury.tafs = this.saveTafs();

    return this.programService.saveProgram(this.programId, data, this.cookieValue);
  }

  private saveAccomplishments() {
    let accomplishments: any = {};

    if(this.accomplishmentsModel && this.accomplishmentsModel['checkbox']) {
      accomplishments.isApplicable = this.accomplishmentsModel['checkbox'].indexOf('na') < 0;
    }

    if(this.accomplishmentsModel && this.accomplishmentsModel['textarea']) {
      accomplishments.list = [
        {
          description: this.accomplishmentsModel['textarea'][0]
        }
      ]
    }

    return accomplishments;
  }

  private loadAccomplishments() {
    let model: any = {
      checkbox: [],
      textarea: []
    };

    if(this.program.data.financial.accomplishments) {
      if(!this.program.data.financial.accomplishments.isApplicable) {
        model.checkbox.push('na');
      }

      if(this.program.data.financial.accomplishments.list
        && this.program.data.financial.accomplishments.list[0]) {
        model.textarea.push(this.program.data.financial.accomplishments.list[0].description);
      }
    }

    return model;
  }

  private saveAccounts() {
    let accounts = [];
    if(this.accountIdentificationModel) { accounts = this.accountIdentificationModel['accounts']; }
    return accounts;
  }

  private loadAccounts() {
    let model = {
      codeBoxes: [],
      descriptionText: [],

      accounts: []
    };

    if(this.program.data.financial.accounts) { model.accounts = this.program.data.financial.accounts }
    return model;
  }

  private saveTafs() {
    let tafs = [];
    if(this.tafsModel) { tafs = this.tafsModel['tafs']; }
    return tafs;
  }

  private loadTafs() {
    let model = {
      departmentCode: '',
      accountCode: '',
      subAccountCode: '',
      allocationTransferAgency: '',
      fy1: '',
      fy2: '',
      tafs: []
    };

    if(this.program.data.financial.treasury.tafs) {
      model.tafs = this.program.data.financial.treasury.tafs;
    }

    return model;
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
      this.router.navigate(['falworkspace']);
    }, err => {
      console.log("Error saving program ", err);
    });
  }

  public onSaveContinueClick(event) {
    this.saveProgramData().subscribe(res => {
      let id = res._body;
      this.router.navigate(['programs', id, 'edit', 'criteria-information']);
    }, err => {
      console.log("Error saving program ", err);
    });
  }
}
