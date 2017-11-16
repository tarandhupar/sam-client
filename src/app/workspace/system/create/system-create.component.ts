import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { extend, isArray, merge, mergeWith } from 'lodash';

import { SamActionsDropdownComponent } from 'sam-ui-elements/src/ui-kit/components/actions';
import { SamTabsComponent, SamTabComponent } from 'sam-ui-elements/src/ui-kit/components/tabs';
import { IAMService } from 'api-kit';

import { Validators as $Validators } from 'authentication/shared/validators';
import { CWSApplication, User } from 'api-kit/iam/interfaces';
import { PageConfig } from 'sam-ui-kit/layout/types';

@Component({
  templateUrl: './system-create.component.html',
})
export class SystemCreateComponent {
  @ViewChild(SamActionsDropdownComponent) actions: SamActionsDropdownComponent;
  @ViewChild(SamTabsComponent) tabs: SamTabsComponent;

  private subscriptions = {};
  public store = {
    section: 'Workspace',
    title: 'New System Account',
    messages: {
      requester: 'Complete and submit this form to request a new system account. All fields are required for security review to establish your account, unless marked as optional.',
      approver:  'Review the following details and approve or reject.',
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
      ('contractOpportunities|contractData|entityInformation|fips199Categorization').split('|'),
      ('ipAddress|typeOfConnection|physicalLocation|securityOfficerName|securityOfficerEmail').split('|'),
      ('uploadAto').split('|'),
    ],

    actions: [
      { label: 'Status', name: 'action-status', callback: this.redirectToStatus.bind(this), icon: 'fa fa-check-circle' },
      { label: 'Delete', name: 'action-delete', callback: this.delete.bind(this), icon: 'fa fa-times' },
    ],

    errors: '',
  };

  private options = {
    page: <PageConfig>{
      badge: {
        attached: 'top right'
      }
    }
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
    fips199Categorization: '',
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
    submitted: false,
    showDetails: false,
  };

  constructor(private router: Router, private route: ActivatedRoute, private builder: FormBuilder, private api: IAMService) {}

