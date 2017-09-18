import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { merge } from 'lodash';

import { IAMService } from 'api-kit';
import { Validators as $Validators } from 'authentication/shared/validators';

@Component({
  selector: 'sam-login',
  templateUrl: './login.component.html',
  providers: [IAMService]
})
export class SamLoginComponent {
  @Input() standalone: boolean = false;

  public form: FormGroup;

  private store = {
    redirect: {
      override: false,
      route: '/',
      params: {
        queryParams: {}
      }
    }
  };

  states = {
    stage: 1,
    submitted: false,
    loading: false,
    password: {
      type: 'password'
    }
  };

  validation = {
    fields: [
      'global',
      'username',
      'password'
    ],

    messages: {
      'username': {
        'required': 'Please enter your email',
        'email': 'Enter a valid email address'
      },

      'password': {
        'required': 'Please enter your password'
      }
    }
  };

  errors = {
    global: [],
    username: [],
    password: []
  };

  constructor(private route: ActivatedRoute, private router: Router, private builder: FormBuilder, private api: IAMService) {
    if(!this.api.iam.user.isSignedIn()) {
    	this.router.navigate([this.store.redirect.route], this.store.redirect.params);
    }
  }

  ngOnInit() {
    let params = this.route.snapshot.queryParams,
        key;

    this.store.redirect.params.queryParams = merge({}, this.store.redirect.params.queryParams, params);

    if(params['redirect'] !== undefined && params['redirect'].length) {
      this.store.redirect.override = true;
      this.store.redirect.route = params['redirect'];

      delete this.store.redirect.params.queryParams['redirect'];
    }

    this.form = this.builder.group({
      'stage1': this.builder.group({
        username: ['', [Validators.required, $Validators.email]],
        password: ['', [Validators.required]]
      }),

      'stage2': this.builder.group({
        otp: ['', [Validators.required]]
      })
    });

    this.form.valueChanges.subscribe(data => this.validate());
  }

  getRoute(): string {
    return this.router.url.replace(/\?.+/g, '');
  }

  isStage(stage: number) {
    return (this.states.stage == stage);
  }

  isErrors() {
    let field;

    if(this.errors.global.length) {
      return true;
    }

    return false;
  }

  resetErrors() {
    let field;

    for(field in this.errors) {
      this.errors[field] = [];
    }
  }

  togglePassword() {
    this.states.password.type = (this.states.password.type == 'password') ? 'text' : 'password';
  }

  switchStage(stage) {
    this.states.stage = stage;

    switch(this.states.stage) {
      case 1:
        this.form.controls['stage2'].reset();
        break;
    }

    this.resetErrors();
  }

  validate() {
    let field,
      message,
      control,
      key;

    if(!this.form.controls['stage1']) {
      return;
    }

    for(field in this.errors) {
      this.errors[field] = [];
      control = this.form.controls['stage1']['controls'][field];

      if(control !== undefined) {
        if(this.states.submitted || (control && control.dirty && control.invalid)) {
          for(key in control.errors) {
            this.errors[field].push(this.validation.messages[field][key]);
          }
        }
      }
    }
  }

  login(cb:() => void) {
    let form = this.form.controls[this.isStage(1) ? 'stage1' : 'stage2'],
        credentials;

    if(form.valid) {
      if(this.states.stage == 1) {
        this.api.iam.resetLogin();
      }

      this.api.iam.loginOTP(form.value, (user) => {
        this.states.submitted = false;

        switch(this.states.stage) {
          case 1:
            this.states.stage = 2;
            break;

          case 2:
            if(this.standalone && !this.store.redirect.override) {
                switch(this.router.url) {
                case '/':
                  this.store.redirect.route = '/workspace';
                  break;

                default:
                  this.store.redirect.route = this.getRoute();
                  this.store.redirect.params.queryParams['refresh'] = true;
              }
            }

            this.router.navigate([this.store.redirect.route], this.store.redirect.params);

            break;
        }

        cb();
      }, (error) => {
        this.errors.global.push(error.message);
        cb();
      });
    } else {
      this.states.loading = false;
    }
  }

  submit($event) {
    this.states.submitted = true;
    this.states.loading = true;

    this.validate();

    this.login(() => {
      this.states.loading = false;
    });
  }
};
