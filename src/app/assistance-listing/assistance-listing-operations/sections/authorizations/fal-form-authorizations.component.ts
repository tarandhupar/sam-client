import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, FormArray} from '@angular/forms';
import { FALAuthSubFormComponent } from '../../../components/authorization-subform/authorization-subform.component';
import {FALFormViewModel} from "../../fal-form.model";

@Component({
  providers: [ ],
  selector: 'fal-form-authorization',
  templateUrl: 'fal-form-authorizations.template.html',
})

export class FALAuthorizationsComponent implements OnInit {

  @Input() viewModel: FALFormViewModel;
  @ViewChild('authSubForm') authSubForm:FALAuthSubFormComponent;
  @ViewChild('authTable') authTable;

  progTitle: string;
  hideAddButton: boolean = false;
  falAuthForm: FormGroup;
  displayAuthInfo: any = [];

  constructor(private fb: FormBuilder){}

  ngOnInit(){
    this.createForm();

    this.falAuthForm.valueChanges.subscribe(data => this.updateViewModel(data));
    this.authSubForm.falAuthSubForm.valueChanges.subscribe(data => this.updateAuthViewModel(data));

    if (!this.viewModel.isNew) {
      this.updateForm();
    }
  }

  createForm(){
    this.falAuthForm = this.fb.group({
      'description': ''
    });
  }

  updateAuthViewModel(data){
    this.viewModel.authList = this.getUpdatedAuthList(data.authorizations);
    const control = <FormArray> this.authSubForm.falAuthSubForm.controls['authorizations'];

    if(control.errors){
      this.authSubForm.errorExists = true;
    }
    else {
      this.authSubForm.errorExists = false;
    }
  }

  updateViewModel(data){
    this.viewModel.authDesc = data.description;
  }

  updateForm(){
    //title
    this.progTitle = this.viewModel.title;

    //authorization list
    this.updateAuthListForm();

    this.falAuthForm.patchValue({
      description: this.viewModel.authDesc
    });
  }

  updateAuthListForm(){
    if(this.viewModel.authList.length > 0){
      this.authSubForm.authInfo = this.viewModel.authList;

      let index = 0;
      const control = <FormArray> this.authSubForm.falAuthSubForm.controls['authorizations'];

      for(let auth of this.authSubForm.authInfo){

        auth.authType = [];
        for(let authType in auth.authorizationTypes){
          if(auth.authorizationTypes[authType] == true){
            auth.authType.push(authType);
          }
        }//end of inner for
        delete auth['authorizationTypes'];
        control.push(this.authSubForm.initAuth());
        control.at(index).patchValue(this.authSubForm.getObjWithoutNullValues(this.authSubForm.authInfo[index]));
        index = index + 1;

      }//end of main for

      this.authInfoFormat(this.authSubForm.authInfo);
    }
  }

  getUpdatedAuthList(authorizations){
    let counter = 0;
    let authTypeKey = ['act','executiveOrder', 'USC', 'publicLaw', 'statute'];
    let authList : any;
    if(authorizations.length > 0){
      authList = [];
      for(let auth of authorizations){
        let list = {};

        list['authorizationId'] = auth.authorizationId;
        list['parentAuthorizationId'] = auth.parentAuthorizationId || null;

        if(auth.authType.length > 0){
          list['authorizationTypes'] = {};
          for(let type of authTypeKey){
            //set fields for each type
            list[type] = auth[type];

            //set boolean value for each type in authorizationTypes
            if(auth.authType.indexOf(type) !== -1){
              list['authorizationTypes'][type] = true;
            }
            else {
              list['authorizationTypes'][type] = null;
              if(Object.keys(this.authSubForm.getObjWithoutNullValues(list[type])).length == 0)
                list[type] = null;

            }
          }
        }//end of if authType.length
        else
          list['authorizationTypes'] = null;

        authList.push(list);
        counter++;
      }//end of for
    }
    else{
      authList = null;
    }

    return authList;
  }

  authActionHandler(event){

    if(event.type == 'add'){
      this.hideAddButton = event.hideAddButton;
    }
    if(event.type == 'confirm'){
      this.hideAddButton = event.hideAddButton;
      this.authInfoFormat(event.authInfo);
    }
    if(event.type == 'cancel'){
      this.hideAddButton = event.hideAddButton;
    }
    if(event.type == 'edit'){
      this.editAuth(event.index, event.parentIndex);
    }
    if(event.type == 'remove'){
      this.removeAuth(event.index, event.parentIndex);
    }
    if(event.type == 'amend'){
      this.authSubForm.addAuth(event.index);
    }
  }//end of authActionHandler

