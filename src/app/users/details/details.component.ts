import { Component, DoCheck, Input, KeyValueDiffers, OnInit, OnChanges, QueryList, SimpleChange, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import { cloneDeep, indexOf, isNumber, merge } from 'lodash';

import { EntityService, FHService, IAMService } from 'api-kit';
import { KBA, User } from 'api-kit/iam/interfaces';

@Component({
  templateUrl: './details.component.html',
  providers: [
    EntityService,
    FHService,
    IAMService,
  ]
})
export class DetailsComponent {
  @ViewChild('identityEditor') identityEditor;
  @ViewChild('businessEditor') businessEditor;
  @ViewChild('kbaEditor') kbaEditor;
  @ViewChild('agencyPicker') agencyPicker;
  @ViewChild('confirmModal') confirmModal;
  @ViewChild('reconfirmModal') reconfirmModal;
  @ViewChildren('kba') kbaEntries;

  private differ;
  private api = {
    entity: null,
    fh: null,
    iam: null
  };

  private subscriptions = {};
  private store = {
    labels: {
      personalPhone: {
        label: 'Mobile Phone',
        hint: `
          To receive one time passwords as text messages, you must provide a mobile phone number and carrier.
          <div><em>* Standard Text Messaging Rates May Apply</em></div>
        `,
      },

      entity: {
        label: 'Entity',
        hint: `
          To be assigned additional roles and permissions for an organization, you must be associated with an entity.
          Enter an Entity ID (DUNS or CAGE) or Entity Name to find your entity.
        `,
        placeholder: 'Search by CAGE code or DUNS or legal business name',
      },

      deactivate: {
        label: 'Deactivate Account',
        hint: `
          Once you deactivate your account, you will not be able to recover any of your account information or permissions. Your account will
          be permanently inaccessible and you will need to re-register to access SAM.gov.
        `,
      }
    },

    levels: ['department', 'agency', 'office'],
    questions: [
      { 'id': 1,  'question': 'What was the make and model of your first car?',                 disabled: false },
      { 'id': 2,  'question': 'Who is your favorite Actor/Actress?',                            disabled: false },
      { 'id': 3,  'question': 'What was your high school mascot?',                              disabled: false },
      { 'id': 4,  'question': 'When you were young, what did you want to be when you grew up?', disabled: false },
      { 'id': 5,  'question': 'Where were you when you first heard about 9/11?',                disabled: false },
      { 'id': 6,  'question': 'Where did you spend New Years Eve 2000?',                        disabled: false },
      { 'id': 7,  'question': 'Who was your childhood hero?',                                   disabled: false },
      { 'id': 8,  'question': 'What is your favorite vacation spot?',                           disabled: false },
      { 'id': 9,  'question': 'What is the last name of your first grade teacher?',             disabled: false },
      { 'id': 10, 'question': 'What is your dream job?',                                        disabled: false },
      { 'id': 11, 'question': 'If you won the Lotto, what is the first thing you would do?',    disabled: false },
      { 'id': 12, 'question': 'What is the title of your favorite book?',                       disabled: false }
    ],

    indexes: {}
  };

  public states = {
    kba: false,
    isGov: false,
    selected: ['','',''],
    loading: false,
    submitted: false,
    edit: {
      identity: false,
      business: false,
      kba: false,
    }
  };

  public user:User = {
    _id: '',
    email: '',

    fullName: '',
    firstName: '',
    initials: '',
    lastName: '',
    suffix: '',

    departmentID: '',
    agencyID: '',
    officeID: '',
    businessName: '',

    workPhone: '',
    personalPhone: '',
    carrier: '',

    kbaAnswerList: [],

    OTPPreference: 'email',
    emailNotification: false,
    accountClaimed: true
  };

  private cache = {
    identity: {
      firstName: this.user.firstName,
      initials: this.user.initials,
      lastName: this.user.lastName,
      suffix: this.user.suffix,
      personalPhone: this.user.personalPhone,
      carrier: this.user.carrier,
      OTPPreference: this.user.OTPPreference,
      emailNotification: this.user.emailNotification,
    },

    organization: {
      departmentID: this.user.departmentID,
      agencyID: this.user.agencyID,
      officeID: this.user.officeID,
      workPhone: this.user.workPhone,
    },

    kba: {
      kbaAnswerList: this.user.kbaAnswerList,
    }
  };

  public alerts = {
    identity: {
      type: 'error',
      message: '',
      show: false
    },

    business: {
      type: 'error',
      message: '',
      show: false
    },

    kba: {
      type: 'error',
      message: '',
      show: false
    },

    deactivate: {
      type: 'error',
      message: '',
      show: false
    },
  };

  private selected = [];
  private questions = [];

  // Organization Names
  private hierarchy = {
    department: '',
    agency: '',
    office: '',
    aac: ''
  };

  private entity = {
    name: '',
    cageCode: '',
    duns: '',
    address: '',
  };

  private $entity = new FormControl('');

  public detailsForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private builder: FormBuilder,
    private differs: KeyValueDiffers,
    private _entity: EntityService,
    private _fh: FHService,
    private _iam: IAMService) {
      this.differ = differs.find({}).create(null);

      this.api.entity = _entity;
      this.api.fh = _fh;
      this.api.iam = _iam.iam;
    }

  ngOnInit() {
    this.initUser(() => {
      this.initForm();
      this.syncCache();
    });
  }

  ngOnDestroy() {
    // Unsubscribe all subscriptions
    Object.keys(this.subscriptions).map(key => {
      if(this.subscriptions[key]) {
        this.subscriptions[key].unsubscribe();
      }
    });
  }

  ngAfterViewInit() {
    this.subscriptions['queryParams'] = this.route.queryParams.subscribe(qparams => {
      if(qparams['edit']) {
        if(this[`${qparams['edit']}Editor`]) {
          this[`${qparams['edit']}Editor`].showInputView = true;
        }
      }
    });
  }

  ngDoCheck() {
    let changes = this.differ.diff(this.user),
        key;

    if(changes) {
      changes.forEachChangedItem((diff) => {
        if(this.detailsForm && this.detailsForm.get(diff.key)) {
          key = diff.key.toString().match(/(middleName|initials)/) ? 'initials' : diff.key;

          if(key.match(/(department|agency|office)/) && isNumber(diff.currentValue) && !diff.currentValue) {
            return;
          }

          this.detailsForm.get(key).setValue(diff.currentValue);
          this.user[key] = diff.currentValue;
        }
      });
    }
  }

  syncCache() {
    this.cache = {
      identity: {
        firstName: this.user.firstName,
        initials: this.user.initials,
        lastName: this.user.lastName,
        suffix: this.user.suffix,
        personalPhone: this.user.personalPhone,
        carrier: this.user.carrier,
        OTPPreference: this.user.OTPPreference,
        emailNotification: this.user.emailNotification
      },

      organization: {
        departmentID: this.user.departmentID,
        agencyID: this.user.agencyID,
        officeID: this.user.officeID,
        workPhone: this.user.workPhone
      },

      kba: {
        kbaAnswerList: this.user.kbaAnswerList
      }
    };

    this.updateSelectedOffice();
  }

  restoreCache() {
    this.user = merge({},
      this.user,
      this.cache.identity,
      this.cache.organization,
      this.cache.kba,
    );

    this.updateSelectedOffice();
  }

  updateSelectedOffice() {
    if(ENV && ENV == 'test') {
      return;
    }

    if(this.states.isGov) {
      this.selected = [this.user.officeID || this.user.agencyID || this.user.departmentID];

       this.subscriptions['fh'] = this.api.fh
        .getOrganizationById(this.selected)
        .subscribe(data => {
          this.setOrganizationNames(data);
        });
    } else {
      const control = this.detailsForm.get('businessName');

      if(control.value) {
        this.subscriptions['entity'] = this.api.entity
        .findByCageCode(control.value)
        .subscribe(entity => {
          this.entity.name = entity.legalBusinessName;
          this.entity.cageCode = entity.cageCode;
          this.entity.duns = entity.duns;
          this.entity.address = entity.address;

          this.$entity.patchValue(entity.cageCode);
          this.$entity.disable();
        });
      }
    }
  }

  handleAction(event, type) {
    if(event.event == 'formActionSave') {
      this.save(type);
    } else {
      this.restoreCache();
    }
  }

  initForm() {
    let orgID = (this.user.officeID || this.user.agencyID || this.user.departmentID || '').toString();

    this.selected = [orgID];

    this.detailsForm = this.builder.group({
      firstName:     [this.user.firstName, Validators.required],
      initials:      [this.user.initials],
      middleName:    [this.user.initials],
      lastName:      [this.user.lastName, Validators.required],
      suffix:        [this.user.suffix],
      personalPhone: [this.user.personalPhone],
      carrier:       [this.user.carrier, this.user.personalPhone ? Validators.required : null],

      workPhone:     [this.user.workPhone],
      officeID:      [orgID],
      businessName:  [this.user.businessName],

      kbaAnswerList: this.builder.array(
        this.user.kbaAnswerList.length ? [
          this.initKBAGroup(0),
          this.initKBAGroup(1),
          this.initKBAGroup(2)
        ] : []
      ),

      OTPPreference:     [this.user.OTPPreference],
      emailNotification: [this.user.emailNotification]
    });

    this.subscriptions['personalPhone'] = this.detailsForm.get('personalPhone').valueChanges.subscribe(value => {
        const control = this.detailsForm.get('carrier'),
              validation = value ? [Validators.required] : null;

        control.setValidators(validation);
        control.updateValueAndValidity();
    });

    if(this.api.iam.isDebug() && !this.api.iam.getParam('gov')) {
      orgID = '';
    }

    this.states.isGov = orgID.length ? true : false;

    if(!this.states.isGov) {
      if(this.user.businessName) {
        this.updateSelectedOffice();
      } else {
        this.subscriptions['entity'] = this.$entity.valueChanges.subscribe(entity => {
          this.detailsForm.get('businessName').setValue(entity.key);
        });
      }
    }
  }

  loadUser(cb) {
    this.api.iam.checkSession(user => {
      user.workPhone = this.sanitizePhone(user.workPhone);
      user.workPhone = (user.workPhone.length < 11 ? '1' : '' ) + user.workPhone;
      user.personalphone = this.sanitizePhone(user.personalPhone, false);
      user.businessName = (user.businessName || '').trim();

      this.user = merge({
        middleName: user.initials,
      }, this.user, user);

      cb();
    }, () => {
      this.router.navigate(['/signin']);
    });
  }

  loadKBA(cb) {
    function processKBAQuestions(data) {
      let selected,
          intAnswer;

      // Prepopulate kbaAnswerList
      for(intAnswer = 0; intAnswer < data.selected.length; intAnswer++) {
        this.user.kbaAnswerList.push({ questionId: 0, answer: this.repeater(' ', 8) });
      }

      // Set Selected Answers
      this.user.kbaAnswerList = this.user.kbaAnswerList.map((answer, intAnswer) => {
        selected = (data.selected[intAnswer] || -1);

        answer.questionId = selected;
        this.states.selected[intAnswer] = selected;

        return answer;
      });

      // Set question mapping of questionID => index
      this.store.questions = data.questions;
      this.store.questions = this.store.questions.map((question, intQuestion) => {
        // Create reverse lookup while remapping
        this.store.indexes[question.id] = intQuestion;
        question['disabled'] = false;
        return question;
      });

      this.initQuestions(data);

      cb();
    }

    function cancelKBAQuestions(error) {
      cb();
    }

    this.api.iam.kba.questions(
      processKBAQuestions.bind(this),
      cancelKBAQuestions.bind(this)
    );
  }

  initUser(cb) {
    let fn,
        getSessionUser = ((promise) => {
          this.loadUser(() => {
            this.loadKBA(() => {
              promise(this.user);
            });
          });
        }),

        getMockUser = (promise => {
          let intQuestion;

          this.api.iam.user.get(user => {
            this.user = user;

            if(ENV && ENV == 'test') {
              delete this.user['departmentID'];
              delete this.user['agencyID'];
              delete this.user['officeID'];
            }

            for(intQuestion in this.user.kbaAnswerList) {
              this.questions.push(this.store.questions);
            }

            this.store.questions = this.store.questions.map((question, intQuestion) => {
              // Create reverse lookup while remapping
              this.store.indexes[question.id] = intQuestion;
              question['disabled'] = false;
              return question;
            });

            this.initQuestions();

            promise(this.user);
          })
        });

    fn = this.api.iam.isDebug() ? getMockUser : getSessionUser;

    fn((userData) => {
      this.user = merge({}, this.user, userData);
      this.user.workPhone = this.sanitizePhone(this.user.workPhone, true);
      this.user.personalPhone = this.sanitizePhone(this.user.personalPhone, false);
      cb();
    });
  }

  initQuestions(data?:any) {
    let questions,
        intQuestion,
        intAnswer;

    data = data || {
      selected: this.api.iam.isDebug() ? [1, 3, 5] : []
    };

    for(intQuestion in this.user.kbaAnswerList) {
      intQuestion = parseInt(intQuestion);

      questions = cloneDeep(this.store.questions).map((question, index) => {
        intAnswer = indexOf(data.selected, question.id);
        // Update disabled state
        question.disabled = (intAnswer > -1) && (intAnswer !== intQuestion);

        return question;
      });

      this.questions.push(questions);
    }
  }

  initKBAGroup($index) {
    let kbaAnswer = this.user.kbaAnswerList[$index];

    return this.builder.group({
      questionId: [kbaAnswer.questionId, Validators.required],
      answer:     [kbaAnswer.answer]
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

  errors(controlName: string) {
    const control = this.detailsForm.get(controlName);
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

  get phone():string {
    return this.sanitizePhone(this.user.workPhone)
      .replace(/([0-9]{1})([0-9]{3})([0-9]{3})([0-9]{4})/g, '$1+($2)$3-$4');;
  }

  get personalPhone(): string {
    return this.sanitizePhone(this.detailsForm.get('personalPhone').value, false)
      .replace(/([0-9]{3})([0-9]{3})([0-9]{4})/g, '($1)$2-$3');
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

  updatePhoneNumber(phoneNumber) {
    this.user.workPhone = phoneNumber;
  }

  setOrganizationNames(data) {
    const organization = data['_embedded'][0]['org'];

    this.hierarchy.department = (organization.l1Name || '');
    this.hierarchy.agency = (organization.l2Name || '');
    this.hierarchy.office = (organization.l3Name || '');

    this.hierarchy.aac = (organization.code || '');
  }

  resetHierarchy() {
    this.store.levels.forEach(level => {
      this.user[`${level}ID`] = 0;
      this.hierarchy[level] = '';
    });

    this.hierarchy.aac = '';
  }

  setHierarchy(hierarchy: { label: string, value: number }[]) {
    let organization;

    this.resetHierarchy();

    this.store.levels.forEach((level, intLevel) => {
      organization = hierarchy[intLevel];

      if(organization) {
        this.user[`${level}ID`] = organization.value;
        this.hierarchy[level]= hierarchy[intLevel].label;
      }
    });

    this.detailsForm.get('officeID').setValue(
       this.user.officeID || this.user.agencyID || this.user.departmentID
    );

    this.selected = [this.detailsForm.get('officeID')];
  }

  setAAC(organization) {
    this.hierarchy.aac = organization.code;
  }

  get name():string {
    return [
      this.user.firstName || '',
      this.user.initials || '',
      this.user.lastName || '',
      this.user.suffix || '',
    ].join(' ').replace(/\s+/g, ' ');
  }

  /**
   * KBA
   */
  getHashedAnswer(answer) {
    return (answer.length ? answer : this.repeater(' ', 8)).replace(/./g, '&bull;');
  }

  question(questionID) {
    const questions = this.store.questions,
          mappings = this.store.indexes;

    return (questions[mappings[questionID]] || { question: ''}).question || '';
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
    this.dismiss('deactivate');

    this.api.iam.user.deactivate(this.user.email, () => {
      cb();
    }, error => {
      this.reconfirmModal.closeModal();
      this.alert('deactivate', error.message);
    });
  }

  deactivate() {
    this.deactivateAccount(() => {
      // Close reconfirm prompt
      this.reconfirmModal.closeModal();
      // Sign user out
      this.api.iam.logout();
      // Redirect to login
      this.router
        .navigate(['/signin'])
        .then(() => {
          window.location.reload();
        });
    });
  }

  /**
   * Alerts
   */
  dismiss(key: string) {
    this.alerts[key].show = false;
    this.alerts[key].message = '';
  }

  alert(key: string, message?: string, type: string = 'error') {
    this.alerts[key].type = type || 'error';
    this.alerts[key].message = message || '';
    this.alerts[key].show = true;
  }

  /**
   * Editables
   */
  isValid(keys: Array<String>) {
    let form = this.detailsForm,
        entries = this.kbaEntries.toArray(),
        valid = true,
        key,
        intKey,
        intArrayKey;

    for(intKey = 0; intKey < entries.length; intKey++) {
      entries[intKey].updateState(true);
    }

    for(intKey = 0; intKey < keys.length; intKey++) {
      key = keys[intKey];

      if(form.get(key)) {
        if(key !== 'kbaAnswerList') {
          form.get(key).markAsDirty();
        }

        if(form.get(key).invalid) {
          valid = false;
          return valid
        }
      }
    }

    return valid;
  }

  saveGroup(keys: Array<String>, $success, $error) {
    let form = this.detailsForm,
        userData = {
          fullName: this.name
        },

        key,
        controlValue,
        intKey;

    $success = $success || (() => {});
    $error = $error || (() => {});

    for(intKey = 0; intKey < keys.length; intKey++) {
      key = keys[intKey];
      controlValue = form.get(key) ? form.get(key).value : this.user[key];

      if(controlValue.toString().length || key.match(/^(initials|suffix)$/)) {
        userData[key] = controlValue;
      }

      switch(key) {
        case 'initials':
          userData[key] = userData[key].length ? userData[key] : null;
          break;

        case 'workPhone':
          userData[key] = this.user.workPhone;
          break;

        case 'departmentID':
        case 'agencyID':
          userData[key] = this.user[key];
          break;

        case 'kbaAnswerList':
          if(form.get(key).dirty) {
            userData[key] = controlValue.map((item, intItem) => {
              item.answer = item.answer.trim();
              this.user.kbaAnswerList[intItem] = item;

              return item;
            });

            this.api.iam.kba.update(userData[key], (user) => {
              $success(user);
            }, (error) => {
              $error(error);
            });
          } else {
            $success();
          }

          return;
      }
    }

    this.api.iam.user.update(userData, (user) => {
      $success(user);
    }, (error) => {
      $error(error);
    });
  }

  save(groupKey) {
    let form = this.detailsForm,
        mappings = {
          'identity': 'firstName|initials|lastName|suffix|personalPhone|carrier|OTPPreference|emailNotification',
          'business': 'departmentID|agencyID|officeID|businessName|workPhone',
          'kba': 'kbaAnswerList'
        },

        keys = mappings[groupKey].split('|'),
        valid = this.isValid(keys);

    this.dismiss(groupKey);
    this.states.submitted = true;

    if(this.agencyPicker) {
      this.agencyPicker.setOrganizationFromBrowse();
    }

    if(valid) {
      this.states.loading = true;

      this.saveGroup(keys, () => {
        this.states.edit[groupKey] = false;
        this.states.loading = false;

        this.syncCache();

        // Trick Header to Update State
        this.router.navigate(['/profile'], { queryParamsHandling: 'merge' });
      }, (error) => {
        this.states.edit[groupKey] = true;
        this.states.loading = false;
        this.alert(groupKey, error.message);
      });
    } else {
      this.states.edit[groupKey] = true;
    }
  }
};