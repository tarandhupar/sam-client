import {Component, Input, ViewChild, forwardRef, Output, EventEmitter} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl, Validators, ValidatorFn} from "@angular/forms";
import {LabelWrapper} from "../../../../sam-ui-elements/src/ui-kit/wrappers/label-wrapper/label-wrapper.component";

export const TEXT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SamFALTextComponent),
  multi: true
};

/**
 * The <sam-text> component provides a text input form control
 */
@Component({
  selector: 'sam-fal-text',
  templateUrl: 'fal-text.template.html',
  providers: [ TEXT_VALUE_ACCESSOR ]
})
export class SamFALTextComponent implements ControlValueAccessor {

  @Input() pending: any;
  /**
   * Sets cfdaCode
   */
  @Input() cfdaCode: string;
  /**
  * Sets the text input value
  */
  @Input() value: string = '';
  /**
  * Sets the label text
  */
  @Input() label: string;
  /**
  * Sets the name attribute
  */
  @Input() name: string;
  /**
  * Sets the helpful hint text
  */
  @Input() hint: string;
  /**
  * Sets the general error message
  */
  @Input() errorMessage: string;
  /**
  * Sets the disabled attribute
  */
  @Input() disabled: boolean;
  /**
  * Sets the required attribute
  */
  @Input() required: boolean;
  /**
  * Passes in the Angular FormControl
  */
  @Input() control: FormControl;
  /**
  * Sets the maxlength attribute
  */
  @Input() maxlength: number;
  /**
   * Lose focus event emit
   */
  @Output() onBlur:EventEmitter<boolean> = new EventEmitter<boolean>();

  onChange: any = () => {
    this.wrapper.formatErrors(this.control);
  };
  onTouched: any = () => { };
  onLoseFocus: any = () => {this.onBlur.emit(true)};

  @ViewChild(LabelWrapper) wrapper: LabelWrapper;

  constructor() {

  }

  ngOnInit() {
    if (!this.name) {
      throw new Error("<sam-text> requires a [name] parameter for 508 compliance");
    }

    if (!this.control) {
      return;
    }

    let validators: ValidatorFn[] = [];

    if(this.control.validator){
      validators.push(this.control.validator);
    }

    if (this.required) {
      validators.push(Validators.required);
    }

    if (this.maxlength) {
      validators.push(Validators.maxLength(this.maxlength));
    }
    this.control.setValidators(validators);
    this.control.statusChanges.subscribe(this.onChange);

    this.wrapper.formatErrors(this.control);
  }

  onInputChange(value) {
    if(this.control){
      this.control.markAsDirty();
      this.control.markAsTouched();
      this.control.setValue(value);
    }
    this.value = value;
    this.onChange(value);
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  setDisabledState(disabled) {
    this.disabled = disabled;
  }

  writeValue(value) {
    this.value = value;
  }
}