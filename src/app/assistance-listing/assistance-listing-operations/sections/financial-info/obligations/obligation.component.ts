import {Component, OnInit, OnDestroy, NgZone} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {ProgramService} from 'api-kit';
import {FormGroup, FormArray, FormBuilder} from '@angular/forms';
import {FinacialInformation} from "./financialinfo";
import {AutocompleteConfig} from "sam-ui-elements/src/ui-kit/types";
import {DictionaryService} from "../../../../../../api-kit/dictionary/dictionary.service";
import {FALOpSharedService} from "../../../assistance-listing-operations.service";

@Component({
  moduleId: __filename,
  templateUrl: 'obligation.template.html',
  providers: [
    ProgramService,
    DictionaryService
  ]
})

export class FinancialObligationsComponent implements OnInit {
  obligationsInfo = [];
  obligationsData = [];
  data = [];
  headerLabels = [];
  headerData = ["obligations", "FY 15", "Actions"];
  cookieValue: string;
  getProgramsSub: any;
  id: string;
  tableData: any;
  estimate: string;
  financial: any
  programId: string;
  finObligationsForm: FormGroup;
  getProgSub: any;
  saveProgSub: any;
  dictionarySub: any;
  financialData: any;
  dictionaries: any;
  toggleNewObligationSection: boolean = false;
  pastYear: number;
  currentYear: number;
  budgetYear: number;
  year: any;
  obligationIndex: number = 0;
  hideAddButton: boolean = false;
  hideObligationsForm: boolean = true;
  mode: string;
  assistanceOptions = [];

  totalpFY = 0;
  totalcFY = 0;
  totalbFY = 0;
  totalvalue = {};


  // Current Fiscal year Checkbox config
  currentFiscalYearCheckboxModel: any = [''];
  currentFiscalYearCheckboxConfig = {
    options: [
      {
        value: 'false',
        label: 'This listing is funded for the current fiscal year.',
        name: 'checkboxcurrentfiscalyear'
      },
    ],
    name: 'Current Fiscal Year Funds'
  };

  // Recovery and Reinvestment Checkbox config
  recReinveCheckboxModel: any = [''];
  recReinveCheckboxConfig = {
    options: [
      {
        value: 'false',
        label: 'This is a Recovery and Reinvestment Act Obligation',
        name: 'checkbox-recReinveCheckbox'
      },
    ],
    name: 'checkbox-recReinveCheckbox'
  };
  // Past Fiscal Year - 2015
  pastFiscalYearModel: {radioOptionId: '', textBoxValue: ''}
  pastFiscalYearConfig = {
    options: [
      {value: 'pFYActual', label: 'Actual', name: 'rradio-pFY', flag: 'number'},
      {value: 'pFYNsi', label: 'Not Separatly Identifiable', name: 'radio-pFY', flag: 'text'},
      {value: 'pFYNa', label: 'Not available (Must be updated by the end of the year)', name: 'radio-pFY', flag: 'text'}
    ],
    name: 'Past Fiscal year - 2016',
    label: '',
    errorMessage: '',
    hint: ''
  };
  // Past Fiscal Year - 2016
  currentFiscalYearModel: {radioOptionId: '', textBoxValue: ''}
  currentFiscalYearConfig = {
    options: [
      {value: 'cFYEstimate', label: 'Estimate', name: 'radio-cFY', flag: 'number'},
      {value: 'cFYNsi', label: 'Not Separatly Identifiable', name: 'radio-cFY', flag: 'text'},
      {value: 'cFYNa', label: 'Not available (Must be updated by the end of the year)', name: 'radio-cFY', flag: 'text'}
    ],
    name: 'Current Fiscal year - 2016',
    label: '',
    errorMessage: '',
    hint: ''
  };
  // Budget Fiscal Year - 2017
  budgetFiscalYearModel: {radioOptionId: '', textBoxValue: ''}
  budgetFiscalYearConfig = {
    options: [
      {value: 'bFYEstimate', label: 'Estimate', name: 'radio-bFY', flag: 'number'},
      {value: 'bFYNsi', label: 'Not Separatly Identifiable', name: 'rradio-bFY', flag: 'text'},
      {value: 'bFYNa', label: 'Not available (Must be updated by the end of the year)', name: 'radio-bFY', flag: 'text'}
    ],
    name: 'Budget Fiscal year - 2016',
    label: '',
    errorMessage: '',
    hint: ''
  };
  options = [];

