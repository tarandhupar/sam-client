import * as moment from 'moment';

import { Component, DoCheck, Input, KeyValueDiffers, NgZone, OnInit, OnChanges, QueryList, SimpleChange, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { IAMService } from 'api-kit';
import { Validators as $Validators } from '../../shared/validators';

import { User } from '../user.interface';

@Component({
  templateUrl: './migrations.component.html',
  providers: [
    IAMService
  ]
})
export class MigrationsComponent {
  private store = {
    systems: [],
    migrations: []
  };

  public migrationForm: FormGroup;

  constructor(
    private router: Router,
    private builder: FormBuilder,
    private zone: NgZone,
    private api: IAMService) {}

  ngOnInit() {
    this.initForm();
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
      this.api.iam.import.history((migrations) => {
        this.zone.run(() => {
          this.store.migrations = migrations.map((account) => {
console.log(account);
            return {
              system: account.sourceLegacySystem.toUpperCase() + '.gov',
              username: account.email,
              orgKey: account.orgKey,
              name: account.fullName,
              migratedAt: moment(account.claimedTimestamp).format('MM/DD/YYYY'),
              roles: (account.gsaRAC || mock).map((role, intRole) => {
                let items = role.split('_');

                items[0] = items[0].replace(/([A-Z])/gi, ' $1');
                items[1] = items[1].replace(/([A-Z])/gi, ' $1');

                return {
                  role: items[0],
                  department: items[1]
                };
              })
            }
          });

          // this.store.migrations.forEach((migration, index) => {
          //
          //   this.history.push(this.store.migrations);
          // });
console.log(this.store.migrations);
        });
      }, () => {
        console.warn('Endpoint Unavailable')
        //TODO
      })
    });

    this.store.systems = this.api.iam.import.systems();

    return data;
  }

  initForm() {
    const session = this.session;

    this.migrationForm = this.builder.group({
      system: [session.system, Validators.required],
      username: [session.username, Validators.required],
      password: [session.password, Validators.required]
    });
  }

  errors(controlName) {
    let control = this.migrationForm.controls[controlName],
        errors = [],
        type;

    for(type in control.errors) {
      errors.push(`${controlName} + is ${type}`)
    }

    return (control.touched && control.dirty) ? errors[0] : '';
  }

  migrate() {

  }
};
