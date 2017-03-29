import { Component, OnInit, OnDestroy } from '@angular/core';
import {FormBuilder, FormArray, FormGroup, Validators} from '@angular/forms';
import { Router} from '@angular/router';
import { ProgramService } from 'api-kit';
import { FALOpSharedService } from '../../assistance-listing-operations.service';
import { DictionaryService } from 'api-kit';

@Component({
  providers: [ ProgramService, DictionaryService ],
  templateUrl: 'contact-information.template.html',
})
export class FALContactInfoComponent implements OnInit, OnDestroy{

  getProgSub: any;
  saveProgSub: any;
  redirectToWksp: boolean = false;
  redirectToViewPg: boolean = false;
  falContactInfoForm: FormGroup;
  programId : any;
  progTitle: string;
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
  countryDrpDwnOptions = [];

  constructor(private fb: FormBuilder,
              private programService: ProgramService,
              private router: Router,
              private sharedService: FALOpSharedService,
              private dictService: DictionaryService){

    sharedService.setSideNavFocus();
    this.programId = sharedService.programId;

    dictService.getDictionaryById('states')
      .subscribe(data => {
        for(let state of data['states']){
          this.stateDrpDwnOptions.push({label:state.value, value:state.code});
        }
      });

    dictService.getDictionaryById('countries')
      .subscribe(data => {
        for(let country of data['countries']){
          this.countryDrpDwnOptions.push({label:country.value, value:country.code});
        }
      });

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
      email:['', Validators.minLength(5)],
      phone:[''],
      fax:[''],
      streetAddress:[''],
      city:[''],
      state:['na'],
      zip:[''],
      country:['US']
    });
  }

  onParamChanged(event){
    if(event != 'new' && event != 'na'){
      const control = <FormArray> this.falContactInfoForm.controls['contacts'];
      control.at(control.length - 1).patchValue({title:"test"});
    }
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
    if(this.mode == 'Add'){
      const control = <FormArray> this.falContactInfoForm.controls['contacts'];
      this.removeContact(control.length - 1);
    }

    this.hideAddButton = false;
    this.hideContactsForm = true;
  }

  removeContact(i: number) {
    const control = <FormArray>this.falContactInfoForm.controls['contacts'];
    control.removeAt(i);
    this.contactsInfo = this.falContactInfoForm.value.contacts;
    this.hideContactsForm = true;
    this.hideAddButton = false;
  }

  editContact(i: number){
    this.mode = "Edit";
    this.contactIndex = i;
    this.hideContactsForm = false;
    this.hideAddButton = true;
  }

  getData() {

    this.getProgSub = this.programService.getProgramById(this.sharedService.programId, this.sharedService.cookieValue)
      .subscribe(api => {
          this.progTitle = api.data.title;
          console.log("Api", api);
          let addInfo = '';

          if(api.data.contacts) {
            if(api.data.contacts.local)
                addInfo = (api.data.contacts.local.description ? api.data.contacts.local.description : '');

            if(api.data.contacts.headquarters){
              let index = 0;
              const control = <FormArray> this.falContactInfoForm.controls['contacts'];
              for(let contact of api.data.contacts.headquarters){
                contact['contact'] = 'existing';
                control.push(this.initContacts());
                control.at(index).patchValue(contact);
                index = index + 1;
              }
            }
          }

          let website = (api.data.website ? api.data.website : '');

          this.falContactInfoForm.patchValue({
            addInfo:addInfo,
            website: website
          });

          this.contactsInfo = this.falContactInfoForm.value.contacts;
        },
        error => {
          console.error('Error Retrieving Program!!', error);
        });//end of subscribe

  }

  saveData(){

    let contacts = [];
    for(let contact of this.falContactInfoForm.value.contacts){
      delete contact.contact;
      contacts.push(contact);
    }

    let data = {
      website: this.falContactInfoForm.value.website,
      contacts:{
        local:{
          description: this.falContactInfoForm.value.addInfo
        },
        headquarters:contacts
      }
    };

    this.saveProgSub = this.programService.saveProgram(this.sharedService.programId, data, this.sharedService.cookieValue)
      .subscribe(api => {
          this.sharedService.programId = api._body;
          console.log('AJAX Completed Contact Information', api);

          if(this.redirectToWksp)
            this.router.navigate(['falworkspace']);
          else if(this.redirectToViewPg){
            this.router.navigate(['/programs', this.sharedService.programId, 'view']);
          }
          else
            this.router.navigate(['/programs/' + this.sharedService.programId + '/edit/financial-information']);

        },
        error => {
          console.error('Error saving Program - Contact Information Section!!', error);
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
      this.router.navigate(['programs/' + this.sharedService.programId + '/edit/financial-information/other-financial-info']);
    else
      this.router.navigate(['programs/add/financial-information/other-financial-info']);

  }

  onSaveExitClick(event) {

    if (this.sharedService.programId)
      this.redirectToViewPg = true;
    else
      this.redirectToWksp = true;


    this.saveData();
  }

  onSaveContinueClick(event) {
    this.redirectToViewPg = true;
    this.saveData();
  }
}
