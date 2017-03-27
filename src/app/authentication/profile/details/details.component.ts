import * as _ from 'lodash';

import { Component, DoCheck, Input, KeyValueDiffers, NgZone, OnInit, OnChanges, QueryList, SimpleChange, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { FHService, IAMService } from 'api-kit';

import { User } from '../../user.interface';
import { KBA } from '../../kba.interface';

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
  @ViewChildren('kba') kbaEntries;

  private differ;
  private api = {
    fh: null,
    iam: null
  };

  private store = {
    title: 'Personal Details',
    questions: [
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
    ],

    indexes: {}
  };

  private states = {
    isGov: false,
    selected: ['','',''],
    loading: false,
    submitted: false,
    editable: {
      identity: false,
      business: false,
      kba: false
    }
  };

  private user:User = {
    _id: '',
    email: '',

    title: '',
    suffix: '',

    fullName: '',
    firstName: '',
    initials: '',
    lastName: '',

    department: '',
    orgID: '',

    workPhone: '',

    kbaAnswerList: [],

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

          this.detailsForm = this.builder.group({
            title:           [this.user.title],

            firstName:       [this.user.firstName, Validators.required],
            initials:        [this.user.initials],
            middleName:      [this.user.initials],
            lastName:        [this.user.lastName, Validators.required],

            suffix:          [this.user.suffix],

            workPhone:       [this.user.workPhone],

            department:      [this.user.department],
            orgID:           [this.user.orgID],

            kbaAnswerList:   this.builder.array(
              this.user.kbaAnswerList.length ? [
                this.initKBAGroup(0),
                this.initKBAGroup(1),
                this.initKBAGroup(2)
              ] : []
            ),
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
    let changes = this.differ.diff(this.user),
        key;

    if(changes) {
      changes.forEachChangedItem((diff) => {
        if(this.detailsForm && this.detailsForm.controls[diff.key]) {
          key = diff.key.toString().search(/(middleName|initials)/) > -1 ? 'initials' : diff.key;
          this.detailsForm.controls[key].setValue(diff.currentValue);
          this.user[key] = diff.currentValue;
        }
      });
    }
  }

  loadUser(cb) {
    this.api.iam.checkSession((user) => {
      this.user = _.merge({}, this.user, user);
      this.user['middleName'] = user.initials;
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
          this.zone.runOutsideAngular(() => {
            this.loadUser(() => {
              this.zone.run(() => {
                this.states.isGov = (_.isUndefined(this.user.department) && String(this.user.department).length > 0);
                this.loadKBA(() => {
                  promise(this.user);
                });
              });
            });
          });
        }).bind(this),

        getMockUser = ((promise) => {
          let intQuestion;

          this.states.isGov = true;
          _.merge(this.user, {
            _id: 'doe.john@gsa.gov',
            email: 'doe.john@gsa.gov',
            suffix: '',
            middleName: 'J',
            firstName: 'John',
            initials: 'J',
            lastName: 'Doe',

            department: 100006688,
            orgID: 100173623,

            workPhone: '12401234568',

            kbaAnswerList: [
              { questionId: 1, answer: this.repeater(' ', 8) },
              { questionId: 3, answer: this.repeater(' ', 8) },
              { questionId: 5, answer: this.repeater(' ', 8) }
            ]
          });

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
        }).bind(this);

    fn = this.api.iam.isDebug() ? getMockUser : getSessionUser;

    fn((userData) => {
      this.user = _.merge({}, this.user, userData);
      this.user.workPhone = this.user.workPhone.replace(/[^0-9]/g, '');
      this.user.workPhone = (this.user.workPhone.length < 11 ? '1' : '' ) + this.user.workPhone;
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

      questions = _.cloneDeep(this.store.questions).map((question, index) => {
        intAnswer = _.indexOf(data.selected, question.id);
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

  get phone():string {
    let phone = this.user.workPhone
      .replace(/[^0-9]/g, '')
      .replace(/([0-9]{1})([0-9]{3})([0-9]{3})([0-9]{4})/g, '$1+($2) $3-$4');

    switch(phone.length) {
      case 14:
        phone = `1+${phone}`;
        break;
    }

    return phone;
  }

  updatePhoneNumber(phoneNumber) {
    this.user.workPhone = phoneNumber;
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

  /**
   * KBA
   */
  getHashedAnswer(answer) {
    return (answer.length ? answer : this.repeater(' ', 8)).replace(/./g, '&bull;');
  }

  question(questionID) {
    const questions = this.store.questions,
          mappings = this.store.indexes;
    return questions[mappings[questionID]].question;
  }

  changeQuestion(questionID, $index) {
    let  items = _.cloneDeep(this.store.questions),
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
      this.questions[intItem] = _.cloneDeep(items);
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
    this.api.iam.user.deactivate(this.user.email, () => {
      cb();
    }, () => {
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
            .then(() => {
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

  isValid(keys: Array<String>) {
    let controls = this.detailsForm.controls,
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

      if(key !== 'kbaAnswerList') {
        controls[key].markAsDirty();
      }

      if(controls[key].invalid) {
        valid = false;
        return valid
      }
    }

    return valid;
  }

  saveGroup(keys: Array<String>, cb) {
    let controls = this.detailsForm.controls,
        userData = {
          fullName: this.name
        },

        key,
        controlValue,
        intKey;

    for(intKey = 0; intKey < keys.length; intKey++) {
      key = keys[intKey];
      controlValue = controls[key].value;

      if(controlValue.toString().length) {
        userData[key] = controlValue;
      }

      switch(key) {
        case 'workPhone':
          userData[key] = this.user.workPhone;
          break;

        case 'kbaAnswerList':
          if(controls[key].dirty) {
            userData[key] = controlValue.map((item, intItem) => {
              item.answer = item.answer.trim();
              this.user.kbaAnswerList[intItem] = item;

              return item;
            });

            this.api.iam.kba.update(userData[key], () => {
              console.log('KBA Q&A successfully saved');
              cb();
            }, () => {
              cb();
            });
          } else {
            cb();
          }

          return;
      }
    }

    this.api.iam.user.update(userData, (data) => {
      cb();
    }, () => {
      cb();
    });
  }

  save(groupKey) {
    let controls = this.detailsForm.controls,
        mappings = {
          'identity': 'title|firstName|initials|lastName|suffix',
          'business': 'department|orgID|workPhone',
          'kba': 'kbaAnswerList'
        },

        keys = mappings[groupKey].split('|'),
        valid = this.isValid(keys);

    this.states.submitted = true;

    if(valid) {
      this.states.loading = true;

      this.zone.runOutsideAngular(() => {
        this.saveGroup(keys, () => {
          this.zone.run(() => {
            this.states.editable[groupKey] = false;
            this.states.loading = false;
          });
        });
      });
    }
  }
};