  ngOnInit() {
    this.subscriptions['params'] = this.route.params.subscribe(params => {
      if(params['id']) {
        this.application.uid = params['id'];

        this.api.iam.cws.application.get(this.application.uid, application => {
          this.application = merge({}, this.application, application);

          this.initForm();
          this.updateStatus();
        }, () => {
          this.router.navigate(['/workspace/system'], { queryParamsHandling: 'merge' });
        });
      } else {
        this.initForm();
      }
    });

    this.subscriptions['qparams'] = this.route.queryParams.subscribe(qparams => {
      if(qparams['section']) {
        this.states.section = parseInt(qparams['section']);
      }
    });

    this.api.iam.user.get(user => {
      this.user = user;

      // Role Debugging Environoment
      if(this.api.iam.isDebug()) {
        if(this.isPending && this.api.iam.getParam('approver')){
          this.user.systemApprover = true;
        }
      }

      if(!user.gov) {
        this.router.navigate(['/workspace/system']);
      } else {
        this.application.authorizingOfficialName = user.fullName;
      }
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
        fips199Categorization: [application.fips199Categorization, [Validators.required]],
      }),

      'security': this.builder.group({
        ipAddress: [application.ipAddress, [Validators.required]],
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

  titleize(value: string) {
    return value
      .toLowerCase()
      .split(' ')
      .map(word => word.replace(word[0], word[0].toUpperCase()))
      .join(' ');
  }

  get isNew(): boolean {
    return (this.application.uid) ? false : true;
  }

  get isPending(): boolean {
    let status = this.application.applicationStatus;
    return status.match(/(pending)/i) ? true : false;
  }

  get isComplete(): boolean {
    let status = this.application.applicationStatus;
    return status.match(/(approved|rejected)/i) ? true : false;
  }

  get seed(): number {
    return Math.floor(Math.random() * 5);
  }

  get title(): string {
    return this.store.title;
  }

  get message(): string {
    return this.user.systemApprover ? this.store.messages.approver : this.store.messages.requester;
  }

  get status(): string {
    return this.titleize(this.application.applicationStatus);
  }

  get active(): string {
    return this.store.nav[this.states.section];
  }

  get errors(): string {
    let errors = [],
        intErrors = 0;

    this.store.nav.children.map(item => {
      if(item.iconClass == 'error') {
        intErrors++;
      }
    });

    errors.push(`You must resolve ${intErrors} ${ intErrors > 1 ? 'issues' : 'issue'} to submit this request`);

    return errors.join('');
  }

  get data(): CWSApplication {
    let form = this.form,
        data = merge({ statuses: this.application.statuses },
          form.get('system-information').value,
          form.get('organization').value,
          form.get('permissions').value,
          form.get('security').value,
          form.get('authorization').value
        );

    data = mergeWith({}, this.application, data, (target, source, key) => {
      if(isArray(target) && isArray(source)) {
        return source;
      }
    });

    return data;
  }

  showError() {
    let items = this.store.nav.children,
        errors;

    errors = items
      .map((item, intItem) => merge({ index: intItem }, item))
      .filter(item => (item.iconClass == 'error'));

    // Hide "Show Details" link if this is the last error otherwise, leave it showing
    if(errors.length == 1) {
      this.states.showDetails = false;
    }

    this.states.section = errors[0].index;
    this.states.tab = 0;
  }

  onNavigate(route) {
    let item,
        index;

    for(index = 0; index < this.store.nav.children.length; index++) {
      item = this.store.nav.children[index];
      if(item.route == route) {
        this.states.section = index;
        this.states.tab = 0;
        return;
      }
    }
  }

  setError(message: string = '') {
    this.store.errors = message;
  }

  resetErrors() {
    this.store.errors = '';
    this.states.showDetails = false;
    this.states.submitted = false;
  }

  redirectToStatus() {
    this.router.navigate(['/workspace/system/status/', this.application.uid], { queryParamsHandling: 'merge' });
  }

  edit(route: string) {
    this.onNavigate(route);
  }

  cancel() {
    this.router.navigate(['/workspace/system'], { queryParamsHandling: 'merge' });
  }

  review() {
    this.save(() => {
      if(typeof this.application.statuses === 'object') {
        this.application.statuses[this.states.section] = 1;
        this.updateStatus();
      }

      this.states.tab = 1;
    });
  }

  previous() {
    this.save(() => {
      this.states.section = Math.max(0, this.states.section - 1);
    });
  }

  next() {
    this.resetErrors();

    if(typeof this.application.statuses === 'object') {
      this.application.statuses[this.states.section] = 1;
      this.updateStatus();
    }

    this.save(() => {
      this.states.section = Math.min(this.states.section + 1, this.store.nav.children.length - 1);
    });
  }

  save(cb: Function = () => {}, section: string = this.store.nav.children[this.states.section].route) {
    const fn = this.isNew ? this.api.iam.cws.application.create : this.api.iam.cws.application.update;
    let args: (string|number|Function|CWSApplication)[] = this.isNew ? [] : [this.application.uid];

    args.push(this.data, application => {
      this.form.get(section).patchValue(application);
      this.application = extend({}, this.application, application);

      if(this.isNew) {
        this.router.navigate(['/workspace/system/new', application.uid], {
          queryParamsHandling: 'merge',
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

  onChange(section: Array<string>) {
    // Only run this for re-saving after all change detections run
    if(section[0] == 'organization') {
      this.save(() => {
        return;
      }, section[0]);
    }
  }

  submit() {
    let form = this.form,
        application = this.application;

    this.resetErrors();

    if(typeof application.statuses === 'object') {
      application.statuses = application.statuses.map(status => 1);
    }

    this.updateStatus();
    this.states.submitted = true;

    if(form.valid) {
      application.applicationStatus = 'Pending Approval';

      this.api.iam.cws.application.update(application.uid, this.data, this.redirectToStatus.bind(this), error => {
        this.setError(error.message)
      });
    } else {
      this.states.showDetails = true;
      this.setError(this.errors);
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
    this.api.iam.cws.application.delete(this.application.uid, response => {
      this.api.alert = {
        type: 'success',
        title: 'Success!',
        message: `Your application: <strong>${this.application.systemAccountName}</strong> was successfully deleted!`,
      };

      this.router.navigate(['/workspace/system'], { queryParamsHandling: 'merge' });
    }, error => {
      this.store.errors = error.message;
    });
  }
}
