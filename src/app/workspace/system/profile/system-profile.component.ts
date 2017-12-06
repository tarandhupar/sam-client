import { merge } from 'lodash';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/of';

import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { FHService, IAMService, PeoplePickerService } from 'api-kit';
import { User } from 'api-kit/iam/api/core/user';

import { Validators as $Validators } from 'app-utils/validators';
import { System, POC } from 'api-kit/iam/intefaces';

@Component({
  templateUrl: './system-profile.component.html',
  providers: [
    FHService,
    IAMService,
    PeoplePickerService,
  ]
})
export class SystemProfileComponent {
  @ViewChild('confirmModal') confirmModal;
  @ViewChild('reconfirmModal') reconfirmModal;
  @ViewChild('picker') picker;

  private api = {
    fh: null,
    iam: null,
    picker: null,
  };

  private store = {
    title: 'Profile (Summary)',
    messages: {
      required: 'This field is required',
      email: 'Enter a valid email address',
    },

    systemCount: 1,
    search: {
      duns: '',
      users: ''
    },

    organization: {
      department: '',
      agency: '',
      office: ''
    },

    picker: {
      placeholder: 'Search users',
      keyValueConfig: {
        keyProperty:     'mail',
        valueProperty:   'commonName',
        subheadProperty: 'mail'
      }
    },
  };

  public states = {
    gov: true,
    system: false,
    cancel: '/workspace',
    deactivate: '/workspace',
    submitted: false,
    edit: false,
    loading: false,
    sections: {
      system: false,
      organization: false
    },

    alert: {
      type: 'success',
      message: '',
      show: false
    }
  };

  public detailsForm: FormGroup;
  public user = {
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


  public system: System = {
    _id: '',
    email: '',
    systemName: '',
    systemType: '',
    comments: '',

    department: '',
    duns: '',
    businessName: '',
    businessAddress: '',

    ipAddress: '',
    primaryOwnerName: '',
    primaryOwnerEmail: '',

    pointOfContact: []
  };

  private pocs = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private builder: FormBuilder,
    private _fh: FHService,
    private _iam: IAMService,
    private _picker: PeoplePickerService) {
    this.api.iam = _iam.iam;
    this.api.fh = _fh;
    this.api.picker = _picker;
  }

  ngOnInit() {
    this.api.iam.checkSession((user) => {
      this.user = merge({}, this.user, user);
      this.states.gov = user.department ? true : false;

      this.api.iam.system.account.get((accounts) => {
        if(accounts.length) {
          this.states.cancel = '/workspace/system';

          if(accounts.length > 1) {
            this.states.deactivate = '/workspace/system';
          }
        }
      });

      this.store['observer'] = this.route.params.subscribe(params => {
         this.system._id = params['id'];

         if(this.system._id) {
           this.api.iam.system.account.get(this.system._id, system => {
             system.pointOfContact = system.pointOfContact || [];

             this.system = merge({}, this.system, system);
             this.states.edit = true;
             this.initForm();
           }, () => {
             // Error handling for system account GET
             this.router.navigate([this.states.cancel]);
           });
         } else {
           this.initForm();
         }
      });
    }, () => {
      this.router.navigate(['/signin']);
    });
  }

  ngOnDestroy() {
    if(this.store['observer']) {
      this.store['observer'].unsubscribe();
    }
  }

  initForm() {
    let initFormGroup,
        initSystemAccountData,
        requests;

    initFormGroup = (() => {
      if(ENV && ENV == 'test') {
        this.states.gov = false;
      }

      this.detailsForm = this.builder.group({
        _id:               [this.system._id, [Validators.required]],
        email:             [this.system.email, [Validators.required, $Validators.email]],
        systemName:        [this.system.systemName, [Validators.required]],
        systemType:        [this.system.systemType],
        comments:          [this.system.comments],

        department:        [this.system.department],
        duns:              [this.system.duns],

        businessName:      [this.system.businessName],
        businessAddress:   [this.system.businessAddress],

        ipAddress:         [this.system.ipAddress],
        primaryOwnerName:  [this.system.primaryOwnerName, [Validators.required]],
        primaryOwnerEmail: [this.system.primaryOwnerEmail, [Validators.required]],

        pointOfContact:    this.builder.array(this.initPointOfContact(this.system.pointOfContact || []))
      });

      requests = this.system.pointOfContact.map(userID =>
        this.api.picker
          .getPerson(userID, {})
          .catch(response => Observable.of({
            user: {
              _id: userID,
              email: userID,
              firstName: userID,
            }
          }))
      );

      if(requests.length) {
        Observable
          .forkJoin(requests)
          .subscribe(results => {
            this.pocs = results.map(result => new User(result['user']));
          });
      }

      if(this.states.gov && this.system.department.toString().length) {
        this.api.fh
          .getOrganizationById(this.system.department)
          .subscribe(data => {
            const organization = data['_embedded'][0]['org'];

            this.store.organization.department = (organization.l1Name || '');
            this.store.organization.agency = (organization.l2Name || '');
            this.store.organization.office = (organization.l3Name || '');
          });
      }
    });

    initSystemAccountData = (() => {
      const isGov = (this.user.officeID || this.user.agencyID || this.user.departmentID || 0) ? true : false,
            type =  isGov ? 'Gov' : 'Non-Gov';

      let override = {
        systemType: type
      };

      this.states.gov = isGov;

      if(isGov) {
        // New System Accounts Only
        if(!this.states.edit) {
          override['department'] = this.user.departmentID;
        } else {
          // Fallback if Department is NULL and is government
          if(!this.system.department) {
            override['department'] = '';
          }
        }
      }

      this.system = merge({}, this.system, override);
    });

    initSystemAccountData();
    initFormGroup();
  }

