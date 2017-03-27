import { Component, OnInit, OnDestroy } from '@angular/core';
import {FormBuilder, FormArray, FormGroup} from '@angular/forms';
import { Router} from '@angular/router';
import { ProgramService } from 'api-kit';
import { FALOpSharedService } from '../../assistance-listing-operations.service';

@Component({
  providers: [ ProgramService ],
  templateUrl: 'contact-information.template.html',
})
export class FALContactInfoComponent implements OnInit, OnDestroy{

  getProgSub: any;
  saveProgSub: any;
  redirectToWksp: boolean = false;
  falContactInfoForm: FormGroup;
  programId : any;
  title: string;
  hideAddButton: boolean = false;
  hideContactsForm: boolean = false;
  contactIndex: number = 0;
  contactsInfo : any;

  constructor(private fb: FormBuilder,
              private programService: ProgramService,
              private router: Router,
              private sharedService: FALOpSharedService){

    this.sharedService.setSideNavFocus();
    this.programId = sharedService.programId;
  }

  ngOnInit(){
    this.createForm();
  }

  ngOnDestroy(){}

  createForm() {

    this.falContactInfoForm = this.fb.group({
      'addInfo': '',
      'contacts': this.fb.array([ ])
    });
  }

  initContacts(){
    return this.fb.group({
      title: [''],
      fullName: [''],
      email:['']
    });
  }

  addContact(){
    const control = <FormArray> this.falContactInfoForm.controls['contacts'];
    this.contactIndex = control.length;
    control.push(this.initContacts());
    this.hideAddButton = true;
    this.hideContactsForm = false;
  }

  onConfirmClick(){

    this.contactsInfo = this.falContactInfoForm.value.contacts;
    this.hideAddButton = false;
    this.hideContactsForm = true;
  }

  removeContact(i: number) {
    const control = <FormArray>this.falContactInfoForm.controls['contacts'];
    control.removeAt(i);
    this.contactsInfo = this.falContactInfoForm.value.contacts;
  }

  editContact(i: number){
    console.log("test");
    this.contactIndex = i;
    this.hideContactsForm = false;
  }

  saveData(){
    console.log(this.falContactInfoForm.value);
  }
}
