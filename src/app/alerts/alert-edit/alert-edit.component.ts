import {Input, Output, Component, OnInit, EventEmitter, ViewChild} from '@angular/core';
import {Alert} from "../alert.model";
import {OptionsType} from "ui-kit/form-controls/types";
import {FormGroup, FormBuilder, AbstractControl, FormControl} from "@angular/forms";
import moment = require("moment");
import before = testing.before;
import {SamDateTimeComponent} from "ui-kit";

function isNotBeforeToday(c: FormControl) {
  let error = {
    isNotBeforeToday: {
      message: 'Date must not be before today'
    }
  };

  return !moment(c.value).isBefore(moment().startOf('day')) || error;
}

@Component({
  selector: 'alert-edit',
  templateUrl: 'alert-edit.template.html'
})
export class AlertEditComponent implements OnInit {

  @Input() alert: Alert;
  @Input() mode: string;
  @Output() accept: EventEmitter<any> = new EventEmitter<any>();
  @Output() cancel: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('endDate') public endDate: SamDateTimeComponent;
  @ViewChild('publishDate') public publishDate: SamDateTimeComponent;

  publishImmediately: boolean;

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
      endDate: [this.alert.endDate(), [isNotBeforeToday]],
      publishedDate: [this.alert.publishedDate(), [isNotBeforeToday]],
      publishImmediately: [false, []],
      isExpiresIndefinite: [false, []],
    });

    this.form.valueChanges.subscribe(val => this.validate());
    this.validate();
  }

  validate() {
    // let startDate = this.form.value['publishedDate'];
    // let endDate = this.form.value['endDate'];
    // if (startDate && endDate && moment(endDate).isBefore(startDate)) {
    //   this.endDate.wrapper.errorMessage = "Publish date must be after startDate";
    //   this.form.setErrors({ dateAfter: false});
    // } else {
    //   if (this.form.valid) {
    //     console.log('clear validators');
    //     this.form.clearValidators();
    //   }
    //   this.endDate.wrapper.errorMessage = "";
    // }
  }

  isoNow() {
    return moment().format('YYYY-MM-DDThh:mm:ss');
  }

  onAcceptClick(event) {
    let alert = new Alert();
    let formValue = this.form.value;
    alert.setDescription(formValue.description);
    alert.setEndDate(formValue.endDate);
    if (formValue.publishImmediately) {
      alert.setPublishedDate(this.isoNow());
    } else {
      alert.setPublishedDate(formValue.publishedDate);
    }
    alert.setSeverity(formValue.severity);
    alert.setTitle(formValue.title);
    alert.setIsExpiresIndefinite(formValue.isExpiresIndefinite);

    if (this.alert.id()) {
      alert.setId(this.alert.id());
    }

    this.accept.emit(alert);
  }

  onCancelClick(event) {
    this.cancel.emit(null);
  }

  onPublishImmediatelyClick(val) {
    let ctrl: AbstractControl = this.form.controls['publishedDate'];
    if (val) {
      ctrl.setValue(this.isoNow());
      ctrl.disable()
    } else {
      ctrl.enable();
    }
  }

  onEndIndefinitelyClick(val) {
    let ctrl: AbstractControl = this.form.controls['endDate'];
    if (val) {
      ctrl.setValue('');
      ctrl.disable();
    } else {
      ctrl.enable();
    }
  }

  acceptButtonStyle() {
    return {'usa-button-primary': this.form.valid, 'usa-button-disabled': !this.form.valid};
  }
}
