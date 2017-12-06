import { Component, DoCheck, ElementRef, forwardRef, Input, KeyValueDiffers, KeyValueDiffer, OnInit, OnChanges, QueryList, SimpleChange, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { cloneDeep, isArray, isNumber, merge } from 'lodash';

import { SamNameEntryComponent } from 'sam-ui-elements/src/ui-kit/form-templates/name-entry';
import { SamPhoneEntryComponent } from 'sam-ui-elements/src/ui-kit/form-templates/phone-entry'
import { SamKBAComponent } from 'app-components';

import { IAMService } from 'api-kit';
import { KBA, User } from 'api-kit/iam/interfaces';

@Component({
  templateUrl: './register-main.component.html',
  providers: [
    IAMService
  ]
})
export class RegisterMainComponent {
  @ViewChild('nameEntry') nameEntry: SamNameEntryComponent;
  @ViewChild('phoneEntry') phoneEntry: SamPhoneEntryComponent;
  @ViewChild('agencyPicker') agencyPicker;
  @ViewChild('passwordComponent') passwordComponent;
  @ViewChild('controls') controls: ElementRef;

  @ViewChildren(forwardRef(() => SamKBAComponent)) kbaComponents:QueryList<any>;

  public userForm: FormGroup;

  private configs = {
    carrier: {
      keyValueConfig: {
        keyProperty: 'key',
        valueProperty: 'value'
      }
    }
  };

  public store = {
    questions: [],
    indexes: {},
    levels: ['department', 'agency', 'office'],
    labels: {
      personalPhone: {
        label: 'Mobile Phone',
        hint: `
          When you sign in each time, you will need to receive a one time password. This password will automatically
          be sent to your email address. To receive one time passwords as text messages instead, you must provide a
          mobile phone number and carrier.
          <div><em>* Standard Text Messaging Rates May Apply.</em></div>
        `
      }
    }
  };

  public states = {
    isGov: false,
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
  private differ;
  public questions = [];
  public user: User = {
    _id: '',
    email: '',

    fullName: '',
    firstName: '',
    initials: '',
    lastName: '',
    suffix: '',
    personalPhone: '',
    carrier: '',

    workPhone: '',
    departmentID: '',
    agencyID: '',
    officeID: '',

    kbaAnswerList: [
      <KBA>{ questionId: '', answer: '' },
      <KBA>{ questionId: '', answer: '' },
      <KBA>{ questionId: '', answer: '' }
    ],

    userPassword: '',
    accountClaimed: true,
    OTPPreference: 'email',
    emailNotification: false,
  };

  constructor(private router: Router, private route: ActivatedRoute, private builder: FormBuilder, private differs: KeyValueDiffers, private api: IAMService) {
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
        personalPhone:     [this.user.personalPhone],
        carrier:           [this.user.carrier, this.user.personalPhone ? Validators.required : null],

        workPhone:         [this.user.workPhone],
        officeID:          [orgID],

        kbaAnswerList:     this.builder.array([
          this.initKBAGroup(0),
          this.initKBAGroup(1),
          this.initKBAGroup(2)
        ]),

        userPassword:      ['', Validators.required],
        accountClaimed:    [true],
        OTPPreference:     [this.user.OTPPreference],
        emailNotification: [this.user.emailNotification],
      });

      this.userForm.get('personalPhone').valueChanges.subscribe(value => {
        const control = this.userForm.get('carrier'),
              validation = value ? [Validators.required] : null;

        control.setValidators(validation);
        control.updateValueAndValidity();
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

  initSession(cb) {
    let onInitSuccess,
        onInitError;

    onInitSuccess = (data => {
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
        const kbaAnswer = <KBA>{ questionId: '', answer: '' };
        let intTarget;

        this.store.questions = data.kbaQuestionList;
        this.user.kbaAnswerList = [kbaAnswer, kbaAnswer, kbaAnswer];

        this.processKBAQuestions();
      }

      // Merge existing user account data
      this.user = merge({}, this.user, userData);

      phone = (this.user.workPhone || '').split('x');

      this.user.workPhone = this.sanitizePhone(phone[0]);
      this.user.personalPhone = this.sanitizePhone(this.user.personalPhone, false);

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

    this.api.iam.user.get(user => {
      user.personalPhone = (user.personalPhone || '').replace(/[^0-9]/g, '');

      this.user = merge({}, this.user, user, {
        kbaAnswerList: [
          { questionId: 1, answer: 'Answer1' },
          { questionId: 2, answer: 'Answer2' },
          { questionId: 3, answer: 'Answer3' }
        ]
      });

      if(ENV && ENV == 'test') {
        this.states.isGov = false;
        delete this.user['departmentID'];
        delete this.user['agencyID'];
        delete this.user['officeID'];
      }

      this.api.iam.kba.questions(kba => {
        this.store.questions = kba.questions;

        this.processKBAQuestions();
        cb();
      });
    });
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

  sanitizePhone(phone: string = null, country: boolean = true): string {
    if(phone) {
      phone = phone.replace(/[^0-9]/g, '');
    }

    if(country && phone.length < 11) {
      phone = `1${phone}`;
    } else if(!country && phone.length > 10) {
      phone = phone.substring(1, phone.length - 1);
    }

    return (phone || '');
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

  errors(controlName: string) {
    const control = this.userForm.get(controlName);
    let errors = '';

    switch(controlName) {
      case 'carrier':
        if(this.states.submitted && control.hasError('required')) {
          errors = 'Carrier is required if mobile phone is entered.';
        }

        break;
    }

    return errors;
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

    this.states.submitted = true;
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
      this.states.loading = true;

      userData = this.prepareData();

      this.api.iam.user.registration.register(this.token, userData, token => {
        this.states.submitted = false;
        this.states.loading = false;
        this.router.navigate(['/profile/details']);
      }, onError);
    } else {
      if(this.api.iam.isDebug()) {
        console.log(this.prepareData());
      }

      this.showAlert('error', 'There were some errors in your response, please review them and try again');
    }
  }
};
