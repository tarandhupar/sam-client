import { Component, DoCheck, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { merge } from 'lodash';

import { SamPasswordComponent } from '../../../app-components';

import { IAMService } from 'api-kit';
import { System } from 'api-kit/iam/interfaces';

import { Validators as $Validators } from '../../shared/validators';

@Component({
  templateUrl: './system-password.component.html',
  providers: [
    IAMService
  ]
})
export class SystemPasswordComponent {
  @ViewChild('formControl') formControl;
  @ViewChild('password') $password;

  private store = {
    title: 'Reset Password',
    phrases: []
  };

  public states = {
    initial: true,
    submitted: false,
    loading: false,
    alert: {
      type: 'success',
      message: '',
      show: false
    }
  }

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

  public passwordForm: FormGroup;

  constructor(private router: Router, private route: ActivatedRoute, private builder: FormBuilder, private api: IAMService) {}

  ngOnInit() {
    this.store['observer'] = this.route.params.subscribe(params => {
       this.system._id = params['id'];

       if(this.system._id) {
         this.api.iam.system.account.get(this.system._id, (system) => {
           this.system = merge({}, this.system, system);
           this.initForm();
         }, () => {
           // Error handling for system account GET
         });
       }
    });
  }

  ngOnDestroy() {
    this.store['observer'].unsubscribe();
  }

  initForm() {
    let group = {
      newPassword: ['', Validators.required],
    };

    if(this.system._id)
      this.store.phrases.push(this.system._id);
    if(this.system.email)
      this.store.phrases.push(this.system.email);

    this.passwordForm = this.builder.group(group);
  }

  setSubmitted() {
    let key;

    this.states.alert.show = false;
    this.states.submitted = true;

    this.$password.setSubmitted();

    this.passwordForm.markAsTouched();
    this.passwordForm.markAsDirty();

    for(key in this.passwordForm.controls) {
      this.passwordForm.controls[key].markAsTouched();
      this.passwordForm.controls[key].markAsDirty();
    }
  }

  alert(type: string, message: string) {
    this.states.alert.message = (message || '');
    this.states.alert.type = (type || 'success');

    this.states.alert.show = (message && message.length) ? true : false;
  }

  reset() {
    let id,
        password;

    this.setSubmitted();

    if(this.passwordForm.valid) {
      if(this.system._id) {
        id = this.system._id;
        password = this.passwordForm.controls['newPassword'].value;

        this.states.loading = true;

        this.api.iam.system.account.reset(id, password, () => {
          this.states.loading = false;
          this.$password.reset();
          this.alert('success', `Password was successfully created/changed.`);
        }, (error) => {
          this.states.loading = false;
          this.alert('error', error.message)
        })
      } else {
        console.error('There was an issue with the system account response data!');
        console.info(this.system);
      }
    }
  }
};
