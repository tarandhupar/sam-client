import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from "@angular/forms";
import { FALFormService } from "../../../fal-form.service";
import { FALFormViewModel } from "../../../fal-form.model";
import {
  FiscalYearTableConfig,
  FiscalYearTableModel
} from "../../../../components/fiscal-year-table/fiscal-year-table.component";
import {
  AccountIdentificationConfig,
  AccountIdentificationModel
} from "../../../../components/account-identification/account-identification.component";
import { TAFSConfig, TAFSModel } from "../../../../components/tafs/tafs.component";
import { FALFormErrorService } from '../../../fal-form-error.service';
import { FALFieldNames, FALSectionNames } from '../../../fal-form.constants';

@Component({
  providers: [FALFormService],
  selector: 'fal-form-financial-info-other',
  templateUrl: 'fal-form-financial-info-other.template.html'
})
export class FALFormFinancialInfoOtherComponent implements OnInit, AfterViewInit {
  @Input() viewModel: FALFormViewModel;
  @Output() public showErrors = new EventEmitter();

  public otherFinancialInfoForm: FormGroup;

  rangeAndAverageHint:string = `<p>Provide a range that best represents the smallest and largest awards available. Provide an approximate average award size.</p>
                                <p>First, list a representative range (smallest to largest) of the amounts of financial assistance available. 
                                The figures for the smallest and the largest awards should be based on what have been awarded in the past fiscal year and the current fiscal year to date. 
                                Second, indicate an approximate average amount of the financial assistance awards (dollars) that were made in the past and current fiscal years.</p>`;
  accomplishmentConfigHint:string = `<p>Showcase for public users the achievements associated with this listing. Use clear, plain language and provide compelling examples.</p><p>Describe the program's accomplishments, outputs, results achieved and services rendered. This information must be provided for the actual fiscal year. Estimates must be provided for the current fiscal year and the budget fiscal year. Quantitative data should be used as much as possible. Data on the number and ratio of applications should be provided. Indicate how many applications were received and how many awards were made for all three relevant fiscal years. When a new program is involved, anticipated accomplishments should be stated. For example, "It is anticipated that 109 applications will be received and 25 awards will be granted in fiscal year 20__.</p>`;
  accountIdentificationConfigHint:string =`<p>List the 11-digit budget account identification code(s) that funds the program. This code must match the President's budget.</p>
                                          <p>List the 11 digit budget account identification code(s) that funds the program. The meaning of the 11-digit code is specified in OMB Circular No. 
                                          A-11, and in Appendix III of the Catalog. All program coding used will be consistent with that submitted for inclusion in the President's Budget.</p>`;
  public accomplishmentsConfig: FiscalYearTableConfig = {
    name: FALFieldNames.PROGRAM_ACCOMPLISHMENTS,
    label: 'Program Accomplishments',
    hint: this.accomplishmentConfigHint,
    required: true,
    itemName: 'Accomplishment',
    errorMessage: 'You must select Not Applicable or add at least one Program Accomplishment.',

    entry: {
      hint: 'Please describe accomplishment:'
    },

    textarea: {
      required: false
    },

    select: {
      required: false
    },

    deleteModal: {
      title: 'Delete Program Accomplishments',
      description: '' // todo: complete description w/ reference to element
    }
  };

  public accountIdentificationConfig: AccountIdentificationConfig = {
    name: FALFieldNames.ACCOUNT_IDENTIFICATION,
    label: 'Account Identification',
    hint: this.accountIdentificationConfigHint,
    codeHint: 'Agency supplied 11-digit budget account code',
    required: true,

    deleteModal: {
      title: 'Delete Account Identification',
      description: '' // todo: complete description w/ reference to element
    }
  };

  public tafsConfig: TAFSConfig = {
    name: 'tafs',
    label: 'TAFS Codes - Unique Treasury Appropriation Fund Symbols',
    hint: '',
    required: true,

    deleteModal: {
      title: 'Delete TAFs',
      description: '' // todo: complete description w/ reference to element
    }
  };

  constructor(private fb: FormBuilder, private errorService: FALFormErrorService) {
  }

  ngOnInit() {
    this.createForm();

    if (!this.viewModel.isNew) {
      this.loadForm();
    }

    setTimeout(() => { // horrible hack to trigger angular change detection
      this.updateErrors();
    });
  }

