import * as _ from 'lodash';

import { Component, DoCheck, Input, KeyValueDiffers, NgZone, OnInit, OnChanges, QueryList, SimpleChange, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { KBAComponent } from '../shared/kba';

import { IAMService } from 'api-kit';

import { Validators as $Validators } from '../shared/validators';

import { KBA } from '../kba.interface';

@Component({
  templateUrl: './forgot-main.component.html',
  providers: [
    IAMService
  ]
})
export class ForgotMainComponent {
  @ViewChildren(KBAComponent) kbaComponents:QueryList<any>;

  public securityForm: FormGroup;
  public states = {
    isGov: true,
    selected: ['','','']
  };

  private token = '';
  private questions = [];
  private differ;
  private lookups = {
    questions: [],
    indexes: {}
  };

  constructor(
    private router: Router,
    private builder: FormBuilder,
    private zone: NgZone,
    private api: IAMService) {}

  ngOnInit() {
    this.securityForm = this.builder.group({
      //TODO
    });
  }

  submit() {

  }

  reset() {
    let userData,
        kbaAnswerList = this.securityForm.value['kbaAnswerList'];

    this.kbaComponents.forEach(function(kbaComponent, index) {
      kbaComponent.updateState(true);
    });

    if(this.securityForm.valid) {
      this.zone.runOutsideAngular(() => {
        // this.process(userData, () => {
        //   this.zone.run(() => {
        //     this.router.navigate(['/signin']);
        //   });
        // });
      });
    }
  }
};
