import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FALFormService} from "../../fal-form.service";
import {FALFormViewModel} from "../../fal-form.model";

@Component({
  providers: [FALFormService],
  selector: 'fal-form-contact-info',
  templateUrl: 'fal-form-contact.template.html'
})

export class FALFormContactInfoComponent implements OnInit {
  @Input() viewModel: FALFormViewModel;
  checkboxConfig: { options: { value: string, label: string, name: string }[] };
  falContactInfoForm: FormGroup;
  contactList: any;
  contactLookup: any;

  constructor(private fb: FormBuilder, private service: FALFormService) {
    this.checkboxConfig = {
      options: [
        {value: 'appendix', label: 'See Regional Agency Offices', name: 'checkbox-rao'},
      ],
    };
  }

  ngOnInit() {
    this.service.getContactsList().subscribe(
      data => this.parseContactList(data),
      error => {
        console.error('error retrieving contact list', error);
      });

    this.falContactInfoForm = this.fb.group({
      'useRegionalOffice': '',
      'additionalInfo': '',
      'website': ''
    });

    this.falContactInfoForm.valueChanges.subscribe(data => this.updateViewModel(data));

    if (!this.viewModel.isNew) {
      this.updateForm();
    }
  }

  parseContactList(data) {
    this.contactList = [];
    this.contactLookup = {};

    for (let contact of data._embedded.contacts) {
      let id = contact.contactId;
      let label = contact.fullName + ", " + contact.email;
      this.contactList.push({
        value: id,
        label: label
      });

      this.contactLookup[id] = contact;
    }
  }

  updateViewModel(data) {
    this.viewModel.useRegionalOffice = data['useRegionalOffice'];
  }

  updateForm() {
    let useRegionalOffice = this.viewModel.useRegionalOffice;
    let additionalInfo = this.viewModel.additionalInfo;

    this.falContactInfoForm.patchValue({
      useRegionalOffice: useRegionalOffice,
      additionalInfo: additionalInfo,
      website: ''
    }, {
      emitEvent: false
    });
  }
}
