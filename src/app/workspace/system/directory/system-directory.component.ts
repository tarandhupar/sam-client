import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { cloneDeep, isObject, merge } from 'lodash';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/of';

import { IAMService, FHService } from 'api-kit';

@Component({
  templateUrl: './system-directory.component.html',
  providers: [
    FHService,
    IAMService
  ]
})
export class SystemDirectoryComponent {
  private accounts = [];
  private api = {
    fh: null,
    iam: null
  };

  private states = {
    loading: false,
    page: {
      current: 1,
      total: 1,
      count: 20
    },
  };

  private store = {
    records: [],
  }

  constructor(private _fh: FHService, private _iam: IAMService) {
    this.api.iam = _iam.iam;
    this.api.fh = _fh;
  }

  ngOnInit() {
    let requests = [];

    this.api.iam.system.account.get(accounts => {
      requests = accounts.map((account, intAccount) => {
        this.accounts[intAccount] = merge({
          subtier: ''
        }, account);

        return account.department ?
          this.api.fh.getOrganizationById(account.department) :
          Observable.of(account.businessName || '');
      });

      Observable
        .forkJoin(requests)
        .subscribe(results => {
          results.forEach((item, intItem) => {
            let organization = isObject(item) ?
              (item['_embedded'][0]['org']['l2Name'] || item['_embedded'][0]['org']['l1Name']) :
              item;

            accounts[intItem].subtier = organization;
          });

          this.accounts = accounts;
          this.setupPaging();
        });
    });
  }

  setupPaging() {
    let intStart = Math.max(0, (this.states.page.current * this.states.page.count) - this.states.page.count);

    this.states.page.total = Math.ceil(this.accounts.length / this.states.page.count);
    this.store.records = this.accounts.splice(intStart, this.states.page.count);
  }

  onPage(page: number) {
    if(this.states.page.current !== page) {
      this.states.page.current = page;
      this.setupPaging();
    }
  }
}
