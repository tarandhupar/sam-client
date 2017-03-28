import { Component, Input, ViewChild, forwardRef } from "@angular/core";
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, FormGroup, Validators } from "@angular/forms";
import { LabelWrapper } from "sam-ui-kit/wrappers/label-wrapper";

@Component({
  selector: 'samAccountIdentification',
  templateUrl: 'account-identification.template.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SamAccountIdentificationComponent),
      multi: true
    }
  ]
})
export class SamAccountIdentificationComponent implements ControlValueAccessor {
  public model = {
    codeBoxes: [],
    descriptionText: '',

    accounts: [] // { code: '', description: '' }
  };

  // general
  @Input() options; // optional - can pass all parameters in a single options object for convenience
  @Input() name: string; // required
  @Input() label: string;
  @Input() hint: string;
  @Input() required: boolean;
  public accountFormGroup: FormGroup;

  //code
  public codeLabelName: string;
  @Input() codeHint: string;
  public codeBoxLengths: number[] = [2, 4, 1, 1, 3];
  private codeFormGroup: FormGroup;

  // textarea
  public textareaName: string;

  public textareaControl: FormControl;
  @ViewChild('accountIdentificationLabel') wrapper: LabelWrapper;
  @ViewChild('codeLabel') codeWrapper: LabelWrapper;

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
      this.codeHint = this.codeHint || this.options.codeHint;
      if(this.required == null) { this.required = this.options.required }
    }

    // subcomponent names are generated based on this component's name
    this.codeLabelName = this.name + '-code-label';
    this.textareaName = this.name + '-textarea';
  }

  private validateInputs() {
    let errorPrefix = "<samAccountIdentification> requires ";

    if(!this.name) {
      throw new Error(errorPrefix + "a [name] parameter for 508 compliance");
    }
  }

  private createFormControls() {
    this.accountFormGroup = new FormGroup({});
    this.codeFormGroup = new FormGroup({});
    this.accountFormGroup.addControl('codeBoxes', this.codeFormGroup);

    for(let i = 0; i < this.codeBoxLengths.length; i++) {
      let codeBoxControl = new FormControl('', Validators.required);
      codeBoxControl.valueChanges.subscribe(value => {
        this.model.codeBoxes[i] = value;
        this.onChange();
      });

      this.codeFormGroup.addControl('codeBox' + i, codeBoxControl);
    }

    this.textareaControl = new FormControl();
    this.textareaControl.valueChanges.subscribe(value => {
      this.model.descriptionText = value;
      this.onChange();
    });
    this.accountFormGroup.addControl('textarea', this.textareaControl);
  }

  public addAccount() {
    let account = {};
    let code = '';
    for(let i = 0; i < this.codeBoxLengths.length; i++) {
      code = code + this.codeFormGroup.get('codeBox'+i).value;
    }

    account['code'] = code;
    account['description'] = this.textareaControl.value;
    this.model.accounts.push(account);
    this.accountFormGroup.reset();
  };

  private onChange() {
    this.wrapper.formatErrors(this.accountFormGroup);
    this.codeWrapper.formatErrors(this.codeFormGroup);
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
