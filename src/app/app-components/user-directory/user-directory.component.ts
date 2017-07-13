import { Component, EventEmitter, Input, Output } from '@angular/core';

import { isArray, merge } from 'lodash';
import * as moment from 'moment';

import { PeoplePickerService } from 'api-kit';

import { Filter, Sort, Options } from './user-directory.interfaces';
import { User } from '../../../api-kit/iam/api/core/user.ts';

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
  templateUrl: 'user-directory.component.html'
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
      count:    20
    },

    sort: {
      type:  'lastName',
      order: 'asc',
    },

    loading: false
  };

  private store = {
    dateformat: 'MMM DD, YYYY',
    sortOptions:  [
      { label: 'Last Name (ascending)', value: 'lastName|asc' },
      { label: 'Last Name (descending)', value: 'lastName|desc' },
      { label: 'Last Log In (ascending)', value: 'lastLogin|asc' },
      { label: 'Last Log In (descending)', value: 'lastLogin|desc' },
    ],

    sort: 'lastName|asc',
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

  @Output('onSearch') _onSearch: EventEmitter<any> = new EventEmitter();
  @Output('onSort') _onSort: EventEmitter<any> = new EventEmitter();
  @Output('onPage') _onPage: EventEmitter<any> = new EventEmitter();

  constructor(private api: PeoplePickerService) {}

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
    this.setSort();
  }

  setSort() {
    if(this.states.sort.type.length && this.states.sort.order.length) {
      this.store.sort = `${this.states.sort.type}|${this.states.sort.order}`;
    }
  }

  get intStart(): number {
    return (Math.max(0, this.states.page.current - 1) * 20) + 1;
  }

  get intEnd(): number {
    return Math.min(this.intTotal, this.intStart + this.states.page.count);
  }

  get intTotal(): number {
    return this.store.cache.length;
  }

  get sort(): Sort {
    let mapping = this.store.sort.split('|'),
        sort= <Sort>{
          type:  mapping[0] || 'lastName',
          order: mapping[1] || 'asc'
        };

    return sort;
  }

  formatDate(value) {
    return moment().format(this.store.dateformat);
  }

  onFilter(organization) {
    this.states.filter.value = organization ? organization.value : '';
  }

  onSort(value: string) {
    this.fetch(() => {
      this._onSort.emit(this.store.sort);
    });
  }

  onPage(page) {
    this.states.page.current = page;
    this._onPage.emit(this.states.page);
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
          fnSubscription;

    cb = cb || ((data) => {});
    fnSubscription = (data => {
      let users = data._embedded.userResources,
          page = data.page;

      this.store.cache = users.map(item => new User(item.user));
      this.states.page.total = page.totalPages;

      cb();
    });

    if(params['fle'].length || params['organization']) {
      this.api.getFilteredList(params).subscribe(fnSubscription);
    } else {
      this.api.getList(params).subscribe(fnSubscription);
    }
  }

  search() {
    let state = merge({}, this.states);

    delete this.states.loading;

    this.fetch(() => {
      this._onSearch.emit(state);
    });
  }
}
