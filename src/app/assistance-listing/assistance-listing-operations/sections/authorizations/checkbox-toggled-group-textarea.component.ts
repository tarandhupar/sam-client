import { Component, Input, ViewChild, forwardRef } from "@angular/core";
import {
  ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, Validators, FormGroup,
  AbstractControl
} from "@angular/forms";
import { LabelWrapper } from "sam-ui-kit/wrappers/label-wrapper";
import { OptionsType } from "sam-ui-kit/types";

@Component({
  selector: 'samCheckboxToggledGroupTextarea',
  templateUrl: 'checkbox-toggled-group-textarea.template.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SamCheckboxToggledGroupTextareaComponent),
      multi: true
    }
  ]
})
export class SamCheckboxToggledGroupTextareaComponent implements ControlValueAccessor {
  public model = {
    checkbox: [],
    textareaGrp: []
  };

  // general
  // todo: document options
  @Input() options: any; // optional - can pass all parameters in a single options object for convenience
  @Input() name: string; // required, subcomponent names are generated based on this component's name
  @Input() label: string;
  @Input() hint: string;
  @Input() required: boolean;
  @Input() validateComponentLevel: boolean;

  // checkbox
  @Input() checkboxOptions: OptionsType[]; // required
  @Input() checkboxHasSelectAll: boolean;
  @Input() checkboxRequired: boolean;

  // textarea
  @Input() textareaPlaceholder: string[]; // todo: implement this
  @Input() textareaDisabled: boolean[]; // todo: implement this
  @Input() textareaMaxlength: number[]; // todo: implement this
  @Input() textareaRequired: any[];
  @Input() textareaLabel: any[];
  @Input() textareaName: any[];
  @Input() grpHeader: string[];
  @Input() showWhenCheckbox: string; // 'checked' or 'unchecked'
  public textareaHidden: boolean[];

  public validationGroup: FormGroup;
  public textareaControls: FormControl[];
  @ViewChild('checkboxToggledTextareaLabel') wrapper: LabelWrapper;

  constructor() { }

  ngOnInit() {
    this.parseInputsAndSetDefaults();
    this.validateInputs();
    this.createTextareaControls();
  }

  private parseInputsAndSetDefaults() {
    // inputs can either be passed directly, or through an options object
    // if an input is passed both ways, the value passed directly will take precedence
    if(this.options) {
      this.name = this.name || this.options.name;
      this.label = this.label || this.options.label;
      this.hint = this.hint || this.options.hint;

      if(this.required == null) { this.required = this.options.required; }

      if(this.validateComponentLevel == null) { this.validateComponentLevel = this.options.validateComponentLevel; }

      if(this.options.checkbox) {
        this.checkboxRequired = this.checkboxRequired || this.options.checkbox.reuired;
        this.checkboxOptions = this.checkboxOptions || this.options.checkbox.options;
        if(this.checkboxHasSelectAll == null) { this.checkboxHasSelectAll = this.options.checkbox.hasSelectAll; }
      }

      if(this.options.textarea) {
        this.textareaPlaceholder = this.textareaPlaceholder || this.options.textarea.placeholders;
        if(this.textareaDisabled == null) { this.textareaDisabled = this.options.textarea.disabled; }
        if(this.textareaMaxlength == null) { this.textareaMaxlength = this.options.textarea.maxlengths; }
        this.textareaRequired = this.textareaRequired || this.options.textarea.required;
        this.textareaLabel = this.textareaLabel || this.options.textarea.labels;
        this.textareaName = this.textareaName || this.options.textarea.name;
        this.showWhenCheckbox = this.showWhenCheckbox || this.options.textarea.showWhenCheckbox;
        this.grpHeader = this.grpHeader || this.options.textarea.grpHeader;
      }
    }


    // Defaults
    if(this.required == null) { this.required = false; }
    if(this.validateComponentLevel == null) { this.validateComponentLevel = false; }

    this.textareaHidden = [];
    this.textareaRequired = this.textareaRequired || [];
    this.textareaLabel = this.textareaLabel || [];
    if(this.checkboxOptions) {
      let k=0;
      for(let i = 0; i < this.checkboxOptions.length; i++) {
        this.textareaHidden.push(true);
        /*for(let j=0; j< this.textareaLabel[i].length; j++){
          if(this.textareaLabel.length <= i || this.textareaLabel[i][j] == null) {
            this.textareaLabel.push({j:''});
          }
          if(this.textareaRequired.length <= i || this.textareaRequired[i][j] == null) {
            this.textareaRequired.push({j:false});
          }
        }*/
      }
    }

    this.showWhenCheckbox = this.showWhenCheckbox || 'checked';
  }

