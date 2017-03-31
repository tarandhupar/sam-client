import { Component, DoCheck, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SamPasswordComponent } from '../../shared';

import { IAMService } from 'api-kit';
import { Validators as $Validators } from '../../shared/validators';

import { System } from '../../system.interface';

@Component({
  templateUrl: './system-password.component.html',
  providers: [
    IAMService
  ]
})
export class SystemPasswordComponent {
  @ViewChild('formControl') formControl;
  @ViewChild('password') $password: SamPasswordComponent;

  private store = {
    title: 'Reset Password'
  };

  private states = {
    initial: true,
    submitted: false,
    loading: false,
    alert: {
      type: 'success',
      message: '',
      show: false
    }
  }

  private system: System;
  public passwordForm: FormGroup;

  constructor(private router: Router, private builder: FormBuilder, private api: IAMService) {}

  ngOnInit() {
    // Verify Session
    this.api.iam.checkSession((user) => {
      // Verify System Account
      this.api.iam.system.account.get(account => {
console.log(account)
        this.states.initial = (account.userPassword == undefined);
        this.system = account;
        this.initForm();
      }, (error) => {
        if(!this.api.iam.isDebug()) {
          this.router.navigate(['profile']);
        }
      });
    }, (error) => {
      if(!this.api.iam.isDebug()) {
        this.router.navigateByUrl('/signin');
      }
    });
  }

  initForm() {
    let group = {
      newPassword: ['', Validators.required],
    };

    if(this.states.initial) {
      group.newPassword = ['', Validators.required];
    }

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
    this.states.alert.show = true;
  }

  reset() {
    let params = this.passwordForm.value;

    this.setSubmitted();

    if(this.passwordForm.valid) {
      this.states.loading = true;

      this.system['userPassword'] = this.passwordForm.controls['newPassword'].value;

      this.api.iam.system.account.update(this.system, () => {
        this.states.loading = false;
        this.$password.reset();
        this.alert('success', `Password Successfully ${(this.states.initial ? 'Created' : 'Changed')}`);
      }, (error) => {
        this.states.loading = false;
        this.alert('error', error.message)
      });
    }
  }
};
