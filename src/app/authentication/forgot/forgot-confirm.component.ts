import { Component, NgZone, OnInit } from '@angular/core';

import { IAMService } from 'api-kit';

import { CookieService } from 'angular2-cookie/core';

@Component({
  templateUrl: './forgot-confirm.component.html',
  providers: [
    IAMService
  ]
})
export class ForgotConfirmComponent {
  private email = '';

  private states = {
    alert: {
      show: false,
      type: 'success',
      title: '',
      description: ''
    },

    error: ''
  };

  constructor(private zone: NgZone, private cookies: CookieService, private api: IAMService) {}

  ngOnInit() {
    this.email = (this.cookies.get('iam-forgot-email') || '')
    this.cookies.remove('iam-forgot-email')
  }

  alert(type, message?) {
    this.states.alert.type = type || '';

    switch(type) {
      case 'success':
        this.states.alert.title = 'Email Resent!';
        this.states.alert.description = 'Please check your inbox. The confirmation link will remain valid for 48 hours.';
        break;

      case 'error':
        this.states.alert.title = 'Error!';
        this.states.alert.description = message || '';
        break;
    }

    this.states.alert.show = true;
  }

  dismissAlert() {
    this.states.alert.show = false;
  }

  resendEmail() {
    let vm = this;

    this.zone.runOutsideAngular(() => {
      this.api.iam.user.password.init(this.email, () => {
        vm.zone.run(() => {
          this.alert('success')
        });
      }, (error) => {
        vm.zone.run(() => {
          this.alert('error', error);
        });
      });
    });
  }
};
