import { Component, EventEmitter, Input, Output, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { Validators as $Validators } from '../validators';

@Component({
	selector: 'sam-password',
  templateUrl: 'password.component.html'
})
export class PasswordComponent {
  @Input() password:FormControl;

  private passwordConfirm = new FormControl(['']);

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
    toggle: false,
    error: '',
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
    this.password.setValidators([
      Validators.minLength(this.config.rules.minlength),
      $Validators.uppercase,
      $Validators.numeric,
      $Validators.special,
      $Validators.match('passwordConfirm')
    ]);

    this.passwordConfirm.setValidators([
      Validators.required
    ]);

    this.password.updateValueAndValidity();

    this.password.valueChanges.subscribe(data => this.updateState());
    this.passwordConfirm.valueChanges.subscribe(data => {
      this.updateState()
      this.password.updateValueAndValidity();
    });
  }

  updateState() {
    let valid = true,
        errors = this.password.errors,
        validator,
        verifyMatch = (
          this.passwordConfirm.dirty &&
          errors !== null &&
          errors['match'] !== undefined
        );

    for(validator in this.states.validations) {
      this.states.validations[validator] = (
        errors === null ||
        errors[validator] === undefined
      );
    }

    if(verifyMatch) {
      if(errors['required'])
        this.states.error = "Don't forget to confirm your password";
      if(errors['match'])
        this.states.error = this.config.messages['match'];
    } else {
      this.states.error = '';
    }
  }
};
