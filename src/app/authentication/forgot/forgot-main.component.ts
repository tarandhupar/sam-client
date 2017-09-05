import { Component, DoCheck, Input, KeyValueDiffers, OnInit, OnChanges, SimpleChange, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';

import { SamKBAComponent } from '../../app-components';

import { IAMService } from 'api-kit';

import { Validators as $Validators } from '../shared/validators';

import { KBA } from '../kba.interface';

@Component({
  templateUrl: './forgot-main.component.html',
  providers: [
    IAMService
  ]
})
export class ForgotMainComponent {
  @ViewChild('form') form;
  @ViewChild('samPassword') $password;

  public states = {
    submittedCount: 0,
    submitted: false,
    reset: false,
    lockout: false,
    alert: {
      type: 'warning',
      title: 'You have one attempt left',
      message: '',
      show: false
    }
  };

  private token = '';

  private question = '';
  private answer = new FormControl('', Validators.required);
  private password = new FormControl('');

  private lookups = {
    questions: [],
    indexes: {}
  };

  constructor(private router: Router, private route: ActivatedRoute, private api: IAMService) {}

  ngOnInit() {
    this.getToken();

    if(this.router.url.match(/^\/fsdforgot\//)) {
      this.verifyFSD();
    } else {
      this.verifyToken();
    }
  }

  getToken() {
    this.token = this.route.snapshot.queryParams['token'] || '';
  }

  verifyToken() {
    if(this.token.length) {
      this.api.iam.user.password.verify(this.token, (newToken, question) => {
        console.info('Confirmation and token verified!');

        this.question = question;
        this.token = newToken || '';

        if(!this.token.length) {
          // API Issue
          console.error('No token response from API');
        }
      }, (error) => {
        this.expire(error.message);
      });
    } else {
      if(!this.api.iam.isDebug()) {
        this.expire(null);
      }
    }
  }

  expire(message) {
    let params:NavigationExtras = {
      queryParams: {
        type: 'error',
        message: message || 'Your confirmation link has expired. Please start a new session.'
      }
    };

    if(!this.api.iam.isDebug()) {
      this.router.navigate(['/forgot'], params);
    } else {
      console.log(params);
    }
  }

  hideAlert() {
    this.states.alert.show = false;
  }

  next(status, token, question, message) {
    this.token = token || '';

    switch(status) {
      //--> Continue
      case 'continue':
      case 'warning':
        this.question = question;

        switch(status) {
          //--> Continuing
          case 'continue':
            break;
          //--> Warning
          case 'warning':
            this.states.alert.type = 'warn';
            this.states.alert.title = message;
            this.states.alert.show = true;
            break;
        }

        break;

      //--> Reset
      case 'success':
        this.states.reset = true;
        this.hideAlert();
        break;

      //--> Lockout
      case 'lockout':
        this.states.lockout = true;
        break;

      //--> Unauthorized (shrug)
      default:
        this.expire(null);
    }
  }

  verify() {
    let stage = this.states.reset ? 2 : 1;

    switch(stage) {
      case 1:
        if(this.answer.valid) {
          this.states.submitted = true;

          this.api.iam.user.password.kba(this.token, this.answer.value, (status, token, question, message) => {
            this.answer.reset('');
            this.next(status, token, question, message);
            this.states.submitted = false;
          }, (error) => {
            this.expire(error.message);
          });
        }

        break;

      case 2:
        this.reset();
        break;
    }
  }

  verifyFSD() {
    this.api.iam.fsd.reset.verify(this.token, (status, token, message) => {
      this.next(status, token, '', message);
      this.states.submitted = false;
    }, (error) => {
      this.expire(error.message);
    });
  }

  reset() {
    let control = this.password;

    this.states.submittedCount++;
    this.$password.setSubmitted();

    if(control.valid) {
      this.states.submitted = true;

      this.api.iam.user.password.reset(control.value, this.token, () => {
        this.router.navigate(['/forgot'], {
          queryParams: {
            type: 'success',
            title: 'Your password reset was successful.'
          }
        });
      }, (error) => {
        switch(error.httpCode) {
          case 412:
            this.$password.setConsecutiveValidationError();
            break;
          case 406:
            this.$password.setCustomError('password', error.message);
            break;
          default:
            this.expire(error.message);
        }

        this.states.submitted = false;
      });
    };
  }
};
