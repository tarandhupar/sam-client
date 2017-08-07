import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, FormControl,Validators } from "@angular/forms";
import { FALFormViewModel } from "../../fal-form.model";
import { FALFormService } from "../../fal-form.service";
import { UUID } from "angular2-uuid";
import { falCustomValidatorsComponent } from '../../../validators/assistance-listing-validators';
import { FALFormErrorService } from '../../fal-form-error.service';
import { FALSectionNames, FALFieldNames } from '../../fal-form.constants';
import * as _ from 'lodash';

@Component({
  providers: [FALFormService],
  templateUrl: 'fal-form-contact.template.html',
  selector: 'fal-form-contact-info'
})
export class FALFormContactInfoComponent implements OnInit {
  @Input() viewModel: FALFormViewModel;
  @Output() public showErrors = new EventEmitter();
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
  contactDrpDwnOptions = [{label: "None Selected", value: 'na'},
    {label: "New Contact", value: 'new'}];

  stateDrpDwnOptions = [{label: "None Selected", value: 'na'}];
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
              private errorService: FALFormErrorService) {


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
        {value: 'appendix', label: 'See Regional Agency Offices', name: 'checkbox-rao'},
      ],
    };

    this.falContactInfoForm = this.fb.group({
      'website': ['', falCustomValidatorsComponent.checkURLPattern],
      'useRegionalOffice': '',
      'additionalInfo': '',
      'contacts': this.fb.array([], falCustomValidatorsComponent.atLeastOneEntryCheck)
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
      contactId: ['na'],
      title: [''],
      fullName: [''],
      email: ['', [falCustomValidatorsComponent.checkEmailPattern,Validators.required]],
      phone: [''],
      fax: [''],
      streetAddress: [''],
      city: [''],
      state: ['na', falCustomValidatorsComponent.selectRequired],
      zip: [''],
      country: ['US']
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
    const control = <FormArray> this.falContactInfoForm.controls['contacts'];
    for (let contact of headquarters) {
      let c = this.initContacts();
      c.patchValue(contact);
      control.push(c);
    }

    this.contactsInfo = this.falContactInfoForm.value.contacts;

    setTimeout(() => {
      this.updateErrors();
      this.updateSubformErrors();
    });
  }

  saveData() {

    let contacts = [];
    let regLocalOffice = '';
    let counter = 0;

    for (let contact of this.falContactInfoForm.value.contacts) {
      let generateUUID = false;

      if (contact.contactId == 'na' || contact.contactId == 'new') {
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
    this.setSubFormErrors(this.errorService.validateContactList());
    this.showErrors.emit(this.errorService.applicableErrors);
  }

  private setSubFormErrors(contactsErrorList){
    this.subFormErrorIndex = {};
    if(contactsErrorList) {
      let fieldList = ['fullName', 'email', 'phone', 'fax', 'streetAddress', 'city', 'state', 'zip'];

      for(let errObj of contactsErrorList.errorList){
        if(!errObj.errors['noContact']) {
          let id = errObj.id;
          id = id.substr(id.length - 1);

          for(let fieldName of fieldList) {
            let fcontrol = this.falContactInfoForm.controls['contacts']['controls'][id].get(fieldName);
            fcontrol.markAsDirty();
            fcontrol.updateValueAndValidity({onlySelf: true, emitEvent: true});
          }

          this.subFormErrorIndex[id] = true;
        }//end of if
      }//end of for
    }//end of if
  }

  private updateErrors() {
    this.errorService.viewModel = this.viewModel;
    let contactErrors = this.errorService.validateContactList();
    if(contactErrors){
      let formArr = <FormArray>this.falContactInfoForm.get('contacts');
      if(contactErrors.errorList[0]['errors']['noContact']){
        formArr.setErrors(contactErrors.errorList[0]['errors']);
      }
    }


    this.falContactInfoForm.get('website').clearValidators();
    this.falContactInfoForm.get('website').setValidators((control) => { return control.errors });
    this.falContactInfoForm.get('website').setErrors(this.errorService.validateContactWebsite().errors);
    this.falContactInfoForm.get('website').updateValueAndValidity({onlySelf: true, emitEvent: true});

    this.showErrors.emit(this.errorService.applicableErrors);
  }

  public beforeSaveAction() {
    this.onSubFormCancelClick(this.contactIndex);
    if(this.sectionStatus === 'updated')
      this.atLeastOneEntryError = true;
    else
      this.atLeastOneEntryError = false;
  }

  contactsSubform:FormGroup = this.fb.group({
    contactId: ['na'],
    title: [''],
    fullName: [''],
    email: ['', [falCustomValidatorsComponent.checkEmailPattern,Validators.required]],
    phone: [''],
    fax: [''],
    streetAddress: [''],
    city: [''],
    state: ['na', falCustomValidatorsComponent.selectRequired],
    zip: [''],
    country: ['US']
  });

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
    if(event=="add-cancel"){
      this.mode = "";
      formArray.markAsDirty();
      this.updateErrors();
    } else if (event=="edit"){
      this.mode = "Edit";
    }
  }
}
