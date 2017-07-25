import { Component, Input, forwardRef  } from '@angular/core';
import {NumberFormatter} from "@angular/common/src/pipes/intl";
import { ControlValueAccessor,NG_VALUE_ACCESSOR } from '@angular/forms';
/**
* SamSortComponent - Lists results message component
*/
@Component({
	selector: 'sam-sort',
	templateUrl:'./sam-sort.template.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SamSortComponent),
        multi: true
    }]
})
export class SamSortComponent implements ControlValueAccessor{
  options = [{
      label:"Sort By",
      name: "Sort By",
      value: ""
  },{
      label:"Ascending",
      name: "Ascending",
      value: "asc"
  },{
      label:"Descending",
      name: "Descending",
      value: "desc"
  },];
  selection = "";
  disabled = false;
  selectionHandler(evt){
    this.selection = evt;
    this.onTouched();
    this.onChange(this.selection);
  }

  onChange = (c)=>{};
  onTouched = ()=>{};

  setDisabledState(disabled) {
    this.disabled = disabled;
  }

  writeValue(value) {
    this.selection = value;
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
}
