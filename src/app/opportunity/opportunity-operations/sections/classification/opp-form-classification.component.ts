import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { AutocompleteConfig } from 'sam-ui-elements/src/ui-kit/types';
import { OpportunityFormViewModel } from '../../framework/data-model/opportunity-form/opportunity-form.model';
import { OpportunityFormService } from '../../framework/service/opportunity-form/opportunity-form.service';
import { OppNoticeTypeFieldService } from '../../framework/service/notice-type-field-map/notice-type-field-map.service';
import { OpportunityFieldNames } from '../../framework/data-model/opportunity-form-constants';

@Component({
  selector: 'opp-form-classification',
  templateUrl: 'opp-form-classification.template.html'
})

export class OpportunityClassificationComponent implements OnInit {
  @Input() public viewModel: OpportunityFormViewModel;
  public oppClassificationForm: FormGroup;
  public oppClassificationViewModel: any;
  public noticeType: any;

  classificationDictionaries = [];

  autocompleteConfig: any = {
    keyValueConfig: {
      keyProperty: 'code',
      valueProperty: 'name',
    }, showOnEmptyInput: true
  };
  secondaryNAICSAutocompleteConfig: AutocompleteConfig = {
    keyValueConfig: {keyProperty: 'code', valueProperty: 'name'},
  };

  /*setAsideType config*/
  setAsideType: any;
  setAsideLookUp = [];
  public readonly setAsideConfig = {
    id: OpportunityFieldNames.SET_ASIDE_TYPE,
    label: 'Original/Updated Set Aside',
    name: OpportunityFieldNames.SET_ASIDE_TYPE + '-auto',
    required: false,
    hint: null,
    options: [
      // loaded asynchronously
    ],
  };

  /*classificationCodeType config*/
  classificationCodeType: any;
  classificationCodeLookUp = [];
  public readonly classificationCodeConfig = {
    id: OpportunityFieldNames.PRODUCT_SERVICE_CODE,
    label: 'Product Service Code',
    name: OpportunityFieldNames.PRODUCT_SERVICE_CODE + '-auto',
    required: true,
    hint: null,
    options: [
      // loaded asynchronously
    ],
  };

  /*primaryNAICSCodeType config*/
  primaryNAICSObj = [];
  naicsCodeLookUp = [];
  primaryNAICSCodeType = {};
  public readonly primaryNAICSCodeConfig = {
    id:  OpportunityFieldNames.PRIMARY_NAICS_CODE,
    label: 'Primary NAICS Code',
    name: OpportunityFieldNames.PRIMARY_NAICS_CODE +  '-auto',
    required: true,
    hint: null,
    options: [
      // loaded asynchronously
    ],
  };

  /*SecondaryNAICSCodeTypes Config*/
  secondaryNAICSObj = [];
  secondaryNAICSCodeTypes = [];
  public readonly secondaryNAICSCodeConfig = {
    id: OpportunityFieldNames.SECONDARY_NAICS_CODE,
    label: 'Additional NAICS Code(s)',
    name: OpportunityFieldNames.SECONDARY_NAICS_CODE + '-auto',
    hint: null,
    options: [
      // loaded asynchronously
    ],
  };

  /*Country Config*/
  countryType: any;
  countryLookUp = [];
  public readonly countryConfig = {
    id: 'opp-country',
    label: 'Country',
    name: 'opp-country-auto',
    options: [
      // loaded asynchronously
    ],
  };

  /*State Config*/
  stateType: any;
  stateLookUp = [];
  public readonly stateConfig = {
    id: 'opp-state',
    label: 'State',
    name: 'opp-state-auto',
    options: [
      // loaded asynchronously
    ],
  };

  constructor(private formBuilder: FormBuilder,
              private oppFormService: OpportunityFormService, private noticeTypeFieldService: OppNoticeTypeFieldService) {

    Object.freeze(this.setAsideConfig);
    Object.freeze(this.classificationCodeConfig);
    Object.freeze(this.primaryNAICSCodeConfig);
    Object.freeze(this.secondaryNAICSCodeConfig);
    Object.freeze(this.countryConfig);
    Object.freeze(this.stateConfig);
  }

