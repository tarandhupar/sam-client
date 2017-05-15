import {Component, Input, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormArray} from "@angular/forms";
import {FALFormViewModel} from "../../../fal-form.model";
import moment = require("moment");
import * as _ from 'lodash';
import {FALObligationSubFormComponent} from "../../../../components/obligation-subform/obligation-subform.component";
import {FALFormService} from "../../../fal-form.service";


@Component({
  providers: [FALFormService],
  selector: 'fal-form-obligation-info',
  templateUrl: 'fal-form-obligation-info.template.html'
})


export class FALFormObligationsInfoComponent {
  finObligationsForm: FormGroup;
  @Input() viewModel: FALFormViewModel;
  @ViewChild('obligationSubForm') obligationSubForm: FALObligationSubFormComponent;

  obligationsInfo: any = [];
  hideAddButton: boolean = false;
  programTitle: string;
  fyYearOptions: any;
  totalvalue: any;
  persistPreYearsData = [];
  assistanceTypeArray = [];
  options = [];

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


  constructor(private fb: FormBuilder, private service: FALFormService) {

  }
  parseDictionariesList(data) {
    if (data['assistance_type'] && data['assistance_type'].length > 0) {
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
      if(this.viewModel.obligations && this.viewModel.obligations.length > 0){
        let index = 0;
        for(let obligation of this.viewModel.obligations){
          let code = obligation['assistanceType'];
          delete obligation['assistanceType'];
          obligation['assistanceType'] = {code: code, name : this.assistanceTypeArray[code]};
          const control = <FormArray> this.obligationSubForm.falObligationSubForm.controls['obligations'];
          control.push(this.obligationSubForm.initobligations(obligation,false));
          let initObligations = control.value;
          control.at(index).patchValue(initObligations);
          index = index + 1;

        }
      }

      this.obligationsInfo = _.cloneDeep(this.obligationSubForm.falObligationSubForm.value.obligations);
      this.obligationSubForm.obligationsInfo = _.cloneDeep(this.obligationSubForm.falObligationSubForm.value.obligations);
      this.caluclateTotal(this.obligationsInfo);
    }
  }

  ngOnInit() {
    this.fyYearOptions = {
      prevFY: (this.getCurrentFY() - 1).toString(),
      currentFY: this.getCurrentFY().toString(),
      nextFY : (this.getCurrentFY() + 1).toString()
    };
    this.service.getObligation_Info_Dictionaries().subscribe(
      data => this.parseDictionariesList(data),
      error => {
        console.error('error retrieving dictionary data', error);
      });
    this.createForm();


    if (!this.viewModel.isNew) {
      this.updateForm();
    }
  }
  createForm() {
    this.finObligationsForm = this.fb.group({
      isFundedCurrentFY: ['']
    });
    this.finObligationsForm.valueChanges.subscribe(data => this.updateViewModel(data));
    this.obligationSubForm.falObligationSubForm.valueChanges.subscribe(data => this.updateObligationsViewModel(data));
     this.obligationsInfo = _.cloneDeep(this.obligationSubForm.falObligationSubForm.value.obligations);
    this.obligationSubForm.obligationsInfo = _.cloneDeep(this.obligationSubForm.falObligationSubForm.value.obligations);
  }
  updateViewModel(data) {
    this.viewModel.isFundedCurrentFY = this.saveIsFunded(data['isFundedCurrentFY']);
  }

  updateObligationsViewModel(data) {
    this.viewModel.obligations = this.saveObligations(data);
  }

  updateForm() {
    this.programTitle = this.viewModel.title;
    this.finObligationsForm.patchValue({
      isFundedCurrentFY: this.loadIsFunded(this.viewModel.isFundedCurrentFY)
    }, {
      emitEvent: false
    });
  }
  private loadIsFunded(flag: boolean) {
    let isFunded = [];
    if (flag) {
      isFunded.push('isFundedCurrentFY')
    }
    return isFunded;
  }

