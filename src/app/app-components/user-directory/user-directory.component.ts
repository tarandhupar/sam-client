import { Component, EventEmitter, Input, Output } from '@angular/core';

import { isArray, merge } from 'lodash';
import * as moment from 'moment';

import { SamSortComponent } from '..';
import { FHService, PeoplePickerService } from 'api-kit';

import { OptionsType } from 'sam-ui-kit/types';
import { Filter, Sort, Options, PageState } from './user-directory.interfaces';
import { User } from 'api-kit/iam/api/core/user.ts';

/**
 * UsersDirectory - Users Directory Listing
 *
 * @Input() title: string - Page title
 * @Input() subtitle: string - Page subtitle
 * @Input() options: Option - Set search/filter states on init
 * @Input() filterable: boolean - Toggles agency filter feature
 * @Input() sortable: boolean - Toggle search feature
 * @Input() router: Function - Function that returns a valid routerLink value, each result will be provided to the callback
 *
 * @Output() onSearch: EventEmitter - Search change event (Options)
 * @Output() onSort: EventEmitter - Sort change event (Sort)
 * @Output() onPage: EventEmitter - Page change event (number)
 */
@Component({
	selector: 'sam-user-directory',
  templateUrl: 'user-directory.component.html',
  providers: [SamSortComponent],
})
export class SamUserDirectoryComponent {
  private states = {
    previous: '',
    search: '',
    filter: {
      department: '',
      value:      '',
    },

    page: {
      current:  1,
      total:    1,
      count:    20,
      totalRecords:  0
    },

    sort: {
      type:  'lastName',
      order: 'asc',
    },

    loading: false
  };

  private store = {
    dateformat: 'MMM DD, YYYY',
    sorts:  [
      <OptionsType>{ name: 'sort-last-name', label: 'Last Name', value: 'lastName' },
      <OptionsType>{ name: 'sort-last-login', label: 'Last Log In', value: 'lastLogin' },
    ],

    departments: {},
    cache: []
  };

  private _options: Options = {
    search: this.states.search,
    filter: this.states.filter,
    page:   this.states.page,
    sort:   this.states.sort,
  };

  @Input() title: string = 'Workspace';
  @Input() subtitle: string = 'User Directory';
  @Input() searchable: boolean = true;
  @Input() sortable: boolean = true;
  @Input() filterable: boolean = true;
  @Input() router: Function = function(user) {
    return ['/user', user._id];
  };

  @Output('onSearch') _onSearch: EventEmitter<Options> = new EventEmitter();
  @Output('onSort') _onSort: EventEmitter<Sort> = new EventEmitter();
  @Output('onPage') _onPage: EventEmitter<PageState> = new EventEmitter();

  constructor(private api: PeoplePickerService, private fh: FHService) {}

  ngOnInit() {
    this.setOptions(this._options);
    this.fetch();
  }

  @Input('options')
  set options(options: Options) {
    this._options = merge({}, this._options, options);
  };

  setOptions(options: Options) {
    this.states = merge({}, this.states, options);
    this.initSort();
  }

  initSort() {
    this.states.sort.order = this.states.sort['sort'] || this.states.sort.order;
  }

  get intStart(): number {
    return (Math.max(0, this.states.page.current - 1) * ((this.states.page.current == 1) ? this.store.cache.length : this.states.page.count)) +
           (this.store.cache.length ? 1 : 0);
  }

  get intEnd(): number {
    return this.intStart + Math.max(0, this.store.cache.length - 1)
  }

  get intTotal(): number {
    return this.states.page.totalRecords;
  }

  get sort(): Sort {
    return <Sort>{
      type:  this.states.sort.type,
      order: this.states.sort.order,
    };
  }

  department(key) {
    return this.store.departments[key] ? '' : '&nbsp;';
  }

  formatDate(value) {
    return moment().format(this.store.dateformat);
  }

  onFilter(organization) {
    this.states.filter.value = organization ? organization.value : '';
  }

  onSort(value: string) {
    this.states.sort = merge({}, this.states.sort, value);
    this.initSort();
    this.fetch(() => {
      this._onSort.emit(this.states.sort);
    });
  }

  onPage(page) {
    this.states.page.current = page;
    this.fetch(() => {
      this._onPage.emit(this.states.page);
    });
  }

  get params() {
    let filter = this.states.filter,
        sort = this.sort,
        params = {
          fle: this.states.search,
          orderBy: sort.type,
          dir: sort.order,
          page: (this.states.page.current - 1)
        };

    if(filter.value) {
      params['organization'] = filter.value;
    };

    return params;
  }

  fetch(cb?: Function) {
    let params = this.params,
        fnSubscription,
        fnError = (error => {
          this.states.loading = false;
        });

    cb = cb || ((data) => {});
    fnSubscription = (data => {
      let users = isArray(data) ? data : data._embedded.ldapUserResources,
          page = data.page,
          departments;

      this.store.cache = users.map(item => new User(item.user));

      departments = this.store.cache
        .filter(item => item.departmentID)
        .map(item => item.departmentID);

      this.fh
        .getOrganizations({ orgKey: departments.join(',') })
        .subscribe(data => {
          const items = data._embedded.orgs;

          items.map(item => {
            this.store.departments[item.orgKey] = item.orgName;
          });

          this.states.loading = false;
        }, fnError);

      if(page) {
        this.states.page.total = page.totalPages;
        this.states.page.totalRecords = page.totalElements;
      } else {
        this.states.page.current = 1;
        this.states.page.total = 1;
        this.states.page.totalRecords = this.store.cache.length;
      }

      cb();
    });

    if(params['fle'].length || params['organization']) {
      this.api.getFilteredList(params).subscribe(fnSubscription, fnError);
    } else {
      this.api.getList(params).subscribe(fnSubscription, fnError);
    }
  }

  search() {
    this.fetch(() => {
      this._onSearch.emit(<Options>{
        search: this.states.search,
        filter: this.states.filter,
        page:   this.states.page,
        sort:   this.states.sort,
      });
    });
  }
}
