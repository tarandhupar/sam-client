import * as _ from 'lodash';

import { Component, DoCheck, Input, KeyValueDiffers, NgZone, OnInit, OnChanges, QueryList, SimpleChange, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';

import { KBAComponent } from '../shared/kba';

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
  private states = {
    reset: false,
    lockout: false,
    alert: {
      type: 'error',
      message: '',
      show: false
    }
  };

  private token = '';

  private question = '';
  private answer: FormControl;
  private password: FormControl;

  private lookups = {
    questions: [],
    indexes: {}
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone,
    private api: IAMService) {}

  ngOnInit() {
    this.initForm();
    this.verifyToken();
  }

  initForm() {
    this.answer = new FormControl(['', Validators.required]);
    this.password = new FormControl(['']);
  }

  verifyToken() {
    let vm = this,
        token = this.route.snapshot.queryParams['token'] || '';

    if(token.length) {
      this.token = token;

      this.zone.runOutsideAngular(() => {
        this.api.iam.user.password.verify(this.token, (newToken, question) => {
          vm.zone.run(() => {
            console.info('Confirmation and token verified!');

            this.question = question;
            this.token = newToken || '';

            if(!this.token.length) {
              // API Issue
              console.error('No token response from API');
            }
          });
        }, (error) => {
          vm.zone.run(() => {
            if(!this.api.iam.isDebug()) {
              this.expire(error.message);
            }
          });
        });
      });
    } else {
      this.expire(null);
    }
  }

  expire(message) {
    let params:NavigationExtras = {
      queryParams: {
        type: 'error',
        message: message || 'Your confirmation link has expired. Please start a new session.'
      }
    };

    this.router.navigate(['/forgot'], params);
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
            this.states.alert.show = true;
            this.states.alert.message = message;
            break;
        }

        break;

      //--> Reset
      case 'success':
        this.states.reset = true;
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
    let vm = this,
        stage = this.states.reset ? 2 : 1;

    switch(stage) {
      case 1:
        if(this.answer.valid) {
          // this.states.reset = true
          this.zone.runOutsideAngular(() => {
            this.api.iam.user.password.kba(this.token, this.answer.value, function(status, token, question, message) {
              vm.zone.run(() => {
                this.answer.reset();
                this.next(status, token, question, message);
              });
            }, function(error) {
              vm.zone.run(() => {
                // error.message
              });
            });
          });
        }

        break;

      case 2:
        this.reset();
        break;
    }
  }

  reset() {
    // api.iam.user.password.reset($scope.password.new, $scope.token,
    //   function success() {
    //     message = '?message=Your password reset was successful.';
    //     $window.location.href = api.clp.config.CLP_BASE_URL + message;
    //   },
    //   function error(error) {
    //     $ngBootbox.alert(error.message);
    //   }
    // );
  }
};
