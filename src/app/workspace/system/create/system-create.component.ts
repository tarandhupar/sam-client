import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { isArray, merge } from 'lodash';

import { SamActionsDropdownComponent } from 'sam-ui-kit/components/actions';
import { SamTabsComponent, SamTabComponent } from 'sam-ui-kit/components/tabs';
import { IAMService } from 'api-kit';

import { Validators as $Validators } from 'authentication/shared/validators';
import { CWSApplication, User } from 'api-kit/iam/interfaces';

@Component({
  templateUrl: './system-create.component.html',
  providers: [
    IAMService,
  ],
})
export class SystemCreateComponent {
  @ViewChild(SamActionsDropdownComponent) actions: SamActionsDropdownComponent;
  @ViewChild(SamTabsComponent) tabs: SamTabsComponent;

  private subscriptions = {};
  public store = {
    section: 'Workspace',
    title: 'New System Account',
    messages: {
      requester: 'Complete and submit this form to request a new system account All fields are required for security review to establish your account, unless morked as optional.',
      reviewer:  'Review the follow details ond select opprove or reject.',
    },

    nav: {
      label: ' ',
      children: [
        { route: 'system-information', iconClass: 'pending', label: 'System Information' },
        { route: 'organization',       iconClass: 'pending', label: 'Organization' },
        { route: 'permissions',        iconClass: 'pending', label: 'Permissions' },
        { route: 'security',           iconClass: 'pending', label: 'Security' },
        { route: 'authorization',      iconClass: 'pending', label: 'Authorization' },
      ],
    },

    fields: [
      ('systemAccountName|interfacingSystemVersion|systemDescriptionAndFunction').split('|'),
      ('systemAdmins|systemManagers').split('|'),
      ('contractOpportunities|contractData|entityInformation|FIPS199Categorization').split('|'),
      ('ipAddress|typeOfConnection|physicalLocation|securityOfficerName|securityOfficerEmail').split('|'),
      ('uploadAto').split('|'),
    ],

    actions: [
      { label: 'Status', name: 'action-status', callback: this.redirectToStatus, icon: 'fa fa-check-circle' },
      { label: 'Delete', name: 'action-delete', callback: this.delete, icon: 'fa fa-times' },
    ],

    errors: '',
  };

  public user: User;
  private application: CWSApplication = {
    uid: '',
    systemAccountName: '',
    interfacingSystemVersion: '',
    systemDescriptionAndFunction: '',
    departmentOrgId: '',
    agencyOrgId: '',
    officeOrgId: '',
    systemAdmins: [],
    systemManagers: [],
    contractOpportunities: [],
    contractData: [],
    entityInformation: [],
    FIPS199Categorization: '',
    ipAddress: '',
    typeOfConnection: '',
    physicalLocation: '',
    securityOfficialName: '',
    securityOfficialEmail: '',
    uploadAto: '',
    authorizationConfirmation: false,
    authorizingOfficialName: '',
    authorizationDate: null,
    submittedBy: '',
    applicationStatus: 'Draft',
    securityApprover: '',
    securityApproved_Date: null,
    dateOfRejection: null,
    rejectedBy: '',
    rejectionReason: '',
    statuses: [0,0,0,0,0],
  };

  public form: FormGroup;
  public states = {
    tab: 0,
    section: 0,
    edit: true,
    review: false,
  };

  constructor(private router: Router, private route: ActivatedRoute, private builder: FormBuilder, private api: IAMService) {}

  ngOnInit() {
    this.api.iam.user.get(user => {
      this.user = user;

      if(!user.gov) {
        this.router.navigate(['/workspace/system']);
      } else {
        this.application.authorizingOfficialName = user.fullName;
      }
    });

    this.subscriptions['params'] = this.route.params.subscribe(params => {
      if(params['id']) {
        this.application.uid = params['id'];

        this.api.iam.cws.application.get(this.application.uid, application => {
          this.application = merge({}, this.application, application);
          this.initForm();
          this.updateStatus();
        });
      } else {
        this.initForm();
      }
    });

    this.subscriptions['qparams'] = this.route.queryParams.subscribe(qparams => {
      if(qparams['section']) {
        this.states.section = qparams['section'];
      }
    });
  }

  ngOnDestroy() {
    // Unsubscribe all subscriptions
    Object.keys(this.subscriptions).map(key => {
      this.subscriptions[key].unsubscribe();
    });
  }

  initForm() {
    const application = this.application;

    this.form = this.builder.group({
      'system-information': this.builder.group({
        systemAccountName: [application.systemAccountName, [Validators.required]],
        interfacingSystemVersion: [application.interfacingSystemVersion, [Validators.required]],
        systemDescriptionAndFunction: [application.systemDescriptionAndFunction, [Validators.required]],
      }),

      'organization': this.builder.group({
        departmentOrgId: [application.departmentOrgId, [Validators.required]],
        agencyOrgId: [application.agencyOrgId, [Validators.required]],
        officeOrgId: [application.officeOrgId],
        systemAdmins: [application.systemAdmins],
        systemManagers: [application.systemManagers],
      }),

      'permissions': this.builder.group({
        contractOpportunities: [application.contractOpportunities],
        contractData: [application.contractData],
        entityInformation: [application.entityInformation],
        FIPS199Categorization: [application.FIPS199Categorization, [Validators.required]],
      }),

      'security': this.builder.group({
        ipAddress: [application.ipAddress],
        typeOfConnection: [application.typeOfConnection, [Validators.required]],
        physicalLocation: [application.physicalLocation, [Validators.required]],
        securityOfficialName: [application.securityOfficialName, [Validators.required]],
        securityOfficialEmail: [application.securityOfficialEmail, [Validators.required, $Validators.email]],
      }),

      'authorization': this.builder.group({
        uploadAto: [application.uploadAto],
        authorizationConfirmation: [application.authorizationConfirmation, [Validators.required]],
        authorizingOfficialName: [application.authorizingOfficialName],
        authorizationDate: [''],
      }),
    });
  }

