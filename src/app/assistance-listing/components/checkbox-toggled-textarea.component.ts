import { Component, Input, ViewChild, forwardRef } from "@angular/core";
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, Validators } from "@angular/forms";
import { LabelWrapper } from "sam-ui-kit/wrappers/label-wrapper";

@Component({
  selector: 'samCheckboxToggledTextarea',
  templateUrl: 'checkbox-toggled-textarea.template.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SamCheckboxToggledTextareaComponent),
      multi: true
    }
  ]
})
export class SamCheckboxToggledTextareaComponent implements ControlValueAccessor {
  public model = {
    checkbox: [],
    textarea: ''
  };

  // general
  @Input() options; // optional - can pass all parameters in a single options object for convenience
  @Input() name: string; // required
  @Input() label: string;
  @Input() hint: string;
  @Input() required: boolean;

  // checkbox
  public checkboxName: string;
  @Input() checkboxOptions: {}; // required
  @Input() checkboxHasSelectAll: boolean;

  // textarea
  public textareaName: string;
  @Input() textareaPlaceholder: string;
  @Input() textareaDisabled: boolean;
  @Input() textareaMaxlength: number; // todo: implement this
  @Input() textareaHidden: boolean; // todo: implement this

  public textareaControl: FormControl;
  @ViewChild('checkboxToggledTextareaLabel') wrapper: LabelWrapper;

  constructor() { }

  ngOnInit() {
    this.parseInputsAndSetDefaults();
    this.validateInputs();
    this.createTextareaControl();
  }

  private parseInputsAndSetDefaults() {
    // inputs can either be passed directly, or through an options object
    // if an input is passed both ways, the value passed directly will take precedence
    if(this.options) {
      this.name = this.name || this.options.name;

      this.label = this.label || this.options.label;
      this.hint = this.hint || this.options.hint;
      if(this.required == null) { this.required = this.options.required }

      if(this.options.checkbox) {
        this.checkboxOptions = this.checkboxOptions || this.options.checkbox.options;
        if(this.checkboxHasSelectAll == null) { this.checkboxHasSelectAll = this.options.checkbox.hasSelectAll; }
      }

      if(this.options.textarea) {
        this.textareaPlaceholder = this.textareaPlaceholder || this.options.textarea.placeholder;
        if(this.textareaDisabled == null) { this.textareaDisabled = this.options.textarea.disabled; }
        if(this.textareaMaxlength == null) { this.textareaMaxlength = this.options.textarea.maxlength; }
        if(this.textareaHidden == null) { this.textareaHidden = this.options.textarea.hidden; }
      }
    }

    // subcomponent names are generated based on this component's name
    this.checkboxName = this.name + '-checkbox';
    this.textareaName = this.name + '-textarea';
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

  private createTextareaControl() {
    this.textareaControl = new FormControl(null);
    if(this.required) {
      this.textareaControl.setValidators(Validators.required);
      this.textareaControl.updateValueAndValidity();
    }
    this.textareaControl.valueChanges.subscribe(value => {
      this.model.textarea = value;
      this.onChange();
    });
  }

  public onCheckboxChange(checkboxModel) {
    this.model.checkbox = checkboxModel;
    this.toggleTextarea();
    this.onChange();
  }

  private toggleTextarea() {
    // todo: fix array.prototype.includes does not exist warning
    if(this.model.checkbox.includes('na')) { // todo: generalize this
      this.textareaHidden = true;
      this.textareaControl.setValidators(null);
      this.textareaControl.updateValueAndValidity();
    } else {
      this.textareaHidden = false;
      if(this.required) {
        this.textareaControl.setValidators(Validators.required);
        this.textareaControl.updateValueAndValidity();
      }
    }
  }

  private onChange() {
    this.wrapper.formatErrors(this.textareaControl);
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

      if(!this.model.textarea) {
        this.model.textarea = '';
      }

      if(!this.model.checkbox) {
        this.model.checkbox = [];
      }

      this.textareaControl.setValue(this.model.textarea);
      this.toggleTextarea();
      this.onChange();
    }
  }

  // todo: finish implementation of disabled for checkbox
  public setDisabledState(isDisabled: boolean) : void {
    this.textareaDisabled = isDisabled;
  }
}
