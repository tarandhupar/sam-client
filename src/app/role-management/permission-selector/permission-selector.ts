import { Component, Input, Output, OnChanges, EventEmitter } from "@angular/core";
import * as _ from 'lodash';

export type PermissionOptionType = {
  label: string,
  isNew: boolean,
  value: any,
  isSelected?: boolean,
  isDefault?: boolean,
};

@Component({
  selector: 'permission-selector',
  templateUrl: './permission-selector.html'
})
export class PermissionSelectorComponent implements OnChanges {
  @Input() options: PermissionOptionType[];
  @Input() values: PermissionOptionType[];
  @Output() valuesChange: EventEmitter<PermissionOptionType[]> = new EventEmitter();
  @Input() selectAllText: string = '';
  @Input() title: string = '';

  constructor() {

  }

  ngOnChanges(val) {
    if (val.options) {
      this.values = _.clone(this.options);
    }
  }

  onPermissionClick(isChecked, option) {
    option.isSelected = isChecked;
  }

  onDefaultClick(isChecked, option) {
    option.isDefault = isChecked;
  }

  onCheckAllClick(isChecked, val) {
    this.values.forEach(v => {
      v.isSelected = isChecked;
    })
  }

  onCheckAllDefaultClick(isChecked, val) {
    this.values.forEach(v => {
      v.isDefault = isChecked;
    })
  }
}
