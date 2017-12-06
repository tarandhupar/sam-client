import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';

import { IAMService } from 'api-kit';
import { Validators as $Validators } from 'app-utils/validators';

import { merge } from 'lodash';
import { Cookie } from 'ng2-cookies';

@Component({
  templateUrl: './forgot-initial.component.html',
  providers: [
    IAMService
  ]
})
export class ForgotInitialComponent {
  @ViewChild('form') form;

  public states = {
    submitted: false,
    loading: false,
    error: '',
    notification: {
      type: 'error',
      title: '',
      show: true
    }
  };

  private errors = {
    'required': 'Please enter your email',
    'email': 'Enter a valid email address'
  };

  public email: FormControl;

  constructor(private router: Router, private route: ActivatedRoute, private api: IAMService) {}

  ngOnInit() {
    this.resetNotifications();
    this.dispatchNotiications();

    this.email = new FormControl('', [Validators.required, $Validators.email])
  }

  dispatchNotiications() {
    this.states.notification = merge(this.states.notification, {
      title: this.route.snapshot.queryParams['message'] || this.states.notification.title || ''
    }, this.route.snapshot.queryParams);

    if(this.states.notification.title.length) {
      this.states.notification.show = true;
    }
  }

  resetNotifications() {
    let prop;

    for(prop in this.states.notification) {
      switch(typeof this.states.notification[prop]) {
        case 'boolean':
          this.states.notification[prop] = false;
          break;
        case 'string':
          this.states.notification[prop] = '';
          break;
      }
    }
  }

  validate() {
    let control = this.email,
        messages = this.errors,
        result = '',
        error;

    for(error in control.errors) {
      if(messages[error] !== undefined) {
        result = messages[error];
        break;
      }
    }

    this.states.error = result;
  }

  init() {
    let control = this.email;

    control.markAsTouched();
    this.validate();

    if(control.valid) {
      this.states.loading = true;

      this.api.iam.user.password.init(control.value, () => {
        this.states.loading = false;
        Cookie.set('iam-forgot-email', control.value);
        this.router.navigate(['/forgot/confirm']);
      }, (error) => {
        this.states.loading = false;
        this.states.error = error.message;
      });
    }
  }
};
