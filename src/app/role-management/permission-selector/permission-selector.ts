import { Component, Input, Output, OnChanges, EventEmitter } from "@angular/core";
import * as _ from 'lodash';

export type PermissionOptionType = {
  label: string,
  value: any,
  isNew?: boolean,
  isSelected?: boolean,
  isDefault?: boolean,
};

@Component({
  selector: 'permission-selector',
  templateUrl: './permission-selector.html'
})
export class PermissionSelectorComponent {
  @Input() options: PermissionOptionType[];
  @Input() optionsChange: EventEmitter<PermissionOptionType[]> = new EventEmitter();
  @Input() selectAllText: string = '';
  @Input() titleText: string = '';
  @Input() hideDefaultColumn: false;
  @Input() hideColumnHeader: false;

  private isAllDefaultsChecked: boolean = false;
  private isAllChecked: boolean = false;

  constructor() {

  }

  onPermissionClick(isChecked, option) {
    option.isSelected = isChecked;
    this.optionsChange.emit(this.options);
  }

  onDefaultClick(isChecked, option) {
    option.isDefault = isChecked;
    if (isChecked) {
      option.isSelected = true;
    }
    this.optionsChange.emit(this.options);
  }

  onCheckAllClick(isChecked) {
    this.options.forEach(v => {
      if (!v.isDefault) {
        v.isSelected = isChecked;
      }
    });
    this.optionsChange.emit(this.options);
  }

  onCheckAllDefaultClick(isChecked) {
    this.options.forEach(v => {
      v.isDefault = isChecked;
      if (isChecked) {
        v.isSelected = true;
      }
    });
    this.optionsChange.emit(this.options);
  }
}
