import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { merge } from 'lodash';
import * as moment from 'moment';

import { IAMService } from 'api-kit';
import { CWSApplication, User } from 'api-kit/iam/interfaces';
import { Validators as $Validators } from 'app-utils/validators';

@Component({
  templateUrl: './application-requests.component.html',
  providers: [
    IAMService,
  ],
})
export class ApplicationRequestsComponent {
  @ViewChild('confirmModal') confirmModal;

  private subscriptions = {};
  private store = {
    section: 'Workspace',
    title: 'System Account Request',
    breadcrumbs: [
      { breadcrumb: 'Workspace', url: '/workspace' },
      { breadcrumb: 'Requests', url: '/workspace/myfeed/requests' },
      { breadcrumb: 'System Account Request' },
    ],

    errors: '',
  };

  private states = {
    comments: true,
    pending: true,
    redirectType: 0,
  };

  private user: User;
  private form: FormGroup;
  private errors = '';

  public application: CWSApplication = {
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

  constructor(private route: ActivatedRoute, private router: Router, private builder: FormBuilder, private api: IAMService) {}

  ngOnInit() {
    this.subscriptions['params'] = this.route.params.subscribe(params => {
      if(params['id']) {
        this.api.iam.checkSession(user => this.user = user);

        this.api.iam.cws.application.get(params['id'], application => {
          this.application = application;

          if(application.applicationStatus.match(/approved|rejected|cancelled/i))
            this.states.pending = false;
          if(application.rejectionReason)
            this.states.comments = false;

          this.initForm();
        }, error => {
          this.router.navigate(['/workspace/myfeed/requests']);
        });
      }
    });

    this.subscriptions['queryParams'] = this.route.queryParams.subscribe(qparams => {
      if(qparams['directory']) {
        this.states.redirectType = 1;
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
        authorizationConfirmation: [application.authorizationConfirmation, [Validators.requiredTrue]],
        authorizingOfficialName: [application.authorizingOfficialName],
        authorizationDate: [application.authorizationDate],
      }),

      rejectionReason: [{
        value: application.rejectionReason,
        disabled: this.isCommentsDisabled,
      }],
    });
  }

  resetErrors() {
    this.store.errors = '';
    this.errors = '';
  }

  setError(message: string) {
    this.store.errors = message || '';
  }

  updateCommentState() {
    const control = this.form.get('rejectionReason');

    if(control) {
      this.isCommentsDisabled ? control.disable() : control.enable();
    }
  }

  get comments(): string {
    const control = this.form.get('rejectionReason');
    let comment = '';

    if(!this.states.comments && control && control.value) {
      comment = `<strong>${this.user.fullName}</strong> ${control.value}`;
    }

    return comment;
  }

  get data(): CWSApplication {
    const form = this.form;

    this.application = merge(
      this.application,
      form.get('system-information').value,
      form.get('organization').value,
      form.get('permissions').value,
      form.get('security').value,
      form.get('authorization').value,
      { rejectionReason: form.get('rejectionReason').value },
    );

    return this.application;
  }

  get isCommentsDisabled(): boolean {
    const control = this.form ? this.form.get('rejectionReason') : false,
          pending = this.states.pending;
    return (control && !control.value && !pending) ? true : false;
  }

  close() {
    this.router.navigate(
      [(this.states.redirectType == 0) ? '/workspace/myfeed/requests' : '/workspace/system']
    );
  }

  cancel() {
    if(this.confirmModal) {
      this.confirmModal.openModal();
    } else {
      this.router.navigate(['/workspace/myfeed/requests']);
    }
  }

  reject() {
    const control = this.form.get('rejectionReason');

    this.resetErrors();

    if(control.value) {
      this.api.iam.cws.application.reject(this.data, application => {
        this.application = application;
        this.states.pending = false;
        this.states.comments = false;

        this.updateCommentState();
      }, error => {
        this.setError(error.message);
      });
    } else {
      this.errors = 'Please provide a reason for rejecting application';
    }
  }

  approve() {
    const control = this.form.get('rejectionReason');

    this.resetErrors();

    // API doesn't allow saving of `rejectionReason` through /approve endpoint
    if(!this.application.rejectionReason && control.value) {
      control.patchValue('');
    }

    this.api.iam.cws.application.approve(this.data, application => {
      this.application = application;
      this.states.pending = false;

      this.updateCommentState();
    }, error => {
      this.setError(error.message);
    });
  }

  deactivate() {
    this.confirmModal.closeModal();
    this.router.navigate(['/workspace/myfeed/requests'], { queryParamsHandling: 'merge' });
  }
}
