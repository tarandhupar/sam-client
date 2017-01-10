import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';

import { IAMService } from 'api-kit';
import { Validators as $Validators } from '../shared/validators';

import { CookieService } from 'angular2-cookie/core';

@Component({
  templateUrl: './register-initial.component.html',
  providers: [
    IAMService
  ]
})
export class RegisterInitialComponent {
  private states = {
    submitted: false,
    loading: false,
    error: ''
  };

  email: FormControl;

  constructor(
    private router: Router,
    private zone: NgZone,
    private cookies: CookieService,
    private api: IAMService) {}

  ngOnInit() {
    this.email = new FormControl('', [Validators.required, $Validators.email])
  }

  dispatch(cb:() => void) {
    let vm = this,
        email = this.email.value;

    this.api.iam.user.registration.init(email, () => {
      vm.cookies.put('iam-signup-email', email);
      vm.router.navigate(['/signup/confirm']);
      cb();
    }, (error) => {
      vm.states.error = error;
      cb();
    });
  }

  init() {
    this.states.submitted = true;
    if(this.email.valid) {
      this.zone.runOutsideAngular(() => {
        this.dispatch(() => {
          this.zone.run(() => {
            // cb()
          });
        });
      });
    }
  }
};
