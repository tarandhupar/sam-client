import {Component, OnInit, Input} from "@angular/core";
import {FormBuilder, FormArray, FormGroup, Validators} from "@angular/forms";
import {FALFormViewModel} from "../../fal-form.model";
import {FALFormService} from "../../fal-form.service";
import {UUID} from "angular2-uuid";

@Component({
  providers: [FALFormService],
  templateUrl: 'fal-form-contact.template.html',
  selector: 'fal-form-contact-info'
})
export class FALFormContactInfoComponent implements OnInit {
  @Input() viewModel: FALFormViewModel;

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
      'website': '',
      'useRegionalOffice': '',
      'additionalInfo': '',
      'contacts': this.fb.array([])
    });
  }

  initContacts() {
    return this.fb.group({
      contactId: ['na'],
      title: [''],
      fullName: [''],
      email: ['', Validators.pattern('[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,3}$')],
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

  onConfirmClick() {

    this.contactsInfo = this.falContactInfoForm.value.contacts;
    this.hideAddButton = false;
    this.hideContactsForm = true;
  }

  onSubFormCancelClick(i) {

    if (this.mode == 'Add') {
      this.removeContact(i);
    }

    if (this.mode == 'Edit') {
      const control = <FormArray> this.falContactInfoForm.controls['contacts'];
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

    let contacts = [];
    let regLocalOffice = '';

    for (let contact of this.falContactInfoForm.value.contacts) {
      let generateUUID = false;

      if (contact.contactId == 'na' || contact.contactId == 'new') {
        generateUUID = true;
      }
      else {
        if (JSON.stringify(contact) !== JSON.stringify(this.contactDrpDwnInfo[contact.contactId])) {
          generateUUID = true;
        }
      }

      if (generateUUID) {
        let uuid = UUID.UUID().replace(/-/g, "");
        contact.contactId = uuid;
      }

      contacts.push(contact);
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
  }
}