  editAuth(index: number, parentIndex: number = null){
    let controlIndex: number;
    if(parentIndex !== null) {
      this.authSubForm.subFormLabel = 'Edit - ' + this.displayAuthInfo[parentIndex].children[index].label;
      controlIndex = this.displayAuthInfo[parentIndex].children[index].index;
    }
    else {
      this.authSubForm.subFormLabel = 'Edit - ' + this.displayAuthInfo[index].label;
      controlIndex = this.displayAuthInfo[index].index;
    }

    this.authSubForm.editAuth(controlIndex);
    this.hideAddButton = this.authSubForm.hideAddButton;
  }

  removeAuth(index: number, parentIndex: number = null){

    let controlIndex: number;

    if(parentIndex !== null){
      controlIndex = this.displayAuthInfo[parentIndex].children[index].index;
      this.authSubForm.removeAuth(controlIndex);
    }
    else {
      let children = [];
      for(let child of this.displayAuthInfo[index].children){
        children.push(child.index);
      }
      this.authSubForm.removeBulkAuth(children);
      this.authSubForm.removeAuth(this.displayAuthInfo[index].index);
    }
    this.hideAddButton = this.authSubForm.hideAddButton;
    this.authInfoFormat(this.authSubForm.authInfo);
  }

  authInfoFormat(authInfo){

    this.displayAuthInfo = [];
    let tempArr = [];
    let counter = 0;
    const control = <FormArray> this.authSubForm.falAuthSubForm.controls['authorizations'];

    for(let auth of authInfo){

      let label = ',';
      for(let authType of auth.authType){
        switch(authType){
          case 'act':{
            label += "," + (auth.act.description || '') + ",Title " + (auth.act.title || '') + ",Part " + (auth.act.part || '') + ",Section " + (auth.act.section || '');
            break;
          }
          case 'executiveOrder':{
            label += ",Executive Order- " + (auth.executiveOrder.description || '') + ", Title " + (auth.executiveOrder.title || '') + ",Part " + (auth.executiveOrder.part || '') + ",Section " + (auth.executiveOrder.section || '');
            break;
          }
          case 'publicLaw':{
            label += ",Public Law " + (auth.publicLaw.congressCode || '') + "-" + (auth.publicLaw.number || '');
            break;
          }
          case 'statute':{
            label += ",Statute " + (auth.statute.volume || '') + "-" + (auth.statute.page || '');
            break;
          }
          case 'USC':{
            label += "," + (auth.USC.title || '') + " US Code " + (auth.USC.section || '');
            break;
          }
        }//end of switch
      }//end of inner for

      label = label.replace(",,", "");

      if(label.charAt(0) == ','){
        label = label.replace(",", "");
      }

      let errorExists = false;
      if(control.controls[counter]['controls'].authType.errors !== null) {
        errorExists = true;
      }

      if(auth.parentAuthorizationId == null){

        this.displayAuthInfo.push({
          label: label,
          children: [],
          index: counter,
          authorizationId: auth.authorizationId,
          errorExists: errorExists
        });

        tempArr[auth.authorizationId] = this.displayAuthInfo.length - 1;
      }
      else {
        let parentIndex = tempArr[auth.parentAuthorizationId];
        this.displayAuthInfo[parentIndex].children.push({label: label, index:counter, errorExists: errorExists});
      }

      counter = counter + 1;

    }//end of for
  }

  validateSection() {

    this.authTable.review = true;
    this.authSubForm.review = true;
    this.updateControlStatus();

  }

  updateControlStatus(){
    //mark control as dirty on each level in subform
    //Iterate over subform
    const control = <FormArray> this.authSubForm.falAuthSubForm.controls['authorizations'];

    if(control.errors){
      this.authSubForm.errorExists = true;
    }
    else {
      this.authSubForm.errorExists = false;
    }

    for(let auth of control.controls){

      for(let key of Object.keys(auth['controls'])){
        auth['controls'][key].markAsDirty();
        auth['controls'][key].updateValueAndValidity();

        if(auth['controls'][key]['controls']){
          for(let subkey of Object.keys(auth['controls'][key]['controls'])){
            auth['controls'][key]['controls'][subkey].markAsDirty();
            auth['controls'][key]['controls'][subkey].updateValueAndValidity();
          }
        }//end of if
      }//end of 2nd for
    }//end of outermost for
  }
}
