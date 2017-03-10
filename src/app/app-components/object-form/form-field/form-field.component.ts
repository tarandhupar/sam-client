import { Component, Input, forwardRef,  OnInit } from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor, FormGroup} from "@angular/forms";

export const FORM_FIELD_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FormFieldComponent),
  multi: true
};

@Component({
  selector: 'form-field',
  templateUrl: 'form-field.template.html',
  providers: [ FORM_FIELD_VALUE_ACCESSOR ]
})
export class FormFieldComponent implements ControlValueAccessor{
  @Input() field;
  @Input() value;
  @Input() control;
  @Input() fieldFormGroup: FormGroup;

  onChange: any = () => { };
  onTouched: any = () => { };

  /*ngOnInit(){
     this.writeValue("Test23");
      this.control.patchValue("kajdsaljd");
      this.registerOnTouched(() => { });
  }*/

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  writeValue(value) {
    this.value = value;
  }

}
