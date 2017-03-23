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
  @Input() optionsChange: EventEmitter<PermissionOptionType[]> = new EventEmitter();
  @Input() selectAllText: string = '';
  @Input() title: string = '';

  constructor() {

  }

  onPermissionClick(isChecked, option) {
    option.isSelected = isChecked;
    this.optionsChange.emit(this.options);
  }

  onDefaultClick(isChecked, option) {
    option.isDefault = isChecked;
    this.optionsChange.emit(this.options);
  }

  onCheckAllClick(isChecked) {
    this.options.forEach(v => {
      v.isSelected = isChecked;
    });
    this.optionsChange.emit(this.options);
  }

  onCheckAllDefaultClick(isChecked) {
    this.options.forEach(v => {
      v.isDefault = isChecked;
    });
    this.optionsChange.emit(this.options);
  }
}
