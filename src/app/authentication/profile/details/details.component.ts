import * as _ from 'lodash';

import { Component, DoCheck, Input, KeyValueDiffers, NgZone, OnInit, OnChanges, QueryList, SimpleChange, ViewChild } from '@angular/core';
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
  @ViewChild('confirmModal') confirmModal;
  @ViewChild('reconfirmModal') reconfirmModal;

  private differ;
  private api = {
    fh: null,
    iam: null
  };

  private lookups = {
    questions: [],
    indexes: {}
  };

  private states = {
    isGov: false,
    selected: ['','',''],
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

  private questions = [];

  private department = '';
  private agency = '';
  private office = '';
  private aac = '';

  public detailsForm: FormGroup;

  constructor(
    private router: Router,
    private builder: FormBuilder,
    private differs: KeyValueDiffers,
    private zone: NgZone,
    private _fh: FHService,
    private _iam: IAMService) {
      this.differ = differs.find({}).create(null);

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
              this.initKBAGroup(0),
              this.initKBAGroup(1),
              this.initKBAGroup(2)
            ]),
          });

          if(this.states.isGov) {
            this.api.fh
              .getOrganizationById(this.user.orgID)
              .subscribe(data => {
                let organization = data['_embedded'][0]['org'];

                this.department = (organization.l1Name || '');
                this.agency = (organization.l2Name || '');
                this.office = (organization.l3Name || '');

                this.aac = (organization.code || '');
              });
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
        if(vm.detailsForm && vm.detailsForm.controls[diff.key]) {
          vm.detailsForm.controls[diff.key].setValue(diff.currentValue);
        }
      });
    }
  }

  loadUser(cb) {
    let vm = this;

    this.api.iam.checkSession(function(user) {
      vm.user = _.merge({}, vm.user, user);
      vm.user['middleName'] = user.initials;
      cb();
    }, function() {
      vm.router.navigate(['/signin']);
    });
  }

  loadKBA(cb) {
    let vm = this;

    function processKBAQuestions(data) {
      let intQuestion;

      vm.lookups.questions = data.questions;

      vm.lookups.questions = vm.lookups.questions.map(function(question, intQuestion) {
        if(intQuestion) {
          // Crseate reverse lookup while remapping
          vm.lookups.indexes[question.id] = intQuestion;
          // Update associative array
          question.disabled = false;
        }

        return question;
      });

      for(intQuestion in vm.user.kbaAnswerList) {
        vm.questions.push(_.clone(vm.lookups.questions));
      }

      vm.lookups.questions.unshift(null);

      cb();
    }

    this.api.iam.kba.questions(processKBAQuestions, processKBAQuestions);
  }

  initUser(cb) {
    let vm = this,
        fn,
        getSessionUser = (function(promise) {
          this.zone.runOutsideAngular(() => {
            this.loadUser(() => {
              this.zone.run(() => {
                this.states.isGov = _.isUndefined(this.user.department) && String(this.user.department).length;
                this.loadKBA(() => {
                  promise(this.user);
                });
              });
            });
          });


        }).bind(this),

        getMockUser = (function(promise) {
          let intQuestion;

          vm.states.isGov = true;
          vm.lookups.questions = [
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
          ];

          for(intQuestion in vm.user.kbaAnswerList) {
            vm.questions.push(vm.lookups.questions);
          }

          promise({
            email: 'doe.john@gsa.gov',
            suffix: '',
            firstName: 'John',
            middleName: 'J',
            lastName: 'Doe',

            department: 100006688,
            orgID: 100173623,

            workPhone: '2401234568'
          });
        }).bind(this);

    fn = this.api.iam.isDebug() ? getMockUser : getSessionUser;

    fn((userData) => {
      vm.user = _.merge({}, vm.user, userData);
      cb();
    });
  }

  initKBAGroup($index) {
    let kbaAnswer = this.user.kbaAnswerList[$index];

    return this.builder.group({
      questionId: [kbaAnswer.questionId, Validators.required],
      answer:     [kbaAnswer.answer, [Validators.required, Validators.minLength(8), $Validators.unique('answer')]]
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
      this.user['middleName'] || '',
      this.user.lastName || ''
    ].join(' ').replace(/\s+/g, ' ');
  }

  isEdit(groupKey) {
    return this.states.editable[groupKey] || false;
  }

  changeQuestion(questionID, $index) {
    let vm = this,
        items = _.cloneDeep(this.lookups.questions),
        intQuestion;

    this.states.selected[$index] = questionID;

    this.states.selected.forEach(function(questionID, intItem) {
      if(questionID.toString().length) {
        intQuestion = vm.lookups.indexes[questionID];
        // Loop through new questions array lookup to apply disabled options
        items[intQuestion].disabled = true;
      }
    });

    this.states.selected.forEach(function(questionID, intItem) {
      // Loop through each question list to set the list to the new questions list
      vm.questions[intItem] = _.cloneDeep(items);
      // Re-enable the selected option
      if(questionID) {
        intQuestion = vm.lookups.indexes[questionID];
        vm.questions[intItem][intQuestion].disabled = false;
      }
    });
  }

  /**
   * Account Deactivation
   */
  confirmDeactivation() {
    this.confirmModal.openModal();
  }

  reconfirmDeactivation() {
    this.confirmModal.closeModal();
    this.reconfirmModal.openModal();
  }

  deactivateAccount(cb) {
    this.api.iam.user.deactivate(this.user.email, function() {
      cb();
    }, function() {
      //TODO
    });
  }

  deactivate() {
    this.zone.runOutsideAngular(() => {
      this.deactivateAccount(() => {
        this.zone.run(() => {
          // Close reconfirm prompt
          this.reconfirmModal.closeModal();
          // Sign user out
          this.api.iam.logout();
          // Redirect to login
          this.router
            .navigate(['signin'])
            .then(function() {
              window.location.reload();
            });
        });
      });
    });
  }

  /**
   * Editables
   */
  edit(groupKey) {
    this.states.editable[groupKey] = true;
  }

  saveGroup(key, cb) {
    let userData;

    this.user = _.clone(this.detailsForm.value);
    userData = _.clone(this.user);

    switch(key) {
      case 'identity':
        userData.name = this.name;
        userData.initials = userData['middleName'];

        delete userData.kbaAnswerList;
        break;

      case 'business':
        delete userData.kbaAnswerList;
        break;

      case 'kba':
        break;
    }

    console.log(userData);

    this.api.iam.user.update(userData, function(data) {
      cb();
    }, function() {
      cb();
    });
  }

  save(groupKey) {
    this.zone.runOutsideAngular(() => {
      this.saveGroup(groupKey, () => {
        this.zone.run(() => {
          this.states.editable[groupKey] = false;
        });
      });
    });
  }
};