  updateStatus() {
    let form = this.form,
        sections = this.store.nav.children,
        statuses = this.application.statuses,
        section,
        intSection;

    for(intSection = 0; intSection < sections.length; intSection++) {
      section = sections[intSection].route;

      this.store.nav.children[intSection].iconClass = 'pending';

      // Verify submitted state
      if(statuses[intSection]) {
        this.store.nav.children[intSection].iconClass = form.get(section).valid ? 'completed' : 'error';
      }
    }
  }

  get isNew(): boolean {
    return (this.application.uid) ? false : true;
  }

  get seed(): number {
    return Math.floor(Math.random() * 5);
  }

  get title(): string {
    return this.store.title;
  }

  get message(): string {
    return this.store.messages.requester;
  }

  get status(): string {
    return this.application.applicationStatus;
  }

  get active(): string {
    return this.store.nav[this.states.section];
  }

  get errors(): string[] {
    let errors = [],
        intErrors = 0;

    this.store.nav.children.map(item => {
      if(item.iconClass == 'error') {
        intErrors++;
      }
    });

    errors.push(`You must resolve ${intErrors} ${ intErrors > 1 ? 'issues' : 'issue'} to submit this request`);

    return errors;
  }

  get data(): CWSApplication {
    let form = this.form;

    return merge({}, this.application,
      form.get('system-information').value,
      form.get('organization').value,
      form.get('permissions').value,
      form.get('security').value,
      form.get('authorization').value
    );
  }

  onNavigate(route) {
    let item,
        index;

    for(index = 0; index < this.store.nav.children.length; index++) {
      item = this.store.nav.children[index];
      if(item.route == route) {
        this.states.section = index;
        this.states.review = false;
        this.states.edit = true;
        return;
      }
    }

    this.states.review = false;
    this.states.edit = true;
  }

  onTab(tab: SamTabComponent) {
    switch(tab.title) {
      case 'Submit':
      case 'Approve':
      case 'Reject':
        this[tab.title.toLowerCase()]();
        break;

      case 'Edit':
        this.states.edit = true;
        //this.states.review = false;
        break;

      case 'Review':
        //this.states.edit = false;
        this.states.review = true;
        break;
    }
  }

  setError(message: string = '') {
    this.store.errors = message;
  }

  resetErrors() {
    this.store.errors = '';
  }

  redirectToStatus(application: CWSApplication) {
    this.router.navigate(['/workspace/system/status/', application.uid]);
  }

  edit(route: string) {
    this.onNavigate(route);
  }

  cancel() {
    this.router.navigate(['/workspace/system']);
  }

  review() {
    // this.states.edit = false;
    this.states.review = true;
  }

  previous() {
    this.states.section--;
  }

  next() {
    this.resetErrors();

    if(typeof this.application.statuses === 'object') {
      this.application.statuses[this.states.section] = 1;
      this.updateStatus();
    }

    this.save(() => {
      this.states.section++;
    });
  }

  save(cb: Function = () => {}) {
    const fn = this.isNew ? this.api.iam.cws.application.create : this.api.iam.cws.application.update;
    let args: (string|number|Function|CWSApplication)[] = this.isNew ? [] : [this.application.uid],
        section = this.store.nav.children[this.states.section].route;

    args.push(this.data, application => {
      this.form.get(section).patchValue(application);

      if(this.isNew) {
        this.router.navigate(['/workspace/system/new', application.uid], {
          queryParams: {
            section: this.states.section + 1
          }
        });
      } else {
        cb();
      }
    }, error => {
      this.setError(error.message);
    });

    fn.apply(this.api.iam.cws, args);
  }

  submit() {
    let form = this.form,
        application = this.application;

    this.resetErrors();

    if(typeof application.statuses === 'object') {
      application.statuses = application.statuses.map(status => 1);
    }

    this.updateStatus();

    if(form.valid) {
      application.applicationStatus = 'Pending Approval';

      this.api.iam.cws.application.update(application.uid, this.data, this.redirectToStatus, error => {
        this.setError(error.message)
      });
    } else {
      this.setError(this.errors[0]);
    }
  }

  approve() {
    this.api.iam.cws.application.approve(this.data, this.redirectToStatus, error => {
      this.store.errors = error.message;
    });
  }

  reject() {
    this.api.iam.cws.application.reject(this.data, this.redirectToStatus, error => {
      this.store.errors = error.message;
    });
  }

  delete() {
    this.api.iam.cws.delete(response => {
      this.router.navigate(['/workspace/system']);
    }, error => {
      this.store.errors = error.message;
    });
  }
}
