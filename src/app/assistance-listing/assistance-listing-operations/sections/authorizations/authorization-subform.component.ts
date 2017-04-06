import { Component, Input, Output, EventEmitter } from '@angular/core';
import {FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';

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

  // Checkboxes Component
  /*public authTypeConfig: any = {
    name: 'authorization-authType',
    hint: 'Please select all that apply',
    required: true,
    validateComponentLevel: false,
    checkbox: {
      reuired:true,
      options: [
        {value: 'act', label: 'Act', name: 'authType-checkbox-act'},
        {value: 'executiveOrder', label: 'Executive Order', name: 'authType-checkbox-executiveOrder'},
        {value: 'publicLaw', label: 'Public Law', name: 'authType-checkbox-publicLaw'},
        {value: 'statute', label: 'Statute', name: 'authType-checkbox-statute'},
        {value: 'USC', label: 'USC', name: 'authType-checkbox-usc'},
      ]
    },

    textarea:{
      showWhenCheckbox: 'checked',
      grpHeader:['Act', 'Executive Order', 'Public Law', 'Statute', 'USC'],
      name:[
        ['title','part', 'section', 'description'],
        ['title', 'part', 'section', 'description'],
        ['congressCode', 'number'],
        ['volume', 'page'],
        ['title', 'section']
      ],
      labels:[
        ['Title', 'Part', 'Section', 'Description'],
        ['Title', 'Part', 'Section', 'Description'],
        ['Congress', 'Law Number'],
        ['Volume', 'Page'],
        ['Title', 'Section']
      ],
      required:[
        [false, false, false, false],
        [false, false, false, false],
        [false, false],
        [false, false],
        [false, false]
      ]
    }
  };*/

  checkboxConfig = {
    options: [
      {value: 'act', label: 'act', name: 'checkbox-act'},
      {value: 'executiveOrder', label: 'executiveOrder', name: 'checkbox-executiveOrder'},
      {value: 'publicLaw', label: 'publicLaw', name: 'checkbox-publicLaw'},
      {value: 'statute', label: 'statute', name: 'checkbox-statute'},
      {value: 'usc', label: 'USC', name: 'checkbox-usc'},
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
      })
    });
  }

  addAuth(){
    this.subFormLabel = "New Authorization";
    const control = <FormArray> this.falAuthSubForm.controls['authorizations'];
    this.authIndex = control.length;
    control.push(this.initAuth());
    this.hideAddButton = true;
    this.mode = "Add";

    this.authActionHandler.emit({
      type:'add',
      hideAddButton: this.hideAddButton
    });
  }

  onConfirmClick(){
    //this.authInfo = JSON.parse(JSON.stringify(this.falAuthSubForm.value.authorizations));
    this.authInfo = this.falAuthSubForm.value.authorizations;
    this.hideAddButton = false;
    console.log(this.falAuthSubForm);

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
    //this.authInfo = JSON.parse(JSON.stringify(this.falAuthSubForm.value.authorizations));
    this.authInfo = this.falAuthSubForm.value.authorizations;
    this.hideAddButton = false;
  }

  editAuth(i: number){
    //this.authInfo = JSON.parse(JSON.stringify(this.falAuthSubForm.value.authorizations));
    //this.authInfo = this.falAuthSubForm.value.authorizations;
    this.subFormLabel = "Edit Authorization";
    this.mode = "Edit";
    this.authIndex = i;
    this.hideAddButton = true;
  }
}
