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
export class EntityPickerComponent implements ControlValueAccessor{
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
  @Input() searchMessage: '';
  /**
   * Flag that controls emitting an event when the formControl passes down a new value to set
   */
  @Input() editOnFlag: boolean = true;

  private _disabled: boolean = false;

  labelName: string;
  selections = null;
  serviceOptions = {};
  singleACConfig = {keyValueConfig:{keyProperty: 'key',valueProperty: 'name'}};
  multipleACConfig = {keyProperty: 'key',valueProperty: 'name'};

  constructor(private oFHService:FHService, private iamService: IAMService, private cdr:ChangeDetectorRef) {}

  onChange = (_: any)=>{ console.error('this will only get called if the component fails to register onChange')};
  onTouched = ()=>{};


  setDisabledState(disabled) {
    this._disabled = disabled;
  }

  writeValue(value){
      this.selections = value;
  }
  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
}
