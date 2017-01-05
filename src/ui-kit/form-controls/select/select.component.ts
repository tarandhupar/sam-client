import {Component, Input, Output, ViewChild, EventEmitter, forwardRef} from '@angular/core';
import { LabelWrapper } from '../wrapper/label-wrapper.component';
import { OptionsType } from '../types';
import {FormControl, NG_VALUE_ACCESSOR, ControlValueAccessor, Validators} from "@angular/forms";

const MY_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SamSelectComponent),
  multi: true
};

/**
 * The <samSelect> component is a select/options group compliant with sam.gov standards
 * https://gsa.github.io/sam-web-design-standards/
 *
 * @Input/@Output value - the bound value of the component
 * @Input options: [{Option}] - the array of checkbox values and labels (see OptionsType)
 * @Input label: string - the innerHtml of <fieldset>
 * @Input name: string - semantic description for the component
 * @Input hint: string - helpful text for the using the component
 * @Input errorMessage: string - red error message
 *
 */
@Component({
  selector: 'samSelect',
  template: `
      <labelWrapper [label]="label" [name]="name" [hint]="hint" [errorMessage]="errorMessage" [required]="required">
        <select [attr.id]="name" [ngModel]="model" (change)="onSelectChange(select.value)" #select [disabled]="disabled">
          <option *ngFor="let option of options" [value]="option.value" [disabled]="option.disabled">{{option.label}}</option>
        </select>
      </labelWrapper>
  `,
  providers: [MY_VALUE_ACCESSOR]
})
export class SamSelectComponent implements ControlValueAccessor {
  @Input() model: string|number|symbol;
  @Input() options: OptionsType;
  @Input() label: string;
  @Input() name: string;
  @Input() hint: string;
  @Input() errorMessage: string;
  @Input() disabled: boolean;
  @Input() required: boolean;
  @Input() control: FormControl;

  @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(LabelWrapper)
  public wrapper: LabelWrapper;

  constructor() { }

  ngOnInitf() {
    if (!this.name) {
      throw new Error("<samSelect> requires a [name] parameter for 508 compliance");
    }

    if (!this.control) {
      return;
    }

    let validators: any[] = [];

    if (this.required) {
      validators.push(Validators.required);
    }

    this.control.setValidators(validators);
    this.control.valueChanges.subscribe(this.onChange);
  }

  onSelectChange(val) {
    this.model = val;
    this.modelChange.emit(val);
    this.onChange(val);
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
    this.model = value;
  }

  onChange: any = () => {
    if (this.control && this.control.invalid && this.control.errors) {
      for (let k in this.control.errors) {
        let errorObject = this.control[k];
        switch (k) {
          case 'required':
            this.errorMessage = 'This field cannot be empty';
            break;
          default:
            if (errorObject.message) {
              this.errorMessage = errorObject.message;
            } else {
              this.errorMessage = 'Invalid';
            }
        }
      }
    }
    if (this.control && this.control.valid) {
      this.errorMessage = '';
    }
  };

  onTouched: any = () => {

  };


}
