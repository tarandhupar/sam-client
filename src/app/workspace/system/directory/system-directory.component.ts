import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { cloneDeep, concat, isObject, merge } from 'lodash';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/of';

import { IAMService } from 'api-kit';

@Component({
  templateUrl: './system-directory.component.html',
})
export class SystemDirectoryComponent {
  private _applications = [];
  private _accounts = [];
  private accounts = [];
  private options = {
    domains: [
      { label: 'Contract Opportunities', name: 'filter-contract-opportunities', value: 'contract-opportunities' },
      { label: 'Contract Data',          name: 'filter-contract-data',          value: 'contract-data' },
      { label: 'Entity Information',     name: 'filter-entity-information',     value: 'entity-information' },
    ],

    statuses: [
      { label: 'Draft',            name: 'filter-draft',     value: 'draft' },
      { label: 'Pending Approved', name: 'filter-pending',   value: 'pending' },
      { label: 'Published',        name: 'filter-published', value: 'published' },
      { label: 'Rejected',         name: 'filter-rejected',  value: 'rejected' },
    ],

    sort: [
      { label: 'Unique Account ID', name: 'sort-uid', value: 'uid' },
    ],
  };

  private subscriptions = {};
  private states = {
    applications: false,
    accounts: false,
    loading: true,
    page: {
      current: 1,
      total: 1,
      count: 10,
    },
  };

  private store = {
    section: 'Workspace',
    title: 'System Accounts',
    records: [],
  }

  private alert = {
    type: 'success',
    title: '',
    message: '',
  };

  private search = {
    keyword: '',
    user: '',
  };

  private filter = {
    domains: [],
    statuses: [],
  };

  private sort = { type: 'uid', sort: 'asc' };

  constructor(private router: Router, private route: ActivatedRoute, private api: IAMService) {}

  ngOnInit() {
    let requests = [],
        resolve = ((type: string) => {
          this.states[type] = true;

          if(this.states.applications && this.states.accounts) {
            this.states.loading = false;
            this.accounts = concat(this._applications, this._accounts);
            this.setupPaging();
          }
        });

    // Dynamic Alerts
    console.log
    this.ping(this.api.alert)

    this.api.iam.cws.application.getAll(applications => {
      this._applications = applications;
      resolve('applications');
    }, () => {
      resolve('applications')
    });

    this.api.iam.system.account.get(accounts => {
      this._accounts = accounts;
      resolve('accounts');
    }, () => {
      resolve('accounts');
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

  axe(id: string|number) {
    this.accounts = this.accounts.filter(account => (account.uid == id) ? false : true);
    this.setupPaging();
  }

  setupPaging() {
    let intStart = Math.max(0, (this.states.page.current * this.states.page.count) - this.states.page.count),
        intEnd = this.states.page.current * this.states.page.count;

    this.states.page.total = Math.ceil(this.accounts.length / this.states.page.count);
    this.store.records = this.accounts.slice(intStart, intEnd);
  }

  ping(alert) {
    this.alert.type = alert.type || 'info';
    this.alert.title = alert.title || '';
    this.alert.message = alert.message || '';
  }

  fetch(): void {
    this.states.loading = true;
    // TODO
    this.states.loading = true;
  }

  onPage(page: number) {
    if(this.states.page.current !== page) {
      this.states.page.current = page;
      this.setupPaging();
    }
  }
}
