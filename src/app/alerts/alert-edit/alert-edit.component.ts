import {Input, Output, Component, OnInit, EventEmitter} from '@angular/core';
import {Alert} from "../alert.model";
import {OptionsType} from "ui-kit/form-controls/types";
import {FormGroup, FormBuilder, AbstractControl} from "@angular/forms";
import moment = require("moment");

@Component({
  selector: 'alert-edit',
  templateUrl: 'alert-edit.template.html'
})
export class AlertEditComponent implements OnInit {

  @Input() alert: Alert;
  @Input() mode: string;
  @Output() accept: EventEmitter<any> = new EventEmitter<any>();
  @Output() cancel: EventEmitter<any> = new EventEmitter<any>();

  typeOptions: OptionsType = [
    { name: 'information', label: 'Informational', value: 'Informational'},
    { name: 'error', label: 'Error', value: 'Error'},
    { name: 'warning', label: 'Warning', value: 'Warning'}
  ];

  form: FormGroup;

  constructor(private builder: FormBuilder) {

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

    this.form = this.builder.group({
      description: [this.alert.description(), []],
      title: [this.alert.title(), []],
      severity: [this.alert.severity(), []],
      endDate: [this.alert.endDate(), []],
      publishedDate: [this.alert.publishedDate(), []]
    });

    this.form.valueChanges.subscribe(val => this.validate(val));
  }

  validate(val) {

  }

  onAcceptClick(event) {
    console.log('accept clicked, form value: ', this.form.value);
    let alert = new Alert();
    let formValue = this.form.value;
    alert.setDescription(formValue.description);
    alert.setEndDate(formValue.endDate);
    alert.setPublishedDate(formValue.publishedDate);
    alert.setSeverity(formValue.severity);
    alert.setTitle(formValue.title);
    this.accept.emit(alert);
  }

  onCancelClick(event) {
    this.cancel.emit(null);
  }

  onPublishImmediatelyClick(val) {
    console.log('val is: ', val);
    let ctrl: AbstractControl = this.form.controls['publishedDate'];
    if (val) {
      ctrl.setValue(moment().format('YYYY-MM-DDTHH:mm'));
      ctrl.disable(true)
    } else {
      ctrl.disable(false);
    }
  }

  onEndIndefinitelyClick(val) {
    let ctrl: AbstractControl = this.form.controls['endDate'];
    if (val) {
      ctrl.setValue('');
      ctrl.disable(true)
    } else {
      ctrl.disable(false);
    }
  }

  acceptButtonStyle() {
    //return 'usa-button-disabled';
    return {'usa-button-primary': this.form.valid, 'usa-button-disabled': !this.form.valid};
  }
}
