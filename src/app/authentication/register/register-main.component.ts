import * as _ from 'lodash';

import { Component, DoCheck, Input, KeyValueDiffers, NgZone, OnInit, OnChanges, QueryList, SimpleChange, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { KBAComponent } from '../shared/kba';

import { IAMService } from 'api-kit';

import { Validators as $Validators } from '../shared/validators';
import { User } from '../user.interface';
import { KBA } from '../kba.interface';

@Component({
  templateUrl: './register-main.component.html',
  providers: [
    IAMService
  ]
})
export class RegisterMainComponent {
  @Input() user: User;
  @ViewChildren(KBAComponent) kbaComponents:QueryList<any>;

  public userForm: FormGroup;
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
    private route: ActivatedRoute,
    private builder: FormBuilder,
    private differs: KeyValueDiffers,
    private zone: NgZone,
    private api: IAMService) {
    this.differ = differs.find({} ).create(null);
  }

  ngOnInit() {
    let vm = this,
        params = (this.route.queryParams['value'] || {});

    this.token = (params.token || '');

    if(!(this.token.length || this.api.iam.isDebug())) {
      this.router.navigate(['signup'], <NavigationExtras>{ error: 'There was an issue with your confirmation link. Please try again to register.' });
    }

    this.zone.runOutsideAngular(() => {
      this.initSession(() => {
        this.zone.run(() => {
          this.userForm = this.builder.group({
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

            userPassword:    ['', Validators.required],
            accountClaimed:  [true]
          });

          // Set the model for components using the model system
          this.user = this.userForm.value;
        });
      });
    });
  }

  ngDoCheck() {
    let vm = this,
        changes = this.differ.diff(this.user);

    if(changes) {
      changes.forEachChangedItem(function(diff) {
        vm.userForm.controls[diff.key].setValue(diff.currentValue);
      });
    }
  }

  writeValue(obj: any) {}
  registerOnChange(fn: any) {}
  registerOnTouched(fn: any) {}
  setDisabledState(isDisabled: boolean){}

  initSession(cb) {
    let vm = this;

    function onInitSuccess(data) {
      let userData = _.merge({}, data.user || {}),
          phone;

      userData._id = userData.id || userData._id || '';
      userData.firstName = userData.firstname || userData.firstName || '';
      userData.lastName = userData.lastname || userData.lastName || '';
      userData.workPhone = userData.phone || userData.workPhone || '';

      vm.user = {
        _id: '',
        email: '',

        fullName: '',
        firstName: '',
        initials: '',
        lastName: '',

        department: '',
        orgID: '',

        workPhone: '',

        suffix: '',

        kbaAnswerList: [
          <any>{ questionId: '', answer: '' },
          <any>{ questionId: '', answer: '' },
          <any>{ questionId: '', answer: '' }
        ],

        userPassword: '',
        accountClaimed: true
      };

      // Set new token for registration route security
      if(data.tokenId !== undefined) {
        vm.token = data.tokenId;
      }

      // Transform KBA questions data response
      if(_.isArray(data.kbaQuestionList)) {
        const kbaAnswer = <KBA>{ questionId: 0, answer: '' };
        let intTarget;

        vm.lookups.questions = data.kbaQuestionList;
        vm.user.kbaAnswerList = [kbaAnswer, kbaAnswer, kbaAnswer];

        vm.processKBAQuestions();
      }

      // Merge existing user account data
      _.merge(vm.user, userData, {
        orgID: data.orgID
      });

      phone = (vm.user.workPhone || '').split('x');

      vm.user.workPhone = phone[0];

      if(phone.length > 1) {
        vm.user.phoneExtension = phone[1];
      }

      // Set rendering to gov vs non-gov
      vm.states.isGov = data.gov || false;

      // Set default organization if available from response
      vm.user.orgID = vm.user.department;

      cb();
    };

    function onInitError() {
      vm.router.navigate(['signup'], <NavigationExtras>{ error: 'There was an issue with your confirmation link. Please try again to register.' });
    };

    if(this.api.iam.isDebug()) {
      this.initMockSession();
      return;
    } else {
      this.api.iam.user.registration.confirm(this.token, onInitSuccess, onInitError);
    }
  }

  initMockSession() {
    this.userForm = this.builder.group({
      email:           ['doe.john@gsa.com', Validators.required],

      title:         [''],
      firstName:     ['John', Validators.required],
      middleName:    [''],
      lastName:      ['Doe', Validators.required],
      suffix:        [''],

      workPhone:       ['12401234567'],

      department:      [''],
      orgID:           [''],

      kbaAnswerList:   this.builder.array([
        this.initKBAGroup(),
        this.initKBAGroup(),
        this.initKBAGroup()
      ]),

      userPassword:    ['', Validators.required],

      accountClaimed: [true]
    });

    this.user = this.userForm.value;

    this.lookups.questions = [
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

   this.processKBAQuestions();
  }

  processKBAQuestions() {
    let vm = this,
        intQuestion;


    this.lookups.questions = this.lookups.questions.map(function(question, intQuestion) {
      // Crseate reverse lookup while remapping
      vm.lookups.indexes[question.id] = intQuestion;
      // Update associative array
      question.disabled = false;
      return question;
    });

    for(intQuestion in this.user.kbaAnswerList) {
      this.questions.push(this.lookups.questions);
    }
  }

  initKBAGroup() {
    return this.builder.group({
      questionId: ['', Validators.required],
      answer:     ['', [Validators.required, Validators.minLength(8), $Validators.unique('answer')]]
    })
  }

  setDepartment(department) {
    this.user.department = department.value;
  }

  setOrganization(organization) {
    this.user.orgID = organization.value;
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

  prepareData() {
    let userData = this.userForm.value,
        propKey,
        isRemove;

    userData.initials = userData.middleName;
    userData.fullName = [userData.firstName, userData.initials, userData.lastName]
      .join(' ')
      .replace(/\s+/, ' ');

    userData.kbaAnswerList = [
      { questionId: 1, answer: '12345678' },
      { questionId: 2, answer: '34567890' },
      { questionId: 3, answer: '23456789' }
    ];

    // Clean up empty properties
    for(propKey in userData) {
      if(propKey !== 'kbaAnswerList') {
        isRemove = (
          _.isArray(userData[propKey]) && (
            !(userData[propKey] || '').length || !userData[propKey]
          )
        );

        if(isRemove || (userData[propKey] || '').length == 0) {
          delete userData[propKey];
        }
      }
    }

    return userData;
  }

  process(data, cb) {
    let vm = this;

    this.api.iam.user.registration.register(this.token, data, function(userData) {
      _.extend(userData, vm.user);

      let credentials = {
        username: vm.user._id,
        password: vm.user.userPassword
      };

      // Automatically authenticate the user and start a session
      vm.api.iam.login(credentials, function() {
        cb();
      }, function() {
        //TODO
      });
    }, function(err) {
      vm.api.iam.login({});
      //TODO
    });
  }

  register() {
    let userData,
        kbaAnswerList = this.userForm.value['kbaAnswerList'];

    this.kbaComponents.forEach(function(kbaComponent, index) {
      kbaComponent.updateState(true);
    });

    if(this.userForm.valid) {
      userData = this.prepareData();
      this.zone.runOutsideAngular(() => {
        this.process(userData, () => {
          this.zone.run(() => {
            this.router.navigate(['/profile/details']);
          });
        });
      });
    }
  }
};
