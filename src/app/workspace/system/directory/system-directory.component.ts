import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { concat, extend, isArray, isNill, isObject, isEqual, keys, merge, pick, some } from 'lodash';
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
      { label: 'Contract Opportunities', name: 'filter-contract-opportunities', value: 'contractOpportunities' },
      { label: 'Contract Data',          name: 'filter-contract-data',          value: 'contractData' },
      { label: 'Entity Information',     name: 'filter-entity-information',     value: 'entityInformation' },
    ],

    statuses: [
      { label: 'Draft',            name: 'filter-draft',     value: 'draft' },
      { label: 'Pending Approved', name: 'filter-pending',   value: 'pending approval' },
      { label: 'Published',        name: 'filter-published', value: 'approved' },
      { label: 'Rejected',         name: 'filter-rejected',  value: 'rejected' },
      { label: 'Cancelled',        name: 'filter-cancelled', value: 'cancelled' },
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

    params: {
      keyword: '',
      user: null,
      dir: 'asc',
      domains: [],
      status: [],
    }
  };

  private store = {
    section: 'Workspace',
    title: 'System Accounts',
    records: [],
    thresholds: {
      keyword: 2,
      user: 2,
    },

    configs: {
      user: {
        keyValueConfig: {
          keyProperty: 'mail',
          valueProperty: 'givenName',
          subheadProperty: 'mail',
        }
      }
    },
  }

  private alert = {
    type: 'success',
    title: '',
    message: '',
  };

  private search = {
    keyword: '',
    user: null,
  };

  private filter = {
    domains: [],
    status: [],
  };

  private order = { type: 'uid', sort: 'asc' };

  constructor(private router: Router, private route: ActivatedRoute, private api: IAMService) {}

  ngOnInit() {
    let requests = [];

    // Allow for Search/Filter Page State
    this.subscriptions['queryParams'] = this.route.queryParams.subscribe(qParams => {
      let params = merge({}, this.states.params, pick(qParams, keys(this.states.params)));

      ('status|domains').split('|').map(key => {
        params[key] = params[key] || [];

        if(!isArray(params[key])) {
          params[key] = [params[key]];
        }
      });

      // All options are supported with the exception of `user` (Administrater/Manager)
      params.user = null;
      this.order.sort = params.dir;
      this.search = extend({}, this.search, pick(params, keys(this.search)));
      this.filter = extend({}, this.filter, pick(params, keys(this.filter)));
    });

    // Dynamic Alerts
    this.ping(this.api.alert)
    this.fetch();
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

    this.states.loading = false;
  }

  ping(alert) {
    this.alert.type = alert.type || 'info';
    this.alert.title = alert.title || '';
    this.alert.message = alert.message || '';
  }

  resetAlert() {
    this.ping({});
  }

  get isError(): boolean {
    return (this.alert.type == 'error') &&
           (this.alert.title.length + this.alert.message.length) > 0;
  }

  get params(): { [key: string]: string|boolean|Array<string> } {
    let params = {
      status: this.filter.status,
      dir: this.order.sort,
    };

    if(this.hasFilter()) {
      if(this.search.user)
        params['admin'] = isObject(this.search.user) ? this.search.user.givenName : this.search.user;
      if(this.search.keyword)
        params['keyword'] = this.search.keyword;

      this.filter.domains.map(domain => {
        params[domain] = true;
      });
    } else {
      params = extend({}, params, {
        status: ('draft|pending approval|published|approved|rejected').split('|'),
        contractOpportunities: true,
        contractData: true,
        entityInformation: true,
      });
    }

    // To prevent duplicate requests when filtering
    this.states.params = extend({}, this.states.params, pick(params, keys(this.states.params)));

    return params;
  }

  check(): boolean {
    const params = extend({ dir: this.order.sort }, this.search, this.filter),
          isUpdated = !isEqual(this.states.params, params),
          isValid = (!params.keyword.length || params.keyword.length >= this.store.thresholds.keyword) ||
                    (!params.user || params.user && params.user.length >= this.store.thresholds.user);

    if(isValid && isUpdated) {
      this.states.params = extend({}, this.states.params, params);
    }

    return isUpdated && isValid;
  }

  hasFilter(): boolean {
    if(isObject(this.search.user) && this.search.user.mail == 'error') {
      this.search.user = null;
    }

    return (
      some(this.filter.domains) ||
      this.filter.status.length ||
      this.search.keyword.length ||
      isObject(this.search.user)
    );
  }

  getResolve(): Function {
    return ((data?, type?: string) => {
      switch(type) {
        case 'accounts':
        case 'applications': // Unfiltered
          this[`_${type}`] = data || [];

          this.states[type] = true;

          if(this.states.applications && this.states.accounts) {
            this.accounts = concat(this._applications, this._accounts);
            this.setupPaging();
          }

          break;

        default: // Filtered
          this.accounts = data || [];
          this.setupPaging();
      }
    });
  }

  fetch(): void {
    const resolve = this.getResolve(),
          hasFilter = this.hasFilter();

    this.resetAlert();

    if(!hasFilter || (hasFilter && this.check())) {
      this.states.loading = true;
      this.store.records = [];
      this.accounts = [];

      if(!hasFilter) {
        this.states.applications = false;
        this.states.accounts = false;
        this._applications = [];
        this._accounts = [];
      }

      this.api.iam.cws.applications.filter(this.params, applications => {
        resolve(applications, hasFilter ? null : 'applications');
      }, error => {
        this.ping({
          type: 'error',
          title: 'Server Connection Issue',
          message: error.message,
        });

        resolve(null, hasFilter ? null : 'applications');
      });

      // Fetch legacy system accounts endpoint when there are no filters
      if(!hasFilter) {
        this.api.iam.system.account.get(accounts => {
          resolve(accounts, 'accounts');
        }, () => {
          resolve(null, 'accounts');
        });
      }
    }
  }

  onPage(page: number) {
    if(this.states.page.current !== page) {
      this.states.page.current = page;
      this.setupPaging();
    }
  }
}
