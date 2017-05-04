import { Component, Input, ViewChild, forwardRef } from "@angular/core";
import {
  ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, FormGroup, Validators,
  AbstractControl
} from "@angular/forms";
import { LabelWrapper } from "sam-ui-kit/wrappers/label-wrapper";

@Component({
  selector: 'falAccountIdentificationInput',
  templateUrl: 'account-identification.template.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FALAccountIdentificationComponent),
      multi: true
    }
  ]
})
export class FALAccountIdentificationComponent implements ControlValueAccessor {
  //todo: refactor model duplication
  private currentIndex: number = 0;
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
  public showForm: boolean = false;

  //code
  public codeLabelName: string;
  @Input() codeHint: string;
  public codeBoxLengths: number[] = [2, 4, 1, 1, 3];
  private codeFormGroup: FormGroup;

  // textarea
  public textareaName: string;
  public textareaControl: FormControl;

  // label wrappers
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
    // names of code text boxes are generated in html template
    this.codeLabelName = this.name + '-code-label';
    this.textareaName = this.name + '-textarea';
  }

  private validateInputs() {
    let errorPrefix = "<falAccountIdentificationInput> requires ";

    if(!this.name) {
      throw new Error(errorPrefix + "a [name] parameter for 508 compliance");
    }
  }

  private createFormControls() {
    this.accountFormGroup = new FormGroup({});
    this.codeFormGroup = new FormGroup({});
    this.accountFormGroup.addControl('codeBoxes', this.codeFormGroup);

    for(let i = 0; i < this.codeBoxLengths.length; i++) {
      let codeBoxControl = new FormControl(null, [Validators.required, Validators.pattern('[0-9]*')]);
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

  public displayForm() {
    this.showForm = true;
  }

  public addAccount() {
    let account = {};
    let code = this.codeFormGroup.get('codeBox0').value;
    for(let i = 1; i < this.codeBoxLengths.length; i++) {
      code = code + '-' + this.codeFormGroup.get('codeBox'+i).value;
    }

    account['code'] = code;
    account['description'] = this.textareaControl.value;
    this.model.accounts[this.currentIndex] = account;
    this.resetForm();
  };

  public removeAccount(index: number) {
    this.model.accounts.splice(index, 1);
    if(index === this.currentIndex) {
      this.accountFormGroup.reset();
      this.currentIndex = this.model.accounts.length;
    } else if(index < this.currentIndex) {
      this.currentIndex--;
    }

    this.onChange();
  }

  public editAccount(index: number) {
    let code = this.model.accounts[index].code;
    let splits = code.split('-');
    for(let i = 0; i < this.codeBoxLengths.length; i++) {
      this.codeFormGroup.get('codeBox' + i).setValue(splits[i]);
    }

    // this.codeBoxLengths.reduce((acc, length, i) => {
    //   this.codeFormGroup.get('codeBox' + i).setValue(code.slice(acc, acc+length));
    //   return acc + length;
    // }, 0);

    let description = this.model.accounts[index].description || '';
    this.textareaControl.setValue(description);

    this.currentIndex = index;
    this.showForm = true;
  }

  public resetForm() {
    this.currentIndex = this.model.accounts.length;
    this.accountFormGroup.reset();
    this.showForm = false;

    this.onChange();
  }

  // Modified version of code originally by Joseph Lennox
  // http://stackoverflow.com/a/15595732
  private onKeyup(event) {
    let target = event.srcElement || event.target;
    let maxLength = parseInt(target.attributes["maxlength"].value, 10);
    let currentLength = target.value.length;
    if (currentLength >= maxLength) {
      var next = target.parentNode.parentNode.parentNode;
      while (next = next.nextElementSibling) {
        if (next == null)
          break;
        if (next.tagName.toLowerCase() === "samtext") {
          next.getElementsByTagName('input')[0].focus();
          break;
        }
      }
    }
    // Move to previous field if empty (user pressed backspace)
    else if (currentLength === 0) {
      var previous = target.parentNode.parentNode.parentNode;
      while (previous = previous.previousElementSibling) {
        if (previous == null)
          break;
        if (previous.tagName.toLowerCase() === "samtext") {
          previous.getElementsByTagName('input')[0].focus();
          break;
        }
      }
    }
  }

  private onChange() {
    this.onChangeCallback(this.model);

    let errored: AbstractControl = new FormControl();

    // todo: add check for whether user is editing
    for (let key in this.codeFormGroup.controls) {
      if (this.codeFormGroup.controls.hasOwnProperty(key)) {
        let control = this.codeFormGroup.controls[key];
        if (control.invalid && control.errors) {
          errored = control;
          break;
        }
      }
    }

    // Magic happens here
    if(errored.pristine && !this.codeFormGroup.pristine) {
      errored.markAsDirty({onlySelf: true});
      this.codeWrapper.formatErrors(errored);
      errored.markAsPristine({onlySelf: true});
    } else {
      this.codeWrapper.formatErrors(errored);
    }

    // todo: implement this in separate function
    // this.wrapper.formatErrors(this.accountFormGroup);
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
      this.currentIndex = this.model.accounts.length;

      this.onChange();
    }
  }
}
