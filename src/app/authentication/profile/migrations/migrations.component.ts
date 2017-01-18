import * as _ from 'lodash';

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

  };

  public migrationForm: FormGroup;

  constructor(
    private router: Router,
    private builder: FormBuilder,
    private zone: NgZone,
    private api: IAMService) {}

  ngOnInit() {
    this.migrationForm = this.builder.group({
      website: [''],
      username: ['', Validators.required],
      password: ['', Validators.required]
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
