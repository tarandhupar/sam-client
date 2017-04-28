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

export class FinancialObligationsComponent implements OnInit, OnDestroy {
  obligationsInfo = [];
  obligationsData = [];
  data = [];
  getProgramsSub: any;
  programId: string;
  finObligationsForm: FormGroup;
  getProgSub: any;
  saveProgSub: any;
  dictionarySub: any;
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
  totalvalue = {};
  assistanceTypeArray = [];
  assistanceTypeLabel = 'Assistance Type';
  persistPreYearsData = [];
  pyCellData = [];
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
    let pyValues = [];
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
    if (isRecoveryAct) {
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
          } else if (value['flag'] === 'ena') {
            current = 'cFYNa';
            currentText = value['explanation'];
          }
          pyValues.push(value);
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
          if ((value['actual'] && value['estimate'])||value['actual']) {
            past = 'pFYActual';
            pastText = value['actual'];
          } else if(value['estimate']){
            past = 'pFYActual';
            pastText = value['estimate'];
          } else if (value['flag'] === 'nsi') {
            past = 'pFYNsi';
            pastText = value['explanation'];
          } else if (value['flag'] === 'ena') {
            past = 'pFYNa';
            pastText = value['explanation'];
          }
          pyValues.push(value);
        } else if (value['year'] !== this.pastYear || value['year'] !== this.currentYear || value['year'] !== this.budgetYear) {
          pyValues.push(value);
        }
      }
    }
    this.persistPreYearsData.push(
      {
        obligationId: obligation['obligationId'],
        values: pyValues
      }
    );

    return this.fb.group({
      isRecoveryAct: [[isRecoveryAct]],
      assistanceType: {
        code: obligation['assistanceType'],
        name: this.assistanceTypeArray[obligation['assistanceType']]
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
      description: obligation['description'],
      obligationId: obligation['obligationId']
    });

  }

  getData() {
    this.getProgSub = this.programService.getProgramById(this.sharedService.programId, this.sharedService.cookieValue)
      .subscribe(api => {
        this.programTitle = api.data.title;
        let isFundedCurrentFY = '';
        if (api.data) {
          if (api.data.financial) {
            if (api.data.financial.isFundedCurrentFY) {
              isFundedCurrentFY = (api.data.financial.isFundedCurrentFY ? api.data.financial.isFundedCurrentFY : '');
            }

            if (api.data.financial.obligations) {
              let index = 0;
              const control = <FormArray> this.finObligationsForm.controls['obligations'];
              for (let obligation of api.data.financial.obligations) {
                control.push(this.initobligations(obligation));
                // let initObligations = this.initobligations(obligation);
                let initObligations = control.value;
                control.at(index).patchValue(initObligations);
                index = index + 1;
              }
            }
          }
        }
        if (isFundedCurrentFY) {
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
    let totalpFY: any = 0.00
    let totalcFY: any = 0.00;
    let totalbFY: any = 0.00;

    for (let obligation of obligations) {
      if (parseFloat(obligation.pFY.textboxValue) && (obligation.pFY.radioOptionId === "pFYActual")) {
        totalpFY = totalpFY + parseFloat(obligation.pFY.textboxValue);
      }
      if (parseFloat(obligation.cFY.textboxValue) && (obligation.cFY.radioOptionId === "cFYEstimate")) {
        totalcFY = totalcFY + parseFloat(obligation.cFY.textboxValue);
      }
      if (parseFloat(obligation.bFY.textboxValue) && (obligation.bFY.radioOptionId === "bFYEstimate")) {
        totalbFY = totalbFY + parseFloat(obligation.bFY.textboxValue);
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
      this.router.navigate(['programs/' + this.sharedService.programId + '/edit/authorization']);
    else
      this.router.navigate(['programs/add/authorization']);

  }

  onSaveExitClick(event) {
    this.redirectToWksp = true;
    this.saveData();
  }

  onSaveContinueClick(event) {
    this.saveData();
  }

  saveData() {
    let data = {};
    let isFundedCurrentFY: boolean;
    if (this.finObligationsForm.value.isFundedCurrentFY !== undefined) {
      isFundedCurrentFY = this.finObligationsForm.value.isFundedCurrentFY.indexOf('isFundedCurrentFY') !== -1;
    }
    let obligationsData = [];
    if (this.obligationsInfo) {
      for (let i = 0; i < this.obligationsInfo.length; i++) {
        let obligation = this.obligationsInfo[i];
        obligationsData.push(this.buildJSON(obligation));
      }
    }

    data = {
      "financial": {
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

  buildJSON(obligation: any): any {
    let obligationData = {};
    let values = [];
    let uuid = '';
    let isRecoveryAct: boolean;
    let description = obligation.description;
    let assistanceType = obligation.assistanceType.code ? obligation.assistanceType.code : null;
    if (obligation.isRecoveryAct !== undefined) {
      isRecoveryAct = obligation.isRecoveryAct.indexOf('isRecoveryAct') !== -1;
    }
    if (obligation.obligationId == '' || obligation.obligationId == null)
      uuid = UUID.UUID().replace(/-/g, "");
    else
      uuid = obligation.obligationId;
    values = this.buildValues(uuid, obligation);
    obligationData['isRecoveryAct'] = isRecoveryAct;
    obligationData['obligationId'] = uuid;
    obligationData['values'] = values;
    obligationData['assistanceType'] = assistanceType;
    obligationData['description'] = description;

    return obligationData;
  }

  buildValues(uuid: string, obligation: any): any {
    let valuesData = [];
    valuesData.push(this.pastYearData(uuid, obligation));
    valuesData.push(this.currentYearData(uuid, obligation));
    valuesData.push(this.budgetYearData('',obligation));
    if(this.persistPreYearsData && this.persistPreYearsData.length>0) {
      for (let pyData of this.persistPreYearsData) {
        if (uuid == pyData.obligationId) {
          for (let value of pyData.values) {
            if (value.year != this.pastYear && value.year != this.currentYear && value.year != this.budgetYear) {
              valuesData.push(value);
            }
          }
        }
      }
    }

    return valuesData;
  }

  pastYearData(uuid: string, obligation: any): any {
    let pastObj = {};
    if (obligation.pFY) {
      pastObj['year'] = this.pastYear;
      if (obligation.pFY.radioOptionId === 'pFYActual') {
        pastObj['actual'] = parseFloat(obligation.pFY.textboxValue) > 0 ? parseFloat(obligation.pFY.textboxValue) : null;
      }
      if (obligation.pFY.radioOptionId === 'pFYNsi') {
        pastObj['flag'] = 'nsi';
        pastObj['explanation'] = obligation.pFY.textboxValue != '' ? obligation.pFY.textboxValue : null;
      }
      if (obligation.pFY.radioOptionId === 'pFYNa') {
        pastObj['flag'] = 'ena';
        pastObj['explanation'] = obligation.pFY.textboxValue != '' ? obligation.pFY.textboxValue : null;
      }
    }
    if(this.persistPreYearsData && this.persistPreYearsData.length>0) {
      for (let pyData of this.persistPreYearsData) {
        for (let pValue of pyData.values) {
          if ((pValue.year === this.pastYear && uuid === pyData.obligationId)) {
            if((pValue.estimate) && (pValue.estimate !== null || pValue.estimate !== null || pValue.estimate !== undefined)) {
              pastObj['estimate'] = pValue.estimate
            }
          }
        }
      }
    }

    return pastObj;
  }

  currentYearData(uuid: string, obligation: any) {
    let currentObj = {};
    if (obligation.cFY) {
      currentObj['year'] = this.currentYear;
      if (obligation.cFY.radioOptionId === 'cFYEstimate') {
        currentObj['estimate'] = parseFloat(obligation.cFY.textboxValue) > 0 ? parseFloat(obligation.cFY.textboxValue) : null;
      }
      if (obligation.cFY.radioOptionId === 'cFYNsi') {
        currentObj['flag'] = 'nsi';
        currentObj['explanation'] = obligation.cFY.textboxValue != '' ? obligation.cFY.textboxValue : null;
      }
      if (obligation.cFY.radioOptionId === 'cFYNa') {
        currentObj['flag'] = 'ena';
        currentObj['explanation'] = obligation.cFY.textboxValue != '' ? obligation.cFY.textboxValue : null;
      }
    }
    if(this.persistPreYearsData && this.persistPreYearsData.length>0) {
      for (let cyData of this.persistPreYearsData) {
        for (let cValue of cyData.values) {
          if ((cValue.year == this.currentYear&& uuid === cValue.obligationId)) {
            if((cValue.estimate) && (cValue.estimate !== null || cValue.estimate !== null || cValue.estimate !== undefined)) {
              currentObj['estimate'] = cValue.estimate
            }
          }
        }
      }
    }

    return currentObj;
  }

  budgetYearData(uuid: string, obligation: any) {
    let budgetObj = {};

    if (obligation.bFY) {
      budgetObj['year'] = this.budgetYear;
      if (obligation.bFY.radioOptionId === 'bFYEstimate') {
        budgetObj['estimate'] =  parseFloat(obligation.bFY.textboxValue) > 0 ? parseFloat(obligation.bFY.textboxValue) : null;
      }
      if (obligation.bFY.radioOptionId === 'bFYNsi') {
        budgetObj['flag'] = 'nsi';
        budgetObj['explanation'] = obligation.bFY.textboxValue != '' ? obligation.bFY.textboxValue : null;
      }
      if (obligation.bFY.radioOptionId === 'bFYNa') {
        budgetObj['flag'] = 'ena';
        budgetObj['explanation'] = obligation.bFY.textboxValue != '' ? obligation.bFY.textboxValue : null;
      }
    }
    return budgetObj;
  }
}
