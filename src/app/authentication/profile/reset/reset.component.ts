import * as _ from 'lodash';

import { Component, DoCheck, Input, NgZone, OnInit, OnChanges, ViewChild } from '@angular/core';
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
  private config = {
    alert: {
      sites: 'javascript:void(0)',
      migrate: 'javascript:void(0)'
    }
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

  @ViewChild('passwordEntry') passwordEntry;

  constructor(
    private router: Router,
    private builder: FormBuilder,
    private zone: NgZone,
    private api: IAMService) {}

  ngOnInit() {
    this.states.alert.show = true;

    this.zone.runOutsideAngular(() => {
      this.api.iam.checkSession((user) => {
        this.zone.run(() => {
          this.user = user;
          this.passwordForm = this.builder.group({
            email: [this.user.email],
            currentPassword: ['', Validators.required],
            newPassword: ['', Validators.required],
          });
        });
      }, (response) => {
        this.zone.run(() => {
          if(!this.api.iam.isDebug()) {
            this.router.navigate(['/signin']);
          }
        });
      });
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
        }, (error) => {
          this.zone.run(() => {
            this.states.alert.type = 'error';
            this.states.alert.title = error.message;
            this.states.alert.show = true;
          });
        });
      });
    }
  }
};
