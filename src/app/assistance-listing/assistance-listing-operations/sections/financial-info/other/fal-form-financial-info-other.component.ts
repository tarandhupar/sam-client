import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { FormGroup,FormControl, FormBuilder, FormArray } from "@angular/forms";
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
import { falCustomValidatorsComponent } from "app/assistance-listing/validators/assistance-listing-validators";
import * as _ from 'lodash';

@Component({
  providers: [FALFormService],
  selector: 'fal-form-financial-info-other',
  templateUrl: 'fal-form-financial-info-other.template.html'
})
export class FALFormFinancialInfoOtherComponent implements OnInit, AfterViewInit {
  @Input() viewModel: FALFormViewModel;
  @Output() public showErrors = new EventEmitter();

  public otherFinancialInfoForm: FormGroup;
  acctIdentifcationModel: any;
  tafsModel: any;

  rangeAndAverageHint:string = `<p>Provide a range that best represents the smallest and largest awards available. Provide an approximate average award size.</p>
                                <p>First, list a representative range (smallest to largest) of the amounts of financial assistance available. 
                                The figures for the smallest and the largest awards should be based on what have been awarded in the past fiscal year and the current fiscal year to date. 
                                Second, indicate an approximate average amount of the financial assistance awards (dollars) that were made in the past and current fiscal years.</p>`;
  accomplishmentConfigHint:string = `<p>Showcase for public users the achievements associated with this listing. Use clear, plain language and provide compelling examples.</p><p>Describe the program's accomplishments, outputs, results achieved and services rendered. This information must be provided for the actual fiscal year. Estimates must be provided for the current fiscal year and the budget fiscal year. Quantitative data should be used as much as possible. Data on the number and ratio of applications should be provided. Indicate how many applications were received and how many awards were made for all three relevant fiscal years. When a new program is involved, anticipated accomplishments should be stated. For example, "It is anticipated that 109 applications will be received and 25 awards will be granted in fiscal year 20__.</p>`;
  accountIdentificationConfigHint:string =`<p>List the 11-digit budget account identification code(s) that funds the program. This code must match the President's budget.</p>
                                          <p>List the 11 digit budget account identification code(s) that funds the program. The meaning of the 11-digit code is specified in OMB Circular No. 
                                          A-11, and in Appendix III of the Catalog. All program coding used will be consistent with that submitted for inclusion in the President's Budget.</p>`;
  tafsHint:string =`<p>Enter as many components as possible. Treasury Dept Code, Allocation Transfer Agency, and Treasury Account Main Code are required.</p><p>In order to provide more 
                    complete information, Treasury Appropriation Fund Symbol (TAFS) for each CFDA entry must be provided in Paragraph 124 of the CFDA program description. 
                    The TAFS is an administrative identifier that represents an act of congress that permits Federal agencies to incur obligations and make payments out of the 
                    Treasury for specified purposes. Each TAFS provides the framework for establishing a set of balanced accounts on the books of the agency concerned. 
                    The TAFS describes key components of financial information, such as the department or agency, and the specific account within the department or agency 
                    providing funding for the relevant CFDA program, as well as the year(s) the funding is available for obligation. 
                    The TAFS is a type of Treasury Account Symbol. These codes are important to help put programs in the context of other related funding information.
                     In cases where more than one program is linked to one TAFS, each program should have its own entry with the TAFS number as appropriate. 
                     In cases where one program is linked to more than one TAFS, please enter all relevant TAFS into the space provided. 
                     All TAFS codes provided must include the following components: Treasury Department Code, Allocation Transfer Agency and Treasury Account Main Code. 
                     All other components are optional; however, agencies are encouraged to include as many components as available. 
                     If questions arise regarding correct entry of the above listed components, please coordinate the population of these data fields with your agency's budget office and/or CFO office as appropriate.</p>`;

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

