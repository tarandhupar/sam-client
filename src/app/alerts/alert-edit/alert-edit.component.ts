import {Input, Output, Component, OnInit, EventEmitter, ViewChild} from '@angular/core';
import {Alert} from "../alert.model";
import {OptionsType} from "ui-kit/form-controls/types";
import {FormGroup, FormBuilder, AbstractControl, FormControl} from "@angular/forms";
import moment = require("moment");
import {SamDateTimeComponent} from "ui-kit";
import {SamSelectComponent} from "ui-kit";
import {SamTextComponent} from "ui-kit";
import {SamTextareaComponent} from "../../../ui-kit/form-controls/textarea/textarea.component";

function isNotBeforeToday(c: FormControl) {
  let error = {
    isNotBeforeToday: {
      message: 'Date must not be before today'
    }
  };

  if (c.value && moment(c.value).isBefore(moment().startOf('day'))) {
    return error;
  }
}

function isAfter(before: SamDateTimeComponent) {
  return (after: FormControl) => {
    let startDate = before.value;
    let endDate = after.value;
    if (startDate && endDate && moment(endDate).isBefore(startDate)) {
      return {
        dateAfter: {
          message: `End date must be after publish date`,
        }
      }
    }
  };
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

  @ViewChild('endDate') endDate: SamDateTimeComponent;
  @ViewChild('publishedDate') publishedDate: SamDateTimeComponent;
  @ViewChild('severity') severity: SamSelectComponent;
  @ViewChild('title') title: SamTextComponent;
  @ViewChild('description') description: SamTextareaComponent;

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
      endDate: [this.alert.endDate(), [isNotBeforeToday, isAfter(this.publishedDate)]],
      publishedDate: [this.alert.publishedDate(), [isNotBeforeToday]],
      publishImmediately: [false, []],
      isExpiresIndefinite: [this.alert.isExpiresIndefinite(), []],
    });

    if (this.alert.isExpiresIndefinite()) {
      this.form.get('endDate').disable();
    }
  }

  isoNow() {
    return moment().format('YYYY-MM-DDThh:mm:ss');
  }

  onAcceptClick(event) {
    if (!this.form.valid) {
      this.severity.wrapper.formatErrors(<FormControl>this.form.get('severity'));
      this.title.wrapper.formatErrors(<FormControl>this.form.get('title'));
      this.description.wrapper.formatErrors(<FormControl>this.form.get('description'));
      this.publishedDate.wrapper.formatErrors(<FormControl>this.form.get('publishedDate'));
      this.endDate.wrapper.formatErrors(<FormControl>this.form.get('endDate'));
      return;
    }

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
      this.publishedDate.wrapper.errorMessage = '';
      ctrl.disable();

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
}
