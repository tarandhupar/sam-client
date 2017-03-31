import { merge } from 'lodash';

import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { IAMService } from 'api-kit';

import { Validators as $Validators } from '../../shared/validators';
import { User } from '../../user.interface';
import { System, POC } from '../../system.interface';

@Component({
  templateUrl: './system-profile.component.html',
  providers: [
    IAMService
  ]
})
export class SystemProfileComponent {
  private store = {
    title: 'Profile',
    messages: {
      required: 'This field is required',
      email: 'Enter a valid email address',
    },

    search: {
      duns: '',
      users: ''
    }
  };

  private states = {
    gov: true,
    system: false,
    submitted: false,
    loading: false,
    alert: {
      type: 'success',
      message: '',
      show: false
    }
  };

  private detailsForm: FormGroup;
  private user: User = {
    _id: '',
    email: '',

    title: '',
    suffix: '',

    fullName: '',
    firstName: '',
    initials: '',
    lastName: '',

    department: '',
    orgID: '',

    workPhone: ''
  };

  private system: System = {
    _id: '',
    email: '',
    systemName: '',
    systemType: '',
    comments: '',

    department: '',
    duns: '',
    businessName: '',
    businessAddress: '',

    ipAddress: '',
    primaryOwnerName: '',
    primaryOwnerEmail: '',

    pointOfContact: []
  };

  constructor(private router: Router, private builder: FormBuilder, private api: IAMService) {}

  ngOnInit() {
    this.api.iam.checkSession((user) => {
      this.user = user;

      this.states.system = user.systemAccount;
      this.states.gov = user.department ? true : false;
      this.states.system ? this.initForm() : this.router.navigateByUrl('/profile');
    }, () => {
      if(!this.api.iam.isDebug()) {
        this.router.navigate(['/signin']);
      } else {
        merge(this.user, {
          email: '_doe.john@gsa.gov',
          firstName: 'John',
          lastName: 'Doe',
          department: 100006688,
          orgID: 100183406
        });

        merge(this.system, {
          _id: 'System101',
          email: this.user.email,
          systemName: 'System 101',
          systemType: 'Gov',
          comments: 'System comments...',
          duns: 'Test Duns',
          businessName: 'John Doe Inc.',
          businessAddress: '1600 Pennsylvania Ave NW, Washington DC 20500',

          primaryOwnerName: [this.user.firstName, this.user.lastName].join(' '),
          primaryOwnerEmail: this.user.email,
          pointOfContact: [
            { firstName: 'Tester', lastName: '#1', email: 'test.user@yahoo.com',   phone: '12223334444' },
            { firstName: 'Tester', lastName: '#2', email: 'test.user@gmail.com',   phone: '15556667777' },
            { firstName: 'Tester', lastName: '#3', email: 'test.user@hotmail.com', phone: '16667778888' }
          ]
        });

        this.initForm();
      }
    });
  }

  initForm() {
    merge(this.system, {
      department: this.user.orgID,
      systemType: this.user.department ? 'Gov' : 'Non-Gov'
    });

    this.detailsForm = this.builder.group({
      _id:               [this.system._id, [Validators.required]],
      email:             [this.system.email, [Validators.required, $Validators.email]],
      systemName:        [this.system.systemName, [Validators.required]],
      systemType:        [this.system.systemType],
      comments:          [this.system.comments],

      department:        [this.system.department],
      duns:              [this.system.duns],

      businessName:      [this.system.businessName],
      businessAddress:   [this.system.businessAddress],

      ipAddress:         [this.system.ipAddress],
      primaryOwnerName:  [this.system.primaryOwnerName, [Validators.required]],
      primaryOwnerEmail: [this.system.primaryOwnerEmail, [Validators.required]],

     pointOfContact:    this.builder.array(this.initPointOfContact(this.system.pointOfContact))
    });
  }

  initPointOfContact(items: POC[]) {
    let formItems: FormGroup[] = items.map((item) => {
      return this.builder.group({
        email:     [item.email],
        firstName: [item.firstName],
        lastName:  [item.lastName],
        phone:     [item.phone]
      });
    });

    return formItems;
  }

  setControlValue(key, value) {
    this.system[key] = value;
    this.detailsForm.controls[key].setValue(value);
  }

  $errors(controlName) {
    const controls = this.detailsForm.controls,
          errors = controls[controlName].errors || {},
          mappings = Object.keys(errors),
          isError = (this.states.submitted && mappings.length),
          message = isError ? this.store.messages[mappings[0]] : '';
    return message;
  }

  setOrganization(organization) {
    this.setControlValue('department', organization.value);
  }

  alert(type: string, message: string) {
    this.states.alert.message = (message || '');
    this.states.alert.type = (type || 'success');
    this.states.alert.show = true;
  }

  save() {
    this.states.submitted = true;
    this.states.alert.show = false;

    if(this.detailsForm.valid) {
      this.api.iam.system.account.create(this.detailsForm.value, (account) => {
        this.alert('success', 'The system account was successfully created!');
      }, (error) => {
        this.alert('error', error.message);
      });
    }
  }
}