  initPointOfContact(items: POC[]) {
    return items.map(item => new FormControl(item));
  }

  setControlValue(key, value) {
    this.system[key] = value;
    this.detailsForm.controls[key].setValue(value);
  }

  $errors(controlName) {
    const controls = this.detailsForm.controls,
          errors = controls[controlName].errors || {},
          mappings = Object.keys(errors),
          isError = (this.states.submitted && mappings.length),
          message = isError ? this.store.messages[mappings[0]] : '';
    return message;
  }

  isEditable(key) {
    return !this.states.edit || (this.states.sections[key] || false)
  }

  get organization(): string {
    const organization = this.store.organization;
    return this.states.gov ? `${organization.department}/${organization.office}` : '';
  }

  setOrganization(organization) {
    this.system.department = organization.value;
    this.detailsForm.controls['department'].setValue(organization.value);
    this.store.organization.office = organization.name;
  }

  alert(type: string, message: string) {
    this.states.alert.message = (message || '');
    this.states.alert.type = (type || 'success');

    this.states.alert.show = message && message.length ? true : false;
  }

  updateSystemState(data: System) {
    merge(this.system, data);
  }

  /**
   * Point of Contact
   */
  addPOC(user) {
    const controls = <FormArray>this.detailsForm.controls['pointOfContact'];

    user = new User(user);

    this.pocs.push(user);
    this.system.pointOfContact.push(user._id);
    controls.push(new FormControl(user._id));

    this.picker.inputValue = '';

    if(this.states.edit) {
      this.save('poc');
    }
  }

  removePOC($index) {
    const controls = <FormArray>this.detailsForm.controls['pointOfContact'];

    this.pocs.splice($index, 1);
    this.system.pointOfContact.splice($index, 1);
    controls.removeAt($index);

    if(this.states.edit) {
      this.save('poc');
    }
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
    const submitButton = document.querySelector('button.usa-modal-content-submit-btn');

    this.states.loading = true;

    if(submitButton) {
      submitButton.setAttribute('disabled', 'disabled');
      submitButton.className += ' usa-button-disabled';
    }

    this.api.iam.system.account.deactivate(this.system._id, () => {
      this.states.loading = false;

      if(submitButton) {
        submitButton.removeAttribute('disabled');
        submitButton.className = submitButton.className.replace(/ usa-button-disabled/g, '');
      }

      this.reconfirmModal.closeModal();

      // Redirect to either /workspace or /workspace/system (accounts.length > 1)
      this.router.navigate([this.states.deactivate]);
    }, (error) => {
      this.alert('error', error.message);

      this.reconfirmModal.closeModal();
      this.states.loading = false;
    });
  }

  /**
   * Event Handlers
   */
  edit(key) {
    this.states.sections[key] = true;
  }

  cancel(key) {
    this.states.sections[key] = false;
  }

  save(key) {
    this.states.sections[key] = true;
    this.states.loading = true;

    this.updateSystemState(this.detailsForm.value);

    this.api.iam.system.account.update(this.system, () => {
      this.states.sections[key] = false;
      this.states.loading = false;
    }, () => {
      this.states.loading = false;
    });
  }

  create() {
    this.states.submitted = true;
    this.states.alert.show = false;

    if(this.detailsForm.valid) {
      this.states.loading = true;

      this.updateSystemState(this.detailsForm.value);

      this.api.iam.system.account.create(this.system, (account) => {
        this.alert('success', 'The system account was successfully created!');
        this.router.navigate(['workspace/system/profile', this.system._id], { preserveQueryParams: true });
        this.states.loading = false;
      }, (error) => {
        this.alert('error', error.message);
        this.states.loading = false;
      });
    }
  }
}
