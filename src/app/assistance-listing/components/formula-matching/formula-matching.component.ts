import { Component, Input, ViewChild, forwardRef } from "@angular/core";
import {
  ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, Validators, FormGroup,
  AbstractControl
} from "@angular/forms";
import { LabelWrapper } from "sam-ui-kit/wrappers/label-wrapper";
import { OptionsType } from "sam-ui-kit/types";

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
  public model = {};

  // general
  @Input() options: any;
  @Input() name: string;
  @Input() label: string;
  @Input() hint: string;
  @Input() required: boolean;

  constructor() { }

  ngOnInit() {
    this.parseInputsAndSetDefaults();
    this.validateInputs();
    this.createTextareaControls();
  }

  private parseInputsAndSetDefaults() {}

  private validateInputs() {
    let errorPrefix = "<falFormulaMatchingInput> requires ";

    if(!this.name) {
      throw new Error(errorPrefix + "a [name] parameter for 508 compliance");
    }
  }

  private createTextareaControls() {}

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
    if(obj) {
      this.model = obj;

      this.onChange();
    }
  }

  public setDisabledState(isDisabled: boolean) : void {}
}
