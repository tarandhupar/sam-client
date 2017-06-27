import {Component, OnInit, Input, ViewChild, Output, EventEmitter} from "@angular/core";
import {FormBuilder, FormArray, FormGroup, Validators} from "@angular/forms";
import {FALFormViewModel} from "../../fal-form.model";
import {FALFormService} from "../../fal-form.service";
import {UUID} from "angular2-uuid";
import { falCustomValidatorsComponent } from '../../../validators/assistance-listing-validators';

@Component({
  providers: [FALFormService],
  templateUrl: 'fal-form-contact.template.html',
  selector: 'fal-form-contact-info'
})
export class FALFormContactInfoComponent implements OnInit {
  @Input() viewModel: FALFormViewModel;
  @Output() public onError = new EventEmitter();
  @ViewChild('contactInfoTable') contactInfoTable;

  falContactInfoForm: FormGroup;
  progTitle: string;
  hideAddButton: boolean = false;
  hideContactsForm: boolean = true;
  contactIndex: number = 0;
  contactsInfo = [];
  checkboxConfig: any;
  mode: string;
  contactDrpDwnInfo = [];
  contactDrpDwnOptions = [{label: "None Selected", value: 'na'},
    {label: "New Contact", value: 'new'}];

  stateDrpDwnOptions = [{label: "None Selected", value: 'na'}];
  countryDrpDwnOptions = [];
  //errorExists: boolean = false;
  formErrorArr: any = {};
  review: boolean = false;
  contactadditionalInforamtionHint:string = `<p>Identify Federal regional or local offices that may be contacted about this listing.</p>
                                             <p>Identify the Federal regional or local office(s) that may be contacted for detailed information concerning a program, such as the availability of funds, the likelihood of receiving assistance and State Plan/application deadlines. 
                                             Only the names of program managers and/or contact persons closest to the program should be listed. The commercial, FTS, FAX, and TTY/TTD telephone numbers, and e-mail addresses should also be included for the regional and local contact persons. 
                                             Where appropriate, reference to Appendix IV of the Catalog for addresses and telephone numbers of Federal regional or field offices should be made in this section. 
                                             As in the current Catalog, certain programs should list this information within the program description because of the small number of offices and/or the small number of programs for which those offices are relevant. 
                                             The statement "See Appendix IV for list of addresses" alone is insufficient. The statement should be more specific, for example, "Complaints may be filed with the Department of Agriculture, Packers and Stockyards Regional Office, as listed in Appendix IV of the Catalog." 
                                             The subagency designations, and Appendix IV should be mentioned along with whatever directions the applicant might need. If potential applicants are not encouraged to contact the regional or local offices or if the program is administered entirely at the headquarters level, select Not applicable.</p>`;

  headquartersOfficeHint:string = `<p>Add up to two points of Contacts for your headquarters office.</p><br>
                                   <p>List the names, addresses, commercial, FTS, FAX, and TTY/TDD telephone numbers, and e-mail addresses of the administering office at the headquarters level. 
                                   The administering office will consist of the lowest agency subdivision that has direct operational responsibility for managing a program. 
                                   If regional or local offices are not able to answer inquiries, list the telephone number for the headquarters administering office. 
                                   If possible, provide a control number at the agency in case there might be difficulty contacting a resource person.</p>`;

  websiteHint:string = `<p>Provide the primary web page URL for this listing. When possible, the web page should be specific to this listing.</p>
                        <p>List the Website address of the administering office at the headquarters level.</p>`;
  constructor(private fb: FormBuilder,
              private service: FALFormService) {


    this.service.getContactDict().subscribe(data => {
      for (let state of data['states']) {
        this.stateDrpDwnOptions.push({label: state.value, value: state.code});
      }

      for (let country of data['countries']) {
        this.countryDrpDwnOptions.push({label: country.value, value: country.code});
      }
    });

    this.service.getContactsList().subscribe(api => {
      for (let contact of api._embedded.contacts) {

        this.contactDrpDwnOptions.push({
          label: contact.fullName + ", " + contact.email,
          value: contact.contactId
        });

        this.contactDrpDwnInfo[contact.contactId] = contact;
      }

    });

  }

