import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'sam-password',
  templateUrl: 'password.component.html'
})
export class PasswordComponent {
  @Input() password = '';
  @Input() passwordConfirm = '';

  @Output() onValid = new EventEmitter();
  @Output() onInvalid = new EventEmitter();

  protected config = {
    rules: {
      min: 12,
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
    valid: false,
    toggle: false,
    validations: {
      min: false,
      uppercase: false,
      numeric: false,
      special: false
    }
  };

  constructor(private KeysPipe: KeysPipe) {
    this.config.messages = {
      min: `Be at least <strong>${this.config.rules.min}</strong> characters`,
      uppercase: `Have at least <strong>${this.config.rules.uppercase}</strong> uppercase character`,
      numeric: `Have at least <strong>${this.config.rules.numeric}</strong> numeric digit`,
      special: `Have at least <strong>${this.config.rules.special}</strong> special character`
    };
  }

  validate($event) {
    let valid = this.states.valid;

    this.states.validations.min = (this.password.length >= this.config.rules.min);
    this.states.validations.uppercase = /[A-Z]/.test(this.password);
    this.states.validations.numeric = /[0-9]/.test(this.password);
    this.states.validations.special = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(this.password);

    this.states.valid = (
      this.states.validations.min &&
      this.states.validations.uppercase &&
      this.states.validations.numeric &&
      this.states.validations.special
    );

    // For efficient event-emitting only on valid/invalid state change
    if(valid !== this.states.valid) {
      this[this.states.valid ? 'onValid' : 'onInvalid'].emit();
    }
  }
};