  private saveIsFunded(flag: any) {
    let isflag = false;
    if (flag && flag.length > 0) {
      isflag = true;
    }
    return isflag;
  }
  caluclateTotal(obligations: any) {
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
    }
    this.totalvalue = {
      totalpFY: totalpFY,
      totalcFY: totalcFY,
      totalbFY: totalbFY
    };
  }
  obligationActionHandler(event) {
    if(event.type == 'add'){
      this.hideAddButton = event.hideAddButton;
    }
    if(event.type == 'confirm'){
      this.hideAddButton = event.hideAddButton;
      this.obligationsInfo = event.obligationsInfo;
      this.caluclateTotal(this.obligationsInfo)
    }
    if(event.type == 'cancel'){
      this.hideAddButton = event.hideAddButton;
    }
    if(event.type == 'edit'){
      this.editObligation(event.index);
    }
    if(event.type == 'remove'){
      this.removeObligaiton(event.index);
    }
  }
  editObligation(i: number){
    this.obligationSubForm.editObligation(i);
    this.hideAddButton = this.obligationSubForm.hideAddButton;
  }

  removeObligaiton(i: number){
    this.obligationSubForm.removeObligation(i);
    this.obligationsInfo = this.obligationSubForm.obligationsInfo;
    this.hideAddButton = this.obligationSubForm.hideAddButton;
    this.caluclateTotal(this.obligationsInfo);
  }
  public getCurrentFY() {
    return moment().quarter() === 4 ? moment().add('year', 1).year() : moment().year()
  }

  saveObligations(obligations: Array<any>) {
    let obligationsData = [];
    if (obligations) {
      for (let i = 0; i < obligations['obligations'].length; i++) {
        let obligation = obligations['obligations'][i];
        obligationsData.push(this.buildJSON(obligation));
      }
    }

    return obligationsData;
  }

  buildJSON(obligation: any): any {
    let obligationData = {};
    let values = [];
    let isRecoveryAct: boolean;
    let description = obligation.description;
    let assistanceType = obligation.assistanceType.code ? obligation.assistanceType.code : null;
    if (obligation.isRecoveryAct !== undefined) {
      isRecoveryAct = obligation.isRecoveryAct.indexOf('isRecoveryAct') !== -1;
    }
    values = this.buildValues(obligation.obligationId, obligation);
    obligationData['isRecoveryAct'] = isRecoveryAct;
    obligationData['obligationId'] = obligation.obligationId;
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
    if(this.obligationSubForm.persistPreYearsData && this.obligationSubForm.persistPreYearsData.length>0) {
      for (let pyData of this.obligationSubForm.persistPreYearsData) {
        if (uuid == pyData.obligationId) {
          for (let value of pyData.values) {
            if (value.year != this.fyYearOptions.prevFY && value.year != this.fyYearOptions.currentFY && value.year != this.fyYearOptions.nextFY) {
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
      pastObj['year'] = parseInt(this.fyYearOptions.prevFY,10);
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
    if (obligation.pFY.radioOptionId === 'pFYActual') {
      if (this.obligationSubForm.persistPreYearsData && this.obligationSubForm.persistPreYearsData.length > 0) {
        for (let pyData of this.obligationSubForm.persistPreYearsData) {
          for (let pValue of pyData.values) {
            if ((pValue.year.toString() === this.fyYearOptions.prevFY && uuid === pyData.obligationId)) {
              if ((pValue.estimate) && (pValue.estimate !== null || pValue.estimate !== null || pValue.estimate !== undefined)) {
                pastObj['estimate'] = pValue.estimate
              }
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
      currentObj['year'] = parseInt(this.fyYearOptions.currentFY,10);
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
    return currentObj;
  }

  budgetYearData(uuid: string, obligation: any) {
    let budgetObj = {};

    if (obligation.bFY) {
      budgetObj['year'] = parseInt(this.fyYearOptions.nextFY,10);
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
