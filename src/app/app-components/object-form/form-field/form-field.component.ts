import { Component, Input, forwardRef,  OnInit } from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from "@angular/forms";


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
export class FormFieldComponent implements ControlValueAccessor, OnInit{
  @Input() field;
  @Input() value;
  @Input() control;

  private _formControlName;

  onChange: any = () => { };
  onTouched: any = () => { };

  ngOnInit(){
      this.writeValue("Test23");
      this.control.patchValue("kajdsaljd");
      this.registerOnTouched(() => { });
  }

  registerOnChange(fn) {
    this.onChange = fn;
    console.log("registeronchange");
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
    console.log("registerontouch");
  }

  writeValue(value) {
    //this._formControlName = value;
    //console.log("writevalue", value);
    this.value = value;
  }

}
