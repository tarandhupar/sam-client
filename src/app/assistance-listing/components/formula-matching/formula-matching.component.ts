import { Component, Input, ViewChild, forwardRef } from "@angular/core";
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, FormGroup } from "@angular/forms";
import { LabelWrapper } from "sam-ui-kit/wrappers/label-wrapper";

@Component({
  selector: 'falFormulaMatchingInput',
  templateUrl: 'formula-matching.template.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FALFormulaMatchingComponent),
      multi: true
    }
  ]
})
export class FALFormulaMatchingComponent implements ControlValueAccessor {
  private model: any = {}; // internally maintained model - should never be null or undefined

  public formulaMatchingOptions = [
    { value: 'cfr', label: 'This listing has statutory formula/or administrative rule reference in the CFR', name: this.name + '-checkbox-cfr' },
    { value: 'matching', label: 'This listing has matching requirements', name: this.name + '-checkbox-matching-requirements' },
    { value: 'moe', label: 'This listing has maintenance of effort (MOE) requirements AND total allocations over $100 million for the current fiscal year.', name: this.name + '-checkbox-moe' }
  ];

  public matchingRequirementsOptions = (() => {
    let percentages = [];
    for(let i = 0; i <= 100; i+=5) {
      percentages.push({value: i, label: i.toString(), name: this.name + '-percentage' + i});
    }

    return percentages;
  })();

public formulaMatchingGroup: FormGroup;

  @Input() options: any; // all inputs are passed through a single options object
  public name: string;
  public label: string;
  public hint: string;
  public required: boolean;

  @ViewChild('formulaMatchingLabel') wrapper: LabelWrapper;

  constructor() { }

  ngOnInit() {
    this.parseOptionsAndSetDefaults();
    this.validateInputs();
    this.createFormControls();
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
      this.model.subpart = value;
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

  public onCheckboxChange(checkboxModel) {
    // todo...
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
    this.onChange();
  }

  public setDisabledState(isDisabled: boolean) : void {}
}
