import { Component, Input, Output, EventEmitter } from '@angular/core';
import {FormBuilder, FormGroup, FormArray} from '@angular/forms';
import { v4 as UUID } from 'uuid';
import { falCustomValidatorsComponent } from '../../validators/assistance-listing-validators';

@Component({
  selector : 'authSubform',
  providers: [ ],
  templateUrl: 'authorization-subform.template.html',
})

export class FALAuthSubFormComponent {

  @Input() hideAddButton: boolean;
  @Input() toggleAtLeastOneEntryError: boolean;
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
      'authorizations': this.fb.array([ ], falCustomValidatorsComponent.atLeastOneEntryCheck)
    });
  }

  initAuth(){
    return this.fb.group({
      authType:['', falCustomValidatorsComponent.checkboxRequired],
      act: this.fb.group({
        title: [null],
        part:[null],
        section:[null],
        description:['']
      }),
      executiveOrder: this.fb.group({
        title: [null],
        part:[null],
        section:[null],
        description:['']
      }),
      publicLaw: this.fb.group({
        congressCode:[null],
        number:[null]
      }),
      statute: this.fb.group({
        volume:[null],
        page:[null]
      }),
      USC: this.fb.group({
        title:[null],
        section:[null]
      }),
      authorizationId:[null],
      parentAuthorizationId:[null]
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
    const control = <FormArray> this.falAuthSubForm.controls['authorizations'];
    let authId = this.falAuthSubForm.value.authorizations[index].authorizationId;

    if(authId == '' || authId == null){
      uuid = UUID().replace(/-/g, "");
    }
    else {
      uuid = authId;
    }

    control.at(index).patchValue({authorizationId:uuid});

    this.authInfo = this.falAuthSubForm.value.authorizations;
    this.hideAddButton = false;

    this.authActionHandler.emit({
      type:'confirm',
      hideAddButton: this.hideAddButton,
      authInfo: this.authInfo,
      controlIndex: index
    });
  }

  onSubFormCancelClick(i: number){

    if(this.hideAddButton === false) {
      return; // clicking cancel has no effect if nothing is being edited or added
    }

    if(this.mode == 'Add'){
      this.removeAuth(i);
    }

    if(this.mode == 'Edit'){
      const control = <FormArray> this.falAuthSubForm.controls['authorizations'];
      control.at(i).patchValue(this.getObjWithoutNullValues(this.authInfo[i]));
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

  getObjWithoutNullValues(obj){
    for(let item in obj){
      if(item === 'act' || item === 'executiveOrder') {
        if(obj[item] && obj[item]['description'] === null) {
          obj[item]['description'] = '';
        }
      }
      if(obj[item] === null)
        delete obj[item];
    }
    return obj;
  }

  getCheckBoxConfig(i) {
    for(let option of this.checkboxConfig.options) {
      if(option.name.indexOf('_') == -1) {
        option.name = option.name + '_' + i;
      }
      else {
        option.name = option.name.substring(0, option.name.indexOf('_')) + '_' + i;
      }
    }
    return this.checkboxConfig.options;
  }
}
