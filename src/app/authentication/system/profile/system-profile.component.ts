import { merge } from 'lodash';

import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { FHService, IAMService } from 'api-kit';

import { Validators as $Validators } from '../../shared/validators';
import { User } from '../../user.interface';
import { System, POC } from '../../system.interface';

@Component({
  templateUrl: './system-profile.component.html',
  providers: [
    FHService,
    IAMService
  ]
})
export class SystemProfileComponent {
  @ViewChild('confirmModal') confirmModal;
  @ViewChild('reconfirmModal') reconfirmModal;

  private api = {
    fh: null,
    iam: null
  };

  private store = {
    title: 'Profile (Summary)',
    messages: {
      required: 'This field is required',
      email: 'Enter a valid email address',
    },

    search: {
      duns: '',
      users: ''
    },

    organization: {
      department: '',
      agency: '',
      office: ''
    }
  };

  public states = {
    gov: true,
    system: false,
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

  private detailsForm: FormGroup;
  private user: User = {
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

    workPhone: ''
  };

  private system: System = {
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

  constructor(private router: Router, private route: ActivatedRoute, private builder: FormBuilder, private _fh: FHService, private _iam: IAMService) {
    this.api.iam = _iam.iam;
    this.api.fh = _fh;
  }

  ngOnInit() {
    this.store['observer'] = this.route.params.subscribe(params => {
       this.system._id = params['id'];
    });

    this.api.iam.checkSession((user) => {
      this.user = user;

      this.states.system = user.systemAccount;
      this.states.gov = user.department ? true : false;
      this.states.system ? this.initForm() : this.router.navigateByUrl('/profile');
    }, () => {
      if(!this.api.iam.isDebug()) {
        this.router.navigate(['/signin']);
      } else {
        this.initForm();
        this.states.edit = this.api.iam.getParam('edit');
      }
    });
  }

  ngOnDestroy() {
    this.store['observer'].unsubscribe();
  }

  getSystemAccount($success, $error) {
    if(this.system._id) {
      this.api.iam.system.account.get(this.system._id, $success, $error);
    } else {
      this.api.iam.system.account.get((accounts) => {
        if(accounts.length) {
          $success(accounts[0]);
        } else {
          $error();
        }
      }, $error);
    }
  }

  initForm() {
    let initFormGroup,
        initSystemAccountData;

    initFormGroup = (() => {
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

    initSystemAccountData = ((account: any) => {
      const isGov = (this.user.department || this.user.orgID || '').toString().length > 0,
            type =  isGov ? 'Gov' : 'Non-Gov';

      let override = {
        systemType: type
      };

      this.states.gov = isGov;

      if(isGov) {
        // New System Accounts Only
        if(!account) {
          override['department'] = this.user.department;
        } else {
          // Fallback if Department is NULL and is government
          if(!account.department) {
            override['department'] = '';
          }
        }
      }

      merge(this.system, account, override);
    });

    if(!this.api.iam.isDebug()) {
      this.getSystemAccount((account) => {
        this.states.edit = account ? true : false;
        account ? initSystemAccountData(account) : initSystemAccountData({});

        initFormGroup();
      }, () => {
        initSystemAccountData({});
        initFormGroup();
      });
    } else {
      merge(this.system, {
        _id: 'System101',
        email: this.user.email,
        systemName: 'System 101',
        systemType: 'Gov',
        comments: 'System comments...',
        duns: 'Test Duns',
        businessName: 'John Doe Inc.',
        businessAddress: '1600 Pennsylvania Ave NW, Washington DC 20500',

        primaryOwnerName: [this.user.firstName, this.user.lastName].join(' '),
        primaryOwnerEmail: this.user.email,
        pointOfContact: [
          { firstName: 'Tester', lastName: '#1', email: 'test.user@yahoo.com',   phone: '12223334444' },
          { firstName: 'Tester', lastName: '#2', email: 'test.user@gmail.com',   phone: '15556667777' },
          { firstName: 'Tester', lastName: '#3', email: 'test.user@hotmail.com', phone: '16667778888' }
        ]
      });

      initFormGroup();
    }
  }

  initPointOfContact(items: POC[]) {
    let formItems: FormGroup[] = items.map((item) => {
      return this.builder.group({
        email:     [item.email],
        firstName: [item.firstName],
        lastName:  [item.lastName],
        phone:     [item.phone]
      });
    });

    return formItems;
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
    this.states.alert.show = true;
  }

  updateSystemState(data: System) {
    merge(this.system, data);
  }

  /**
   * Point of Contact
   */
  addPOC() {
     //TODO
  }

  removePOC($index) {
    this.system.pointOfContact.splice($index, 1);
    (<FormArray>this.detailsForm.controls['pointOfContact']).removeAt($index);
    this.save('poc');
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

      // Refresh System Account Profile
      window.location.reload();
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
        this.router.navigate(['/system/profile'], { queryParams: { refresh: 1 } });
        this.states.loading = false;
        this.states.edit = true;
      }, (error) => {
        this.alert('error', error.message);
        this.states.loading = false;
      });
    }
  }
}
