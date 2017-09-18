import { Component, DoCheck, ElementRef, forwardRef, Input, KeyValueDiffers, KeyValueDiffer, OnInit, OnChanges, QueryList, SimpleChange, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { cloneDeep, isArray, isNumber, merge } from 'lodash';

import { SamNameEntryComponent } from 'sam-ui-kit/form-templates/name-entry';
import { SamPhoneEntryComponent } from 'sam-ui-kit/form-templates/phone-entry'
import { SamKBAComponent, SamPasswordComponent } from '../../app-components';
import { AgencyPickerComponent } from '../../app-components/agency-picker/agency-picker.component'

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
  @ViewChild('nameEntry') nameEntry: SamNameEntryComponent;
  @ViewChild('phoneEntry') phoneEntry: SamPhoneEntryComponent;
  @ViewChild('agencyPicker') agencyPicker: AgencyPickerComponent;
  @ViewChild('passwordComponent') passwordComponent: SamPasswordComponent;
  @ViewChild('controls') controls: ElementRef;

  @ViewChildren(forwardRef(() => SamKBAComponent)) kbaComponents:QueryList<any>;

  public userForm: FormGroup;

  public store = {
    questions: [],
    indexes: {},
    levels: ['department', 'agency', 'office']
  };

  public states = {
    isGov: true,
    submitted: false,
    loading: false,
    selected: ['','',''],
    alert: {
      show: false,
      type: 'error',
      message: ''
    }
  };

  private token = '';
  private differ: KeyValueDiffer;

  public questions = [];
  public user: User = {
    _id: '',
    email: '',

    fullName: '',
    firstName: '',
    initials: '',
    lastName: '',

    departmentID: '',
    agencyID: '',
    officeID: '',

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
      const orgID = (this.user.officeID || this.user.agencyID || this.user.departmentID || '').toString();

      this.userForm = this.builder.group({
        title:             [this.user.title],
        firstName:         [this.user.firstName, Validators.required],
        middleName:        [this.user.initials],
        lastName:          [this.user.lastName, Validators.required],
        suffix:            [this.user.suffix],

        workPhone:         [this.user.workPhone],

        officeID:          [orgID], // Set default organization

        kbaAnswerList:     this.builder.array([
          this.initKBAGroup(0),
          this.initKBAGroup(1),
          this.initKBAGroup(2)
        ]),

        userPassword:      ['', Validators.required],
        accountClaimed:    [true],
        emailNotification: [this.user.emailNotification]
      });

      if(this.states.isGov) {
        this.userForm.controls['officeID'].setValidators([Validators.required]);
      }

      // Set the model for components using the model system
      this.user = merge({}, this.user, this.userForm.value);
    });
  }

  ngDoCheck() {
    let changes = this.differ.diff(this.user);

    if(changes) {
      changes.forEachChangedItem((diff) => {
        if(this.userForm.controls[diff.key]) {
          if(diff.key.match(/(department|agency|office)/) && isNumber(diff.currentValue) && !diff.currentValue) {
            return;
          }

          this.userForm.controls[diff.key].setValue(diff.currentValue);
        }
      });
    }
  }

  writeValue(obj: any) {}
  registerOnChange(fn: any) {}
  registerOnTouched(fn: any) {}
  setDisabledState(isDisabled: boolean) {}

  initSession(cb) {
    let onInitSuccess,
      onInitError;

    onInitSuccess = ((data) => {
      let userData = merge({}, data.user || {}),
        phone;

      userData._id = userData.id || userData._id || '';
      userData.firstName = userData.firstname || userData.firstName || '';
      userData.lastName = userData.lastname || userData.lastName || '';
      userData.workPhone = userData.phone || userData.workPhone || '';

      // Set new token for registration route security
      if(data.tokenId !== undefined) {
        this.token = data.tokenId;
      }

      // Transform KBA questions data response
      if(isArray(data.kbaQuestionList)) {
        const kbaAnswer = <KBA>{ questionId: 0, answer: '' };
        let intTarget;

        this.store.questions = data.kbaQuestionList;
        this.user.kbaAnswerList = [kbaAnswer, kbaAnswer, kbaAnswer];

        this.processKBAQuestions();
      }

      // Merge existing user account data
      this.user = merge({}, this.user, userData);

      phone = (this.user.workPhone || '').split('x');

      this.user.workPhone = phone[0].replace(/[^0-9]/g, '');
      this.user.workPhone = (this.user.workPhone.length < 11 ? '1' : '' ) + this.user.workPhone;

      if(phone.length > 1) {
        this.user.phoneExtension = phone[1];
      }

      // Set rendering to gov vs non-gov
      this.states.isGov = data.gov || false;

      cb();
    });

    onInitError = (() => {
      this.router.navigate(['signup'], <NavigationExtras>{ error: 'There was an issue with your confirmation link. Please try again to register.' });
    });

    if(this.api.iam.isDebug()) {
      this.initMockSession(cb);
      return;
    } else {
      this.api.iam.user.registration.confirm(this.token, onInitSuccess, onInitError);
    }
  }

  initMockSession(cb) {
    this.states.isGov = true;

    this.user = merge({}, this.user, {
      _id:           'john.doe@gsa.com',
      email:         'john.doe@gsa.com',
      firstName:     'John',
      lastName:      'Doe',
      initials:      'J',
      fullName:      'John J Doe',
      workPhone:     '12345678901',
      kbaAnswerList: [
        { questionId: 1, answer: 'Answer1' },
        { questionId: 2, answer: 'Answer2' },
        { questionId: 3, answer: 'Answer3' }
      ]
    });

    this.store.questions = [
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

    cb();
  }

  processKBAQuestions() {
    let intQuestion;

    this.store.questions = this.store.questions.map((question, intQuestion) => {
      // Crseate reverse lookup while remapping
      this.store.indexes[question.id] = intQuestion;
      // Update associative array
      question.disabled = false;
      return question;
    });

    for(intQuestion in this.user.kbaAnswerList) {
      this.questions.push(this.store.questions);
    }
  }

  initKBAGroup(index: number) {
    return this.builder.group({
      questionId: [this.user.kbaAnswerList[index].questionId, Validators.required],
      answer:     [this.user.kbaAnswerList[index].answer]
    })
  }

  setHierarchy(hierarchy: { label: string, value: number }[]) {
    let organization;

    this.user.departmentID = 0;
    this.user.agencyID = 0;
    this.user.officeID = 0;

    this.store.levels.forEach((level, intLevel) => {
      organization = hierarchy[intLevel];

      if(organization) {
        this.user[`${level}ID`] = organization.value;
        hierarchy[intLevel].value;
      }
    });

    this.userForm.controls['officeID'].setValue(
      this.user.officeID || this.user.agencyID || this.user.departmentID
    );
  }

  changeQuestion(questionID, $index) {
    let items = cloneDeep(this.store.questions),
      intQuestion;

    this.states.selected[$index] = questionID;

    this.states.selected.forEach((questionID, intItem) => {
      if(questionID.toString().length) {
        intQuestion = this.store.indexes[questionID];
        // Loop through new questions array lookup to apply disabled options
        items[intQuestion].disabled = true;
      }
    });

    this.states.selected.forEach((questionID, intItem) => {
      // Loop through each question list to set the list to the new questions list
      this.questions[intItem] = cloneDeep(items);
      // Re-enable the selected option
      if(questionID) {
        intQuestion = this.store.indexes[questionID];
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
    let userData = merge({}, this.user, this.userForm.value),
      propKey,
      isRemove;

    userData.initials = userData.middleName;
    userData.fullName = [userData.firstName, userData.initials, userData.lastName]
      .join(' ')
      .replace(/\s+/, ' ');

    // Clean up empty properties
    for(propKey in userData) {
      switch(propKey) {
        case 'departmentID':
        case 'agencyID':
        case 'officeID':
          userData[propKey] = parseInt(this.user[propKey]);
          break;

        case 'kbaAnswerList':
          userData[propKey] = this.userForm.value.kbaAnswerList;
          break;
      }

      isRemove = (isArray(userData[propKey]) && !userData[propKey].length) ||
        ((userData[propKey] || '').length == 0);

      if(isRemove && !propKey.match(/(department|agency|office)ID/)) {
        delete userData[propKey];
      }
    }

    userData.isGov = this.states.isGov;

    return userData;
  }

  cancel() {
    this.router.navigate(['/signup']);
  }

  validate() {
    this.nameEntry.setSubmitted();
    this.passwordComponent.setSubmitted();

    if(this.states.isGov) {
      this.agencyPicker.setOrganizationFromBrowse();
    }

    this.kbaComponents.forEach(function(kbaComponent, index) {
      kbaComponent.updateState(true);
    });
  }

  register() {
    let userData,
      onError = ((error) => {
        // Error Promise
        this.showAlert('error', error.message);
        this.states.submitted = false;
        this.states.loading = false;
      });

    this.hideAlert();
    this.validate();

    if(this.userForm.valid) {
      this.states.submitted = true;
      this.states.loading = true;

      userData = this.prepareData();

      this.api.iam.user.registration.register(this.token, userData, (data) => {
        let credentials = {
          username: userData.email,
          password: userData.userPassword
        };

        this.user = merge({}, this.user, data);
        this.states.loading = false;

        // Automatically authenticate the user and start a session
        this.api.iam.login(credentials, () => {
          // Success Promise
          this.router.navigate(['/profile/details']);
        }, onError);
      }, onError);
    } else {
      if(this.api.iam.isDebug()) {
        console.log(this.prepareData());
      }

      this.showAlert('error', 'There were some errors in your response, please review them and try again');
    }
  }
};
