import {Input, Output, Component, OnInit, EventEmitter} from '@angular/core';
import {Alert} from "../alert.model";
import {OptionsType} from "ui-kit/form-controls/types";

@Component({
  selector: 'alert-edit',
  templateUrl: 'alert-edit.template.html'
})
export class AlertEditComponent implements OnInit {

  @Input() alert: Alert;
  @Input() mode: string;
  @Output() publish: EventEmitter<any> = new EventEmitter<any>();
  @Output() draft: EventEmitter<any> = new EventEmitter<any>();
  @Output() cancel: EventEmitter<any> = new EventEmitter<any>();

  typeOptions: OptionsType = [
    { name: 'info', label: 'Information', value: 'Information'},
    { name: 'critical', label: 'Critical', value: 'Critical'},
    { name: 'warning', label: 'Warning', value: 'Warning'}
  ];

  constructor() {

  }

  ngOnInit() {
    const modes = ['edit', 'add'];
    if (!this.mode) {
      throw new Error('[mode] must be set for "alert-item" (either "edit" or "add")');
    }

    if (!modes.find(m => m === this.mode)) {
      throw new Error('[mode] must be "edit" or "add"');
    }

    if (!this.alert) {
      this.alert = new Alert();
    }
  }

  onPublishClick(event) {
    this.publish.emit(this.alert);
  }

  onDraftClick(event) {
    this.draft.emit(this.alert);
  }

  onCancelClick(event) {
    this.cancel.emit(null);
  }

  onSeverityChange(val) {
    this.alert.setSeverity(val);
  }

  onDescriptionChange(val) {
    this.alert.setDescription(val);
  }

  onTitleChange(val) {
    this.alert.setTitle(val);
  }
}
