import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';

import { IAMService } from 'api-kit';
import { Validators as $Validators } from '../shared/validators';

import { Cookie } from 'ng2-cookies';

@Component({
  templateUrl: './register-initial.component.html',
  providers: [
    IAMService
  ]
})
export class RegisterInitialComponent {
  public states = {
    submitted: false,
    loading: false,
    error: ''
  };

  email: FormControl;

  constructor(private router: Router, private api: IAMService) {}

  ngOnInit() {
    this.email = new FormControl('', [Validators.required, $Validators.email])
  }

  init() {
    let email;

    this.states.submitted = true;

    if(this.email.valid) {
      email = this.email.value;

      this.api.iam.user.registration.init(email, () => {
        Cookie.set('iam-signup-email', email);
        this.router.navigate(['/signup/confirm']);
      }, (error) => {
        this.states.error = error;
      });
    }
  }
};
