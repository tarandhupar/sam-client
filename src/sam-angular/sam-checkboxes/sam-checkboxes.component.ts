import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FieldsetWrapper,  } from '../common/wrappers/fieldset-wrapper.component';
import { OptionsType, WrapperConfigType } from '../common/types';

export type CheckboxesConfigType = {
  options: OptionsType,
  label: string,
  name: string,
  wrapper: WrapperConfigType,
  hasSelectAll?: boolean,
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
      <fieldsetWrapper [label]="config.wrapper.label" [name]="config.wrapper.name" [hint]="config.wrapper.hint" [errorMessage]="config.wrapper.errorMessage">
        <ul class="usa-unstyled-list">
          <li *ngIf="config.hasSelectAll">
            <input [attr.id]="checkAllLabelName()" type="checkbox" (change)="onSelectAllChange($event.target.checked)">
            <label [attr.for]="checkAllLabelName()">Select all</label>
          </li>
          <li *ngFor="let option of config.options; let i = index">
            <input [attr.id]="option.name" [disabled]='option.disabled' type="checkbox"
              (change)="onCheckChanged(option.value, $event.target.checked)" [checked]="isChecked(option.value)">
            <label [attr.for]="option.name">{{option.label}}</label>
          </li>
        </ul>
      </fieldsetWrapper>
  `,
})
export class SamCheckboxesComponent {
  @Input() config: CheckboxesConfigType;
  @Input() model: Array<any> = [];
  @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(FieldsetWrapper)
  public wrapper: FieldsetWrapper;

  /*
   * We want our model to list the checked items in the order that they appear in in the options list
   * This object allows us to efficiently determine if a value is before another value
   */
  private _ordering: any = {};

  constructor() {

  }

  ngOnInit() {
    this.config.wrapper.label = this.config.label;

    // initialize the order lookup map
    for (let i = 0; i < this.config.options.length; i++) {
      let val = this.config.options[i].value;
      this._ordering[val] = i;
    }
  }

  // Give the check all label a name for screen readers
  checkAllLabelName() {
    return `all-${this.config.label}`;
  }

  isChecked(value) {
    return this.model.indexOf(value) !== -1;
  }

  onCheckChanged(value, isChecked) {
    if (!isChecked) {
      // If the option was unchecked, remove it from the model
      this.model = this.model.filter(val => val !== value);
    } else {
      // Else, insert the checked item into the model in the correct order
      let i = 0;
      let thisOrder = this._ordering[value];
      while (i < this.model.length) {
        let otherValue = this.model[i];
        // If the item being inserted is after the current value, break and insert it
        if (thisOrder <= this._ordering[otherValue]){
          break;
        }
        i++;
      }
      this.model.splice(i, 0, value);
    }
    this.modelChange.emit(this.model);
  }

  onSelectAllChange(isSelectAllChecked) {
    if (!isSelectAllChecked) {
      this.model = [];
    } else {
      this.model = this.config.options.map(option => option.value);
    }
    this.modelChange.emit(this.model);
  }
}
