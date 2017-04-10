import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import { Router} from '@angular/router';
import { ProgramService } from 'api-kit';
import { FALOpSharedService } from '../../assistance-listing-operations.service';
import { FALAuthSubFormComponent } from './authorization-subform.component';

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
  authInfo = [];
  displayAuthInfo = [];
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
          console.log("api", api);
        },
        error => {
          console.error('Error Retrieving Program!!', error);
        });//end of subscribe
  }

  saveData(){

    let data = {authorizations:{}};
    let authTypeKey = ['act','executiveOrder', 'USC', 'publicLaw', 'statute'];

    if(this.falAuthForm.value.description != null && this.falAuthForm.value.description != '')
      data.authorizations = {description: this.falAuthForm.value.description};

    console.log(this.authInfo);
    if(this.authInfo.length > 0){
      data.authorizations['list']=[];
      for(let auth of this.authInfo){
        let list = {};
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

    console.log("data", data);
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

  onSaveContinueClick(event){
    this.saveData();
  }

  authActionHandler(event){

    if(event.type == 'add'){
      this.hideAddButton = event.hideAddButton;
    }
    if(event.type == 'confirm'){
      this.hideAddButton = event.hideAddButton;
      this.authInfo = event.authInfo;
      this.authInfoFormat(event.authInfo);
    }
    if(event.type == 'cancel'){
      this.hideAddButton = event.hideAddButton;
    }
    if(event.type == 'edit'){
      this.editAuth(event.index);
    }
    if(event.type == 'remove'){
      this.removeAuth(event.index);
    }
  }//end of authActionHandler

  editAuth(i: number){
    this.authSubForm.editAuth(i);
    this.hideAddButton = this.authSubForm.hideAddButton;
  }

  removeAuth(i: number){
    this.authSubForm.removeAuth(i);
    this.displayAuthInfo.splice(i, 1);
    this.hideAddButton = this.authSubForm.hideAddButton;
  }

  authInfoFormat(authInfo){
    this.displayAuthInfo = [];
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
            label += "," + auth.statute.volume + "-" + auth.statute.page;
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

      if(label != '')
        this.displayAuthInfo.push(label);
    }
  }
}
