import { Component, Input, OnInit, OnChanges, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { cloneDeep, indexOf, isNumber, merge } from 'lodash';
import { FHService, IAMService } from 'api-kit';

import { User } from '../../user.interface';
import { KBA } from '../../kba.interface';

@Component({
  templateUrl: './user.component.html',
  providers: [
    FHService,
    IAMService
  ]
})
export class UserComponent {
  @ViewChild('confirmModal') confirmModal;
  @ViewChild('reconfirmModal') reconfirmModal;
  @ViewChildren('kba') kbaEntries;

  private api = {
    fh: null,
    iam: null
  };

  private store = {
    levels: ['department', 'agency', 'office'],
    questions: {
      0: ''
    }
  };

  public states = {
    fsd: false,
    kba: false,
    isGov: false,
    loading: false
  };

  private alerts = {
    deactivate: {
      type: 'error',
      message: '',
      show: false
    },

    password: {
      type: 'success',
      message: '',
      show: false
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

    workPhone: '',

    kbaAnswerList: [],

    accountClaimed: true
  };

  private hierarchy = {
    department: '',
    agency:     '',
    office:     '',
    aac: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _fh: FHService,
    private _iam: IAMService) {
      this.api.iam = _iam.iam;
      this.api.fh = _fh;
    }

  ngOnInit() {
    this.store['observer'] = this.route.params.subscribe(params => {
       this.user._id = params['id'];

       this.initUser(() => {
         const orgID = (this.user.officeID || this.user.agencyID || this.user.departmentID || '').toString();

         this.states.isGov = orgID.length ? true : false;

         if(this.states.isGov) {
            this.api.fh
             .getOrganizationById(orgID)
             .subscribe(data => {
               this.setOrganizationNames(data);
             });
         }
       });
    });
  }

  ngOnDestroy() {
    this.store['observer'].unsubscribe();
  }

  loadUser(cb) {
    this.api.iam.fsd.user(this.user._id, (user) => {
      this.user = merge({}, this.user, user, {
        middleName: user.initials
      });

      this.user.workPhone = this.user.workPhone.replace(/[^0-9]/g, '');
      this.user.workPhone = (this.user.workPhone.length < 11 ? '1' : '' ) + this.user.workPhone;

      cb();
    }, () => {
      this.router.navigate(['/fsd']);
    });
  }

  loadKBA() {
    const fnQuestions = ((data) => {
      let question,
          intQuestion;

      for(intQuestion = 0; intQuestion < data.questions.length; intQuestion++) {
        question = data.questions[intQuestion];
        this.store.questions[question.id] = question.question;
      }

      this.api.iam.fsd.kba(this.user._id, (answers) => {
        this.user.kbaAnswerList = answers;
      });
    });

    this.api.iam.kba.questions(fnQuestions, fnQuestions);
  }

  initUser(cb) {
    this.loadUser((cb) => {
      this.loadKBA();
    });
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

  get phone(): string {
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
  }

  setAAC(organization) {
    this.hierarchy.aac = organization.code;
  }

  get name():string {
    return [
      this.user.firstName || '',
      this.user.initials || '',
      this.user.lastName || ''
    ].join(' ').replace(/\s+/g, ' ');
  }

  /**
   * KBA
   */
  getQuestion(questionID) {
    return this.store.questions[questionID];
  }

  getHashedAnswer(answer) {
    return (answer.length ? answer : this.repeater(' ', 8)).replace(/./g, '&bull;');
  }

  /**
   * Alerts
   */
  dismiss(key: string) {
    this.alerts[key].show = false;
    this.alerts[key].message = '';
  }

  alert(key: string, type?: string, message?: string) {
    this.alerts[key].type = type || 'success';
    this.alerts[key].message = message || '';
    this.alerts[key].show = true;
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

  deactivate() {
    this.api.iam.fsd.deactivate(this.user._id, (response) => {
      this.reconfirmModal.closeModal();
      this.router.navigate(['/fsd/users']);
    }, (error) => {
      this.reconfirmModal.closeModal();
      this.alert('deactivate', 'error', error.message);
    });
  }

  /**
   * Password Reset
   */
  sendPasswordReset() {
    this.api.iam.fsd.reset.init(this.user._id, (response) => {
      this.alert('password', 'success', response.message);
    }, (error) => {
      this.alert('password', 'error', error.message);
    });
  }
};
