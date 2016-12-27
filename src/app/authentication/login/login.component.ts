import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { IAMService } from 'api-kit';
import { Validators as $Validators } from '../shared/validators';

@Component({
  templateUrl: './login.component.html',
  providers: [IAMService]
})
export class LoginComponent {
  public form: FormGroup;

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

  constructor(
    private router: Router,
    private builder: FormBuilder,
    private zone: NgZone,
    private api: IAMService) {}

  ngOnInit() {
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

  login(cb: () => void) {
    let vm = this,
        form = this.form.controls[this.isStage(1) ? 'stage1' : 'stage2'],
        credentials;

    if(form.valid) {
      this.api.iam.loginOTP(form.value, function() {
        vm.states.submitted = false;

        switch(vm.states.stage) {
          case 1:
            vm.states.stage = 2;
            break;

          case 2:
            vm.router
              .navigate(['/'])
              .then(function() {
                window.location.reload();
              });

            break;
        }

        cb();
      }, function(error) {
        vm.errors.global.push(error);
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

    this.zone.runOutsideAngular(() => {
      this.login(() => {
        this.zone.run(() => {
          this.states.loading = false;
        });
      });
    });
  }
};