  ngAfterViewInit() {
    setTimeout(() => { // horrible hack to trigger angular change detection
      if (this.viewModel.getSectionStatus(FALSectionNames.OTHER_FINANCIAL_INFO) === 'updated') {
        this.otherFinancialInfoForm.get('assistanceRange').markAsDirty();
        this.otherFinancialInfoForm.get('assistanceRange').updateValueAndValidity();
        this.otherFinancialInfoForm.get('accomplishments').markAsDirty();
        this.otherFinancialInfoForm.get('accomplishments').updateValueAndValidity();
        this.otherFinancialInfoForm.get('accountIdentification').markAsDirty();
        this.otherFinancialInfoForm.get('accountIdentification').updateValueAndValidity();
        this.otherFinancialInfoForm.get('tafs').markAsDirty();
        this.otherFinancialInfoForm.get('tafs').updateValueAndValidity();
      }
    });
  }

  private createForm() {
    this.otherFinancialInfoForm = this.fb.group({
      'assistanceRange': null,
      'accomplishments': null,
      'accountIdentification': null,
      'tafs': null
    });

    this.otherFinancialInfoForm.valueChanges.subscribe(data => {
      this.updateViewModel(data);
      setTimeout(() => { // horrible hack to trigger angular change detection
        this.updateErrors();
      });
    });
  }

  private loadForm() {
    this.otherFinancialInfoForm.patchValue({
      assistanceRange: this.viewModel.financialDescription,
      accomplishments: this.loadAccomplishments(),
      accountIdentification: this.loadAccounts(),
      tafs: this.loadTafs()
    }, {
      emitEvent: false
    });

    setTimeout(() => { // horrible hack to trigger angular change detection
      this.updateErrors();
    });
  }

  private updateViewModel(data: Object) {
    this.viewModel.financialDescription = data['assistanceRange'];
    this.viewModel.accomplishments = this.saveAccomplishments(data['accomplishments']);
    this.viewModel.accounts = this.saveAccounts(data['accountIdentification']);
    this.viewModel.tafs = this.saveTafs(data['tafs']);
  }

  private updateErrors() {
    this.errorService.viewModel = this.viewModel;
    this.errorService.validateAccountIdentification();
    this.errorService.validateProgramAccomplishments();
    this.errorService.validateTafsCodes();
    this.showErrors.emit(this.errorService.applicableErrors);
  }

  private loadAccomplishments() {
    let model: any = {
      entries: []
    };

    if (this.viewModel.accomplishments) {
      model.isApplicable = this.viewModel.accomplishments.isApplicable;
    }

    if (this.viewModel.accomplishments.list && this.viewModel.accomplishments.list.length > 0) {
      for (let accomplishment of this.viewModel.accomplishments.list) {
        model.entries.push({
          year: accomplishment.fiscalYear,
          description: accomplishment.description
        });
      }
    }

    return model;
  }

  private saveAccomplishments(accomplishmentsModel: FiscalYearTableModel) {
    let accomplishments: any = {};

    if (accomplishmentsModel) {
      accomplishments.isApplicable = accomplishmentsModel.isApplicable;
    }

    if (accomplishmentsModel && accomplishmentsModel.entries) {
      accomplishments.list = [];

      for (let entry of accomplishmentsModel.entries) {
        accomplishments.list.push({
          fiscalYear: entry.year,
          description: entry.description
        });
      }
    }

    return accomplishments;
  }

  private loadAccounts() {
    let model: any = {};

    if (this.viewModel.accounts) {
      model.accounts = this.viewModel.accounts
    }

    return model;
  }

  private saveAccounts(accountsModel: AccountIdentificationModel) {
    let accounts = null;

    if (accountsModel) {
      accounts = accountsModel.accounts;
    }

    return accounts;
  }

  private loadTafs() {
    let model: any = {};

    if (this.viewModel.tafs) {
      model.tafs = this.viewModel.tafs;
    }

    return model;
  }

  private saveTafs(tafsModel: TAFSModel) {
    let tafs = null;

    if (tafsModel) {
      tafs = tafsModel.tafs;
    }

    return tafs;
  }
}
