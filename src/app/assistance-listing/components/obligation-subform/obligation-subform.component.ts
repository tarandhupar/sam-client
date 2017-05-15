import {Component, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';
import {AutocompleteConfig} from "sam-ui-kit/types";
import moment = require("moment");
import * as _ from 'lodash';
import {UUID} from "angular2-uuid";

@Component({
  selector: 'obligation-subform',
  providers: [],
  templateUrl: 'obligation-subform.template.html',
})

export class FALObligationSubFormComponent {

  falObligationSubForm: FormGroup;
  @Input() hideAddButton: boolean;
  @Input() fyYearOptions: any;
  @Input() options: any;
  @Output() public subFormObligActionHandler = new EventEmitter();
  currentFY: number;
  prevFY: number;
  nextFY: number;


  obligationsInfo = [];
  obligationIndex: number = 0;
  hideObligationsForm: boolean = true;
  mode: string;
  assistanceTypeArray = [];
  assistanceTypeLabel = 'Assistance Type';
  persistPreYearsData = [];
  preservePFYDataOnCancel: any;
  preserveCFYDataOnCancel: any;
  preserveBFYDataOnCancel: any;
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
  subFormLabel: string;

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  createForm() {
    this.falObligationSubForm = this.fb.group({
      'obligations': this.fb.array([])
    });

  }


  initobligations(obligation: {}, populateAddFalg: boolean) {
    let year = new Date();
    let currentFY = year.getFullYear();
    let prevFY = (currentFY) - 1;
    let nextFY = (currentFY) + 1;
    this.currentFY = currentFY;
    this.prevFY = prevFY;
    this.nextFY = nextFY;

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
        if (value['year'].toString() === currentFY.toString()) {
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
        } else if (value['year'].toString() === nextFY.toString()) {
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
        } else if (value['year'].toString() === prevFY.toString()) {
          if ((value['actual'] && value['estimate']) || value['actual']) {
            past = 'pFYActual';
            pastText = value['actual'];
          } else if (value['estimate']) {
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
        } else if (value['year'].toString() !== prevFY.toString() || value['year'].toString() !== nextFY.toString() || value['year'].toString() !== currentFY.toString()) {
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
      assistanceType: populateAddFalg ? {code: '', name: ''} : obligation['assistanceType'],
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

  assistanceTypeChange(event, i) {
    const control = <FormArray> this.falObligationSubForm.controls['obligations'];
    const controlGrp = <FormGroup> control.at(i);
    this.assistanceTypeWrapper.formatErrors(controlGrp.controls['assistanceType'])
  }

  onAddNewObliClick() {
    this.subFormLabel = "Add Obligation";
    const control = <FormArray> this.falObligationSubForm.controls['obligations'];
    this.obligationIndex = control.length;
    control.push(this.initobligations({}, true));
    control.at(this.obligationIndex).patchValue(control.value);
    this.hideAddButton = true;
    this.mode = "Add";
    this.hideObligationsForm = false;

    this.subFormObligActionHandler.emit({
      type: 'add',
      hideAddButton: this.hideAddButton
    });
  }

  removeObligation(i: number) {
    const control = <FormArray>this.falObligationSubForm.controls['obligations'];
    control.removeAt(i);
    this.obligationsInfo = this.falObligationSubForm.value.obligations;
    this.hideAddButton = false;
    this.hideObligationsForm = true;
  }

  editObligation(i: number) {
    this.mode = "Edit";
    this.subFormLabel = "Edit Obligations";
    this.obligationIndex = i;
    this.hideAddButton = true;
    this.preservePFYDataOnCancel = _.cloneDeep(this.obligationsInfo[i].pFY);
    this.preserveCFYDataOnCancel =  _.cloneDeep(this.obligationsInfo[i].cFY);
    this.preserveBFYDataOnCancel =  _.cloneDeep(this.obligationsInfo[i].bFY);
    this.hideObligationsForm = false;
  }

  onObligationConfirmClick(i) {
    let uuid;
    const control = <FormArray> this.falObligationSubForm.controls['obligations'];
    let obligationId = this.falObligationSubForm.value.obligations[i].obligationId;

    if (obligationId == '' || obligationId == null) {
      uuid = UUID.UUID().replace(/-/g, "");
    }
    else {
      uuid = obligationId;
    }
    control.at(i).patchValue({obligationId: uuid});
    //this.obligationsInfo = this.falObligationSubForm.value.obligations;
    this.obligationsInfo = _.cloneDeep(this.falObligationSubForm.value.obligations);
    this.hideAddButton = false;
    this.hideObligationsForm = true;
    this.subFormObligActionHandler.emit({
      type: 'confirm',
      hideAddButton: this.hideAddButton,
      obligationsInfo: _.cloneDeep(this.falObligationSubForm.value.obligations)
    });
  }

  onObligationCancelClick(i) {
    if (this.mode == 'Add') {
      this.removeObligation(i);
    }
    if (this.mode == 'Edit') {
      this.obligationsInfo[i].pFY = this.preservePFYDataOnCancel;
      this.obligationsInfo[i].cFY = this.preserveCFYDataOnCancel;
      this.obligationsInfo[i].bFY = this.preserveBFYDataOnCancel;
      const control = <FormArray> this.falObligationSubForm.controls['obligations'];
      control.at(i).patchValue(this.obligationsInfo[i]);
    }
    this.hideObligationsForm = true;
    this.hideAddButton = false;
    this.subFormObligActionHandler.emit({
      type: 'cancel',
      hideAddButton: this.hideAddButton,
    });
  }
}
