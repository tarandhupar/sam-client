import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, FormArray} from '@angular/forms';
import { Router} from '@angular/router';
import { ProgramService } from 'api-kit';
import { FALOpSharedService } from '../../assistance-listing-operations.service';
import { FALAuthSubFormComponent } from '../../../components/authorization-subform/authorization-subform.component';

@Component({
  providers: [ ProgramService ],
  templateUrl: 'authorizations.template.html',
})

export class FALAuthorizationsComponent implements OnInit, OnDestroy {

  getProgSub: any;
  saveProgSub: any;
  programId : any;
  progTitle: string;
  hideAddButton: boolean = false;
  redirectToViewPg: boolean = false;
  redirectToWksp: boolean = false;
  falAuthForm: FormGroup;
  displayAuthInfo: any = [];
  @ViewChild('authSubForm') authSubForm:FALAuthSubFormComponent;

  constructor(private fb: FormBuilder,
              private programService: ProgramService,
              private router: Router,
              private sharedService: FALOpSharedService){

    sharedService.setSideNavFocus();
    this.programId = sharedService.programId;
  }

  ngOnInit(){

    this.createForm();

    if (this.sharedService.programId) {
      this.getData();
    }
  }

  ngOnDestroy(){
    if (this.saveProgSub)
      this.saveProgSub.unsubscribe();

    if (this.getProgSub)
      this.getProgSub.unsubscribe();
  }

  createForm(){
    this.falAuthForm = this.fb.group({
      'description': ''
    });
  }

  getData(){
    this.getProgSub = this.programService.getProgramById(this.sharedService.programId, this.sharedService.cookieValue)
      .subscribe(api => {
          this.progTitle = api.data.title;

          if(api.data.authorizations){
            this.falAuthForm.patchValue({
              description: api.data.authorizations.description || ''
            });

            if(api.data.authorizations.list.length > 0){
              this.authSubForm.authInfo = api.data.authorizations.list;

              let index = 0;
              const control = <FormArray> this.authSubForm.falAuthSubForm.controls['authorizations'];

              for(let auth of this.authSubForm.authInfo){
                auth.authType= [];
                for(let authType in auth.authorizationTypes){
                  if(auth.authorizationTypes[authType] == true){
                    auth.authType.push(authType);
                  }
                }//end of inner for
                delete auth['authorizationTypes'];
                control.push(this.authSubForm.initAuth());
                control.at(index).patchValue(this.authSubForm.authInfo[index]);
                index = index + 1;
              }//end of main for

              this.authInfoFormat(this.authSubForm.authInfo);
            }
          }//if authorization exists
        },
        error => {
          console.error('Error Retrieving Program!!', error);
        });//end of subscribe
  }

  saveData(){

    let data = {authorizations:{}};
    let authTypeKey = ['act','executiveOrder', 'USC', 'publicLaw', 'statute'];
    let description = '';

    if(this.falAuthForm.value.description != null && this.falAuthForm.value.description != '')
      description = this.falAuthForm.value.description;

    data.authorizations = {description: description};

    if(this.authSubForm.authInfo.length > 0){

      data.authorizations['list']=[];
      for(let auth of this.authSubForm.authInfo){
        let list = {};

        list['authorizationId'] = auth.authorizationId;
        list['parentAuthorizationId'] = auth.parentAuthorizationId || null;

        if(auth.authType.length > 0){
          list['authorizationTypes'] = {};
          for(let type of authTypeKey){
            list[type] = auth[type];
            if(auth.authType.indexOf(type) !== -1){
              list['authorizationTypes'][type] = true;
            }
            else {
              list['authorizationTypes'][type] = false;
            }
          }
        }//end of if authType.length
        data.authorizations['list'].push(list);
      }//end of for
    }
    else{
      data.authorizations['list'] = [];
    }

    this.saveProgSub = this.programService.saveProgram(this.sharedService.programId, data, this.sharedService.cookieValue)
      .subscribe(api => {
          this.sharedService.programId = api._body;
          console.log('AJAX Completed Contact Information', api);

          if(this.redirectToWksp) {
            this.router.navigate(['falworkspace']);
          }
          else if(this.redirectToViewPg){
            this.router.navigate(['/programs', this.sharedService.programId, 'view']);
          }
          else
            this.router.navigate(['/programs/' + this.sharedService.programId + '/edit/financial-information']);

        },
        error => {
          console.error('Error saving Program - Authorization Section!!', error);
        }); //end of subscribe
  }

  onCancelClick(event) {
    if (this.sharedService.programId)
      this.router.navigate(['/programs', this.sharedService.programId, 'view']);
    else
      this.router.navigate(['/falworkspace']);
  }

  onPreviousClick(event){
    if(this.sharedService.programId)
      this.router.navigate(['programs/' + this.sharedService.programId + '/edit/overview']);
    else
      this.router.navigate(['programs/add/overview']);

  }

  onSaveContinueClick(event){
    this.saveData();
  }

  onSaveExitClick(event) {

    this.redirectToWksp = true;
    this.saveData();
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

    for(let auth of authInfo){

      let label = ',';
      for(let authType of auth.authType){
        switch(authType){
          case 'act':{
            label += "," + auth.act.description + ",Title " + auth.act.title + ",Part " + auth.act.part + ",Section " + auth.act.section;
            break;
          }
          case 'executiveOrder':{
            label += ",Executive Order- " + auth.executiveOrder.description + ", Title " + auth.executiveOrder.title + ",Part " + auth.executiveOrder.part + ",Section " + auth.executiveOrder.section;
            break;
          }
          case 'publicLaw':{
            label += ",Public Law " + auth.publicLaw.congressCode + "-" + auth.publicLaw.number;
            break;
          }
          case 'statute':{
            label += ",Statute " + auth.statute.volume + "-" + auth.statute.page;
            break;
          }
          case 'USC':{
            label += "," + auth.USC.title + " US Code " + auth.USC.section;
            break;
          }
        }//end of switch
      }//end of inner for

      label = label.replace(",,", "");

      if(label.charAt(0) == ','){
        label = label.replace(",", "");
      }

      if(label != ''){
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
          this.displayAuthInfo[parentIndex].children.push({label: label, index:counter});
        }

      }
      counter = counter + 1;

    }//end of for
  }
}
