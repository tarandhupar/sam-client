import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import * as moment from 'moment';

import { IAMService } from 'api-kit';
import { CWSApplication } from 'api-kit/iam/interfaces';

@Component({
  templateUrl: './system-status.component.html',
  providers: [
    IAMService,
  ],
})
export class SystemStatusComponent {
  private subscriptions = {};
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

  private statuses = {
    'draft': 'Draft',
    'pending approval': 'Pending Approval',
    'approved': 'Published',
    'rejected': 'Rejected',
  };

  constructor(private route: ActivatedRoute, private router: Router, private api: IAMService) {}

  ngOnInit() {
    this.subscriptions['params'] = this.route.params.subscribe(params => {
      if(params['id']) {
        this.api.iam.cws.application.get(params['id'], application => {
          this.application = application;

          if(this.api.iam.isDebug()) {
            this.subscriptions['qparams'] = this.route.queryParams.subscribe(qparams => {
              if(qparams['status']) {
                this.application.applicationStatus = qparams['status'];
              }
            });
          }
        }, error => {
          this.router.navigate(['/workspace/system']);
        });
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

  get status(): number {
    let status = 1;

    switch(this.application.applicationStatus.toLowerCase()) {
      case 'pending approval':
        status = 2;
        break;

      case 'approved':
      case 'rejected':
        status = 3;
        break;
    }

    return status;
  }

  get label(): string {
    const status = this.application.applicationStatus.toLowerCase();
    return this.statuses[status] || '';
  }

  className() {
    return `step-${this.status}`;
  }

  bold(stage: number) {
    return (stage == this.status) ? 'text-bold' : '';
  }

  field(key: string = '') {
    let field = this.application[key] ? this.application[key] : '',
        format = 'MMM D, h:mm a';

    switch(key) {
      case 'submittedDate':
      case 'lastUpdate':
      case 'securityApproved_Date':
        if(field) {
          field = moment(field).format(format);
        } else if(key == 'securityApproved_Date') {
          field = '<em>Not yet approved</em>';
        }

        break;

      case 'securityApprover':
        if(!field) {
          field = '<em>Not yet approved</em>';
        }

        break;
    }

    return field;
  }
}
