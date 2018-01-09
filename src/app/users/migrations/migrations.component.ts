import { Component, DoCheck, Input, KeyValueDiffers, OnInit, OnChanges, QueryList, SimpleChange, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { IAMService } from 'api-kit';
import { User } from 'api-kit/iam/interfaces';

import { Validators as $Validators } from 'app-utils/validators';
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
    system: 'SAM'
  };

  public states = {
    submitted: false,
    loading: false,
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
    private api: IAMService) {
    this.differ = differs.find({}).create(null);
    this.store.legacy = data;
  }

  ngOnInit() {
    this.api.iam.checkSession((user) => {
      let role,
          intRole;

      this.email = user.email;

      this.initForm();
      this.fetchHistory();
    }, () => {
      if(this.api.iam.isDebug()) {
        this.email = 'John.Doe@gmail.com';

        this.initForm();
        this.fetchHistory();

        this.alert('Account Successfully Migrated', 'success');
      } else {
        this.router.navigate(['/signin']);
      }
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
        if(this.migrationForm.controls[diff.key]) {
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
      data.system = 'SAM';
      data.username = 'ina@iaculis.us';
      data.password = 'password'
    }

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

    this.store.system = session.system;
  }

  fetchHistory() {
    this.api.iam.import.history(this.email, accounts => {
      this.store.migrations = accounts;

      if(this.store.migrations.length) {
        this.alert('Account Successfully Migrated');
      }
    }, error => {
      this.alert(error.message, 'error');
    });
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

  open(target: string) {
    window.open(target);
  }

  alert(message: string = '', type: string = 'success') {
    this.states.confirm.type = type;
    this.states.confirm.message = message;
    this.states.confirm.show = false;

    // Delay for *ngIf timing to kick in
    if(message.length) {
      setTimeout(() => this.states.confirm.show = true, 100);
    }
  }

  migrate() {
    this.migrationForm.markAsTouched();
    this.migrationForm.markAsDirty();

    this.alert();
    this.states.submitted = true;

    if(this.migrationForm.valid) {
      let data = this.migrationForm.value;

      this.states.loading = true;

      this.api.iam.import.create(this.email, data.system, data.username, data.password, account => {
        this.store.migrations.push(account);
        this.alert('Account Successfully Migrated', 'success');
        this.states.loading = false;
      }, error => {
        this.alert(error.message, 'error');
        this.states.loading = false;
      });
    }
  }
};
