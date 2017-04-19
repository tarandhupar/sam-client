import { Component, Input, ViewChild, forwardRef } from "@angular/core";
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, FormGroup } from "@angular/forms";
import { LabelWrapper } from "sam-ui-kit/wrappers/label-wrapper";
import {DictionaryService} from "api-kit";

@Component({
  selector: 'falFormulaMatchingInput',
  templateUrl: 'formula-matching.template.html',
  providers: [ DictionaryService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FALFormulaMatchingComponent),
      multi: true
    }
  ]
})
export class FALFormulaMatchingComponent implements ControlValueAccessor {
  private model: any = {
    checkbox: []
  }; // internally maintained model - should never be null or undefined

  public formulaMatchingOptions = [
    // todo: fix undefined names
    { value: 'cfr', label: 'This listing has statutory formula/or administrative rule reference in the CFR', name: this.name + '-checkbox-cfr' },
    { value: 'matching', label: 'This listing has matching requirements', name: this.name + '-checkbox-matching-requirements' },
    { value: 'moe', label: 'This listing has maintenance of effort (MOE) requirements AND total allocations over $100 million for the current fiscal year.', name: this.name + '-checkbox-moe' }
  ];

  public matchingRequirementsOptions = [
    { value: 'mandatory', label: 'Matching requirements are mandatory', name: this.name + '-radio-mandatory'},
    { value: 'voluntary', label: 'Matching requirements are voluntary', name: this.name + '-radio-voluntary'},
    { value: 'voluntary_rating', label: 'Matching requirements are voluntary and part of the rating criteria', name: this.name + '-radio-voluntary-rating'}
  ];

  public matchingPercentageOptions = [];

public formulaMatchingGroup: FormGroup;

  @Input() options: any; // all inputs are passed through a single options object
  public name: string;
  public label: string;
  public hint: string;
  public required: boolean;

  private _ordering: any;

  @ViewChild('formulaMatchingLabel') wrapper: LabelWrapper;

  constructor(private dictService: DictionaryService) {
    dictService.getDictionaryById('match_percent').subscribe(data => {
      for(let percent of data['match_percent']) {
        this.matchingPercentageOptions.push({
          value: percent.code,
          label: percent.value,
          name: this.name + '-percentage' + percent.value
        });
      }
    });
  }

  ngOnInit() {
    this.parseOptionsAndSetDefaults();
    this.validateInputs();
    this.createFormControls();

    // initialize the order lookup map
    this._ordering = {};
    for (let i = 0; i < this.formulaMatchingOptions.length; i++) {
      let val = this.formulaMatchingOptions[i].value;
      this._ordering[val] = i;
    }
  }

  private parseOptionsAndSetDefaults() {
    if(this.options) {
      this.name = this.options.name;
      this.label = this.options.label;
      this.hint = this.options.hint;
      this.required = this.options.required;
    }

    if(this.required == null) {
      this.required = false;
    }
  }

  private validateInputs() {
    if(!this.name) {
      throw new Error('<falFormulaMatchingInput> requires a [name] parameter for 508 compliance');
    }
  }

