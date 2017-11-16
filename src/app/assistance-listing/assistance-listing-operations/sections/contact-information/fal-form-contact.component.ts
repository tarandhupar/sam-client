import { Component, ChangeDetectorRef, OnInit, Input, Output, ViewChildren, ViewChild, EventEmitter,QueryList } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, FormControl,Validators } from "@angular/forms";
import { FALFormViewModel } from "../../fal-form.model";
import { FALFormService } from "../../fal-form.service";
import { LocationService } from 'api-kit/location/location.service';
import { v4 as UUID } from 'uuid';

import { falCustomValidatorsComponent } from '../../../validators/assistance-listing-validators';
import { FALFormErrorService } from '../../fal-form-error.service';
import { FALSectionNames, FALFieldNames } from '../../fal-form.constants';
import * as _ from 'lodash';
import { SamPOCEntryComponent } from "../../../../app-components/poc-entry";
import { Observable } from "rxjs";

@Component({
  providers: [FALFormService],
  templateUrl: 'fal-form-contact.template.html',
  selector: 'fal-form-contact-info'
})
export class FALFormContactInfoComponent implements OnInit {
  @Input() viewModel: FALFormViewModel;
  @Output() public showErrors = new EventEmitter();
  @ViewChildren('poc') pocs: QueryList<SamPOCEntryComponent>;
  @ViewChild('contactLB') contactLB;
  falContactInfoForm: FormGroup;
  progTitle: string;
  hideAddButton: boolean = false;
  hideContactsForm: boolean = true;
  atLeastOneEntryError: boolean = false;
  contactIndex: number = 0;
  contactsInfo = [];
  subFormErrorIndex: any = {};
  checkboxConfig: any;
  mode: string;
  contactDrpDwnInfo = [];
  sectionStatus: string = '';
  contactDrpDwnOptions = [];//[{value: "New Contact", key: 'new'}];
  contactNameOptions = [];
  contactEmailOptions = [];

