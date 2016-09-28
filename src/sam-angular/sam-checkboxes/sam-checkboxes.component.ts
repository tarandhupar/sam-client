import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { InputWrapper, OptionsType, InputWrapperConfigType } from '../common/input-wrapper/input-wrapper.component';

export type CheckboxesConfigType = {
  options: OptionsType,
  name: string,
  hasSelectAll?: boolean,
  wrapper?: InputWrapperConfigType
};

/**
 * The <samCheckboxes> component is a set of checkboxes compliant with sam.gov standards
 * https://gsa.github.io/sam-web-design-standards/
 *
 * @Input() config - a configuration object. This object can also contain any of the inputs for input-wrapper (e.g. "label").
 *   format:
 *   {
 *     options: Array<any>, *required* an array of { value: <any>, label: <string> } objects.
 *     name: <string>, *required* Legend is a descriptive name the input group that will be spoken by screen readers
 *     hasSelectAll: <boolean>, If true, there will be a "Select all" input before the other options
 *     wrapper: (see input-wrapper-config for the rest of the wrapper properties)
 *   }
 *
 * @Input/@Output model - the bound value of the component
 */
@Component({
  selector: 'samCheckboxes2',
  template: `
      <inputWrapper [labelFor]="config.wrapper?.name" [label]="config.wrapper?.label" [errorMessage]="config.wrapper?.errorMessage" [hint]="config.wrapper?.hint" [errorLabel]="config.wrapper?.errorLabel">
        <fieldset class="usa-fieldset-inputs usa-sans">
          <legend class="usa-sr-only">{{config.name}}</legend>      
          <ul class="usa-unstyled-list">
            <li *ngIf="config.hasSelectAll">
              <input [attr.id]="checkAllLabelName()" type="checkbox" [(ngModel)]="isSelectAllChecked" (ngModelChange)="onSelectAllChange(isSelectAllChecked)">
              <label [attr.for]="checkAllLabelName()">Select all</label>
            </li>
            <li *ngFor="let option of config.options; let i = index">
              <input [attr.id]="option.idFor" [disabled]='option.disabled' type="checkbox" [(ngModel)]="_modelHash[option.value]" (ngModelChange)="onCheckChange(option.value, _modelHash[option.value])">
              <label [attr.for]="option.idFor">{{option.label}}</label>
            </li>
          </ul>
        </fieldset>
      </inputWrapper>
  `,
})
export class SamCheckboxesComponent {
  @Input() config: CheckboxesConfigType;
  @Input() model: Array<any> = [];
  @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(InputWrapper)
  public wrapper: InputWrapper;

  /*
   * We want our model to list the checked items in the order that they appear in in the options list
   * We use two additional objects to acheive reasonable runtime for the inserts and delete that occur when items are
   * checked and unchecked.
   */

  /**
   * @member _ordering
   * An array of { itemValue:
   * Allows us to the determine the order of a value without traversing the entire options array
   */
  private _ordering: any = {};

  /**
   * @member _modelHash
   * Allows us to determine if an object is checked without traversing the entire model object
   */
  private _modelHash: any = {};

  constructor() {

  }

  ngOnInit() {
    // initialize the helper objects
    for (let i = 0; i < this.config.options.length; i++) {
      let val = this.config.options[i].value;
      this._ordering[val] = i;
    }
    this.model.forEach(val => {
      this._modelHash[val] = true;
    });
  }

  // Give the check all label a name for screen readers
  checkAllLabelName() {
    return `all-${this.config.name}`;
  }

  onCheckChange(key, isChecked) {
    if (!isChecked) {
      // If the option was unchecked, remove it from the model
      this.model = this.model.filter(val => val !== key);
    } else {
      // Else, insert the checked item into the model in the correct order
      let i = 0;
      let thisOrder = this._ordering[key];
      while (i < this.model.length) {
        let otherValue = this.model[i];
        // If the item being inserted is after the current value, break and insert it
        if (thisOrder <= this._ordering[otherValue]){
          break;
        }
        i++;
      }
      this.model.splice(i, 0, key);
    }
    this.modelChange.emit(this.model);
  }

  onSelectAllChange(isSelectAllChecked) {
    if (!isSelectAllChecked) {
      this.model = [];
      this._modelHash = {};
    } else {
      this.model = this.config.options.map(option => option.value);
      this.config.options.forEach(option => {
        this._modelHash[option.value] = true;
      });
    }
    this.modelChange.emit(this.model);
  }
}
