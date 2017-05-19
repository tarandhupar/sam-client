import { Component, Input, Output, EventEmitter, ViewChild, forwardRef } from '@angular/core';
import { FieldsetWrapper } from '../../wrappers/fieldset-wrapper';
import { OptionsType } from '../../types';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl, Validators, ValidatorFn } from "@angular/forms";


/**
 * The <sam-radio-button> component is a set of checkboxes compliant with sam.gov standards
 */
@Component({
  selector: 'sam-radio-button',
  templateUrl: 'radiobutton.template.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SamRadioButtonComponent),
    multi: true
  }]
})
export class SamRadioButtonComponent  {
  /**
  * Sets the bound value of the component
  */
  @Input() model: string|number|symbol;
  /**
  * Sets the array of checkbox values and labels (see OptionsType)
  */
  @Input() options: OptionsType[];
  /**
  * Sets the label text
  */
  @Input() label: string;
  /**
  * Sets the semantic description for the component
  */
  @Input() name: string;
  /**
  * Sets the helpful text for the using the component
  */
  @Input() hint: string;
  /**
  * Sets required text on component
  */
  @Input() required: boolean = false;
  /**
  * Sets the general error message
  */
  @Input() errorMessage: string;
  /**
  * Sets the angular FormControl
  */
  @Input() control: FormControl;
  /**
  * Event emitted when model value changes
  */
  @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(FieldsetWrapper)
  public wrapper: FieldsetWrapper;
  private disabled = null;

  constructor() { }

  ngOnInit() {
    if (!this.name) {
      throw new Error("<sam-radio-button> requires a [name] parameter for 508 compliance");
    }

    if(!this.control){
      return;
    }

    this.control.valueChanges.subscribe(()=>{
      this.wrapper.formatErrors(this.control);
    });

    this.wrapper.formatErrors(this.control);
  }

  onRadioChange(value) {
    this.model = value;
    this.onChange(value);
    this.modelChange.emit(value);
  }
  
  onChange: any = () => { };
  onTouched: any = () => { };
  
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
    this.model = value;
  }
}