  ngOnInit() {
    this.createForm();

    this.falContactInfoForm.valueChanges.subscribe(data => {
      this.saveData();
    });

    if (!this.viewModel.isNew) {
      this.getData();
      this.collectErrors();
    }
  }

  createForm() {

    // Checkboxes Component
    this.checkboxConfig = {
      options: [
        {value: 'appendix', label: 'See Regional Agency Offices', name: 'checkbox-rao'},
      ],
    };

    this.falContactInfoForm = this.fb.group({
      'website': ['', falCustomValidatorsComponent.checkURLPattern],
      'useRegionalOffice': '',
      'additionalInfo': '',
      'contacts': this.fb.array([], falCustomValidatorsComponent.atLeastOneEntryCheck)
    });
  }

  initContacts() {
    return this.fb.group({
      contactId: ['na'],
      title: [''],
      fullName: [''],
      email: ['', falCustomValidatorsComponent.checkEmailPattern],
      phone: [''],
      fax: [''],
      streetAddress: [''],
      city: [''],
      state: ['na'],
      zip: [''],
      country: ['US']
    });
  }

  onParamChanged(event) {
    const control = <FormArray> this.falContactInfoForm.controls['contacts'];

    if (event != 'new' && event != 'na') {
      control.at(control.length - 1).patchValue(this.contactDrpDwnInfo[event]);
    }

  }

  addContact() {
    const control = <FormArray> this.falContactInfoForm.controls['contacts'];
    this.contactIndex = control.length;
    control.push(this.initContacts());

    this.hideAddButton = true;
    this.hideContactsForm = false;
    this.mode = "Add";

  }

  onConfirmClick(i) {

    this.contactsInfo = this.falContactInfoForm.value.contacts;
    this.hideAddButton = false;
    this.hideContactsForm = true;

    if(this.contactInfoTable.review)
      this.markAllSubControls(this.falContactInfoForm.controls['contacts']['controls'][i]);
  }

  onSubFormCancelClick(i) {

    if (this.mode == 'Add') {
      this.removeContact(i);
    }

    if (this.mode == 'Edit') {
      const control = <FormArray> this.falContactInfoForm.controls['contacts'];
      //let errorExists = this.contactsInfo[i]['errorExists'];
      delete this.contactsInfo[i]['errorExists'];
      control.at(i).setValue(this.contactsInfo[i]);
      //this.contactsInfo[i].errorExists = errorExists;
    }

    this.hideAddButton = false;
    this.hideContactsForm = true;
  }

  actionHandler(event) {
    if (event.type == 'edit') {
      this.editContact(event.index);
    }
    else {
      this.removeContact(event.index);
    }
  }

  removeContact(i: number) {
    const control = <FormArray>this.falContactInfoForm.controls['contacts'];
    control.removeAt(i);
    this.contactsInfo = this.falContactInfoForm.value.contacts;
    this.hideContactsForm = true;
    this.hideAddButton = false;
  }

  editContact(i: number) {
    this.mode = "Edit";
    this.contactIndex = i;
    this.hideContactsForm = false;
    this.hideAddButton = true;
  }

  getData() {
    this.progTitle = this.viewModel.title;
    let regLocalOffice = this.viewModel.useRegionalOffice ? 'appendix' : '';

    this.falContactInfoForm.patchValue({
      additionalInfo: this.viewModel.additionalInfo || '',
      website: this.viewModel.website || '',
      useRegionalOffice: [regLocalOffice]
    }, {
      emitEvent: false
    });

    let headquarters = this.viewModel.headquarters;
    let index = 0;
    const control = <FormArray> this.falContactInfoForm.controls['contacts'];
    for (let contact of headquarters) {
      control.push(this.initContacts());
      control.at(index).patchValue(contact);
      index = index + 1;
    }

    this.contactsInfo = this.falContactInfoForm.value.contacts;
  }

