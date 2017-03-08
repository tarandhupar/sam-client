import { Component, EventEmitter, Input, Output, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { Validators as $Validators } from '../validators';

@Component({
	selector: 'sam-password',
  templateUrl: 'password.component.html'
})
export class SamPasswordComponent {
  @Input() currentPassword: FormControl;
  @Input() password:FormControl;

  @Input() phrases:string[] = [];

  private confirmPassword = new FormControl(['']);

  protected config = {
    rules: {
      minlength: 12,
      uppercase: 1,
      numeric: 1,
      special: 1
    },

    messages: {},

    icons: {
      valid: 'fa-check',
      invalid: 'fa-times'
    }
  };

  protected states = {
    uid: Math.floor(Math.random() * 89999 + 10000),
    toggle: false,
    error: {
      password: '',
      confirmPassword: ''
    },

    submitted: false,
    validations: {
      minlength: false,
      uppercase: false,
      numeric: false,
      special: false
    }
  };

  constructor() {
    this.config.messages = {
      minlength: `Be at least <strong>${this.config.rules.minlength}</strong> characters`,
      uppercase: `Have at least <strong>${this.config.rules.uppercase}</strong> uppercase character`,
      numeric: `Have at least <strong>${this.config.rules.numeric}</strong> numeric digit`,
      special: `Have at least <strong>${this.config.rules.special}</strong> special character`,
      match: "The two passwords don't match"
    };
  }

  ngOnInit() {
    this.password.setValidators([,
      $Validators.minlength(this.config.rules.minlength),
      $Validators.uppercase,
      $Validators.numeric,
      $Validators.special,
      $Validators.consecutive(this.phrases),
      $Validators.match('confirmPassword'),
      Validators.required
    ]);

    if(this.currentPassword !== undefined) {
      this.currentPassword.setValidators([
        Validators.required
      ]);
    }

    this.confirmPassword.setValidators([
      Validators.required
    ]);

    this.confirmPassword.setValue('');

    this.password.updateValueAndValidity();

    this.password.valueChanges.subscribe(data => this.updateState());
    this.confirmPassword.valueChanges.subscribe(data => {
      this.updateState()
      this.password.updateValueAndValidity();
    });
  }

  ngAfterViewInit() {
    let $body = document.body,
        $inputs = $body.querySelectorAll('input[readonly]'),
        $input,
        intInput;

    for(intInput = 0; intInput < $inputs.length; intInput++) {
      $input = $inputs[intInput];
      $input.removeAttribute('readonly');
    }
  }

  setSubmitted() {
    this.states.submitted = true;
    this.updateState();
  }

  $formState(validation) {
    let classes = this.getFormControlStates('password');

    if(validation !== undefined) {
      classes[this.config.icons.valid] = validation;
      classes[this.config.icons.invalid] = !validation;
    }

    return classes;
  }

  $currentPasswordErrors() {
    let errors = [],
        type;

    if(this.states.submitted || this.confirmPassword.touched) {
      for(type in this.currentPassword.errors) {
        switch(type) {
          case 'required':
            errors.push('Your current password must be entered');
            break;
          default:
            if(typeof this.currentPassword.errors[type] == 'string') {
              errors.push(this.currentPassword.errors[type]);
            }
        }
      }
    }

    return errors.length ? errors : '';
  }

  setCustomError(controlName, error) {
    if(this[controlName] !== undefined) {
      this[controlName].setErrors(error);
    }
  }

  getFormControlStates(controlName) {
    let control = this[controlName] || false,
        classes = {},
        states = ('ng-touched|ng-untouched|ng-dirty|ng-pristine|ng-valid|ng-invalid').split('|'),
        state,
        intState,
        prop;

    if(control) {
      for(intState = 0; intState < states.length; intState++) {
        state = states[intState];
        prop = control[state.replace(/ng-/, '')];
        classes[state] = prop;
      }
    }

    classes['ng-submitted'] = this.states.submitted;

    return classes;
  }

  updateState() {
    let valid = true,
        errors = this.password.errors,
        validator,
        verifyMatch = (
          (this.states.submitted && this.confirmPassword.dirty) &&
          (
            !(this.password.errors && (this.password.errors['required'] || false)) &&
            !(this.confirmPassword.errors && (this.confirmPassword.errors['required'] || false))
          ) &&
          errors !== null &&
          errors['match'] !== undefined
        );

    this.states.error.password = '';
    this.states.error.confirmPassword = '';

    for(validator in this.states.validations) {
      validator = validator.toLowerCase();
      this.states.validations[validator] = (
        errors === null ||
        errors[validator] === undefined
      );
    }

    if(this.password.errors && (this.password.errors['required'] || false))
      this.states.error.password = ' ';
    if(this.confirmPassword.errors && (this.confirmPassword.errors['required'] || false))
      this.states.error.confirmPassword = ' ';

    if(verifyMatch) {
      if(errors['required'])
        this.states.error.confirmPassword = "Don't forget to confirm your password";
      if(errors['match'])
        this.states.error.confirmPassword = this.config.messages['match'];
    }
  }
};
