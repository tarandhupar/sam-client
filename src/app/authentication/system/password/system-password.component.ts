import { Component, DoCheck, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SamPasswordComponent } from '../../shared';

import { IAMService } from 'api-kit';
import { Validators as $Validators } from '../../shared/validators';

import { System } from '../../system.interface';

@Component({
  templateUrl: './system-password.component.html',
  providers: [
    IAMService
  ]
})
export class SystemPasswordComponent {
  @ViewChild('formControl') formControl;
  @ViewChild('password') $password;

  private store = {
    title: 'Reset Password'
  };

  private states = {
    initial: true,
    submitted: false,
    loading: false,
    alert: {
      type: 'success',
      message: '',
      show: false
    }
  }

  private system: System;
  public passwordForm: FormGroup;

  constructor(private router: Router, private route: ActivatedRoute, private builder: FormBuilder, private api: IAMService) {}

  ngOnInit() {
    this.store['observer'] = this.route.params.subscribe(params => {
       this.system._id = params['id'];
    });

    // Verify Session
    this.api.iam.checkSession((user) => {
      if(user.systemAccount) {
        // Get System Account details
        this.getSystemAccount(account => {
          // Redirect the user to System Account Profile if no System Account is associated with user
          if(!account) {
            this.router.navigate(['profile']);
          } else {
            this.system = account;
            this.initForm();
          }
        }, (error) => {
          if(!this.api.iam.isDebug()) {
            this.router.navigate(['profile']);
          }
        });
      } else {
        // Redirect to User Account Profile if not enough permission
        this.router.navigateByUrl('/profile')
      }
    }, (error) => {
      if(!this.api.iam.isDebug()) {
        this.router.navigateByUrl('/signin');
      }
    });
  }

  ngOnDestroy() {
    this.store['observer'].unsubscribe();
  }

  getSystemAccount($success, $error) {
    if(this.system._id) {
      this.api.iam.system.account.get(this.system._id, $success, $error);
    } else {
      this.api.iam.system.account.get((accounts) => {
        if(accounts.length) {
          $success(accounts[0]);
        } else {
          $error();
        }
      }, $error);
    }
  }

  initForm() {
    let group = {
      newPassword: ['', Validators.required],
    };

    this.passwordForm = this.builder.group(group);
  }

  setSubmitted() {
    let key;

    this.states.alert.show = false;
    this.states.submitted = true;

    this.$password.setSubmitted();

    this.passwordForm.markAsTouched();
    this.passwordForm.markAsDirty();

    for(key in this.passwordForm.controls) {
      this.passwordForm.controls[key].markAsTouched();
      this.passwordForm.controls[key].markAsDirty();
    }
  }

  alert(type: string, message: string) {
    this.states.alert.message = (message || '');
    this.states.alert.type = (type || 'success');
    this.states.alert.show = true;
  }

  reset() {
    let id,
        password;

    this.setSubmitted();

    if(this.passwordForm.valid) {
      if(this.system._id) {
        id = this.system._id;
        password = this.passwordForm.controls['newPassword'].value;

        this.states.loading = true;

        this.api.iam.system.account.reset(id, password, () => {
          this.states.loading = false;
          this.$password.reset();
          this.alert('success', `Password was successfully created/changed.`);
        }, (error) => {
          this.states.loading = false;
          this.alert('error', error.message)
        })
      } else {
        console.error('There was an issue with the system account response data!');
        console.info(this.system);
      }
    }
  }
};
