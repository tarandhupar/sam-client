import { Component, NgZone, OnInit } from '@angular/core';

import { IAMService } from 'api-kit';

import { CookieService } from 'angular2-cookie/core';

@Component({
  templateUrl: './register-confirm.component.html',
  providers: [
    IAMService
  ]
})
export class RegisterConfirmComponent {
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
    this.email = (this.cookies.get('iam-signup-email') || '')
    this.cookies.remove('iam-signup-email')
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

  dispatch(cb:() => void) {
    let vm = this;

    this.api.iam.user.registration.init(this.email, () => {
      vm.alert('success')
      cb();
    }, (error) => {
      vm.alert('error', error);
      cb();
    });
  }

  resendEmail() {
    this.zone.runOutsideAngular(() => {
      this.dispatch(() => {
        this.zone.run(() => {
          // cb()
        });
      });
    });
  }
};
