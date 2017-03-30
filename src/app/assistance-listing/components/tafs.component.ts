import { Component, Input, forwardRef, ViewChild } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormGroup, FormControl } from "@angular/forms";
import { LabelWrapper } from "sam-ui-kit/wrappers";

@Component({
  selector: 'falTAFSInput',
  templateUrl: 'tafs.template.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FALTafsComponent),
      multi: true
    }
  ]
})
export class FALTafsComponent implements ControlValueAccessor {
  private currentIndex: number = 0;
  public model = {
    tafs: [] // todo: document
  };

  // general
  @Input() options; // optional - can pass all parameters in a single options object for convenience
  @Input() name: string; // required
  @Input() label: string;
  @Input() hint: string;
  @Input() required: boolean;

  // tafs
  private tafsFormGroup;

  @ViewChild('tafsLabel') tafsWrapper: LabelWrapper;

  constructor() { }

  ngOnInit() {
    this.parseInputsAndSetDefaults();
    this.validateInputs();
    this.createFormControls();
  }

  private parseInputsAndSetDefaults() {
    // inputs can either be passed directly, or through an options object
    // if an input is passed both ways, the value passed directly will take precedence
    if(this.options) {
      this.name = this.name || this.options.name;

      this.label = this.label || this.options.label;
      this.hint = this.hint || this.options.hint;
      if(this.required == null) { this.required = this.options.required }
    }

    // subcomponent names are generated based on this component's name within html template
  }

  private validateInputs() {
    let errorPrefix = "<samTAFSInput> requires ";

    if(!this.name) {
      throw new Error(errorPrefix + "a [name] parameter for 508 compliance");
    }
  }

  private createFormControls() {
    this.tafsFormGroup = new FormGroup({
      treasuryDeptCode: new FormControl(null),
      treasuryMainCode: new FormControl(null),
      tafsSubCode: new FormControl(null),
      allocationTransferCode: new FormControl(null),
      fy1Code: new FormControl(null),
      fy2Code: new FormControl(null)
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
    if(obj) {
      this.model = obj;

      // todo ...

      this.onChange();
    }
  }
}
