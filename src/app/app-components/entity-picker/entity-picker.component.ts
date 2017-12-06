import { Component, ChangeDetectorRef, forwardRef, Directive, Input, ElementRef, Renderer, Output, OnInit, EventEmitter, ViewChild, SimpleChanges } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FHService, IAMService } from "api-kit";
import { ControlValueAccessor,NG_VALUE_ACCESSOR,AbstractControl } from '@angular/forms';
import { LabelWrapper } from "sam-ui-elements/src/ui-kit/wrappers/label-wrapper";
import { FHTitleCasePipe } from "../../app-pipes/fhTitleCase.pipe";
import adminLevel from "app/role-management/admin-level";
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


  private _disabled: boolean = false;

  selections = [];
  serviceOptions = {};
  multipleACConfig = {keyProperty: 'key',valueProperty: 'name', categoryProperty: 'detail'};

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