  textareaModel = '';
  textareaConfig = {
    label: "Additional Information",
    name: 'Additional Information',
  };

  autocompleteConfig: AutocompleteConfig = {
    keyValueConfig: {
      keyProperty: 'code',
      valueProperty: 'name'
    }
  };

  constructor(private fb: FormBuilder,
              private programService: ProgramService,
              private route: ActivatedRoute, private dictionaryService: DictionaryService, private _ngZone: NgZone,
              private sharedService: FALOpSharedService) {
    sharedService.setSideNavFocus();
    this.programId = sharedService.programId;

    this.dictionarySub = dictionaryService.getDictionaryById('assistance_type')
      .subscribe(data => {
        for (let dictionaries of data['assistance_type']) {
          for (let element of dictionaries.elements) {
            let elementId = element.element_id;
            let value = element.value;
            let code = element.code;
            this.options.push({
              code: elementId,
              name: code + ' - ' + value
            })
          }
        }
      });
  }
  ngOnInit() {
    this.createForm();
    this.fiscalyear();
    /*if (this.sharedService.programId) {*/
    this.getData();
    /* }*/
  }

  fiscalyear() {
    let year = new Date();
    this.currentYear = year.getFullYear();
    this.pastYear = (this.currentYear) - 1;
    this.budgetYear = (this.currentYear) + 1;
  }

  ngOnDestroy() {
    if (this.saveProgSub)
      this.saveProgSub.unsubscribe();

    if (this.getProgSub)
      this.getProgSub.unsubscribe();
  }


  onAddNewObliClick() {
    const control = <FormArray> this.finObligationsForm.controls['obligations'];
    this.obligationIndex = control.length;
    control.push(this.initobligations({}));

    this.hideAddButton = true;
    this.hideObligationsForm = false;
    this.mode = "Add";
  }

  createForm() {
    this.finObligationsForm = this.fb.group({
      'isFundedCurrentFY': '',
      'obligations': this.fb.array([]),
    });
  }

  initobligations(obligation: {}) {
    let recoveryAct = false;

    if (obligation['questions']) {
      for (let question of obligation['questions']) {
        if (question['questionCode'] === 'recovery') {
          recoveryAct = question['flag'] !== 'na';
          break;
        }
      }
    }

    let past = 'pFYNa';
    let pastText = '';
    let current = 'cFYNa';
    let currentText = '';
    let budget = 'bFYNa';
    let budgetText = '';
    if (obligation['values']) {
      for (let value of obligation['values']) {
        if (value['year'] === this.currentYear) {
          if (value['estimate']) {
            current = 'cFYEstimate';
            currentText = value['estimate'];
          } else if (value['flag'] === 'ena') {
            current = 'cFYNsi';
            currentText = value['explanation'];
          } else {
            currentText = value['explanation'];
          }
        } else if (value['year'] === this.budgetYear) {
          if (value['estimate']) {
            budget = 'bFYEstimate';
            budgetText = value['estimate'];
          } else if (value['flag'] === 'ena') {
            budget = 'bFYNsi';
            budgetText = value['explanation'];
          } else {
            budgetText = value['explanation'];
          }
        } else if (value['year'] === this.pastYear) {
          if (value['actual']) {
            past = 'pFYActual';
            pastText = value['actual'];
          } else if (value['flag'] === 'ena') {
            past = 'pFYNsi';
            pastText = value['explanation'];
          } else {
            pastText = value['explanation'];
          }
        }
      }
    }

    return this.fb.group({
      isRecoveryAct: recoveryAct,
      assistanceType: obligation['assistanceType'],
      pFY: {
        radioOptionId: past,
        textboxValue: pastText ? pastText : ''
      },
      cFY: {
        radioOptionId: current,
        textboxValue: currentText ? currentText : ''
      },
      bFY: {
        radioOptionId: budget,
        textboxValue: budgetText ? budgetText : ''
      },
      description: obligation['additionalInfo'] ? obligation['additionalInfo']['content'] : ''
    });
  }

  removeObligation(i: number) {
    const control = <FormArray>this.finObligationsForm.controls['obligations'];
    control.removeAt(i);

    this.obligationsInfo = [];
    let obligations = {};
    for (let obligation of  this.finObligationsForm.value.obligations) {
      this.obligationsInfo.push(obligation);
    }
    //this.obligationsInfo = this.finObligationsForm.value.obligations;
  }

  editObligation(i: number) {
    this.mode = "Edit";
    this.obligationIndex = i;
    this.hideObligationsForm = false;
    this.hideAddButton = true;
  }


