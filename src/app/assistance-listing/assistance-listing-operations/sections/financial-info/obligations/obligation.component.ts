import {Component, OnInit, OnDestroy, NgZone} from '@angular/core';
import {Router, ActivatedRoute, NavigationExtras} from '@angular/router';
import {ProgramService} from 'api-kit';
import * as Cookies from 'js-cookie';
import {Validators, FormGroup, FormArray, FormBuilder, ControlValueAccessor} from '@angular/forms';
import {FinacialInformation} from "./financialinfo";
import {ReplaySubject} from "rxjs";

import {AutocompleteConfig} from "sam-ui-elements/src/ui-kit/types";
import {DictionaryService} from "../../../../../../api-kit/dictionary/dictionary.service";


/*import {Control} from "@angular/common";*/

@Component({
  moduleId: __filename,
  templateUrl: 'obligation.template.html',
  providers: [
    ProgramService,
    DictionaryService
  ]
})

export class FinancialObligationsComponent implements OnInit {
  pFYmodel: any;
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
      {value: 'pFYActual', label: 'Actual', name: 'rradio-pFY', flag:'number'},
      {value: 'pFYNsi', label: 'Not Separatly Identifiable', name: 'radio-pFY', flag:'text'},
      {value: 'pFYNa', label: 'Not available (Must be updated by the end of the year)', name: 'radio-pFY', flag:'text'}
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
      {value: 'cFYEstimate', label: 'Estimate', name: 'radio-cFY', flag:'number'},
      {value: 'cFYNsi', label: 'Not Separatly Identifiable', name: 'radio-cFY', flag:'text'},
      {value: 'cFYNa', label: 'Not available (Must be updated by the end of the year)', name: 'radio-cFY',flag:'text'}
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
      {value: 'bFYEstimate', label: 'Estimate', name: 'radio-bFY',flag:'number'},
      {value: 'bFYNsi', label: 'Not Separatly Identifiable', name: 'rradio-bFY', flag:'text'},
      {value: 'bFYNa', label: 'Not available (Must be updated by the end of the year)', name: 'radio-bFY', flag:'text'}
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
              private route: ActivatedRoute, private dictionaryService: DictionaryService, private _ngZone: NgZone) {

  }


  ngOnInit() {
    this.programId = this.route.snapshot.parent.params['id'];
    this.createForm();
    this.cookieValue = Cookies.get('iPlanetDirectoryPro') !== 'undefined' ? Cookies.get('iPlanetDirectoryPro') : '';
    /*this.getProgramsSub = this.programService.getProgramById('00150cf14b72addbee78cb340b3e5d40', this.cookieValue)
     .subscribe(api => {
     this.obligations = api.data.financial.obligations;
     });*/
    this.obligationsData = [
      {
        "values": [
          {
            "year": 2017,
            "estimate": 40500000
          },
          {
            "year": 2015,
            "actual": 38109000,
            "estimate": 38109000
          },
          {
            "year": 2016,
            "estimate": 38109000
          },
          {
            "year": 2014,
            "actual": 123,
            "estimate": 123
          },
          {
            "year": 2013,
            "actual": 123,
            "estimate": 123
          }
        ],
        "questions": [
          {
            "flag": "na",
            "questionCode": "recovery"
          },
          {
            "flag": "na",
            "questionCode": "salary_or_expense"
          }
        ],
        "obligationId": "1",
        "additionalInfo": {
          "content": "Program operates on a program year (PY) beginning on July 1 and ending on June 30. PY 2015 (Performance period July 1, 2015 - June 30, 2016); PY 2016 (Performance period July 1, 2016 - June 30, 2017); PY 2017 (Performance period July 1, 2017 - June 30, 2018)."
        },
        "assistanceType": "asis-1"
      },
      {
        "values": [
          {
            "year": 2017,
            "estimate": 40500000
          },
          {
            "year": 2015,
            "actual": 38109000,
            "estimate": 38109000
          },
          {
            "year": 2016,
            "estimate": 38109000
          },
          {
            "year": 2014,
            "actual": 353,
            "estimate": 456
          },
          {
            "year": 2013,
            "actual": 123,
            "estimate": 123
          }
        ],
        "questions": [
          {
            "flag": "na",
            "questionCode": "recovery"
          },
          {
            "flag": "na",
            "questionCode": "salary_or_expense"
          }
        ],
        "obligationId": "2",
        "additionalInfo": {
          "content": "Program operates on a program year (PY) beginning on July 1 and ending on June 30. PY 2015 (Performance period July 1, 2015 - June 30, 2016); PY 2016 (Performance period July 1, 2016 - June 30, 2017); PY 2017 (Performance period July 1, 2017 - June 30, 2018)."
        },
        "assistanceType": "assi-2"
      }
    ];
    this.fiscalyear();
    //this.massageData(this.obligationsData);

    this.loadDictionaries();

    /* if (this.programId) {*/
    this.getData();
    /*  }*/
  }

  /**
   * @return Observable of Dictionary API
   */
  private loadDictionaries() {

    // declare dictionaries to load
    let dictionaries = 'assistance_type';

    let dictionaryServiceSubject = new ReplaySubject(1); // broadcasts the dictionary data to multiple subscribers
    // construct a stream of dictionary data
    this.dictionarySub = this.dictionaryService.getDictionaryById(dictionaries).subscribe(dictionaryServiceSubject);

    var temp: any = {};
    dictionaryServiceSubject.subscribe(res => {
      // run whenever dictionary data is updated
      for (let key in res) {
        temp[key] = res[key]; // store the dictionary
      }
      for (let dictionaries of temp.assistance_type) {
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

    return dictionaryServiceSubject;
  }

  ngOnDestroy() {
    if (this.saveProgSub)
      this.saveProgSub.unsubscribe();

    if (this.getProgSub)
      this.getProgSub.unsubscribe();
  }


  onAddNewObliClick() {
    this.addObligation();
  }

  onObligationCancelClick() {

    if (this.mode == 'Add') {
      const control = <FormArray> this.finObligationsForm.controls['obligations'];
      this.removeObligation(control.length - 1);
    }

    this.hideAddButton = false;
    this.hideObligationsForm = true;
  }


  onObligationConfirmClick() {
    this.obligationsInfo = [];
    let obligations = {};
    let totalpFY = 0;
    let totalcFY = 0;
    let totalbFY = 0;

    for (let obligation of  this.finObligationsForm.value.obligations) {
      let values = [];
      values.push(obligation.pFY, obligation.cFY, obligation.bFY);
      if ((obligation.pFY.radioOptionId === "pFYActual") || (obligation.cFY.radioOptionId === "cFYEstimate") ||(obligation.bFY.radioOptionId === "bFYEstimate")) {
        totalpFY = totalpFY + parseInt(obligation.pFY.textboxValue);
        totalcFY = totalcFY + parseInt(obligation.cFY.textboxValue);
        totalbFY = totalbFY + parseInt(obligation.bFY.textboxValue);
      }

      obligations = {
        isRecoveryAct: obligation.isRecoveryAct,
        assistanceType: obligation.assistanceType,
        description: obligation.description,
        values: values
      };
      this.obligationsInfo.push(obligations);
      values = null;
    }
    this.totalvalue = {
      totalpFY: totalpFY,
      totalcFY: totalcFY,
      totalbFY: totalbFY
    };

    this.hideAddButton = false;
    this.hideObligationsForm = true;
  }


  fiscalyear() {
    let year = new Date();
    this.currentYear = year.getFullYear();
    this.pastYear = (this.currentYear) - 1;
    this.budgetYear = (this.currentYear) + 1;
  }



  chkCurrFiscalYearChange(event) {
    this.currentFiscalYearCheckboxConfig.options[0].value = 'true';
  }

  getData() {

    this.getProgSub = this.programService.getProgramById(this.programId, this.cookieValue)
      .subscribe(api => {
        let title = api.data.title;

        this.finObligationsForm.patchValue({
          title: title
        });

      });//end of subscribe

  }

  addObligation() {
    const control = <FormArray> this.finObligationsForm.controls['obligations'];
    this.obligationIndex = control.length;
    control.push(this.initobligations());

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

  initobligations() {
    return this.fb.group({
      isRecoveryAct: [''],
      assistanceType: [''],
      pFY: '',
      cFY: '',
      bFY: '',
      description: ''
    });
  }

  removeObligation(i: number) {
    const control = <FormArray>this.finObligationsForm.controls['obligations'];
    control.removeAt(i);

    this.obligationsInfo = [];
    let obligations = {};
    for (let obligation of  this.finObligationsForm.value.obligations) {
      let values = [];
      values.push(obligation.pFY, obligation.cFY, obligation.bFY);
      obligations = {
        isRecoveryAct: obligation.isRecoveryAct,
        assistanceType: obligation.assistanceType,
        description: obligation.description,
        values: values
      };
      this.obligationsInfo.push(obligations);
      values = null;
    }
    //this.obligationsInfo = this.finObligationsForm.value.obligations;
  }

  editObligation(i: number) {
    let dataRow = this.obligationsInfo[i];

    let pFY = this.finObligationsForm.controls['obligations']['controls'][0].controls.pFY;
    console.log('......................', pFY);
    if ((dataRow.values[0].radioOptionId === 'pFYActual') || (dataRow.values[0].radioOptionId === 'pFYNsi') || (dataRow.values[0].radioOptionId === 'pFYNa'))
      pFY.setValue(dataRow.values[0]);
    /*this._ngZone.run(()=>{});*/
    this.mode = "Edit";
    this.obligationIndex = i;
    this.hideObligationsForm = false;
  }

  saveData() {
    console.log(this.finObligationsForm.value.obligations, 'save data');
    let data = {};
    let isFundedCurrentFY;
    let obligationsData = [];
    for (let obligation of this.finObligationsForm.value.obligations) {
      let valuesData = [];
      let values = {};

      isFundedCurrentFY = obligation.isFundedCurrentFY;
      let isRecoveryAct = obligation.isRecoveryAct;
      let description = obligation.description;
      let assistanceType = obligation.assistanceType;
      let value: any;
      if (obligation.pFY) {
        if (obligation.pFY.radioOptionId === 'pFYActual') {
          value = this.buildJson(this.pastYear, obligation.pFY.textboxValue, '', '', '')
        } else if (obligation.pFY.radioOptionId === 'pFYNsi') {
          value = this.buildJson(this.pastYear, '', '', 'nsi', obligation.pFY.textboxValue);
        } else if (obligation.pFY.radioOptionId === 'pFYNa') {
          value = this.buildJson(this.pastYear, '', '', 'na', obligation.pFY.textboxValue);
        }
      }
      valuesData.push(value);
      if (obligation.cFY) {
        if (obligation.cFY.radioOptionId === 'cFYEstimate') {
          value = this.buildJson(this.currentYear, '', obligation.cFY.textboxValue, '', '')
        } else if (obligation.cFY.radioOptionId === 'cFYNsi') {
          value = this.buildJson(this.currentYear, '', '', 'nsi', obligation.cFY.textboxValue)
        } else if (obligation.cFY.radioOptionId === 'cFYNa') {
          value = this.buildJson(this.currentYear, '', '', 'na', obligation.cFY.textboxValue);
        }
      }
      valuesData.push(value);
      if (obligation.bFY) {
        if (obligation.bFY.radioOptionId === 'bFYEstimate') {
          value = this.buildJson(this.budgetYear, '', obligation.bFY.textboxValue, '', '')
        } else if (obligation.bFY.radioOptionId === 'bFYNsi') {
          value = this.buildJson(this.budgetYear, '', '', 'nsi', obligation.bFY.textboxValue);
        } else if (obligation.bFY.radioOptionId === 'bFYNa') {
          value = this.buildJson(this.budgetYear, '', '', 'na', obligation.bFY.textboxValue);
        }
      }
      valuesData.push(value);


      obligationsData.push(
        {
          "isRecoveryAct": isRecoveryAct,
          "obligationId": '',
          "assistanceType": assistanceType,
          "values": valuesData,
          "description": description
        }
      );
    }
    data = {
      "isFundedCurrentFY": isFundedCurrentFY,
      "obligations": obligationsData
    }
    console.log('final save', data);

  }

  buildJson(year: number, actual: string, estimate: string, flag: string, explanation: string): any {

    let data = {
      "year": year,
      "actual": actual,
      "estimate": estimate,
      "flag": flag,
      "explanation": explanation
    };

    return data;
  }

}



