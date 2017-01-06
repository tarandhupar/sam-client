import * as _ from 'lodash';

import { Component, DoCheck, Input, KeyValueDiffers, NgZone, OnInit, OnChanges, QueryList, SimpleChange, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { FHService, IAMService } from 'api-kit';
import { Validators as $Validators } from '../../shared/validators';

import { User } from '../user.interface';
import { KBA } from '../kba.interface';

@Component({
  templateUrl: './details.component.html',
  providers: [
    FHService,
    IAMService
  ]
})
export class DetailsComponent {
  private differ;
  private api = {
    fh: null,
    iam: null
  };

  private lookups = {
    questions: [
      null,
      { 'id': 1,  'question': 'What was the make and model of your first car?' },
      { 'id': 2,  'question': 'Who is your favorite Actor/Actress?' },
      { 'id': 3,  'question': 'What was your high school mascot?' },
      { 'id': 4,  'question': 'When you were young, what did you want to be when you grew up?' },
      { 'id': 5,  'question': 'Where were you when you first heard about 9/11?' },
      { 'id': 6,  'question': 'Where did you spend New Years Eve 2000?' },
      { 'id': 7,  'question': 'Who was your childhood hero?' },
      { 'id': 8,  'question': 'What is your favorite vacation spot?' },
      { 'id': 9,  'question': 'What is the last name of your first grade teacher?' },
      { 'id': 10, 'question': 'What is your dream job?' },
      { 'id': 11, 'question': 'If you won the Lotto, what is the first thing you would do?' },
      { 'id': 12, 'question': 'What is the title of your favorite book?' }
    ]
  };

  private states = {
    isGov: false,
    editable: {
      identity: false,
      business: false,
      kba: false
    }
  };

  private user = {
    _id: '',
    email: '',

    title: '',

    fullName: '',
    firstName: '',
    initials: '',
    lastName: '',

    suffix: '',

    department: '',
    orgID: '',

    workPhone: '',

    kbaAnswerList: [
      <any>{ questionId: 1, answer: '&bull;' },
      <any>{ questionId: 5, answer: '&bull;' },
      <any>{ questionId: 7, answer: '&bull;' }
    ],

    accountClaimed: true
  };

  private department = '';
  private agency = '';
  private office = '';

  public detailsForm: FormGroup;

  constructor(
    private builder: FormBuilder,
    private differs: KeyValueDiffers,
    private zone: NgZone,
    private _fh: FHService,
    private _iam: IAMService) {
      this.differ = differs.find({} ).create(null);

      this.api.iam = _iam.iam;
      this.api.fh = _fh;
    }

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      this.initUser(() => {
        this.zone.run(() => {
          let intAnswer;

          for(intAnswer = 0; intAnswer < this.user.kbaAnswerList.length; intAnswer++) {
            this.user.kbaAnswerList[intAnswer].answer = this.repeater(this.user.kbaAnswerList[intAnswer].answer, 8);
          }

          this.detailsForm = this.builder.group({
            title:           [this.user.title],

            firstName:       [this.user.firstName, Validators.required],
            middleName:      [this.user.initials],
            lastName:        [this.user.lastName, Validators.required],

            suffix:          [this.user.suffix],

            workPhone:       [this.user.workPhone],

            department:      [this.user.department],
            orgID:           [this.user.orgID],

            kbaAnswerList:   this.builder.array([
              this.initKBAGroup(),
              this.initKBAGroup(),
              this.initKBAGroup()
            ]),
          });

          if(this.states.isGov) {
            console.log(this.api.fh.getOrganizationById(this.user.orgID));
          }
        });
      });
    });
  }

  ngDoCheck() {
    let vm = this,
        changes = this.differ.diff(this.user);

    if(changes) {
      changes.forEachChangedItem(function(diff) {
        vm.detailsForm.controls[diff.key].setValue(diff.currentValue);
      });
    }
  }

  initUser(cb) {
    let vm = this,
        fn;

    function getSessionUser(promise) {
      promise({});
    }

    function getMockUser(promise) {
      vm.states.isGov = true;

      promise({
        email: 'doe.john@gsa.gov',
        suffix: '',
        firstName: 'John',
        initials: 'J',
        lastName: 'Doe',

        department: 10000668,
        orgId: 100038166,

        workPhone: '2401234568'
      });
    };

    fn = this.api.iam.isDebug() ? getMockUser : getSessionUser;

    fn((userData) => {
      vm.user = _.merge({}, vm.user, userData);
      cb();
    });
  }

  initKBAGroup() {
    return this.builder.group({
      questionId: ['', Validators.required],
      answer:     ['', [Validators.required, Validators.minLength(8), $Validators.unique('answer')]]
    })
  }

  repeater(string, iterations) {
    let repeater = '';

    if(string.length && iterations) {
      while(iterations--) {
        repeater += string;
      }
    }

    return repeater;
  }

  get phone():string {
    let phone = this.user.workPhone
      .replace(/[^0-9]/g, '')
      .replace(/([0-9]{3})([0-9]{3})([0-9]{4})/g, '($1) $2-$3');

    switch(phone.length) {
      case 14:
        phone = `1+${phone}`;
        break;
    }

    return phone;
  }

  setDepartment(department) {
    this.user.department = department.value;
  }

  setOrganization(organization) {
    this.user.orgID = organization.value;
  }

  get name():string {
    return [
      this.user.firstName || '',
      this.user.initials || '',
      this.user.lastName || ''
    ].join(' ').replace(/\s+/g, ' ');
  }

  isEdit(groupKey) {
    return this.states.editable[groupKey] || false;
  }

  edit(groupKey) {
    this.states.editable[groupKey] = true;
  }

  save(groupKey) {
    this.states.editable[groupKey] = false;
  }
};