  private validateInputs() {
    let errorPrefix = "<samCheckboxToggledTextarea> requires ";

    if(!this.name) {
      throw new Error(errorPrefix + "a [name] parameter for 508 compliance");
    }

    if(!this.checkboxOptions) {
      throw new Error(errorPrefix + "a [checkboxOptions] parameter");
    }
  }

  private createTextareaControls() {
    this.validationGroup = new FormGroup({});
    this.textareaControls = [];
    let k=0;

    for (let i = 0; i < this.checkboxOptions.length; i++) {

      for (let j = 0; j < this.textareaLabel[i].length; j++) {

        let textareaControl = new FormControl(null);
        if (this.required || this.textareaRequired[i][j]) {
          textareaControl.setValidators(Validators.required);
          textareaControl.updateValueAndValidity();
        }

        textareaControl.valueChanges.subscribe(value => {
          // todo: figure out why this is being called twice on population
          if(!this.model.textareaGrp[i])
            this.model.textareaGrp[i] =[];

          this.model.textareaGrp[i][j] = {name:this.textareaName[i][j],
                                          value:value};
          this.onChange();
        });

        this.textareaControls[k] = textareaControl;
        this.validationGroup.addControl('textarea' + i + '-' + j, textareaControl);
        k++;
      }
    }

    this.toggleTextarea();
  }

  public onCheckboxChange(checkboxModel) {
    this.model.checkbox = checkboxModel;
    this.toggleTextarea();
    this.onChange();
  }

  private toggleTextarea() {

    let k=0;
    for (let i = 0; i < this.checkboxOptions.length; i++) {

      let isChecked = this.model.checkbox.indexOf(this.checkboxOptions[i].value) >= 0;

      for(let j=0; j<this.textareaLabel[i].length; j++){

        if (isChecked && this.showWhenCheckbox === 'checked' || !isChecked && this.showWhenCheckbox === 'unchecked') {
          this.textareaHidden[i] = false;
          if (this.required || this.textareaRequired[i][j]) {
            this.textareaControls[k].setValidators(Validators.required);
            this.textareaControls[k].updateValueAndValidity();
          }
        } else {
          this.textareaHidden[i] = true;
          //this.textareaControls[k].setValue('');
          this.textareaControls[k].setValidators(null);
          this.textareaControls[k].updateValueAndValidity();
        }
        k=k++;
      }
    }
  }

  private onChange() {
    let errored: AbstractControl = new FormControl();

    if(this.validateComponentLevel) {
      for (let key in this.validationGroup.controls) {
        if (this.validationGroup.controls.hasOwnProperty(key)) {
          let control = this.validationGroup.controls[key];
          if (control.invalid && control.errors) {
            errored = control;
            break;
          }
        }
      }

      // Magic happens here
      if (errored.pristine && !this.validationGroup.pristine) {
        errored.markAsDirty({onlySelf: true});
        this.wrapper.formatErrors(errored);
        errored.markAsPristine({onlySelf: true});
      } else {
        this.wrapper.formatErrors(errored);
      }
    }

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
    if(obj) {
      this.model = obj;

      if(!this.model.textareaGrp) {
        this.model.textareaGrp = [];
      }

      if(!this.model.checkbox) {
        this.model.checkbox = [];
      }

      let k=0;
      let val='';
      for(let i = 0; i < this.checkboxOptions.length; i++) {
        for(let j=0; j< this.textareaLabel[i].length; j++){
          if(this.model.textareaGrp[i] && this.model.textareaGrp[i][j] && this.model.textareaGrp[i][j] != null){
            val = this.model.textareaGrp[i][j].value;
          }
          else {
            val = '';
          }

          this.textareaControls[k].setValue(val);
          k++;
        }
      }
      this.toggleTextarea();
      this.onChange();
    }
  }

  // todo: implement disabled for checkbox
  public setDisabledState(isDisabled: boolean) : void {
  }
}