  ngOnInit() {
    this.noticeType = this.viewModel.oppHeaderInfoViewModel.opportunityType;
    this.oppClassificationViewModel = this.viewModel.oppClassificationViewModel;
    this.createForm();
    this.loadTypeOptions();
    if (!this.viewModel.isNew) {
      this.updateForm();
    }
    this.subscribeToChanges();
  }

  private checkFieldDisplayOption(field) {
    return this.noticeTypeFieldService.checkFieldVisibility(this.noticeType, field);
  }

  private checkFieldRequired(field) {
    return this.noticeTypeFieldService.checkFieldRequired(this.noticeType, field);
  }

  private createForm(): void {
    this.oppClassificationForm = this.formBuilder.group({
      setAsideType: null,
      classificationCodeType: null,
      primaryNAICSCodeType: null,
      secondaryNAICSCodeType: null,
      countryType: null,
      stateType: null,
      zip: null,
      city: null,
    });
  }

  private loadTypeOptions() {
    this.classificationDictionaries = ['set_aside_type', 'classification_code', 'naics_code', 'country', 'state'];
    this.oppFormService.getOpportunityDictionary(this.classificationDictionaries.join()).subscribe((dict) => {
      this.fillListControls(dict, 'set_aside_type', this.setAsideConfig.options, this.setAsideLookUp);
      this.fillListControls(dict, 'classification_code', this.classificationCodeConfig.options, this.classificationCodeLookUp);
      this.fillListControls(dict, 'country', this.countryConfig.options, this.countryLookUp);
      this.fillListControls(dict, 'state', this.stateConfig.options, this.stateLookUp);
      this.fillAndPopulateNAICSControls(dict, this.oppClassificationViewModel.naicsCodeTypes);
      this.setAsideType =this.populateList(this.oppClassificationViewModel.setAsideType, this.setAsideLookUp);
      this.classificationCodeType = this.populateList(this.oppClassificationViewModel.classificationCodeType, this.classificationCodeLookUp);
      this.countryType = this.populateList(this.oppClassificationViewModel.countryType, this.countryLookUp);
      this.stateType = this.populateList(this.oppClassificationViewModel.stateType, this.stateLookUp);
      this.updateFormListControls();
    }, (error) => {
      console.error('error loading notice types', error);
    });
  }

  public populateList(data, lookUp) {
    let type = {};
    type = data ? {code: data, name: lookUp[data]} : null;
    return type;
  }

  private fillListControls(dict: any, dictType: string, options: any[], lookUp: any[]): any {
    if (dict[dictType] && dict[dictType].length > 0) {
      for (let item of dict[dictType]) {
        options.push({
          code: item.elementId,
          name: item.value,
        });
        lookUp[item.elementId] = item.value;
      }

    }
  }

  private fillAndPopulateNAICSControls(dict: any, naicsCodeTypes: any) {
    if (dict['naics_code'] && dict['naics_code'].length > 0) {
      for (let type of dict['naics_code']) {
        this.primaryNAICSCodeConfig.options.push({
          code: type.elementId,
          name: type.value,
        });
        this.secondaryNAICSCodeConfig.options.push({
          code: type.elementId,
          name: type.value,
        });
        this.naicsCodeLookUp[type.elementId] = type.value;
      }
    }
    if (naicsCodeTypes && naicsCodeTypes.length > 0) {
      for (let item of naicsCodeTypes) {
        if (item.type === 'Primary') {
          this.primaryNAICSCodeType = item.code[0] ? {
              code: item.code[0],
              name: this.naicsCodeLookUp[item.code[0]]
            } : '';
          this.primaryNAICSObj.push({code: [item.code[0]], type: 'Primary'});
        } else {
          let codes = [];
          if (item.code && item.code.length > 0) {
            for (let iCode of item.code) {
              this.secondaryNAICSCodeTypes.push({code: iCode, name: this.naicsCodeLookUp[iCode]});
              codes.push(iCode);
            }
          }
          this.secondaryNAICSObj.push({code: codes, type: 'Secondary'});
        }
      }
    }
  }

