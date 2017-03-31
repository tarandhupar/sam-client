import {Component, OnInit, OnDestroy, NgZone} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {ProgramService} from 'api-kit';
import {FormGroup, FormArray, FormBuilder} from '@angular/forms';
import {FinacialInformation} from "./financialinfo";
import {AutocompleteConfig} from "sam-ui-elements/src/ui-kit/types";
import {DictionaryService} from "../../../../../../api-kit/dictionary/dictionary.service";
import {FALOpSharedService} from "../../../assistance-listing-operations.service";
import {UUID} from 'angular2-uuid';

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
  pFYtableHeaderText: string;
  cFYtableHeaderText: string;
  bFYtableHeaderText: string;
  redirectToWksp: boolean = false;
  redirectToViewPg: boolean = false;

  testtotalpFY = 0;
  testtotalcFY = 0;
  testtotalbFY = 0;
  totalvalue = {};


  // Current Fiscal year Checkbox config
  currentFiscalYearCheckboxModel: any = [''];
  currentFiscalYearCheckboxConfig = {
    options: [
      {
        value: 'isFundedCurrentFY',
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
        value: 'isRecoveryAct',
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
              private sharedService: FALOpSharedService, private router: Router) {
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
    this.fiscalyear();
    this.trimHeaderFields();
    this.createForm();
    if (this.sharedService.programId) {
      this.getData();
    }
  }

  fiscalyear() {
    let year = new Date();
    this.currentYear = year.getFullYear();
    this.pastYear = (this.currentYear) - 1;
    this.budgetYear = (this.currentYear) + 1;
  }

  trimHeaderFields() {
    this.pFYtableHeaderText = this.pastYear.toString().substring(2);
    this.cFYtableHeaderText = this.currentYear.toString().substring(2);
    this.bFYtableHeaderText = this.budgetYear.toString().substring(2);
  }

  ngOnDestroy() {
    if (this.saveProgSub)
      this.saveProgSub.unsubscribe();

    if (this.getProgSub)
      this.getProgSub.unsubscribe();

    if (this.dictionarySub)
      this.dictionarySub.unsubscribe();
  }


  onAddNewObliClick() {
    const control = <FormArray> this.finObligationsForm.controls['obligations'];
    this.obligationIndex = control.length;
    control.push(this.initobligations({}));

    console.log('control', control.value);

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
    let past = 'pFYActual';
    let pastText = '';
    let current = 'cFYEstimate';
    let currentText = '';
    let budget = 'bFYEstimate';
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
    console.log('init obligations', obligation);

    return this.fb.group({
      isRecoveryAct: obligation['isRecoveryAct'],
      assistanceType: {
        code: obligation['assistanceType']
      },
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
      description: obligation['description']
    });
  }

  removeObligation(i: number) {
    const control = <FormArray>this.finObligationsForm.controls['obligations'];
    control.removeAt(i);
    this.obligationsInfo = [];
    for (let obligation of  this.finObligationsForm.value.obligations) {
      this.obligationsInfo.push(obligation);
    }
    this.hideObligationsForm = true;
    this.hideAddButton = false;
  }

  editObligation(i: number) {
    console.log('edit clicked');
    this.mode = "Edit";
    this.obligationIndex = i;
    this.hideObligationsForm = false;
    this.hideAddButton = true;
  }


  onObligationConfirmClick() {
    this.obligationsInfo = [];
    console.log('asdf', this.finObligationsForm.value);
    this.caluclateTotal(this.finObligationsForm.value.obligations, true);
    this.hideAddButton = false;
    this.hideObligationsForm = true;
  }

  onObligationCancelClick(i) {
    if (this.mode == 'Add') {
      this.removeObligation(i);
    }
    if (this.mode == 'Edit') {
      const control = <FormArray> this.finObligationsForm.controls['obligations'];
      control.at(i).setValue(this.obligationsInfo[i]);
    }
    this.hideAddButton = false;
    this.hideObligationsForm = true;

  }


  chkCurrFiscalYearChange(event) {
    this.currentFiscalYearCheckboxConfig.options[0].value = 'true';
  }

  getData() {
    this.getProgSub = this.programService.getProgramById(this.sharedService.programId, this.sharedService.cookieValue)
      .subscribe(api => {
        let isFundedCurrentFY = '';
        console.log(api,'api');
        if (api.data) {
          if(api.data.financial) {
            if (api.data.financial.isFundedCurrentFY) {
              isFundedCurrentFY = (api.data.financial.isFundedCurrentFY ? api.data.financial.isFundedCurrentFY : '');
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
          }
        }
        console.log(isFundedCurrentFY,'isFundedCurrentFY............');

        this.finObligationsForm.patchValue({
         isFundedCurrentFY: [isFundedCurrentFY]
        });
        console.log('get data..............', this.finObligationsForm.value.obligations);
        this.obligationsInfo = this.finObligationsForm.value.obligations;
        this.caluclateTotal(this.obligationsInfo, false);
      }, error => {
        console.error('Error Retrieving Program!!', error);
      });
  }

  caluclateTotal(obligations: any, flag: boolean) {
    let totalpFY = 0;
    let totalcFY = 0;
    let totalbFY = 0;

    for (let obligation of obligations) {
      if (Number.isInteger(parseInt(obligation.pFY.textboxValue))) {
        totalpFY = totalpFY + parseInt(obligation.pFY.textboxValue);
        this.testtotalpFY = totalpFY;
      }
      if (Number.isInteger(parseInt(obligation.cFY.textboxValue))) {
        totalcFY = totalcFY + parseInt(obligation.cFY.textboxValue);
        this.testtotalcFY = totalcFY;
      }
      if (Number.isInteger(parseInt(obligation.bFY.textboxValue))) {
        totalbFY = totalbFY + parseInt(obligation.bFY.textboxValue);
        this.testtotalbFY = totalbFY;
      }
      if (flag === true) {
        this.obligationsInfo.push(obligation);
      }
    }
    this.totalvalue = {
      totalpFY: totalpFY,
      totalcFY: totalcFY,
      totalbFY: totalbFY
    };
  }

  onCancelClick(event) {
    if (this.sharedService.programId)
      this.router.navigate(['/programs', this.sharedService.programId, 'view']);
    else
      this.router.navigate(['/falworkspace']);
  }

  onPreviousClick(event) {
    if (this.sharedService.programId)
      this.router.navigate(['programs/' + this.sharedService.programId + '/edit/overview']);
    else
      this.router.navigate(['programs/add/overview']);

  }

  onSaveExitClick(event) {
    this.redirectToWksp = true;
    this.saveData();
  }

  onSaveContinueClick(event) {
    this.saveData();
  }

  saveData() {
    let uuid = UUID.UUID().replace(/-/g, "");
    /*console.log(uuid,'id ......');*/
    let data = {};
    let isFundedCurrentFY = this.finObligationsForm.value.isFundedCurrentFY.indexOf('isFundedCurrentFY') !== -1;
    let obligationsData = [];
    console.log(this.obligationsInfo);
    for (let i = 0; i < this.obligationsInfo.length; i++) {
      let valuesData = [];
      let obligation = this.obligationsInfo[i];
      let isRecoveryAct = obligation.isRecoveryAct.indexOf('isRecoveryAct') !== -1;
      let description = obligation.description;
      let assistanceType = obligation.assistanceType.code;
      let value: any;
      if (obligation.pFY) {
        if (obligation.pFY.radioOptionId === 'pFYActual') {
          value = this.buildJson(this.pastYear, obligation.pFY.textboxValue, '', '', '')
        } else if (obligation.pFY.radioOptionId === 'pFYNsi') {
          value = this.buildJson(this.pastYear, '', '', 'nsi', obligation.pFY.textboxValue);
        } else if (obligation.pFY.radioOptionId === 'pFYNa') {
          value = this.buildJson(this.pastYear, '', '', 'ena', obligation.pFY.textboxValue);
        }
      }
      valuesData.push(value);
      if (obligation.cFY) {
        if (obligation.cFY.radioOptionId === 'cFYEstimate') {
          value = this.buildJson(this.currentYear, '', obligation.cFY.textboxValue, '', '')
        } else if (obligation.cFY.radioOptionId === 'cFYNsi') {
          value = this.buildJson(this.currentYear, '', '', 'nsi', obligation.cFY.textboxValue)
        } else if (obligation.cFY.radioOptionId === 'cFYNa') {
          value = this.buildJson(this.currentYear, '', '', 'ena', obligation.cFY.textboxValue);
        }
      }
      valuesData.push(value);
      if (obligation.bFY) {
        if (obligation.bFY.radioOptionId === 'bFYEstimate') {
          value = this.buildJson(this.budgetYear, '', obligation.bFY.textboxValue, '', '')
        } else if (obligation.bFY.radioOptionId === 'bFYNsi') {
          value = this.buildJson(this.budgetYear, '', '', 'nsi', obligation.bFY.textboxValue);
        } else if (obligation.bFY.radioOptionId === 'bFYNa') {
          value = this.buildJson(this.budgetYear, '', '', 'ena', obligation.bFY.textboxValue);
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
      "financial":{
        "isFundedCurrentFY": isFundedCurrentFY,
        "obligations": obligationsData
      }

    };
    console.log('final save', data);

    this.saveProgSub = this.programService.saveProgram(this.sharedService.programId, data, this.sharedService.cookieValue)
      .subscribe(api => {
          this.sharedService.programId = api._body;
          console.log('AJAX Completed Obligation Information', api);

          if (this.redirectToWksp)
            this.router.navigate(['falworkspace']);
          else if (this.redirectToViewPg) {
            this.router.navigate(['/programs', this.sharedService.programId, 'view']);
          }
          else
            this.router.navigate(['/programs/' + this.sharedService.programId + '/edit/financial-information/other-financial-info']);

        },
        error => {
          console.error('Error saving Program - Contact Information Section!!', error);
        });
  }

  buildJson(year: number, actual: string, estimate: string, flag: string, explanation: string): any {

    let data = {
      "year": year,
      "actual": parseInt(actual),
      "estimate": parseInt(estimate),
      "flag": flag,
      "explanation": explanation
    };

    return data;
  }
}
