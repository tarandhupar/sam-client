import { Component, ChangeDetectorRef, forwardRef, Directive, Input, ElementRef, Renderer, Output, OnInit } from "@angular/core";
import { ControlValueAccessor,NG_VALUE_ACCESSOR,AbstractControl } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'sam-entity-picker',
  templateUrl:'entity-picker.template.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => EntityPickerComponent),
    multi: true
  }]
})
export class EntityPickerComponent implements OnInit, ControlValueAccessor{
  /**
   * Sets the required text in the label wrapper
   */
  @Input() required: boolean;
  /**
   * Sets the label wrapper text
   */
  @Input() label: string;
  /**
   * Sets the name/id properties with form elements + labels
   */
  @Input() name: string = "default";
  /**
   * Sets the hint text
   */
  @Input() hint: string;
  /**
   * Sets the placeholder text
   */
  @Input() placeholder: string = '';
  /**
   * Sets the label wrapper error message manually
   */
  @Input() searchMessage: string = '';
  /**
   * Sets whether to show a multi autocomplete entity picker or single autocomplete entity picker
   */
  @Input() isMultiple: boolean = true;
  /**
   * Sets whether to limit to the default org that the user belongs to
   */
  @Input() isDefaultOrg: boolean = false;
  /**
   * Sets whether to show the entity/orgs that the user can assign based on the user's role
   */
  @Input() isAssignableOrg: boolean = false;

  private _disabled: boolean = false;

  selections = [];
  serviceOptions = {};
  multipleACConfig = {keyProperty: 'key',valueProperty: 'name', categoryProperty: 'detail'};
  singleACConfig = {keyValueConfig: {keyProperty: 'key', valueProperty: 'name'}};

  constructor(private cdr:ChangeDetectorRef) {}

  onChange = (_: any)=>{};
  onTouched = ()=>{};

  ngOnInit(){
    this.selections = [];
  }

  onSelection(val,emit:boolean = true){
    this.selections = val;
    if(emit){
      this.emitSelections();
    }
  }

  emitSelections(){
    this.onChange(this.selections);
  }

  // Access control methods
  setDisabledState(disabled) {
    this._disabled = disabled;
  }

  writeValue(value){
    if(value){
      this.selections = value;
    }
  }
  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
}