    this.otherFinancialInfoForm.valueChanges.subscribe(data => {
      this.updateViewModel(data);
      setTimeout(() => { // horrible hack to trigger angular change detection
        this.updateErrors();
      });
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
    setTimeout(() => {
      this.otherFinancialInfoForm.markAsPristine({onlySelf: true});
    }, 200);
  }

  private createForm() {
    this.otherFinancialInfoForm = this.fb.group({
      'assistanceRange': null,
      'accomplishments': null,
      'accountIdentification': new FormArray([]),
      'tafs': new FormArray([])
    });
  }

  private loadForm() {
    this.otherFinancialInfoForm.patchValue({
      assistanceRange: this.viewModel.financialDescription,
      accomplishments: this.loadAccomplishments(),
      accountIdentification:[],
      tafs: []
    }, {
      emitEvent: false
    });
    this.loadAccounts();
    this.loadTafs();
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
    let acErrors = this.errorService.validateAccountIdentification();
    if(acErrors && acErrors.errorList){
      let formArr = <FormArray>this.otherFinancialInfoForm.get('accountIdentification');
      for(let i in acErrors.errorList){
        let keys = Object.keys(acErrors.errorList[i]['errors']);
        let errorObj = {};
        for(let key of keys){
          if(acErrors.errorList[i]['errors'][key]){
            if(!isNaN(acErrors.errorList[i]['errors'][key]['index'])){
              let index = acErrors.errorList[i]['errors'][key]['index'];
              let message = acErrors.errorList[i]['errors'][key]['message'];
              formArr.controls[index].setErrors({"message":message});
            }
          }
        }
      }
      let keysArr = Object.keys(acErrors.errorList[0]['errors']);
      if(acErrors.errorList[0]['errors'][keysArr[0]]['listError']){
        formArr.setErrors(acErrors.errorList[0]['errors']);
      }
    }
    this.errorService.validateProgramAccomplishments();
    let tafsErrors = this.errorService.validateTafsCodes();
    if(tafsErrors){
      let formArr = <FormArray>this.otherFinancialInfoForm.get('tafs');
      for(let i in tafsErrors.errorList){
        let keys = Object.keys(tafsErrors.errorList[i]['errors']);
        let errorObj = {};
        for(let key of keys){
          if(tafsErrors.errorList[i]['errors'][key]){
            if(!isNaN(tafsErrors.errorList[i]['errors'][key]['index'])){
              let index = tafsErrors.errorList[i]['errors'][key]['index'];
              let message = tafsErrors.errorList[i]['errors'][key]['message'];
              formArr.controls[index].setErrors({"message":message});
            }
          }
        }
      }
      let keysArr = Object.keys(tafsErrors.errorList[0]['errors']);
      if(tafsErrors.errorList[0]['errors'][keysArr[0]]['listError']){
        formArr.setErrors(tafsErrors.errorList[0]['errors']);
      }
    }
    this.showErrors.emit(this.errorService.applicableErrors);

    let formArr = <FormArray>this.otherFinancialInfoForm.get('tafs');
    for(let i in formArr.controls){
      let group = <FormGroup>formArr.get(i);
      group.get('accountCode').markAsDirty();
      group.get('accountCode').updateValueAndValidity({onlySelf:true,emitEvent:true});
      group.get('departmentCode').markAsDirty();
      group.get('departmentCode').updateValueAndValidity({onlySelf:true,emitEvent:true});
      group.get('allocationTransferAgency').markAsDirty();
      group.get('allocationTransferAgency').updateValueAndValidity({onlySelf:true,emitEvent:true});
      group.get('subAccountCode').markAsDirty();
      group.get('subAccountCode').updateValueAndValidity({onlySelf:true,emitEvent:true});
      group.get('fy1').markAsDirty();
      group.get('fy1').updateValueAndValidity({onlySelf:true,emitEvent:true});
      group.get('fy2').markAsDirty();
      group.get('fy2').updateValueAndValidity({onlySelf:true,emitEvent:true});
    }
    formArr = <FormArray>this.otherFinancialInfoForm.get('accountIdentification');
    for(let i in formArr.controls){
      let group = <FormGroup>formArr.get(i);
      group.get('code').markAsDirty();
      group.get('code').updateValueAndValidity({onlySelf:true,emitEvent:true});
    }
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
    let formArr= <FormArray>this.otherFinancialInfoForm.controls['accountIdentification'];

    if (this.viewModel.accounts) {
      for(let i =0; i< this.viewModel.accounts.length;i++){
        formArr.push(new FormGroup({
          code: new FormControl(this.viewModel.accounts[i]['code'],falCustomValidatorsComponent.checkAcctIdenficationCode),
          description: new FormControl(this.viewModel.accounts[i]['description'])
        }));
      }
    }
  }

  private saveAccounts(accountsModel: any) {
    let accounts = null;

    if (accountsModel) {
      accounts = accountsModel;
    }

    return accounts;
  }

  private loadTafs() {
    let formArr= <FormArray>this.otherFinancialInfoForm.controls['tafs'];

    if (this.viewModel.tafs) {
      for(let i =0; i< this.viewModel.tafs.length;i++){
        formArr.push(new FormGroup({
          departmentCode: new FormControl(this.viewModel.tafs[i]['departmentCode'],falCustomValidatorsComponent.nDigitsValidator(2)),
          accountCode: new FormControl(this.viewModel.tafs[i]['accountCode'],falCustomValidatorsComponent.nDigitsValidator(4)),
          subAccountCode: new FormControl(this.viewModel.tafs[i]['subAccountCode'],falCustomValidatorsComponent.nDigitsValidator(3)),
          allocationTransferAgency: new FormControl(this.viewModel.tafs[i]['allocationTransferAgency'],falCustomValidatorsComponent.nDigitsValidator(2)),
          fy1: new FormControl(this.viewModel.tafs[i]['fy1'],falCustomValidatorsComponent.nDigitsValidator(4)),
          fy2: new FormControl(this.viewModel.tafs[i]['fy2'],falCustomValidatorsComponent.nDigitsValidator(4))
        }));
      }
    }
  }

  private saveTafs(tafsModel: TAFSModel) {
    let tafs = null;

    if (tafsModel) {
      tafs = tafsModel;//.tafs;
    }

    return tafs;
  }

  acctIdentifcationSubform:FormGroup = this.fb.group({
    code: new FormControl("", falCustomValidatorsComponent.checkAcctIdenficationCode),
    description:""
  });
  tafsSubform:FormGroup = this.fb.group({
    departmentCode: new FormControl("", falCustomValidatorsComponent.nDigitsValidator(2)),
    accountCode: new FormControl("", falCustomValidatorsComponent.nDigitsValidator(4)),
    subAccountCode: new FormControl("", falCustomValidatorsComponent.nDigitsValidator(3)),
    allocationTransferAgency: new FormControl("", falCustomValidatorsComponent.nDigitsValidator(2)),
    fy1: new FormControl("", falCustomValidatorsComponent.nDigitsValidator(4)),
    fy2: new FormControl("", falCustomValidatorsComponent.nDigitsValidator(4))
  });

  acctIdentifcationFormArrayChange(data){
    this.acctIdentifcationModel = data;
    let formArray= <FormArray>this.otherFinancialInfoForm.get('accountIdentification');
    while(formArray.value.length>0){
      formArray.removeAt(0);
    }
    for(var idx in data){
      let control = _.cloneDeep(this.acctIdentifcationSubform);
      control.setValue(data[idx].value);
      formArray.markAsDirty();
      formArray.push(control);
    }
  }

  acctIdentificationActionHandler(event) {
    let formArray = <FormArray>this.otherFinancialInfoForm.get('accountIdentification');
    if ((event === 'delete' && this.acctIdentifcationModel && this.acctIdentifcationModel.length === 0) || event === 'add-cancel' || event === 'editSubmit') {
      formArray.markAsDirty();
      this.updateErrors();
    }
  }
  tafsFormArrayChange(data){
    this.tafsModel = data;
    let formArray= <FormArray>this.otherFinancialInfoForm.get('tafs');
    while(formArray.value.length>0){
      formArray.removeAt(0);
    }
    for(var idx in data){
      let control = _.cloneDeep(this.tafsSubform);
      control.setValue(data[idx].value);
      formArray.markAsDirty();
      formArray.push(control);
    }
  }
  tafsActionHandler(event){
    let formArray= <FormArray>this.otherFinancialInfoForm.get('tafs');
    if((event === 'delete' && this.tafsModel && this.tafsModel.length === 0) || event === 'add-cancel' || event === 'editSubmit'){
      formArray.markAsDirty();
      this.updateErrors();
    }
  }
}
