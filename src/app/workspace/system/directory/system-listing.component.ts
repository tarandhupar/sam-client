import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

import { FHService, IAMService } from 'api-kit';

import { SamActionInterface } from 'sam-ui-elements/src/ui-kit/components/actions';
import { CWSApplication, System } from 'api-kit/iam/interfaces';

import { isNull, merge, omitBy } from 'lodash';

interface CWSAccount {
  id: string|number;
  name: string;
  status: string;
  description: string;
  organization: string;
  expires: string;
  domains: string[];
  gov: boolean;
};

function instanceOfCWSApplication(object: any): object is CWSApplication {
  return 'uid' in object;
}

function instanceOfSystem(object: any): object is System {
  return '_id' in object;
}

@Component({
  selector: 'system-listing',
  templateUrl: './system-listing.component.html'
})
export class SystemListingComponent {
  @Output() onAlert = new EventEmitter<{ [key: string]: string }>();
  @Output() onDelete = new EventEmitter<String|Number>();

  private api = { fh: null, iam: null };
  private $account: (CWSAccount|CWSApplication|System);
  private _account: CWSAccount = {
    id: '',
    name: '',
    status: 'Draft',
    description: '',
    organization: '',
    expires: '',
    domains: [],
    gov: false,
  };

  private subscriptions = {};
  private statuses = {
    'Draft': { label: 'Draft', class: '' },
    'Pending Approval': { label: 'Pending Approval', class: '' },
    'approved': { label: 'Published', class: '' },
    'rejected': { label: 'Rejected', class: '' },
  };

  private actions: Array<SamActionInterface> = [
    { label: 'Status', name: 'action-status', callback: this.redirectToStatus.bind(this), icon: 'fa fa-check-circle' },
    { label: 'Delete', name: 'action-delete', callback: this.delete.bind(this), icon: 'fa fa-times' },
  ];

  constructor(private router: Router, private _fh: FHService, private _iam: IAMService) {
    this.api.fh = _fh;
    this.api.iam = _iam.iam;
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.unsubscribe();
  }

  get account(): (CWSAccount|CWSApplication|System) {
    return this._account;
  }

  @Input('account')
  set account(account: (CWSAccount|CWSApplication|System)) {
    let orgID;

    this.$account = account;
    this._account.domains = [];

    // Applications
    if(instanceOfCWSApplication(account)) {
      this._account = merge({}, this._account, omitBy({
        id: account.uid,
        name: account.systemAccountName,
        description: account.systemDescriptionAndFunction,
        status: account.applicationStatus,
        gov: true,
      }, isNull));

      if(account.contractData.length)
        this._account.domains.push('Contract Data');
      if(account.contractOpportunities.length)
        this._account.domains.push('Contract Opportunities');
      if(account.entityInformation.length)
        this._account.domains.push('Entity Information');

      orgID = (account.officeOrgId || account.agencyOrgId || account.departmentOrgId);
    }

    // Accounts
    if(instanceOfSystem(account)) {
      this._account = merge({}, this._account, omitBy({
        id: account._id,
        name: account.systemName,
        description: account.systemDescription,
        status: 'approved',
        gov: account.department ? true : false,
      }, isNull));

      if(!this._account.gov) {
        this._account.organization = account.businessName;
      }

      orgID = account.department;
    }

    this.unsubscribe();

    if(orgID) {
      this.subscriptions['fh'] = this.api.fh
        .getOrganizationById(orgID, false)
        .subscribe(data => {
          const organization = data['_embedded'][0]['org'];
          this._account.organization = organization.name || '';
        });
    }
  }

  unsubscribe() {
    if(this.subscriptions['fh']) {
      this.subscriptions['fh'].unsubscribe();
      delete this.subscriptions['fh'];
    }
  }

  get status() {
    return this.statuses[this._account.status];
  }

  get domains() {
    return this._account.domains.join(', ');
  }

  get route(): Array<string|number> {
    if(this.api.iam.user.isSecurityApprover()) {
      return ['/workspace/requests/system', this._account.id];
    } else {
      return [instanceOfCWSApplication(this.$account) ? 'new' : 'profile', this._account.id];
    }
  }

  get queryParams(): { [key: string]: string } {
    return this.api.iam.user.isSecurityApprover() ? { directory: true } : {};
  }

  redirectToStatus() {
    if(instanceOfCWSApplication(this.$account)) {
      this.router.navigate(['/workspace/system/status/', this._account.id]);
    }
  }

  delete() {
    if(instanceOfCWSApplication(this.$account)) {
      this.api.iam.cws.application.delete(this._account.id, response => {
        this.onAlert.emit({
          type: 'success',
          title: 'Success!',
          message: `Your application: <strong>${this.$account['systemAccountName']}</strong> was successfully deleted!`,
        });

        this.onDelete.emit(this._account.id);
      }, error => {
        this.onAlert.emit({
          type: 'error',
          title: 'Error',
          message: error.message,
        });
      });
    }
  }
}
