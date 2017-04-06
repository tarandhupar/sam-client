import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
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
  falAuthForm: FormGroup;
  authInfo = [];
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
  }//end of authActionHandler

  editAuth(i: number){
    this.authSubForm.editAuth(i);
  }

  removeAuth(i: number){
    this.authSubForm.removeAuth(i);
  }

  authInfoFormat(authInfo){
    this.authInfo = authInfo;
  }
}