  private updateFormListControls(): void {
    this.oppClassificationForm.patchValue({
      setAsideType: this.setAsideType,
      classificationCodeType: this.classificationCodeType,
      primaryNAICSCodeType: this.primaryNAICSCodeType,
      secondaryNAICSCodeType: this.secondaryNAICSCodeTypes,
      countryType: this.countryType,
      stateType: this.stateType
    }, {
      emitEvent: false,
    });
  }

  private updateForm(): void {
    this.oppClassificationForm.patchValue({
      zip: this.oppClassificationViewModel.zip,
      city: this.oppClassificationViewModel.city
    }, {
      emitEvent: false,
    });
  }

  private subscribeToChanges(): void {
    this.linkControlTo(this.oppClassificationForm.get('setAsideType'), this.saveSetAsideType);
    this.linkControlTo(this.oppClassificationForm.get('classificationCodeType'), this.saveClassificationCodeType);
    this.linkControlTo(this.oppClassificationForm.get('primaryNAICSCodeType'), this.savePrimaryNAICSCodeType);
    this.linkControlTo(this.oppClassificationForm.get('secondaryNAICSCodeType'), this.saveSecondaryNAICSCodeType);
    this.linkControlTo(this.oppClassificationForm.get('countryType'), this.saveCountryType);
    this.linkControlTo(this.oppClassificationForm.get('stateType'), this.saveStateType);
    this.linkControlTo(this.oppClassificationForm.get('zip'), this.saveZip);
    this.linkControlTo(this.oppClassificationForm.get('city'), this.saveCity);
  }

  private linkControlTo(control: AbstractControl, callback: (field: any) => void): void {
    let boundCallback = callback.bind(this);
    control.valueChanges
      .debounceTime(10)
      .distinctUntilChanged()
      .subscribe(value => {
      boundCallback(value);
    });
    // actions to take after any field is updated
  }

  private saveSetAsideType(type) {
    let code = null;
    if (type !== null) {
      code = type.code;
    }
    this.oppClassificationViewModel.setAsideType = code;
  }

  private saveClassificationCodeType(type) {
    let code = null;
    if (type !== null) {
      code = type.code;
    }
    this.oppClassificationViewModel.classificationCodeType = code;
  }

  private savePrimaryNAICSCodeType(type) {
    this.primaryNAICSObj = [];
    if (type !== null) {
      this.primaryNAICSObj.push({code: [type.code], type: 'Primary'});
    } else {
      this.primaryNAICSObj = [];
    }
    let naicsCodeTypes = this.primaryNAICSObj.concat(this.secondaryNAICSObj);
    this.oppClassificationViewModel.naicsCodeTypes = (naicsCodeTypes && naicsCodeTypes.length > 0) ? naicsCodeTypes : null;
  }

  private saveSecondaryNAICSCodeType(types) {
    this.secondaryNAICSObj = [];
    let codes = [];
    if (types && types.length > 0) {
      for (let type of types) {
        codes.push(type.code);
      }
      this.secondaryNAICSObj.push({code: codes, type: 'Secondary'});
    } else {
      this.secondaryNAICSObj = [];
    }
    let naicsCodeTypes = this.secondaryNAICSObj.concat(this.primaryNAICSObj);
    this.oppClassificationViewModel.naicsCodeTypes = (naicsCodeTypes && naicsCodeTypes.length > 0) ? naicsCodeTypes : null;
  }

  private saveCountryType(type) {
    let code = null;
    if (type !== null) {
      code = type.code;
    }
    this.oppClassificationViewModel.countryType = code;
  }

  private saveStateType(type) {
    let code = null;
    if (type !== null) {
      code = type.code;
    }
    this.oppClassificationViewModel.stateType = code;
  }

  private saveZip(value) {
    this.oppClassificationViewModel.zip = value ? value : null;
  }

  private saveCity(value) {
    this.oppClassificationViewModel.city = value ? value : null;
  }

}
