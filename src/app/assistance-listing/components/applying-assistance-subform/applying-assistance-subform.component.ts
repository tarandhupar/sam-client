import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
//import { SamDateComponent } from 'sam-ui-kit/form-controls/date';
import * as moment from 'moment';

@Component({
  selector : 'assistSubform',
  providers: [ ],
  templateUrl: 'applying-assistance-subform.template.html',
})

export class FALAssistSubFormComponent {

  @Input() hideAddButton: boolean;
  @Output() public assistActionHandler = new EventEmitter();
 // @ViewChild('startDate') startDate: SamDateComponent;

  falAssistSubForm: FormGroup;
  assistIndex: number = 0;
  assistInfo = [];
  mode:string;
  subFormLabel:string;

  constructor(private fb: FormBuilder){
    this.createForm();
  }

  createForm(){
    this.falAssistSubForm = this.fb.group({
      'deadlineList': this.fb.array([ ])
    });
  }

  initAssist(){
    return this.fb.group({
      start: '',
      end: '',
      description: ''
    });
  }

  addAssist(){
    this.subFormLabel = "Add Deadline";
    const control = <FormArray> this.falAssistSubForm.controls['deadlineList'];
    this.assistIndex = control.length;
    control.push(this.initAssist());
    this.hideAddButton = true;
    this.mode = "Add";

    this.assistActionHandler.emit({
      type:'add',
      hideAddButton: this.hideAddButton
    });
  }

  removeAssist(i: number){

    const control = <FormArray>this.falAssistSubForm.controls['deadlineList'];
    control.removeAt(i);
    this.assistIndex = this.falAssistSubForm.value.deadlineList;
    this.hideAddButton = false;
  }

  editAssist(i: number){
    this.mode = "Edit";
    this.subFormLabel = "Edit Deadline";
    this.assistIndex = i;
    this.hideAddButton = true;
  }

  onConfirmClick(i){
    this.assistInfo = this.falAssistSubForm.value.deadlineList;
    this.hideAddButton = false;

    /*let m = moment(this.assistInfo[i].start);
    console.log("valid", m.isValid());*/

    this.assistActionHandler.emit({
      type:'confirm',
      hideAddButton: this.hideAddButton,
      assistInfo: this.assistInfo
    });
  }

  onSubFormCancelClick(i: number){

    if(this.mode == 'Add'){
      this.removeAssist(i);
    }

    if(this.mode == 'Edit'){
      const control = <FormArray> this.falAssistSubForm.controls['deadlineList'];
      control.at(i).setValue(this.assistInfo[i]);
    }

    this.hideAddButton = false;
    this.assistActionHandler.emit({
      type:'cancel',
      hideAddButton: this.hideAddButton,
      assistInfo: this.assistInfo
    });
  }
}
