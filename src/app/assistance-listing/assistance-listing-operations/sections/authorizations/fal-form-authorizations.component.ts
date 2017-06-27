import { Component, Input, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import {FormBuilder, FormGroup, FormArray} from '@angular/forms';
import { FALAuthSubFormComponent } from '../../../components/authorization-subform/authorization-subform.component';
import {FALFormViewModel} from "../../fal-form.model";
import { Observable } from 'rxjs/Observable';

@Component({
  providers: [ ],
  selector: 'fal-form-authorization',
  templateUrl: 'fal-form-authorizations.template.html',
})

export class FALAuthorizationsComponent implements OnInit {

  @Input() viewModel: FALFormViewModel;
  @Output() public onError = new EventEmitter();
  @ViewChild('authSubForm') authSubForm:FALAuthSubFormComponent;
  @ViewChild('authTable') authTable;

  progTitle: string;
  hideAddButton: boolean = false;
  falAuthForm: FormGroup;
  displayAuthInfo: any = [];
  formErrorArr: any = {};
  description: string = `
<p>This section should include the legal authority upon which a program is based.</p><p>When new legislation is passed that has a significant bearing on a program, the reference should be included in this section.</p>

<p>Do not include appropriation legislation unless it authorizes the program or a significant element of the program.</p>

<p>Cite the name of the act, title, part, section, public law number, statute, U.S.C. (if one exists), and Presidential Reorganization Memorandum. If an Executive Order applies, cite the number, title, and date. The formatted sequence for a typical authorization citation is: Name of Act, Title, Part, Section Number, Public Law Number, Statute Reference (if any), and U.S. Code Reference (if any). Separate the references within a citation using commas. Separate multiple citations using a semicolon. The rules governing how to properly submit your citations follow:</p>
<ul>
<li>... Each item (Act, Title, Part, etc.) should be separated by a comma. The Title, Part, and Section must follow the Act name.</li>
<li> ... Acts and Executive Orders should have capital letters in the first letter of all main words.</li>
<li>... Multiple public laws should be separated by commas. Example: Public Laws 89-177, 89-898, 90- 001, and 100-101. ... The semicolon should only be used to set the limit of a citation among multiple citations.</li>
<li>... The phrase "as amended by" should not be used. Instead, use "as amended," showing the amending law as a separate citation.</li>
</ul>

<p>The Authorization Appendix (Appendix II) of the Catalog consists of acts, public law numbers and the programs they authorize. The appendix is compiled from the information supplied in this section.</p>

`;

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

    /*if(control.errors){
      this.authSubForm.errorExists = true;
    }
    else {
      this.authSubForm.errorExists = false;
    }*/
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
    else {
      this.noAuthError([]);
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
      if(this.authSubForm.review) {
       /*if(this.formErrorArr['authorizations']){
         delete this.formErrorArr['authorizations'];
         this.emitEvent();
       }*/
       this.markAllSubControls(this.authSubForm.falAuthSubForm.controls['authorizations']['controls'][event.controlIndex]);
      }
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
    this.formErrorArr = {};
    let tempArr = [];
    let counter = 0;
    const control = <FormArray> this.authSubForm.falAuthSubForm.controls['authorizations'];

    this.noAuthError(authInfo);

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

      this.collectErrors(control.controls[counter]);

      if(auth.parentAuthorizationId == null){

        this.displayAuthInfo.push({
          label: label,
          children: [],
          index: counter,
          authorizationId: auth.authorizationId
        });

        tempArr[auth.authorizationId] = this.displayAuthInfo.length - 1;
      }
      else {
        let parentIndex = tempArr[auth.parentAuthorizationId];
        this.displayAuthInfo[parentIndex].children.push({
          label: label,
          index:counter,
          authorizationId:auth.authorizationId
        });
      }

      counter = counter + 1;

    }//end of for

  }

  validateSection() {

    this.authTable.review = true;
    this.authSubForm.review = true;
    this.updateControlStatus();

    if(Object.keys(this.formErrorArr).length > 0)
      this.emitEvent();
  }

  updateControlStatus(){
    //mark control as dirty on each level in subform
    //Iterate over subform
    const control = <FormArray> this.authSubForm.falAuthSubForm.controls['authorizations'];

    /*if(control.errors){
      this.authSubForm.errorExists = true;
    }
    else {
      this.authSubForm.errorExists = false;
    }*/

    for(let auth of control.controls){
      this.markAllSubControls(auth);
    }
  }

  markAllSubControls(auth){

    for(let key of Object.keys(auth['controls'])){
      auth['controls'][key].markAsDirty();
      auth['controls'][key].updateValueAndValidity();

      if(auth['controls'][key]['controls']){
        for(let subkey of Object.keys(auth['controls'][key]['controls'])){
          auth['controls'][key]['controls'][subkey].markAsDirty();
          auth['controls'][key]['controls'][subkey].updateValueAndValidity();

          /*this.checkControlforErrors(auth['controls'][key]['controls'][subkey], key + '-' + subkey, auth.value.authorizationId);
          auth['controls'][key]['controls'][subkey].valueChanges.distinctUntilChanged().subscribe(() => {
            this.checkControlforErrors(auth['controls'][key]['controls'][subkey], key + '-' + subkey, auth.value.authorizationId);
          });*/
        }
      }//end of if
      /*else {
        this.checkControlforErrors(auth['controls'][key], key, auth.value.authorizationId);
        auth['controls'][key].valueChanges.distinctUntilChanged().subscribe(() => {
          this.checkControlforErrors(auth['controls'][key], key, auth.value.authorizationId);
        });
      }*/
    }
  }

  collectErrors(auth){
    for(let key of Object.keys(auth['controls'])){

      if(auth['controls'][key]['controls']){
        for(let subkey of Object.keys(auth['controls'][key]['controls'])){
          this.checkControlforErrors(auth['controls'][key]['controls'][subkey], key + '-' + subkey, auth.value.authorizationId);
        }
      }//end of if
      else {
       this.checkControlforErrors(auth['controls'][key], key, auth.value.authorizationId);
      }
    }
  }

  checkControlforErrors(control, key, authId){

    let formErrorLen = Object.keys(this.formErrorArr).length;

    if(control.errors){
      if(!(authId in this.formErrorArr)) {
        this.formErrorArr[authId] = {  errors: [key] };
      }
      else {
        let index = this.formErrorArr[authId].errors.indexOf(key);
        if(index == -1) {
          this.formErrorArr[authId].errors.push(key);
        }
      }
    }
    else {

      if(authId in this.formErrorArr) {

        let index = this.formErrorArr[authId].errors.indexOf(key);
        if(index > -1) {
          this.formErrorArr[authId].errors.splice(index, 1);
        }

        if(this.formErrorArr[authId].errors.length == 0) {
          delete this.formErrorArr[authId];
        }
      }
    }

    if((formErrorLen !== Object.keys(this.formErrorArr).length || Object.keys(this.formErrorArr).length == 0) && this.authSubForm.review) {
      this.emitEvent();
    }

  }

  noAuthError(authInfo){
    let formErrorLen = Object.keys(this.formErrorArr).length;
    if(authInfo.length == 0){
      this.formErrorArr['authorizations'] = { errors: ['one authorization required']};
    }
    else {
      delete this.formErrorArr['authorizations'];
    }

    if(this.authSubForm.review && (formErrorLen !== Object.keys(this.formErrorArr).length) || Object.keys(this.formErrorArr).length == 0)
      this.emitEvent();
  }

  emitEvent(){
    this.onError.emit({
      formErrorArr: this.formErrorArr,
      section: 'authorization'
    });
  }
}