  onObligationConfirmClick() {
    this.obligationsInfo = [];
    let obligations = {};
    let totalpFY = 0;
    let totalcFY = 0;
    let totalbFY = 0;

    for (let obligation of  this.finObligationsForm.value.obligations) {
      if ((obligation.pFY.radioOptionId === "pFYActual") || (obligation.cFY.radioOptionId === "cFYEstimate") || (obligation.bFY.radioOptionId === "bFYEstimate")) {
        totalpFY = totalpFY + parseInt(obligation.pFY.textboxValue);
        totalcFY = totalcFY + parseInt(obligation.cFY.textboxValue);
        totalbFY = totalbFY + parseInt(obligation.bFY.textboxValue);
      }
      console.log('assisyance name', obligation.assistanceType);
      obligations = {
        isRecoveryAct: obligation.isRecoveryAct,
        assistanceType: obligation.assistanceType,
        description: obligation.description,

      };
      this.obligationsInfo.push(obligation);
    }
    this.totalvalue = {
      totalpFY: totalpFY,
      totalcFY: totalcFY,
      totalbFY: totalbFY
    };

    this.hideAddButton = false;
    this.hideObligationsForm = true;
  }

  onObligationCancelClick(i) {
    const control = <FormArray> this.finObligationsForm.controls['obligations'];
    control.at(i).setValue(this.obligationsInfo[i]);

    if (this.mode == 'Add') {
      this.removeObligation(i);
    }
    this.hideAddButton = false;
    this.hideObligationsForm = true;
  }


  chkCurrFiscalYearChange(event) {
    this.currentFiscalYearCheckboxConfig.options[0].value = 'true';
  }

  getData() {
    this.getProgSub = this.programService.getProgramById('00150cf14b72addbee78cb340b3e5d40', this.sharedService.cookieValue)
      .subscribe(api => {
        let isFundedCurrentFY = '';
        console.log("Api", api);
        if (api.data) {
          if (api.data.financial.isFundedCurrentFY) {
            isFundedCurrentFY = (api.data.financial.isFundedCurrentFY ? api.data.financial.isFundedCurrentFY : '');
          }
        }

        if (api.data.financial.obligations) {
          let index = 0;
          const control = <FormArray> this.finObligationsForm.controls['obligations'];
          for (let obligation of api.data.financial.obligations) {
            control.push(this.initobligations(obligation));
            control.at(index).patchValue(obligation);
            index = index + 1;
          }
        }

        this.finObligationsForm.patchValue({
          isFundedCurrentFY: isFundedCurrentFY
        });
        this.obligationsInfo = this.finObligationsForm.value.obligations;

        let totalpFY = 0;
        let totalcFY = 0;
        let totalbFY = 0;
        for (let obligation of  this.finObligationsForm.value.obligations) {
          if ((obligation.pFY.radioOptionId === "pFYActual") || (obligation.cFY.radioOptionId === "cFYEstimate") || (obligation.bFY.radioOptionId === "bFYEstimate")) {
            totalpFY = totalpFY + parseInt(obligation.pFY.textboxValue);
            totalcFY = totalcFY + parseInt(obligation.cFY.textboxValue);
            totalbFY = totalbFY + parseInt(obligation.bFY.textboxValue);
          }
        }
        this.totalvalue = {
          totalpFY: totalpFY,
          totalcFY: totalcFY,
          totalbFY: totalbFY
        };
        console.log(this.obligationsInfo,'init obligations info');
      }, error => {
        console.error('Error Retrieving Program!!', error);
      });
  }


  saveData() {
    /*    let data = {};
     for (let obligation of this.finObligationsForm.value) {
     data = this.templateJson(obligation.isFundedCurrentFY, obligation.obligations);
     }*/

  }

  /*  templateJson(isFundedCurrentFY: string, obligations:any): any {
   let data = {
   isFundedCurrentFY: isFundedCurrentFY,
   obligations: this.obligationJson(obligations)
   }
   return data;
   }

   buildValuesJson(year: number, actual: string, estimate: string, flag: string, explanation: string): any {
   let data = {
   "year": year,
   "actual": actual,
   "estimate": estimate,
   "flag": flag,
   "explanation": explanation
   };

   return data;
   }

   obligationJson(obligationsData: any): any {
   let values= [];
   for(let obligation of obligationsData) {

   values.push(obligation.pFY, obligation.cFY, obligation.bFY);
   }
   console.log(values,'test restse.............................');
   }*/
}



