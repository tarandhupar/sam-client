import * as _ from 'lodash';

import { Component, DoCheck, ElementRef, Input, KeyValueDiffers, OnInit, OnChanges, QueryList, SimpleChange, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SamNameEntryComponent } from 'sam-ui-kit/form-templates/name-entry';
import { SamPhoneEntryComponent } from 'sam-ui-kit/form-templates/phone-entry';
import { SamKBAComponent, SamPasswordComponent } from '../shared';

import { IAMService } from 'api-kit';

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

  @ViewChild('nameEntry') nameEntry: SamNameEntryComponent;
  @ViewChild('phoneEntry') phoneEntry: SamPhoneEntryComponent;
  @ViewChild('passwordComponent') passwordComponent: SamPasswordComponent;
  @ViewChild('controls') controls: ElementRef;

  @ViewChildren(SamKBAComponent) kbaComponents:QueryList<any>;

  public userForm: FormGroup;
  public states = {
    isGov: true,
    submitted: false,
    selected: ['','',''],
    alert: {
      show: false,
      type: 'error',
      message: ''
    }
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
    private api: IAMService) {
    this.differ = differs.find({} ).create(null);
  }

  ngOnInit() {
    let params = (this.route.queryParams['value'] || {});

    this.token = (params.token || '');

    if(!(this.token.length || this.api.iam.isDebug())) {
      this.router.navigate(['signup'], <NavigationExtras>{ error: 'There was an issue with your confirmation link. Please try again to register.' });
    }

    this.initSession(() => {
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
  }

  ngDoCheck() {
    let changes = this.differ.diff(this.user);

    if(changes) {
      changes.forEachChangedItem((diff) => {
        this.userForm.controls[diff.key].setValue(diff.currentValue);
      });
    }
  }

  writeValue(obj: any) {}
  registerOnChange(fn: any) {}
  registerOnTouched(fn: any) {}
  setDisabledState(isDisabled: boolean){}

  initSession(cb) {
    let onInitSuccess,
        onInitError;

    onInitSuccess = ((data) => {
      let userData = _.merge({}, data.user || {}),
          phone;

      userData._id = userData.id || userData._id || '';
      userData.firstName = userData.firstname || userData.firstName || '';
      userData.lastName = userData.lastname || userData.lastName || '';
      userData.workPhone = userData.phone || userData.workPhone || '';

      this.user = {
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
        this.token = data.tokenId;
      }

      // Transform KBA questions data response
      if(_.isArray(data.kbaQuestionList)) {
        const kbaAnswer = <KBA>{ questionId: 0, answer: '' };
        let intTarget;

        this.lookups.questions = data.kbaQuestionList;
        this.user.kbaAnswerList = [kbaAnswer, kbaAnswer, kbaAnswer];

        this.processKBAQuestions();
      }

      // Merge existing user account data
      _.merge(this.user, userData, {
        orgID: data.orgID
      });

      phone = (this.user.workPhone || '').split('x');

      this.user.workPhone = phone[0].replace(/[^0-9]/g, '');
      this.user.workPhone = (this.user.workPhone.length < 11 ? '1' : '' ) + this.user.workPhone;

      if(phone.length > 1) {
        this.user.phoneExtension = phone[1];
      }

      // Set rendering to gov vs non-gov
      this.states.isGov = data.gov || false;

      // Set default organization if available from response
      this.user.orgID = this.user.department;

      cb();
    });

    onInitError = (() => {
      this.router.navigate(['signup'], <NavigationExtras>{ error: 'There was an issue with your confirmation link. Please try again to register.' });
    });

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
      firstName:     ['', Validators.required],
      middleName:    [''],
      lastName:      ['', Validators.required],
      suffix:        [''],

      workPhone:       [''],

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
    this.user.fullName = 'John J Doe';

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
    let intQuestion;

    this.lookups.questions = this.lookups.questions.map((question, intQuestion) => {
      // Crseate reverse lookup while remapping
      this.lookups.indexes[question.id] = intQuestion;
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
      answer:     ['']
    })
  }

  setDepartment(department) {
    this.user.department = department.value;
  }

  setOrganization(organization) {
    this.user.orgID = organization.value;
  }

  changeQuestion(questionID, $index) {
    let items = _.cloneDeep(this.lookups.questions),
        intQuestion;

    this.states.selected[$index] = questionID;

    this.states.selected.forEach((questionID, intItem) => {
      if(questionID.toString().length) {
        intQuestion = this.lookups.indexes[questionID];
        // Loop through new questions array lookup to apply disabled options
        items[intQuestion].disabled = true;
      }
    });

    this.states.selected.forEach((questionID, intItem) => {
      // Loop through each question list to set the list to the new questions list
      this.questions[intItem] = _.cloneDeep(items);
      // Re-enable the selected option
      if(questionID) {
        intQuestion = this.lookups.indexes[questionID];
        this.questions[intItem][intQuestion].disabled = false;
      }
    });
  }

  updatePhoneNumber(phoneNumber) {
    this.user.workPhone = phoneNumber;
  }

  hideAlert() {
    this.states.alert.show = false;
  }

  showAlert(type:string, message:string) {
    this.states.alert.type = type || 'error';
    this.states.alert.message = message || '';
    this.states.alert.show = true;
  }

  prepareData() {
    let userData = this.userForm.value,
        propKey,
        isRemove;

    userData.initials = userData.middleName;
    userData.fullName = [userData.firstName, userData.initials, userData.lastName]
      .join(' ')
      .replace(/\s+/, ' ');

    userData.workPhone = this.user.workPhone;

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

  process(data, fnSuccess, fnError) {
    _.merge(this.user, data);

    fnSuccess = fnSuccess || (() => {});
    fnError = fnError || (() => {});

    this.api.iam.user.registration.register(this.token, data, (userData) => {
       this.user = _.extend({},  this.user, userData);

      let credentials = {
        username: this.user.email,
        password: this.user.userPassword
      };

      // Automatically authenticate the user and start a session
      this.api.iam.login(credentials, () => {
        fnSuccess();
      }, (error) => {
        fnError(error);
      });
    }, (error) => {
      fnError(error);
    });
  }

  cancel() {
    this.router.navigate(['/signup']);
  }

  register() {
    let userData,
        kbaAnswerList = this.userForm.value['kbaAnswerList'];

    this.hideAlert();
    this.nameEntry.setSubmitted();
    this.phoneEntry.check();
    this.passwordComponent.setSubmitted();

    this.kbaComponents.forEach(function(kbaComponent, index) {
      kbaComponent.updateState(true);
    });

    if(this.userForm.valid) {
      this.states.submitted = true;

      userData = this.prepareData();

      this.process(userData, () => {
        // Success Promise
        this.router.navigate(['/profile/details']);
      }, (error) => {
        // Error Promise
        this.showAlert('error', error);
        this.states.submitted = false;
      });
    }
  }
};
