import * as moment from 'moment';

import { Component, DoCheck, Input, KeyValueDiffers, NgZone, OnInit, OnChanges, QueryList, SimpleChange, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { IAMService } from 'api-kit';
import { Validators as $Validators } from '../../shared/validators';

import { User } from '../user.interface';
import * as data from './legacy-systems.json';

@Component({
  templateUrl: './migrations.component.html',
  providers: [
    IAMService
  ]
})
export class MigrationsComponent {
  @ViewChild('form') form;
  @ViewChild('title') title;

  private differ;
  private store = {
    title: 'Role Migrations',
    legacy: [],
    migrations: [],
    systems: [],
    roles: {},
    system: ''
  };

  private states = {
    submitted: false,
    confirm: {
      type: 'success',
      message: 'Account Successfully Migrated',
      show: false
    }
  }

  private email = '';

  public migrationForm: FormGroup;

  constructor(
    private router: Router,
    private builder: FormBuilder,
    private differs: KeyValueDiffers,
    private zone: NgZone,
    private api: IAMService) {
    this.differ = differs.find({}).create(null);
    this.store.legacy = data;
  }

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      this.api.iam.checkSession((user) => {
        this.zone.run(() => {
          let role,
              intRole;

          this.email = user.email;

          for(intRole = 0; intRole < user.gsaRAC.length; intRole++) {
            role = user.gsaRAC[intRole];

            if(this.store.roles[role.system] == undefined)
              this.store.roles[role.system] = {};
            if(this.store.roles[role.system][role.username] == undefined)
              this.store.roles[role.system][role.username] = [];

            this.store.roles[role.system][role.username].push(role);
          }

          this.initForm();
        });
      }, () => {
        this.zone.run(() => {
          if(this.api.iam.isDebug()) {
            this.initForm();
            this.alert('Account Successfully Migrated', 'success');
          } else {
            this.router.navigate(['/signin']);
          }
        });
      });
    });
  }

  ngAfterViewInit() {
    let fragment = window.location.hash;
    if(fragment) {
      this.anchorTo('');
      this.anchorTo(fragment);
    }
  }

  ngDoCheck() {
    let changes = this.differ.diff(this.store);
    if(changes) {
      changes.forEachChangedItem((diff) => {
        if(diff.key == 'system') {
          this.migrationForm.controls[diff.key].setValue(diff.currentValue);
        }
      });
    }
  }

  get session() {
    let data = {
      system: '',
      username: '',
      password: ''
    };

    if(this.api.iam.isDebug()) {
      data.system = 'FBO';
      data.username = 'ina@iaculis.us';
      data.password = 'password'
    }

    this.store.systems = this.api.iam.import.systems();

    this.zone.runOutsideAngular(() => {
      this.api.iam.import.history(this.email, (migrations) => {
        this.zone.run(() => {
          this.store.migrations = migrations.map((account, index) => {
            let roles = [];

            if(this.store.roles[account.system] && this.store.roles[account.system][account.username]) {
              roles = this.store.roles[account.system][account.username].map((role) => {
                return {
                  department: role.department,
                  role: role.role
                }
              });
            }

            return {
              system: account.sourceLegacySystem.toUpperCase() + '.gov',
              username: account.username || '',
              orgKey: account.orgKey,
              name: account.fullName,
              migratedAt: moment(account.claimedTimestamp).format('MM/DD/YYYY'),
              roles: roles
            }
          });

          if(this.store.migrations.length) {
            this.alert('Account Successfully Migrated', 'success');
          }
        });
      }, () => {
        this.zone.run(() => {
          console.warn('Endpoint Unavailable')
          //TODO
        });
      })
    });

    return data;
  }

  initForm() {
    const session = this.session;

    if(Object.keys(this.store.roles).length) {
      this.states.confirm.show = true;
    }

    this.migrationForm = this.builder.group({
      system: [session.system, Validators.required],
      username: [session.username, Validators.required],
      password: [session.password, Validators.required]
    });

    this.store.system = session.system;
  }

  errors(controlName) {
    let control = this.migrationForm.controls[controlName],
        errors = [],
        type;

    controlName = controlName.charAt(0).toUpperCase() + controlName.substring(1, controlName.length);

    for(type in control.errors) {
      errors.push(`${controlName} is ${type}`)
    }

    return ((control.touched && control.dirty) || (this.migrationForm.touched && this.migrationForm.dirty)) && this.states.submitted ? errors[0] : '';
  }

  anchorTo(id) {
    window.location.hash = id;
  }

  alert(message:string, type:string) {
    type = type || 'success';
    message = message || '';

    if(message.length) {
      this.states.confirm.type = type;
      this.states.confirm.message = message;
      this.states.confirm.show = true;
    } else {
      this.states.confirm.show = false;
    }
  }

  migrate() {
    this.migrationForm.markAsTouched();
    this.migrationForm.markAsDirty();

    this.states.confirm.show = false;
    this.states.submitted;

    if(this.migrationForm.valid) {
      let data = this.migrationForm.value;

      this.zone.runOutsideAngular(() => {
        this.api.iam.import.create(this.email, data.system, data.username, data.password, (account) => {
          this.zone.run(() => {
            this.store.migrations.push(account);
            this.alert('Account Successfully Migrated', 'success');
          })
        }, (error) => {
          this.zone.run(() => {
            this.alert(error.message, 'error');
          });
        });
      });
    }
  }
};
