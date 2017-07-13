import { Component, Input, ViewChild, forwardRef, ViewChildren } from "@angular/core";
import {
  ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, FormGroup,
  AbstractControl
} from "@angular/forms";
import { LabelWrapper } from "sam-ui-kit/wrappers/label-wrapper";
import { OptionsType } from "sam-ui-kit/types";


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
  // todo: document options
  @Input() control: FormControl;
  @Input() options: any; // optional - can pass all parameters in a single options object for convenience
  @Input() name: string; // required, subcomponent names are generated based on this component's name
  @Input() label: string;
  @Input() hint: string;
  @Input() required: boolean;
  @Input() validateComponentLevel: boolean;

  // checkbox
  @Input() checkboxOptions: OptionsType[]; // required
  @Input() checkboxHasSelectAll: boolean;

  // textarea
  @Input() textareaPlaceholder: string[]; // todo: implement this
  @Input() textareaDisabled: boolean[]; // todo: implement this
  @Input() textareaMaxlength: number[]; // todo: implement this
  @Input() textareaRequired: boolean[];
  @Input() textareaLabel: string[];
  @Input() textareaHint: string[];
  @Input() showWhenCheckbox: string; // 'checked' or 'unchecked'
  public textareaHidden: boolean[];

  public validationGroup: FormGroup;
  public textareaControls: FormControl[];
  @ViewChild('checkboxToggledTextareaLabel') wrapper: LabelWrapper;
  @ViewChildren('textarea') compTextarea;

  constructor() { }

  ngOnInit() {
    this.parseInputsAndSetDefaults();
    this.validateInputs();
    this.createFormControls();
  }

  ngAfterViewInit() {
    setTimeout(_=> this.toggleTextarea());
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
        this.checkboxOptions = this.checkboxOptions || this.options.checkbox.options;
        if(this.checkboxHasSelectAll == null) { this.checkboxHasSelectAll = this.options.checkbox.hasSelectAll; }
      }

      if(this.options.textarea) {
        this.textareaPlaceholder = this.textareaPlaceholder || this.options.textarea.placeholders;
        if(this.textareaDisabled == null) { this.textareaDisabled = this.options.textarea.disabled; }
        if(this.textareaMaxlength == null) { this.textareaMaxlength = this.options.textarea.maxlengths; }
        this.textareaRequired = this.textareaRequired || this.options.textarea.required;
        this.textareaLabel = this.textareaLabel || this.options.textarea.labels;
        this.textareaHint = this.textareaHint || this.options.textarea.hint;
        this.showWhenCheckbox = this.showWhenCheckbox || this.options.textarea.showWhenCheckbox;
      }
    }


    // Defaults
    if(this.required == null) { this.required = false; }
    if(this.validateComponentLevel == null) { this.validateComponentLevel = false; }

    this.textareaHidden = [];
    this.textareaRequired = this.textareaRequired || [];
    this.textareaLabel = this.textareaLabel || [];
    this.textareaHint= this.textareaHint || [];
    if(this.checkboxOptions) {
      for(let i = 0; i < this.checkboxOptions.length; i++) {
        this.textareaHidden.push(true);
        if(this.textareaLabel.length <= i || this.textareaLabel[i] == null) {
          this.textareaLabel.push('');
        }
        if(this.textareaHint.length <= i || this.textareaHint[i] == null) {
          this.textareaHint.push('');
        }
        if(this.textareaRequired.length <= i || this.textareaRequired[i] == null) {
          this.textareaRequired.push(false);
        }
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

  private createFormControls() {
    this.validationGroup = new FormGroup({});
    this.textareaControls = [];

    for(let i = 0; i < this.checkboxOptions.length; i++) {
      let textareaControl = new FormControl(null);
      textareaControl.valueChanges.subscribe(value => {
        // todo: figure out why this is being called twice on population
        this.model.textarea[i] = value;
        this.onChange();
      });

      this.textareaControls[i] = textareaControl;
      this.validationGroup.addControl('textarea' + i, textareaControl);
    }

     if(this.control) {
       this.control.statusChanges.subscribe(status => {
         this.wrapper.formatErrors(this.control);
       });
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
      let isChecked = this.model.checkbox.indexOf(this.checkboxOptions[i].value) >= 0;
      if (isChecked && this.showWhenCheckbox === 'checked' || !isChecked && this.showWhenCheckbox === 'unchecked') {
        this.textareaHidden[i] = false;
      } else {
        this.textareaHidden[i] = true;
      }
    }
  }

  private onChange() {
    let errored: AbstractControl = new FormControl();
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

      if(this.checkboxOptions) {
        for(let i = 0; i < this.checkboxOptions.length; i++) {
          if(this.model.textarea.length <= i) {
            this.model.textarea.push('');
          }
          if(this.model.textarea[i] == null) {
            this.model.textarea[i] = '';
          }
        }
      }

      for(let i = 0; i < this.checkboxOptions.length; i++) {
        this.textareaControls[i].setValue(this.model.textarea[i]);
      }
      this.toggleTextarea();
      this.onChange();
    }
  }

  // todo: implement disabled for checkbox
  public setDisabledState(isDisabled: boolean) : void {
  }
}
