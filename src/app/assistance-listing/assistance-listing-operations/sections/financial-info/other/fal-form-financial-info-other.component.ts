import { Component, OnInit, Input } from "@angular/core";
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
import {TAFSConfig, TAFSModel} from "../../../../components/tafs/tafs.component";

@Component({
  providers: [FALFormService],
  selector: 'fal-form-financial-info-other',
  templateUrl: 'fal-form-financial-info-other.template.html'
})
export class FALFormFinancialInfoOtherComponent implements OnInit {
  @Input() viewModel: FALFormViewModel;
  public otherFinancialInfoForm: FormGroup;

  public accomplishmentsConfig: FiscalYearTableConfig = {
    name: 'program-accomplishments',
    label: 'Program Accomplishments',
    hint: 'Showcase for public users the achievements associated with this listing. Use clear, plain language and provide compelling examples.',
    required: true,
    itemName: 'Accomplishments',

    entry: {
      hint: 'Please describe accomplishment:'
    },

    deleteModal: {
      title: 'Delete Program Accomplishments',
      description: 'Please confirm that you want to delete program accomplishments' // todo: complete description w/ reference to element
    }
  };

  public accountIdentificationConfig: AccountIdentificationConfig = {
    name: 'account-identification',
    label: 'Account Identification',
    hint: 'List the 11-digit budget account identification code(s) that funds the program. This code must match the President\'s budget.',
    codeHint: 'Agency supplied 11-digit budget account code',
    required: true,

    deleteModal: {
      title: 'Delete Account Identification',
      description: 'Please confirm that you want to delete.' // todo: complete description w/ reference to element
    }
  };

  public tafsConfig: TAFSConfig = {
    name: 'tafs',
    label: 'TAFS Codes - Unique Treasury Appropriation Fund Symbols',
    hint: 'Enter as many components as possible. Treasury Dept Code, Allocation Transfer Agency, and Treasury Account main code are required.',
    required: true,

    deleteModal: {
      title: 'Delete TAFs',
      description: 'Please confirm that you want to delete TAF.' // todo: complete description w/ reference to element
    }
  };

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.createForm();

    if (!this.viewModel.isNew) {
      this.loadForm();
    }
  }

  private createForm() {
    this.otherFinancialInfoForm = this.fb.group({
      'assistanceRange': null,
      'accomplishments': null,
      'accountIdentification': null,
      'tafs': null
    });

    this.otherFinancialInfoForm.valueChanges.subscribe(data => this.updateViewModel(data));
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
  }

  private updateViewModel(data: Object) {
    this.viewModel.financialDescription = data['assistanceRange'];
    this.viewModel.accomplishments = this.saveAccomplishments(data['accomplishments']);
    this.viewModel.accounts = this.saveAccounts(data['accountIdentification']);
    this.viewModel.tafs = this.saveTafs(data['tafs']);
  }

  private loadAccomplishments() {
    let model: any = {
      entries: []
    };

    if(this.viewModel.accomplishments) {
      model.isApplicable = this.viewModel.accomplishments.isApplicable;
    }

    if(this.viewModel.accomplishments.list && this.viewModel.accomplishments.list.length > 0) {
      for(let accomplishment of this.viewModel.accomplishments.list) {
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

    if(accomplishmentsModel) {
      accomplishments.isApplicable = accomplishmentsModel.isApplicable;
    }

    if(accomplishmentsModel && accomplishmentsModel.entries) {
      accomplishments.list = [];

      for(let entry of accomplishmentsModel.entries) {
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

    if(this.viewModel.accounts) {
      model.accounts = this.viewModel.accounts
    }

    return model;
  }

  private saveAccounts(accountsModel: AccountIdentificationModel) {
    let accounts = null;

    if(accountsModel) {
      accounts = accountsModel.accounts;
    }

    return accounts;
  }

  private loadTafs() {
    let model: any = {};

    if(this.viewModel.tafs) {
      model.tafs = this.viewModel.tafs;
    }

    return model;
  }

  private saveTafs(tafsModel: TAFSModel) {
    let tafs = null;

    if(tafsModel) {
      tafs = tafsModel.tafs;
    }

    return tafs;
  }
}
