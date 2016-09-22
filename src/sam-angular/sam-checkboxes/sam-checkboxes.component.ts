import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { InputWrapper } from '../common/input-wrapper/input-wrapper.component';

/**
 * The <samCheckboxes> component is a set of checkboxes compliant with sam.gov standards
 * https://gsa.github.io/sam-web-design-standards/
 *
 * @Input() config - a configuration object. This object can also contain any of the inputs for input-wrapper (e.g. "label").
 *   format:
 *   {
 *     options: Array<any>, an array of { value: <any>, label: <string> } objects.
 *     legend: <string>, Legend is a descriptive name the input group that will be spoken by screen readers
 *     hasSelectAll: <boolean>, If true, there will be a "Select all" input before the other options
 *   }
 *
 * @Input/@Output model - the bound value of the component
 */
@Component({
  selector: 'samCheckboxes2',
  template: `
      <inputWrapper [label]="config.label" [errorMessage]="config.errorMessage" [hint]="config.hint">
        <fieldset class="usa-fieldset-inputs usa-sans">
          <legend class="usa-sr-only">{{config.name}}</legend>      
          <ul class="usa-unstyled-list">
            <li *ngIf="config.hasSelectAll">
              <input [attr.id]="checkAllLabelName()" type="checkbox" [(ngModel)]="isSelectAllChecked" (ngModelChange)="onSelectAllChange(isSelectAllChecked)">
              <label [attr.for]="checkAllLabelName()">Select all</label>
            </li>
            <li *ngFor="let option of config.options; let i = index">
              <input [attr.id]="option.idFor" [disabled]='option.disabled' type="checkbox" [(ngModel)]="model[option.value]">
              <label [attr.for]="option.idFor">{{option.label}}</label>
            </li>
          </ul>
        </fieldset>
      </inputWrapper>
  `,
})
export class SamCheckboxesComponent {
  @Input() config: any = {};
  @Input() model: any = {};
  @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(InputWrapper)
  public wrapper: InputWrapper;

  constructor() {

  }

  ngOnInit() {
    this.config.options.forEach((option) => {
      this.model[option.value] = !!this.model[option.value];
    });
  }

  // For 508 compliance and useability, give each label an id attribute and each label a for attribute with the same value
  checkAllLabelName() {
    return `all-${this.config.name}`;
  }

  onSelectAllChange(isSelectAllChecked) {
    this.config.options.forEach((option) => {
      this.model[option.value] = isSelectAllChecked;
    });
    this.modelChange.emit(this.model);
  }
}
