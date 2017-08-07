import { Component, Input, forwardRef  } from '@angular/core';
import {NumberFormatter} from "@angular/common/src/pipes/intl";
import { ControlValueAccessor,NG_VALUE_ACCESSOR } from '@angular/forms';
import { OptionsType } from 'sam-ui-kit/types';
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
  @Input() options:OptionsType[] = [{
      label:"",
      name: "Sort By",
      value: ""
  }];
  sort = "asc";
  selection = "";
  disabled = false;
  selectionHandler(evt){
    this.selection = evt;
    this.onTouched();
    this.onChange({type:this.selection,sort:this.sort});
  }

  toggleSort(){
    this.onTouched();
    this.sort = this.sort!='asc'?'asc':'desc';
    this.onChange({type:this.selection,sort:this.sort});
  }

  onChange = (c)=>{};
  onTouched = ()=>{};

  setDisabledState(disabled) {
    this.disabled = disabled;
  }

  writeValue(value:{type:string,sort:string}={type:"",sort:"asc"}) {
    if(value && value.type){
      this.selection = value.type;
    } 
    if(value && value.sort){
      this.sort = value.sort;
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
}