  private createFormControls() {
    this.formulaMatchingGroup = new FormGroup({
      formulaMatching: new FormControl([]),
      title: new FormControl(''),
      chapter: new FormControl(''),
      part: new FormControl(''),
      subpart: new FormControl(''),
      publicLaw: new FormControl(''),
      additionalInfo: new FormControl(''),
      matchingRequirements: new FormControl(''),
      matchingPercentage: new FormControl(null),
      matchingDescription: new FormControl(''),
      moeRequirements: new FormControl('')
    });


    this.formulaMatchingGroup.get('formulaMatching').valueChanges.subscribe(value => {
      // todo: figure out why this is being called twice on population
      this.model.checkbox = value;
      this.onChange();
    });

    this.formulaMatchingGroup.get('title').valueChanges.subscribe(value => {
      this.model.title = value;
      this.onChange();
    });

    this.formulaMatchingGroup.get('chapter').valueChanges.subscribe(value => {
      this.model.chapter = value;
      this.onChange();
    });

    this.formulaMatchingGroup.get('part').valueChanges.subscribe(value => {
      this.model.part = value;
      this.onChange();
    });

    this.formulaMatchingGroup.get('subpart').valueChanges.subscribe(value => {
      this.model.subPart = value;
      this.onChange();
    });

    this.formulaMatchingGroup.get('publicLaw').valueChanges.subscribe(value => {
      this.model.publicLaw = value;
      this.onChange();
    });

    this.formulaMatchingGroup.get('additionalInfo').valueChanges.subscribe(value => {
      this.model.additionalInfo = value;
      this.onChange();
    });

    this.formulaMatchingGroup.get('matchingRequirements').valueChanges.subscribe(value => {
      this.model.matchingRequirements = value;
      this.onChange();
    });

    this.formulaMatchingGroup.get('matchingPercentage').valueChanges.subscribe(value => {
      this.model.matchingPercentage = value;
      this.onChange();
    });

    this.formulaMatchingGroup.get('matchingDescription').valueChanges.subscribe(value => {
      this.model.matchingDescription = value;
      this.onChange();
    });

    this.formulaMatchingGroup.get('moeRequirements').valueChanges.subscribe(value => {
      this.model.moeRequirements = value;
      this.onChange();
    });
  }

  private onChange() {
    this.onChangeCallback(this.model);
  }

  private onChangeCallback: any = (_: any) => {};
  private onTouchedCallback: any = () => {};

  public registerOnChange(fn: any) : void {
    this.onChangeCallback = fn;
  }

  public registerOnTouched(fn: any) : void {
    this.onTouchedCallback = fn;
  }

  public writeValue(obj: any) : void {
    if(obj == null) {
      obj = {};
    }

    this.model = obj;

    if(this.model.checkbox == null) {
      this.model.checkbox = [];
    }

    if(this.model.checkbox) {
      this.formulaMatchingGroup.get('formulaMatching').setValue(this.model.checkbox);
    }

    if(this.model.title) {
      this.formulaMatchingGroup.get('title').setValue(this.model.title);
    }

    if(this.model.chapter) {
      this.formulaMatchingGroup.get('chapter').setValue(this.model.chapter);
    }

    if(this.model.part) {
      this.formulaMatchingGroup.get('part').setValue(this.model.part);
    }

    if(this.model.subPart) {
      this.formulaMatchingGroup.get('subpart').setValue(this.model.subPart);
    }

    if(this.model.publicLaw) {
      this.formulaMatchingGroup.get('publicLaw').setValue(this.model.publicLaw);
    }

    if(this.model.additionalInfo) {
      this.formulaMatchingGroup.get('additionalInfo').setValue(this.model.additionalInfo);
    }

    if(this.model.matchingRequirements) {
      this.formulaMatchingGroup.get('matchingRequirements').setValue(this.model.matchingRequirements);
    }

    if(this.model.matchingPercentage) {
      this.formulaMatchingGroup.get('matchingPercentage').setValue(this.model.matchingPercentage);
    }

    if(this.model.matchingDescription) {
      this.formulaMatchingGroup.get('matchingDescription').setValue(this.model.matchingDescription);
    }

    if(this.model.moeRequirements) {
      this.formulaMatchingGroup.get('moeRequirements').setValue(this.model.moeRequirements);
    }

    this.onChange();
  }

  public setDisabledState(isDisabled: boolean) : void {}

  public onCheckChanged(value, isChecked) {
    if (!isChecked) {
      // If the option was unchecked, remove it from the model
      this.model.checkbox = this.model.checkbox.filter(val => val !== value);
    } else {
      // Else, insert the checked item into the model in the correct order
      let i = 0;
      let thisOrder = this._ordering[value];
      while (i < this.model.checkbox.length) {
        let otherValue = this.model.checkbox[i];
        // If the item being inserted is after the current value, break and insert it
        if (thisOrder <= this._ordering[otherValue]){
          break;
        }
        i++;
      }
      let clone = this.model.checkbox.slice(0);
      clone.splice(i, 0, value);
      this.model.checkbox = clone;
    }
  }

  isChecked(value) {
    if(this.model && this.model.checkbox){
      return this.model.checkbox.indexOf(value) !== -1;
    } else {
      return false;
    }
  }
}
