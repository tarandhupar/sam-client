import { Input, Output, Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { Alert } from '../alert.model';
import { OptionsType } from 'samUIKit/types';
import { FormGroup, FormBuilder, AbstractControl, FormControl } from '@angular/forms';
import moment from 'moment';
import { SamDateTimeComponent } from 'samUIKit/form-controls/date-time';
import { SamSelectComponent } from 'samUIKit/form-controls/select/select.component';
import { SamTextComponent } from 'samUIKit/form-controls/text/text.component';
import { SamTextareaComponent } from 'samUIKit/form-controls/textarea/textarea.component';

function isNotBeforeToday(c: FormControl) {
  let error = {
    isNotBeforeToday: {
      message: 'Date must not be before today'
    }
  };

  if (!c.value || c.value.match(/invalid/i)) {
    return;
  }

  let m = moment(c.value);

  if (!m.isValid()) {
    return;
  }

  if (c.value && m.isBefore(moment().startOf('day'))) {
    return error;
  }
}

function isAfter(before: SamDateTimeComponent) {
  return (after: FormControl) => {
    if (!before.value || before.value.match(/invalid/i) || !after.value || after.value.match(/invalid/i)) {
      return;
    }

    let startDate = moment(before.value);
    let endDate = moment(after.value);

    if (!startDate.isValid() || !endDate.isValid()) {
      return;
    }

    if (startDate && endDate && endDate.isBefore(startDate)) {
      return {
        dateAfter: {
          message: `End date must be after publish date`,
        }
      }
    }
  };
}

function validDateTime(c: FormControl) {
  let error = {
    validDateTime: {
      message: 'Date is invalid'
    }
  };

  if (c.value === 'Invalid Date Time') {
    return error;
  }
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

  typeOptions: OptionsType[] = [
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
      endDate: [this.alert.endDate(), [validDateTime]],
      publishedDate: [this.alert.publishedDate(), [validDateTime, isNotBeforeToday]],
      publishImmediately: [false, []],
      isExpiresIndefinite: [this.alert.isExpiresIndefinite(), []],
    });

    if (this.alert.isExpiresIndefinite()) {
      this.form.get('endDate').disable();
    }

    if (this.isActiveAlert()){
      this.form.get('publishedDate').disable();
      this.form.get('publishImmediately').disable();
    }
  }

  isoNow() {
    return moment().format('YYYY-MM-DDTHH:mm:ss');
  }

  isEditMode():boolean{return this.mode === 'edit';}
  isActiveAlert():boolean{return this.alert.status() === 'Active';}

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

    if (this.isActiveAlert()) {
      alert.setPublishedDate(this.alert.publishedDate());
    } else {
      if (formValue.publishImmediately) {
        alert.setPublishedDate(this.isoNow());
      } else {
        alert.setPublishedDate(formValue.publishedDate);
      }
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
    let ctrl: any = this.form.get('publishedDate');
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
