import { Component, Input, forwardRef, ViewChild } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormGroup, FormControl, Validators } from "@angular/forms";
import { LabelWrapper } from "sam-ui-kit/wrappers/label-wrapper";

@Component({
  selector: 'falFYTable',
  templateUrl: 'fiscal-year-table.template.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FALFiscalYearTableComponent),
      multi: true
    }
  ]
})
export class FALFiscalYearTableComponent implements ControlValueAccessor {
  @Input() options; // all inputs are passed through a single options object
  public name: string;
  public label: string;
  public hint: string;
  public required: boolean;

  private model: any = {}; // internally maintained model - should never be null or undefined
  public fyTableGroup: FormGroup;

  @ViewChild('fyTableWrapper') fyTableWrapper: LabelWrapper;

  constructor() { }

  ngOnInit() {
    this.parseInputsAndSetDefaults();
    this.validateInputs();
    this.createFormControls();
  }

  private parseInputsAndSetDefaults() {
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
    let errorPrefix = "<falFYTable> requires ";

    if(!this.name) {
      throw new Error(errorPrefix + "a [name] parameter for 508 compliance");
    }
  }

  private createFormControls() {
    this.fyTableGroup = new FormGroup({});
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
    this.onChange();
  }

  public setDisabledState(isDisabled: boolean) : void {}
}
