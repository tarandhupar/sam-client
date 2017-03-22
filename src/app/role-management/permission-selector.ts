import { Component, Input, Output, OnChanges, EventEmitter } from "@angular/core";

@Component({
  selector: 'permission-selector',
  template: `
  <div class="permission-selector">
    <div class="permission-selector-title">
      <strong>{{title}}</strong>
    </div>
    <div class="permissions-body">
      <div class="usa-grid-full check-all-row permission-row">
        <div class="usa-width-one-twelfth is-new-column">
        &nbsp;
        </div>
        <div class="usa-width-one-third">
          <strong>{{selectAllText}}</strong>
          <span class="pull-right m_R-3x">All</span>
        </div>
        <div class="usa-width-seven-twelfths">
          <input type="checkbox" (click)="onCheckAllClick($event.target.checked)">
        </div>
      </div>
      <div class="usa-grid-full permission-row" *ngFor="let option of options; let i = index">
        <div class="usa-width-one-twelfth is-new-column">
         &nbsp;
        </div>
        <div class="usa-width-one-third">
          <label [attr.for]="option.label">{{option.label}}</label>
        </div>
        <div class="usa-width-seven-twelfths">
          <input [attr.id]='option.label' type="checkbox" (click)="onPermissionClick($event.target.checked, option.value)" [checked]="isChecked(option.value)">
        </div>
      </div>
    </div>
  </div>
  `
})
export class PermissionSelectorComponent implements OnChanges {
  @Input() options: any[];
  @Input() values: any[];
  @Input() selectAllText: string = '';
  @Input() title: string = '';
  @Output() valuesChange: EventEmitter<any[]> = new EventEmitter<any[]>();

  constructor() {

  }

  ngOnChanges(val) {

  }

  isChecked(val) {
    return this.values.indexOf(val) !== -1;
  }

  onPermissionClick(isChecked, val) {
    if (isChecked) {
      this.values.push(val);
    } else {
      this.values = this.values.filter(v => +v !== +val);
    }
  }

  onCheckAllClick(isChecked, val) {
    if (isChecked) {
      this.values = this.options.map(opt => opt.value);
    } else {
      this.values = [];
    }
  }
}