  saveData() {

    this.formErrorArr = {};
    let contacts = [];
    let regLocalOffice = '';
    let counter = 0;

    for (let contact of this.falContactInfoForm.value.contacts) {
      let generateUUID = false;

      if (contact.contactId == 'na' || contact.contactId == 'new') {
        let contactId = contact.contactId;
        generateUUID = true;
      }

      if (generateUUID) {
        let uuid = UUID.UUID().replace(/-/g, "");
        contact.contactId = uuid;
      }

      contacts.push(contact);
      counter++;
    }

    if (this.falContactInfoForm.value.useRegionalOffice.length == 2) {
      regLocalOffice = this.falContactInfoForm.value.useRegionalOffice[1];
    }
    else {
      regLocalOffice = this.falContactInfoForm.value.useRegionalOffice[0];
    }

    regLocalOffice = (regLocalOffice ? regLocalOffice : 'none');

    let data = {
      website: this.falContactInfoForm.value.website,
      contacts: {
        local: {
          flag: regLocalOffice,
          description: this.falContactInfoForm.value.additionalInfo
        },
        headquarters: contacts
      }
    };

    this.viewModel.website = data.website;
    this.viewModel.contacts = data.contacts;

    setTimeout(() => {
      this.collectErrors();
    }, 0);

  }

  validateSection(){

    this.contactInfoTable.review = true;
    this.review = true;

    for (let key of Object.keys(this.falContactInfoForm.controls)) {

      if(this.falContactInfoForm.controls[key] instanceof FormArray){
        const control = <FormArray> this.falContactInfoForm.controls[key];

        for (let contact of control.controls) {
            this.markAllSubControls(contact);
        }//end of contact for
      }
      else {
        this.markAllSubControls(this.falContactInfoForm.controls[key]);
      }
    }

    setTimeout(() => {
      if(Object.keys(this.formErrorArr).length > 0){
        this.emitEvent();
      }
    }, 0);
  }

  markAllSubControls(control){
    if(control.controls){
      for(let key of Object.keys(control['controls'])){
        control['controls'][key].markAsDirty();
        control['controls'][key].updateValueAndValidity();
      }//end of key
    }
    else {
      control.markAsDirty();
      control.updateValueAndValidity();
    }
  }

  collectErrors(){
    for(let key of Object.keys(this.falContactInfoForm.controls)) {
      if(this.falContactInfoForm.controls[key] instanceof FormArray) {
        const control = <FormArray> this.falContactInfoForm.controls[key];
        this.noContactError(control.controls);
        for (let row of control.controls) {
          this.collectErrorsForContact(row);
        }
      }
      else {
        this.checkControlforErrors(this.falContactInfoForm.controls[key], key, key);
      }
    }
  }

  collectErrorsForContact(contact){
    for(let key of Object.keys(contact['controls'])){
        this.checkControlforErrors(contact['controls'][key], key, contact.value.contactId);
    }
  }

  checkControlforErrors(control, key, contactId){

    let formErrorLen = Object.keys(this.formErrorArr).length;

    if(control.errors){
      if(!(contactId in this.formErrorArr)) {
        this.formErrorArr[contactId] = {  errors: [key] };
      }
      else {
        let index = this.formErrorArr[contactId].errors.indexOf(key);
        if(index == -1) {
          this.formErrorArr[contactId].errors.push(key);
        }
      }
    }
    else {

      if(contactId in this.formErrorArr) {

        let index = this.formErrorArr[contactId].errors.indexOf(key);
        if(index > -1) {
          this.formErrorArr[contactId].errors.splice(index, 1);
        }

        if(this.formErrorArr[contactId].errors.length == 0) {
          delete this.formErrorArr[contactId];
        }
      }
    }

    if((formErrorLen !== Object.keys(this.formErrorArr).length || Object.keys(this.formErrorArr).length == 0) && this.review) {
      this.emitEvent();
    }

  }

  noContactError(contactInfo){

    let formErrorLen = Object.keys(this.formErrorArr).length;

    if(contactInfo.length == 0){
      this.formErrorArr['contact'] = { errors: ['one contact information required']};
    }
    else {
      delete this.formErrorArr['contact'];
    }

    if(this.review && formErrorLen !== Object.keys(this.formErrorArr).length)
      this.emitEvent();
  }

  emitEvent(){
    this.onError.emit({
      formErrorArr: this.formErrorArr,
      section: 'contact-information'
    });
  }
}
