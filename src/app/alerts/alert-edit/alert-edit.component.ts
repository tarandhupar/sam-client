import {Input, Component, OnInit} from '@angular/core';
import {Alert} from "../alert.model";
import {OptionsType} from "../../../ui-kit/form-controls/types";

@Component({
  selector: 'alert-edit',
  templateUrl: 'alert-edit.template.html'
})
export class AlertEditComponent implements OnInit {

  @Input() alert: Alert;
  @Input() mode: string;

  typeOptions: OptionsType = [
    { name: 'info', label: 'Information', value: 'Information'},
    { name: 'critical', label: 'Critical', value: 'Critical'},
    { name: 'warning', label: 'Warning', value: 'Warning'}
  ];

  constructor() {

  }

  ngOnInit() {
    if (!this.mode) {
      throw new Error('[mode] must be set for "alert-item" (either "edit" or "add")');
    }

    if (!this.alert) {
      this.alert = new Alert();
    }
  }

  onPublishClick() {

  }

  onSaveDraftClick() {

  }
}
