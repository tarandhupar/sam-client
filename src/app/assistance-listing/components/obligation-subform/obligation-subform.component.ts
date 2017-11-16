import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import { v4 as UUID } from 'uuid';
import { FALFieldNames } from "../../assistance-listing-operations/fal-form.constants";
import { FALFormViewModel } from "../../assistance-listing-operations/fal-form.model";
import { falCustomValidatorsComponent } from "../../validators/assistance-listing-validators";

@Component({
  selector: 'obligation-subform',
  providers: [],
  templateUrl: 'obligation-subform.template.html',
})

export class FALObligationSubFormComponent {

  falObligationSubForm: FormGroup;
  @Input() viewModel: FALFormViewModel;
  @Input() hideAddButton: boolean;
  @Input() fyYearOptions: any;
  @Input() tableView: any;
  @Input() options: any;
  @Input() toggleAttleatOneEntryError: boolean;
  @Input() acCategories = [];
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
  pastFiscalYearConfig = {
    options: [
      {value: 'pFYActual', label: 'Actual', name: 'radio-pFY-actual', flag: 'number'},
      {value: 'pFYNsi', label: 'Not Separately Identifiable', name: 'radio-pFY-nsi', flag: 'text'},
      {value: 'pFYNa', label: 'Not available (Must be updated by the end of the year)', name: 'radio-pFY-na', flag: 'text'}
    ],
    name: 'Past Fiscal year - 2016',
    id: FALFieldNames.PAST_FISCAL_YEAR,
    label: '',
    errorMessage: '',
    hint: ''
  };
  // Past Fiscal Year - 2016
  currentFiscalYearConfig = {
    options: [
      {value: 'cFYEstimate', label: 'Estimate', name: 'radio-cFY-actual', flag: 'number'},
      {value: 'cFYNsi', label: 'Not Separately Identifiable', name: 'radio-cFY-nsi', flag: 'text'},
      {value: 'cFYNa', label: 'Not available (Must be updated by the end of the year)', name: 'radio-cFY-na', flag: 'text'}
    ],
    name: 'Current Fiscal year - 2016',
    id: FALFieldNames.CURRENT_FISCAL_YEAR,
    label: '',
    errorMessage: '',
    hint: ''
  };
  // Budget Fiscal Year - 2017
  budgetFiscalYearConfig = {
    options: [
      {value: 'bFYEstimate', label: 'Estimate', name: 'radio-bFY-actual', flag: 'number'},
      {value: 'bFYNsi', label: 'Not Separately Identifiable', name: 'radio-bFY-nsi', flag: 'text'},
      {value: 'bFYNa', label: 'Not available (Must be updated by the end of the year)', name: 'radio-bFY-na', flag: 'text'}
    ],
    name: 'Budget Fiscal year - 2016',
    id: FALFieldNames.BUDGET_FISCAL_YEAR,
    label: '',
    errorMessage: '',
    hint: ''
  };


  textareaModel = '';
  textareaConfig = {
    label: "Additional Information",
    name: 'Additional-Information',
  };

  autocompleteConfig: any = {
    categoryProperty: 'category',
    isCategorySelectable: false,
    keyValueConfig: {
      keyProperty: 'code',
      valueProperty: 'name',
    }, showOnEmptyInput: true
  };
  subFormLabel: string;

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  createForm() {
    this.falObligationSubForm = this.fb.group({
      'obligations': this.fb.array([], falCustomValidatorsComponent.atLeastOneEntryCheck)
    });
  }

  initobligations(obligation: {}, populateAddFalg: boolean, screen: string = 'form'): FormGroup | any {
    let currentFY = screen === 'table' ? this.tableView.fyYearOptions.currentFY : this.fyYearOptions.currentFY;
    let prevFY = screen === 'table' ? this.tableView.fyYearOptions.prevFY : this.fyYearOptions.prevFY;
    let nextFY = screen === 'table' ? this.tableView.fyYearOptions.nextFY : this.fyYearOptions.nextFY;

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
          if (value['estimate'] !== null && value['estimate'] >= 0) {
            current = 'cFYEstimate';
            currentText = value['estimate'].toString();
          } else if (value['flag'] === 'nsi') {
            current = 'cFYNsi';
            currentText = value['explanation'];
          } else if (value['flag'] === 'ena') {
            current = 'cFYNa';
            currentText = value['explanation'];
          }
          pyValues.push(value);
        } else if (value['year'].toString() === nextFY.toString()) {
          if (value['estimate'] !== null && value['estimate'] >= 0) {
            budget = 'bFYEstimate';
            budgetText = value['estimate'].toString();
          } else if (value['flag'] === 'nsi') {
            budget = 'bFYNsi';
            budgetText = value['explanation'];
          } else if (value['flag'] === 'ena') {
            budget = 'bFYNa';
            budgetText = value['explanation'];
          }
        } else if (value['year'].toString() === prevFY.toString()) {
          if (((value['actual'] !== null && value['actual'] >= 0) && (value['estimate'] !== null && value['estimate'] >= 0)) || (value['actual'] !== null && value['actual'] >= 0)) {
            past = 'pFYActual';
            pastText = value['actual'].toString();
          } else if (value['estimate'] !== null && value['estimate'] >= 0) {
            past = 'pFYActual';
            pastText = value['estimate'].toString();
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

   let assistanceType;
    if(populateAddFalg) {
      assistanceType = '';
    } else {
      assistanceType = obligation['assistanceType'];
    }

    let objObligation = {
      isRecoveryAct: [[isRecoveryAct]],
      assistanceType: [assistanceType, falCustomValidatorsComponent.autoCompleteRequired],
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
      description: obligation['description'] || '',
      obligationId: obligation['obligationId']
    };

    if (screen === 'table') {
      objObligation.assistanceType = assistanceType;
      return objObligation;
    } else {
      this.persistPreYearsData.push(
        {
          obligationId: obligation['obligationId'],
          values: pyValues
        }
      );
      return this.fb.group(objObligation);
    }
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
      uuid = UUID().replace(/-/g, "");
    }
    else {
      uuid = obligationId;
    }
    control.at(i).patchValue({obligationId: uuid});
    //Hotfix: needed for someone who roles obligation by edit existing one but doesn't change anything in the form
    this.falObligationSubForm.markAsDirty();
    this.falObligationSubForm.markAsTouched();
    //
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
    if(this.hideAddButton === false) {
      return; // clicking cancel has no effect if nothing is being edited or added
    }

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
