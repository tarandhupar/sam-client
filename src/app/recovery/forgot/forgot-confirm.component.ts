import { Component, OnInit, ViewChild } from '@angular/core';

import { IAMService } from 'api-kit';
import { Cookie } from 'ng2-cookies';

@Component({
  templateUrl: './forgot-confirm.component.html',
  providers: [
    IAMService
  ]
})
export class ForgotConfirmComponent {
  @ViewChild('target') target;

  private email = '';
  private states = {
    alert: {
      show: false,
      type: 'success',
      title: '',
      message: ''
    }
  };

  constructor(private api: IAMService) {}

  ngOnInit() {
    this.email = (Cookie.get('iam-forgot-email') || '');
    Cookie.delete('iam-forgot-email');

    if(this.api.iam.isDebug()) {
      this.email = 'john.doe@gsa.gov';
    }
  }

  alert(type, message?) {
    this.states.alert.type = type || '';

    switch(type) {
      case 'success':
        this.states.alert.title = 'Email Resent!';
        this.states.alert.message = 'Please check your inbox. The confirmation link will remain valid for 48 hours.';
        break;

      case 'error':
        this.states.alert.title = 'Error!';
        this.states.alert.message = message || '';
        break;
    }

    this.states.alert.show = true;
  }

  dismissAlert() {
    this.states.alert.show = false;
  }

  resendEmail() {
    this.api.iam.user.password.init(this.email, () => {
      this.alert('success')
    }, (error) => {
      if(this.api.iam.isDebug()) {
        this.alert('success');
      } else {
        this.alert('error', error);
      }
    });
  }
};
