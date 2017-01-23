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
    legacy: [],
    migrations: [],
    systems: [],
    system: ''
  };

  private states = {
    alert: false,
    confirm: {
      type: '',
      message: '',
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
    this.states.alert = true;

    this.zone.runOutsideAngular(() => {
      this.api.iam.checkSession((user) => {
        this.zone.run(() => {
          this.email = user.email;
          this.initForm();
        });
      }, () => {
        this.zone.run(() => {
          this.router.navigate(['/signin']);
        });
      });
    });
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
        },

        mock;

    if(this.api.iam.isDebug()) {
      data.system = 'FBO';
      data.username = 'ina@iaculis.us';
      data.password = 'password'
    }

    this.store.systems = this.api.iam.import.systems();

    mock = [
      'AgencyUser_USFishAndWildlifeService',
      'AgencyCoordinator_NationalParksService'
    ];

    this.zone.runOutsideAngular(() => {
      this.api.iam.import.history(this.email, (migrations) => {
        this.zone.run(() => {
          this.store.migrations = migrations.map((account) => {
            return {
              system: account.sourceLegacySystem.toUpperCase() + '.gov',
              username: account.email,
              orgKey: account.orgKey,
              name: account.fullName,
              migratedAt: moment(account.claimedTimestamp).format('MM/DD/YYYY'),
              roles: (account.gsaRAC || mock).map((role, intRole) => {
                let items = role.split('_');

                items[0] = items[0].replace(/([A-Z])/g, ' $1');
                items[1] = items[1].replace(/([A-Z])/g, ' $1');

                return {
                  role: items[0],
                  department: items[1]
                };
              })
            }
          });
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

    return ((control.touched && control.dirty) || (this.migrationForm.touched && this.migrationForm.dirty)) ? errors[0] : '';
  }

  migrate() {
    this.migrationForm.markAsTouched();
    this.migrationForm.markAsDirty();

    this.states.confirm.show = false;

    if(this.migrationForm.valid) {
      let data = this.migrationForm.value;

      this.zone.runOutsideAngular(() => {
        this.api.iam.import.create(data.system, data.username, data.password, (account) => {
          this.zone.run(() => {
            this.store.migrations.push(account);
            this.states.confirm.type = 'success';
            this.states.confirm.message = 'Account Successfully Migrated';
            this.states.confirm.show = true;
          })
        }, (error) => {
          this.zone.run(() => {
            this.states.confirm.type = 'error';
            this.states.confirm.message = error.message;
            this.states.confirm.show = true;
          });
        });
      });
    }
  }
};
