import {Component, OnInit, OnDestroy, NgZone, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {ProgramService} from 'api-kit';
import {FormGroup, FormArray, FormBuilder, Validators} from '@angular/forms';
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
  programTitle: string;

  testtotalpFY = 0;
  testtotalcFY = 0;
  testtotalbFY = 0;
  totalvalue = {};
  assistanceTypeArray = [];
  assistanceTypeLabel='Assistance Type';
  @ViewChild('assistanceTypeWrapper') assistanceTypeWrapper;


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
      {value: 'pFYActual', label: 'Actual', name: 'radio-pFY', flag: 'number'},
      {value: 'pFYNsi', label: 'Not Separately Identifiable', name: 'radio-pFY', flag: 'text'},
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
      {value: 'cFYNsi', label: 'Not Separately Identifiable', name: 'radio-cFY', flag: 'text'},
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
      {value: 'bFYNsi', label: 'Not Separately Identifiable', name: 'radio-bFY', flag: 'text'},
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
            let name = code + ' - ' + value;
            this.options.push({
              code: elementId,
              name: name
            });
            this.assistanceTypeArray[elementId] = name;
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
  assistanceTypeChange(event, i) {
    const control = <FormArray> this.finObligationsForm.controls['obligations'];
    const controlGrp = <FormGroup> control.at(i);
    this.assistanceTypeWrapper.formatErrors(controlGrp.controls['assistanceType'])
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
    let isRecoveryAct = '';
    if (obligation['isRecoveryAct']) {
      isRecoveryAct = (obligation['isRecoveryAct'] ? obligation['isRecoveryAct'] : '');
    }
    if(isRecoveryAct) {
      isRecoveryAct = 'isRecoveryAct';
    }

    if (obligation['values']) {
      for (let value of obligation['values']) {
        if (value['year'] === this.currentYear) {
          if (value['estimate']) {
            current = 'cFYEstimate';
            currentText = value['estimate'];
          } else if (value['flag'] === 'nsi') {
            current = 'cFYNsi';
            currentText = value['explanation'];
          } else if (value['flag'] === 'ena'){
            current = 'cFYNa';
            currentText = value['explanation'];
          }
        } else if (value['year'] === this.budgetYear) {
          if (value['estimate']) {
            budget = 'bFYEstimate';
            budgetText = value['estimate'];
          } else if (value['flag'] === 'nsi') {
            budget = 'bFYNsi';
            budgetText = value['explanation'];
          } else if (value['flag'] === 'ena') {
            budget = 'bFYNa';
            budgetText = value['explanation'];
          }
        } else if (value['year'] === this.pastYear) {
          if (value['actual']) {
            past = 'pFYActual';
            pastText = value['actual'];
          } else if (value['flag'] === 'nsi') {
            past = 'pFYNsi';
            pastText = value['explanation'];
          } else if (value['flag'] === 'ena') {
            past = 'pFYNa';
            pastText = value['explanation'];
          }
        } else if(value['year'] !== this.pastYear || value['year'] === this.currentYear || value['year'] === this.pastYear) {

        }
      }
    }

    return this.fb.group({
      isRecoveryAct: [[isRecoveryAct]],
      assistanceType:{
        code:obligation['assistanceType'],
        name:this.assistanceTypeArray[obligation['assistanceType']]
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

  getData() {
    this.getProgSub = this.programService.getProgramById(this.sharedService.programId, this.sharedService.cookieValue)
      .subscribe(api => {
        this.programTitle = api.data.title;
        let isFundedCurrentFY = '';
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
                let initObligations = this.initobligations(obligation);
                control.at(index).patchValue(initObligations);
                index = index + 1;
              }

            }
          }
        }
        if(isFundedCurrentFY) {
          isFundedCurrentFY = 'isFundedCurrentFY';
        }
        this.finObligationsForm.patchValue({
          isFundedCurrentFY: [isFundedCurrentFY]
        });
        this.obligationsInfo = this.finObligationsForm.value.obligations;
        this.caluclateTotal(this.obligationsInfo, false);
      }, error => {
        console.error('Error Retrieving Program!!', error);
      });
  }

  removeObligation(i: number) {
    const control = <FormArray>this.finObligationsForm.controls['obligations'];
    control.removeAt(i);
    this.obligationsInfo = [];
    for (let obligation of  this.finObligationsForm.value.obligations) {
      this.obligationsInfo.push(obligation);
    }
    this.caluclateTotal(this.obligationsInfo, false);
    this.hideObligationsForm = true;
    this.hideAddButton = false;
  }

  editObligation(i: number) {
    this.mode = "Edit";
    this.obligationIndex = i;
    this.hideObligationsForm = false;
    this.hideAddButton = true;
  }


  onObligationConfirmClick() {
    this.obligationsInfo = [];
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
    let data = {};
    let isFundedCurrentFY:boolean;
    if(this.finObligationsForm.value.isFundedCurrentFY) {
      isFundedCurrentFY = this.finObligationsForm.value.isFundedCurrentFY.indexOf('isFundedCurrentFY') !== -1;
    }
    let obligationsData = [];
    for (let i = 0; i < this.obligationsInfo.length; i++) {
      let isRecoveryAct: boolean;
      let valuesData = [];
      let obligation = this.obligationsInfo[i];
        isRecoveryAct = obligation.isRecoveryAct.indexOf('isRecoveryAct') !==-1;

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
          "obligationId": uuid,
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
          console.error('Error saving Program - Obligations Information Section!!', error);
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
