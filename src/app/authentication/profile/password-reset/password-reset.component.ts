import * as _ from 'lodash';

import { Component, DoCheck, Input, NgZone, OnInit, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { IAMService } from 'api-kit';
import { Validators as $Validators } from '../../shared/validators';

import { User } from '../user.interface';

@Component({
  templateUrl: './password-reset.component.html',
  providers: [
    IAMService
  ]
})
export class PasswordResetComponent {
  private config = {
    alert: {
      sites: 'javascript:void(0)',
      migrate: 'javascript:void(0)'
    }
  };

  public passwordForm: FormGroup;

  constructor(
    private router: Router,
    private builder: FormBuilder,
    private zone: NgZone,
    private api: IAMService) {}

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      this.checkSession(() => {
        this.zone.run(() => {
          this.passwordForm = this.builder.group({
            userPassword: ['', Validators.required],
          })
        });
      });
    });
  }

  checkSession(cb) {
    if(this.api.iam.isDebug()) {
      cb();
    } else {
      this.api.iam.checkSession(() => {
        cb();
      }, () => {
        this.router.navigate(['/signin']);
      });
    }
  }

  reset() {
    this.zone.runOutsideAngular(() => {
      //TODO
    });
  }
};
