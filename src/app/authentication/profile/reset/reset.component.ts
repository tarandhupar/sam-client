import * as _ from 'lodash';

import { Component, DoCheck, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { IAMService } from 'api-kit';
import { Validators as $Validators } from '../../shared/validators';

import { User } from '../../user.interface';

@Component({
  templateUrl: './reset.component.html',
  providers: [
    IAMService
  ]
})
export class ResetComponent {
  @ViewChild('formControl') formControl;

  private store = {
    title: 'Reset Password'
  };

  private states = {
    alert: {
      type: 'success',
      title: '',
      message: '',
      show: false
    }
  }

  private user: User;
  public passwordForm: FormGroup;

  constructor(
    private router: Router,
    private builder: FormBuilder,
    private zone: NgZone,
    private api: IAMService) {}

  ngOnInit() {
    this.states.alert.show = false;

    this.zone.runOutsideAngular(() => {
      this.api.iam.checkSession((user) => {
        this.zone.run(() => {
          this.user = user;
          this.initForm();
        });
      }, (response) => {
        this.zone.run(() => {
          if(!this.api.iam.isDebug()) {
            this.router.navigate(['/signin']);
          } else {
            this.user = <User>{
              _id: 'john.doe@gsa.gov',
              fullName: 'John J Doe',
              firstName: 'John',
              initials: 'J',
              lastName: 'Doe',
              email: 'doe.john@gsa.gov',
              kbaAnswerList: [],
              accountClaimed: true
            };

            this.initForm();
          }
        });
      });
    });
  }

  initForm() {
    let isDebug = (this.api.iam.isDebug() && this.user == undefined);

    this.passwordForm = this.builder.group({
      email: [!isDebug ? this.user.email : ''],
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
    });
  }

  setSubmitted() {
    let key;

    this.states.alert.show = false;

    this.passwordForm.markAsTouched();
    this.passwordForm.markAsDirty();

    for(key in this.passwordForm.controls) {
      this.passwordForm.controls[key].markAsTouched();
      this.passwordForm.controls[key].markAsDirty();
    }
  }

  reset() {
    let params = this.passwordForm.value;

    this.states.alert.show = false;
    this.setSubmitted();

    if(this.passwordForm.valid) {
      this.zone.runOutsideAngular(() => {
        this.api.iam.user.password.change(params.email, params.currentPassword, params.newPassword, () => {
          this.zone.run(() => {
            this.states.alert.type = 'success';
            this.states.alert.title = 'Password Successfully Reset';
            this.states.alert.show = true;
          });
        }, (response) => {
          this.zone.run(() => {
            this.states.alert.type = 'error';
            this.states.alert.title = response.message;
            this.states.alert.show = true;
          });
        });
      });
    }
  }
};
