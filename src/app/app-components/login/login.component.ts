import { Component, Input, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { get, merge } from 'lodash';

import { IAMService } from 'api-kit';
import { Validators as $Validators } from 'app-utils/validators';

@Component({
  selector: 'sam-login',
  templateUrl: './login.component.html',
  providers: [IAMService]
})
export class SamLoginComponent {
  @ViewChildren('input') input;
  @Input() standalone: boolean = false;

  public form: FormGroup;

  private store = {
    redirect: {
      override: false,
      route: '/',
      params: {
        queryParams: {}
      }
    },
  };

  public states = {
    submitted: false,
    loading: false,
    password: {
      type: 'password'
    }
  };

  private options = {
    radio: [
      { label: 'Email', name: 'delivery-email', value: 'email' },
      { label: 'Text',  name: 'delivery-name', value: 'sms' },
    ],

    checkbox: [
      { label: 'Use this as my default choice', name: 'delivery-default', value: true },
    ]
  }

  public validation = {
    messages: {
      'username': {
        required: 'Please enter your email',
        email: 'Enter a valid email address',
      },

      'password': {
        required: 'Please enter your password',
      },

      'otppreference': {
        required: 'Please select an OTP delivery method',
      },

      'otp': {
        required: 'Enter your one-time access code',
      }
    }
  };

  public stage = '1';
  public errors = [];

  constructor(private route: ActivatedRoute, private router: Router, private builder: FormBuilder, private api: IAMService) {}

  ngOnInit() {
    let params = this.route.snapshot.queryParams,
        key;

    this.store.redirect.params.queryParams = merge({}, this.store.redirect.params.queryParams, params);

    if(params['redirect'] !== undefined && params['redirect'].length) {
      this.store.redirect.override = true;
      this.store.redirect.route = params['redirect'];

      delete this.store.redirect.params.queryParams['redirect'];
    } else if(this.router.url.match(/\/(signin)?/) && !this.router.url.match(/\/workspace/)) {
      this.store.redirect.route = '/workspace';
    } else {
      // Component reload workaround
      this.store.redirect.route = '/signin';
      this.store.redirect.params.queryParams['redirect'] = this.router.url;
    }

    if(this.api.iam.user.isSignedIn() && ENV !== 'test' && !this.api.iam.getParam('debug')) {
    	this.router.navigate([this.store.redirect.route], this.store.redirect.params);
    }

    this.form = this.builder.group({
      '1': this.builder.group({
        username: ['', [Validators.required, $Validators.email]],
        password: ['', [Validators.required]]
      }),

      '2': this.builder.group({
        otppreference: ['', Validators.required],
      }),

      '3': this.builder.group({
        otp: ['', [Validators.required]]
      })
    });
  }

  ngAfterViewInit() {
    this.input.first.nativeElement.focus();
  }

  get preference(): string {
    return (this.form.get('2').get('otppreference').value == 'sms') ? 'text' : 'email';
  }

  getRoute(): string {
    return this.router.url.replace(/\?.+/g, '');
  }

  isStage(stage: string|number) {
    return (this.stage == stage);
  }

  hasError(controlName: string = null) {
    let control = controlName ? this.form.get(this.stage).get(controlName) : null,
        isError = control ? control.errors : this.errors.length;

    return isError && this.states.submitted;
  }

  getError(controlName: string = null): string {
    let control = controlName ? this.form.get(this.stage).get(controlName) : null,
        errors = control ? [] : this.errors,
        key,
        error;

    if(control && control.errors && this.states.submitted) {
      for(key in control.errors) {
        error = get(this.validation.messages, [controlName, key]);

        if(error) {
          errors.push(error);
          break;
        }
      }
    }

    return errors[0] || '';
  }

  togglePassword() {
    this.states.password.type = (this.states.password.type == 'password') ? 'text' : 'password';
  }

  reset() {
    this.resetState();

    this.form.get('2').reset();
    this.form.get('3').reset();

    this.errors = [];

    this.api.iam.resetLogin();
    this.updateStage();
  }

  updateStage() {
    this.stage = this.api.iam.stage.toString();
  }

  resetState() {
    this.states.loading = false;
    this.states.submitted = false;
  }

  login() {
    let form = this.form.get(this.stage),
        payload = {};

    this.states.submitted = true;
    this.errors = [];


    if(form.valid) {
      this.states.loading = true;

      this.api.iam.login(form.value, data => {
        this.updateStage();
        this.resetState();

        switch(this.stage) {
          case '2':
            this.options.radio[1].label = `Text (XXX) XXX - ${data.otpphonenumber || ''}`;
            form = this.form.get(this.stage);
            form.get('otppreference').setValue(data.otppreference || '');
            form.get('otppreference').updateValueAndValidity();

            break;
        }

        if(data.tokenId) {
          this.router.navigate([this.store.redirect.route], this.store.redirect.params);
        }
      }, error => {
        this.reset();
        this.updateStage();

        this.errors.push(error.message);
        this.states.loading = false;
        this.states.submitted = true;
      });
    }
  }
};
