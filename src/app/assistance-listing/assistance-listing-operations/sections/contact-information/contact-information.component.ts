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
  hideContactsForm: boolean = true;
  contactIndex: number = 0;
  contactsInfo = [];
  checkboxConfig: any;
  mode:string;
  contactDrpDwnOptions = [{label:"None Selected", value:'na'},
                          {label:"New Contact", value:'new'},
                          {label:"Existing Contact", value:'existing'}];
  stateDrpDwnOptions = [{label:"None Selected", value:'na'}];
  countryDrpDwnOptions;

  constructor(private fb: FormBuilder,
              private programService: ProgramService,
              private router: Router,
              private sharedService: FALOpSharedService){

    sharedService.setSideNavFocus();
    this.programId = sharedService.programId;

    let states = sharedService.getStates();
    for(let key in states){
      this.stateDrpDwnOptions.push({label:states[key], value:key});
    }

    //this.countryDrpDwnOptions = sharedService.getCountries();
  }

  ngOnInit(){
    this.createForm();
  }

  ngOnDestroy(){}

  createForm() {

    // Checkboxes Component
    this.checkboxConfig = {
      options: [
        {value: '', label: 'See Regional Agency Offices', name: 'checkbox-rao'},
      ],
    };

    this.falContactInfoForm = this.fb.group({
      'addInfo': '',
      'contacts': this.fb.array([ ]),
      'website': ''
    });
  }

  initContacts(){
    return this.fb.group({
      contact:['na'],
      title: [''],
      fullName: [''],
      email:[''],
      phone:[''],
      fax:[''],
      street:[''],
      city:[''],
      state:['na'],
      zip:[''],
      country:['']
    });
  }

  addContact(){
    const control = <FormArray> this.falContactInfoForm.controls['contacts'];
    this.contactIndex = control.length;
    control.push(this.initContacts());
    this.hideAddButton = true;
    this.hideContactsForm = false;
    this.mode = "Add";
  }

  onConfirmClick(){

    this.contactsInfo = this.falContactInfoForm.value.contacts;
    this.hideAddButton = false;
    this.hideContactsForm = true;
  }

  onSubFormCancelClick(){
    this.hideAddButton = false;
    this.hideContactsForm = true;
  }

  removeContact(i: number) {
    const control = <FormArray>this.falContactInfoForm.controls['contacts'];
    control.removeAt(i);
    this.contactsInfo = this.falContactInfoForm.value.contacts;
  }

  editContact(i: number){
    this.mode = "Edit";
    this.contactIndex = i;
    this.hideContactsForm = false;
  }

  saveData(){
    console.log(this.falContactInfoForm.value);
  }
}
