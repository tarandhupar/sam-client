import { Component, Input, ViewChild, forwardRef } from "@angular/core";
import {
  ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, Validators, FormGroup,
  AbstractControl
} from "@angular/forms";
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
    textarea: []
  };

  // general
  @Input() options; // optional - can pass all parameters in a single options object for convenience
  @Input() name: string; // required, subcomponent names are generated based on this component's name
  @Input() label: string;
  @Input() hint: string;
  @Input() required: boolean;

  // checkbox
  @Input() checkboxOptions: any[]; // required
  @Input() checkboxHasSelectAll: boolean;

  // textarea
  @Input() textareaPlaceholder: string[]; // todo: implement this
  @Input() textareaDisabled: boolean[]; // todo: implement this
  @Input() textareaMaxlength: number[]; // todo: implement this
  public textareaHidden: boolean[] = [];

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
      if(this.required == null) { this.required = this.options.required }

      if(this.options.checkbox) {
        this.checkboxOptions = this.checkboxOptions || this.options.checkbox.options;
        for(let i = 0; i < this.checkboxOptions.length; i++) {
          this.textareaHidden.push(true);
        }
        if(this.checkboxHasSelectAll == null) { this.checkboxHasSelectAll = this.options.checkbox.hasSelectAll; }
      }

      if(this.options.textarea) {
        this.textareaPlaceholder = this.textareaPlaceholder || this.options.textarea.placeholder;
        if(this.textareaDisabled == null) { this.textareaDisabled = this.options.textarea.disabled; }
        if(this.textareaMaxlength == null) { this.textareaMaxlength = this.options.textarea.maxlength; }
      }
    }
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

    for(let i = 0; i < this.checkboxOptions.length; i++) {
      let textareaControl = new FormControl(null);
      if(this.required) {
        textareaControl.setValidators(Validators.required);
        textareaControl.updateValueAndValidity();
      }
      textareaControl.valueChanges.subscribe(value => {
        this.model.textarea[i] = value;
        this.onChange();
      });

      this.textareaControls[i] = textareaControl;
      this.validationGroup.addControl('textarea' + i, textareaControl);
    }

    this.toggleTextarea();
  }

  public onCheckboxChange(checkboxModel) {
    this.model.checkbox = checkboxModel;
    this.toggleTextarea();
    this.onChange();
  }

  private toggleTextarea() {
    for (let i = 0; i < this.checkboxOptions.length; i++) {
      if (this.model.checkbox.indexOf(this.checkboxOptions[i].value) >= 0) {
        this.textareaHidden[i] = true;
        this.textareaControls[i].setValidators(null);
        this.textareaControls[i].updateValueAndValidity();
      } else {
        this.textareaHidden[i] = false;
        if (this.required) {
          this.textareaControls[i].setValidators(Validators.required);
          this.textareaControls[i].updateValueAndValidity();
        }
      }
    }
  }

  private onChange() {
    let errored: AbstractControl = new FormControl();

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
    if(errored.pristine && !this.validationGroup.pristine) {
      errored.markAsDirty({onlySelf: true});
      this.wrapper.formatErrors(errored);
      errored.markAsPristine({onlySelf: true});
    } else {
      this.wrapper.formatErrors(errored);
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

      if(!this.model.textarea) {
        this.model.textarea = [];
      }

      if(!this.model.checkbox) {
        this.model.checkbox = [];
      }

      this.toggleTextarea();
      this.onChange();
    }
  }

  // todo: implement disabled for checkbox
  public setDisabledState(isDisabled: boolean) : void {
  }
}
