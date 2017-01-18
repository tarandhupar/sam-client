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
      show: true
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
    this.zone.runOutsideAngular(() => {
      this.checkSession(() => {
        this.zone.run(() => {
          this.passwordForm = this.builder.group({
            email: [''],
            currentPassword: ['', Validators.required],
            newPassword: ['', Validators.required],
          });
        });
      });
    });
  }

  checkSession(cb) {
    if(this.api.iam.isDebug()) {
      cb();
    } else {
      this.api.iam.checkSession((user) => {
        this.user = user;
        cb();
      }, () => {
        this.router.navigate(['/signin']);
      });
    }
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
    let vm = this,
        params = this.passwordForm.value;

    this.setSubmitted();

    if(this.passwordForm.valid) {
      this.zone.runOutsideAngular(() => {
        this.api.iam.user.password.change(params.email, params.currentPassword, params.newPassword, () => {
          vm.zone.run(() => {
            this.states.alert.type = 'success';
            this.states.alert.title = 'Password Successfully Reset';
            this.states.alert.show = true;
          });
        }, (error) => {
          vm.zone.run(() => {
            this.states.alert.type = 'error';
            this.states.alert.title = 'Password Reset Failed';
            this.states.alert.message = error.message;
            this.states.alert.show = true;
          });
        });
      });
    }
  }
};