  stateDrpDwnOptions = [{value: "None Selected", key: 'na'}];
  countryDrpDwnOptions = [];

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
              private service: FALFormService,
              private errorService: FALFormErrorService,
              private locationService: LocationService,
              private cdr: ChangeDetectorRef) {


    this.service.getContactDict().subscribe(data => {
      for (let state of data['states']) {
        this.stateDrpDwnOptions.push({value: state.value, key: state.code});
      }

      for (let country of data['countries']) {
        this.countryDrpDwnOptions.push({value: country.value, key: country.code});
      }
    });
    Observable.zip(
      this.service.getContactsList(),
      this.locationService.getAllContries(),
      function(data1,data2){
        return {
          contacts: data1,
          country: data2,
        }
      }
    ).subscribe((data)=>{
      for (let contact of data['contacts']._embedded.contacts) {

        let contactMirror = Object.assign({},contact);
        if(contact.fullName){
          this.contactNameOptions.push({
            key: contact.fullName,
            value: contact.fullName
          });
          contactMirror.fullName = {
            key: contact.fullName,
            value: contact.fullName
          };
        }
        if(contact.email){
          this.contactEmailOptions.push({
            key: contact.email,
            value: contact.email
          });
          contactMirror.email = {
            key: contact.email,
            value: contact.email
          };
        }
        if(contactMirror.phone){
          contactMirror.phone = contactMirror.phone.replace(/\D/g,'');
        }
        if(contactMirror.fax){
          contactMirror.fax = contactMirror.fax.replace(/\D/g,'');
        }

        contactMirror.state = {
          key: contact.state,
          value: contact.state
        };

        contactMirror.country = {
          key: "",
          value: ""
        };
        if(contact.country && data['country']){
          contactMirror.country = this._setCountry(contact.country,data['country']._embedded.countryList);
        }
        this.contactDrpDwnOptions.push(contactMirror);
        //this.contactDrpDwnOptions = this.contactDrpDwnOptions.slice();
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
    }
  }

  ngAfterViewInit() {
    setTimeout( () => {
      this.sectionStatus = this.viewModel.getSectionStatus(FALSectionNames.CONTACT_INFORMATION);
    });
  }

  createForm() {

    // Checkboxes Component
    this.checkboxConfig = {
      options: [
        {value: 'appendix', label: 'See Regional Assistance Locations', name: 'checkbox-rao'},
      ],
    };

    this.falContactInfoForm = this.fb.group({
      'website': ['', falCustomValidatorsComponent.checkURLPattern],
      'useRegionalOffice': '',
      'additionalInfo': '',
      'contacts': this.fb.array([])
    });

    setTimeout(() => { // horrible hack to trigger angular change detection
      if (this.viewModel.getSectionStatus(FALSectionNames.CONTACT_INFORMATION) === 'updated') {
        this.falContactInfoForm.markAsPristine({onlySelf: true});
        this.falContactInfoForm.get('website').markAsDirty({onlySelf: true});
        this.falContactInfoForm.get('website').updateValueAndValidity();
        this.falContactInfoForm.get('useRegionalOffice').markAsDirty({onlySelf: true});
        this.falContactInfoForm.get('useRegionalOffice').updateValueAndValidity();
        this.falContactInfoForm.get('additionalInfo').markAsDirty({onlySelf: true});
        this.falContactInfoForm.get('additionalInfo').updateValueAndValidity();
        this.falContactInfoForm.get('contacts').markAsDirty({onlySelf: true});
        this.falContactInfoForm.get('contacts').updateValueAndValidity();
      }
    });
  }

  initContacts() {
    return this.fb.group({
      poc:[{
        contactId: 'na',
        title: '',
        fullName: '',
        email: '',
        phone: '',
        fax: '',
        streetAddress: '',
        streetAddress2: '',
        city: '',
        state: '',
        zip: '',
        country: {key:"USA",value:'USA - United States'}
      },SamPOCEntryComponent.pocValidations]
    });
  }

  onParamChanged(event,control) {
    if (event != 'new' && event != 'na') {
      this.mode = "Edit";
      control.patchValue(this.contactDrpDwnInfo[event]);
    }
    else if(control.length>0) {
      this.mode = "Edit";
      control.reset();
      control.patchValue({contactId: event});
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
    this.atLeastOneEntryError = true;

    setTimeout(() => {
      this.updateSubformErrors();
    });
  }

  onSubFormCancelClick(i) {
    this.atLeastOneEntryError = true;

    if(this.hideAddButton === false) {
      return; // clicking cancel has no effect if nothing is being edited or added
    }

    if (this.mode == 'Add') {
      this.removeContact(i);
    }

    if (this.mode == 'Edit') {
      const control = <FormArray> this.falContactInfoForm.controls['contacts'];
      //let errorExists = this.contactsInfo[i]['errorExists'];
      delete this.contactsInfo[i]['errorExists'];
      control.at(i).setValue(this.contactsInfo[i]);
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
    this.atLeastOneEntryError = true;

    setTimeout(() => {
      this.updateSubformErrors();
    });
  }

  editContact(i: number) {
    this.mode = "Edit";
    this.contactIndex = i;
    this.hideContactsForm = false;
    this.hideAddButton = true;
    this.atLeastOneEntryError = true;
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
    let contacts = <FormArray>this.falContactInfoForm.controls['contacts'];

    Observable.zip(
      this.locationService.getAllStates("USA"),
      this.locationService.getAllContries(),
      function(data1,data2){
        return {
          state: data1,
          country: data2,
        }
      }
    ).subscribe((data)=>{
      const control = contacts;
      for (let contact of headquarters) {
        let c = this.initContacts();
        if(contact.state){
          let obj = {};
          obj['key'] = contact.state;
          let stateObj = data['state']._embedded.stateList.find((row)=>{
            if(contact.state==row.stateCode){
              return true;
            }
          });
          obj['value'] = stateObj && stateObj['state'] ? stateObj['state'] : obj['key'];
          contact.state = obj;
        }
        if(contact.country){
          contact.country = this._setCountry(contact.country,data['country']._embedded.countryList);
        }
        if(contact['streetAddress2'] === undefined) {
          contact['streetAddress2'] = '';
        }
        c.patchValue({
          poc:contact
        });
        control.push(c);
      }
      this.contactLB.setupModel();
    });

    this.contactsInfo = this.falContactInfoForm.value.contacts;

    setTimeout(() => {
      this.updateErrors();
      this.updateSubformErrors();
    });
  }

  _setCountry(countryCode,countryList){
    let obj = {};
    obj['key'] = countryCode;
    let countryObj = countryList.find((row)=>{
      if(countryCode==row.countrycode || countryCode==row.countryCode2){
        return true;
      }
    });
    let countryStr = "";
    if(countryObj && countryObj['countrycode'] && countryObj['country']){
      countryStr = countryObj['countrycode'] + " - " + countryObj['country'];
    }
    obj['value'] = countryStr;
    return obj;
  }

  saveData() {

    let contacts = [];
    let regLocalOffice = '';
    let counter = 0;
    let formContactsArr = _.cloneDeep(this.falContactInfoForm.value.contacts);
    for (let contact of formContactsArr) {
      let generateUUID = false;

      if (contact.poc.contactId == 'na' || contact.poc.contactId == 'new') {
        generateUUID = true;
      }

      if (generateUUID) {
        let uuid = UUID().replace(/-/g, "");
        contact.poc.contactId = uuid;
      }

      if(contact.poc.state && typeof contact.poc.state == "object"){
        contact.poc.state = contact.poc.state['key'];
      }
      if(contact.poc.country && typeof contact.poc.country == "object"){
        contact.poc.country = contact.poc.country['key'];
      }

      contacts.push(contact.poc);
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
      website: this.falContactInfoForm.value.website.trim(),
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
      this.updateErrors();
    });
  }

  private updateSubformErrors(){
    this.errorService.viewModel = this.viewModel;
    this.showErrors.emit(this.errorService.applicableErrors);
  }

  private updateErrors() {
    this.errorService.viewModel = this.viewModel;
    let contactErrors = this.errorService.validateContactList();
    if(contactErrors){
      let formArr = <FormArray>this.falContactInfoForm.get('contacts');
      if(contactErrors.errorList[0]['errors']['noContact']){
        formArr.setErrors(contactErrors.errorList[0]['errors'],{emitEvent:true});
      } else {
        this.contactLB.wrapper.clearError();
      }
      this.cdr.detectChanges();
    }

    this.falContactInfoForm.get('website').clearValidators();
    this.falContactInfoForm.get('website').setValidators((control) => { return control.errors });
    this.falContactInfoForm.get('website').setErrors(this.errorService.validateContactWebsite().errors);
    this.falContactInfoForm.get('website').updateValueAndValidity({onlySelf: true, emitEvent: true});

    this.showErrors.emit(this.errorService.applicableErrors);
  }

  public beforeNavigationAction() {
    this.onSubFormCancelClick(this.contactIndex);
    if(this.sectionStatus === 'updated')
      this.atLeastOneEntryError = true;
    else
      this.atLeastOneEntryError = false;
  }

  contactsSubform: FormGroup = this.initContacts();

  contactsFormArrayChange(data){
    let formArray= <FormArray>this.falContactInfoForm.get('contacts');
    while(formArray.value.length>0){
      formArray.removeAt(0);
    }
    for(var idx in data){
      let control = _.cloneDeep(this.contactsSubform);
      control.setValue(data[idx].value);
      formArray.markAsDirty();
      formArray.push(control);
    }
    this.mode = "";
  }

  lbActionHandler(event){
    let formArray= <FormArray>this.falContactInfoForm.get('contacts');
    if(event=="add"){
      this.mode = "Add";
    } else if (event=="add-cancel"){
      this.mode = "";
      formArray.markAsDirty();
      this.updateErrors();
    } else if (event=="edit"){
      this.mode = "Edit";
    } else if (event=="edit-cancel"){
      this.mode = "";
    } else if (event=="delete"){
      formArray.markAsDirty();
      this.updateErrors();
    }
  }
}
