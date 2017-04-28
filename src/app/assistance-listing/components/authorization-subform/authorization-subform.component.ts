import { Component, Input, Output, EventEmitter } from '@angular/core';
import {FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';
import { UUID } from 'angular2-uuid';

@Component({
  selector : 'authSubform',
  providers: [ ],
  templateUrl: 'authorization-subform.template.html',
})

export class FALAuthSubFormComponent {

  @Input() hideAddButton: boolean;
  @Output() public authActionHandler = new EventEmitter();

  falAuthSubForm: FormGroup;
  authIndex: number = 0;
  authInfo=[];
  mode:string;
  subFormLabel:string;

  checkboxConfig = {
    options: [
      {value: 'act', label: 'Act', name: 'checkbox-act'},
      {value: 'executiveOrder', label: 'Executive Order', name: 'checkbox-executiveOrder'},
      {value: 'publicLaw', label: 'Public Law', name: 'checkbox-publicLaw'},
      {value: 'statute', label: 'Statute', name: 'checkbox-statute'},
      {value: 'USC', label: 'USC', name: 'checkbox-usc'},
    ],
  };

  constructor(private fb: FormBuilder){
    this.createForm();
  }

  createForm(){
    this.falAuthSubForm = this.fb.group({
      'authorizations': this.fb.array([ ])
    });
  }

  initAuth(){
    return this.fb.group({
      authType:[''],
      act: this.fb.group({
        title: [''],
        part:[''],
        section:[''],
        description:['']
      }),
      executiveOrder: this.fb.group({
        title: [''],
        part:[''],
        section:[''],
        description:['']
      }),
      publicLaw: this.fb.group({
        congressCode:[''],
        number:['']
      }),
      statute: this.fb.group({
        volume:[''],
        page:['']
      }),
      USC: this.fb.group({
        title:[''],
        section:['']
      }),
      authorizationId:[],
      parentAuthorizationId:[]
    });
  }

  addAuth(index=null){

    if(index == null)
      this.subFormLabel = "New Authorization";
    else
      this.subFormLabel = "New Amendment";

    const control = <FormArray> this.falAuthSubForm.controls['authorizations'];
    this.authIndex = control.length;
    control.push(this.initAuth());
    this.hideAddButton = true;
    this.mode = "Add";

    if(index !== null){
      let parentAuthId = this.falAuthSubForm.value.authorizations[index].authorizationId;
      control.at(this.authIndex).patchValue({parentAuthorizationId:parentAuthId});
    }

    this.authActionHandler.emit({
      type:'add',
      hideAddButton: this.hideAddButton
    });
  }

  onConfirmClick(index){

    let uuid;
    let authId = this.falAuthSubForm.value.authorizations[index].authorizationId;

    if(authId == '' || authId == null){
      uuid = UUID.UUID().replace(/-/g, "");
    }
    else {
      uuid = authId;
    }

    this.falAuthSubForm.value.authorizations[index].authorizationId = uuid;

    this.authInfo = this.falAuthSubForm.value.authorizations;
    this.hideAddButton = false;

    this.authActionHandler.emit({
      type:'confirm',
      hideAddButton: this.hideAddButton,
      authInfo: this.authInfo
    });
  }

  onSubFormCancelClick(i: number){

    if(this.mode == 'Add'){
      this.removeAuth(i);
    }

    if(this.mode == 'Edit'){
      const control = <FormArray> this.falAuthSubForm.controls['authorizations'];
      control.at(i).setValue(this.authInfo[i]);
    }

    this.hideAddButton = false;
    this.authActionHandler.emit({
      type:'cancel',
      hideAddButton: this.hideAddButton,
      authInfo: this.authInfo
    });
  }

  removeAuth(i: number){
    const control = <FormArray>this.falAuthSubForm.controls['authorizations'];
    control.removeAt(i);
    this.authInfo = this.falAuthSubForm.value.authorizations;
    this.hideAddButton = false;
  }

  removeBulkAuth(ids){
    const control = <FormArray>this.falAuthSubForm.controls['authorizations'];
    let counter = 0;
    for(let id of ids){
      control.removeAt(id - counter);
      counter = counter + 1;
    }
    this.authInfo = this.falAuthSubForm.value.authorizations;
    this.hideAddButton = false;
  }

  editAuth(i: number){
    this.mode = "Edit";
    this.authIndex = i;
    this.hideAddButton = true;
  }
}
