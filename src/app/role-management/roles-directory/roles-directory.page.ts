import { Component, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { OptionsType, IBreadcrumb } from "sam-ui-kit/types";
import { UserAccessService } from "api-kit/access/access.service";
import * as _ from "lodash";
import { CapitalizePipe } from "../../app-pipes/capitalize.pipe";
import { SamAutocompleteComponent } from "sam-ui-kit/form-controls/autocomplete";
import { Observable } from "rxjs";
import { SamActionInterface } from "sam-ui-kit/components/actions";
import { get as getProp } from 'lodash';
import { AgencyPickerV2Component } from "../../app-components/agency-picker-v2/agency-picker-v2.component";

@Component({
  templateUrl: './roles-directory.template.html',
  providers: [CapitalizePipe]
})
export class RolesDirectoryPage {
  crumbs: Array<IBreadcrumb> = [
    { breadcrumb: 'Workspace', url: '/workspace' },
    { breadcrumb: 'Roles Directory'}
  ];
  actions: Array<SamActionInterface> = [
    { label: 'Bulk Update', name: 'bulk-update', callback: () => {} }
  ];
  viewAndGrantAction: any = [{ label: 'Assign Role', name: 'grant_access', callback: () => {} }, { label: 'View Access', name: 'view_access', callback: () => {} }];
  viewOnlyAction: any = [{ label: 'View Access', name: 'view_access', callback: () => {} }];

  users: any = null;

  //filters
  domainOptions: Array<OptionsType> = [];
  roleOptions: Array<OptionsType> = [];
  selectedDomainIds: Array<string|number> = [];
  selectedRoleIds: Array<string|number> = [];
  selectedOrganization: string|number|undefined;
  userSearchValue: string = '';

  sort: any = {type:'lastName', sort:'asc'};
  sortOptions = [
    { value: 'lastName', label: 'Last name' },
  ];

  // pagination
  itemsPerPage: number = 10;
  totalResults: number = 0;
  totalPages: number;
  currentPage: number;

  userConfig = {
    keyValueConfig: {
      keyProperty: 'key',
      valueProperty: 'value'
    }
  };

  dummySearchValue; //autocomplete makes me do this
  searchStatus: 'success'|'error'|'pending' = 'pending';
  errorMessage: string;

  @ViewChild('picker') agencyPicker: AgencyPickerV2Component;
  @ViewChild('userPicker') userAutoComplete: SamAutocompleteComponent;

  private request: Observable<any>;

  constructor(
    private userAccessService: UserAccessService,
    private capitalize: CapitalizePipe,
    private router: Router
  ) {
    this.doSearch();
  }

  ngOnInit() {
    this.initializeAutoComplete();
  }

  onClearAllClick() {
    this.selectedOrganization = null;
    this.agencyPicker.clearAdvanced();
    this.userAutoComplete.clearInput();
    this.userSearchValue = null;
    this.selectedDomainIds = [];
    this.selectedRoleIds = [];
    this.doSearch();
  }

  getDomainOptions(domains) {
    if (!domains || !domains.length) {
      this.domainOptions = [];
    }
    this.domainOptions = domains.map(dom => {
      return {
        name: dom.id,
        label: dom.val,
        value: dom.id,
      };
    });
  }

  getRoleOptions(roles) {
    if (!roles || !roles.length) {
      this.roleOptions = [];
    }
    this.roleOptions = roles.map(r => {
      return {
        name: r.id,
        label: r.val,
        value: r.id,
      };
    });
  }

  onSortChange(sort) {
    this.doSearch();
  }

  doSearch() {
    this.searchStatus = 'pending';
    this.errorMessage = null;

    let filterOptions: any = {
      order: this.sort.sort,
      page: this.currentPage,
    };

    if (this.selectedDomainIds && this.selectedDomainIds.length) {
      filterOptions.domainKey = this.selectedDomainIds.join(',');
    }
    if (this.selectedRoleIds && this.selectedRoleIds.length) {
      filterOptions.roleKey = this.selectedRoleIds.join(',');
    }
    if (this.selectedOrganization) {
      filterOptions.orgKey = this.selectedOrganization;
    }
    if (this.userSearchValue) {
      filterOptions.user = this.userSearchValue;
    }

    this.userAccessService.getUserDirectory(filterOptions)
      .subscribe(
        res => {
          try {
            this.getDomainOptions(res.domains);
            this.getRoleOptions(res.roles);
            this.getPaginationParameters(res);

            this.users = res.users;
            this.getUserOrgsGroupedByTier(this.users);
            this.searchStatus = 'success';
          } catch (error) {
            this.searchStatus = 'error';
            this.errorMessage = 'The was a error while processing search results';
          }
        },
        error => {
          this.searchStatus = 'error';
          this.errorMessage = 'The was an error while searching for users.';
        }
      );
  }

  getUserOrgsGroupedByTier(users) {
    users.forEach(u => {
      // group by tier type
      let orgsByTier = _.groupBy(u.access, acc => {
        return acc.organization.type || 'Unavailable';
      });

      orgsByTier = _.mapKeys(orgsByTier, (value, key) => {
        switch (key.toLowerCase()) {
          case 'department':
            return 'Department/Independent Agency';
          case 'agency':
            return 'Sub-Tier';
          case 'office':
            return 'Office';
          default:
            return key;
        }
      });

      let tiers = [];

      // convert { [tierName]: [orgs] } to [ {[tierName]: [orgs] ] so that we can iterate in the html
      _.forOwn(orgsByTier, (org, tierName) => {
        let orgs = org.map(o => {
          let v = {
            name: this.capitalize.transform(o.organization.val) || o.organization.id,
            isSelected: o.organization.isSelected
          };
          return v;
        });
        tiers.push({name: tierName, organizations: orgs});
      });

      let sorted = [undefined, undefined, undefined];

      // sort
      tiers.forEach(tier => {
        switch (tier.name) {
          case 'Department/Independent Agency':
            sorted[0] = tier;
            break;
          case 'Sub-Tier':
            sorted[1] = tier;
            break;
          case 'Office':
            sorted[2] = tier;
            break;
          default:
            sorted.push(tier);
        }
      });

      // do not display tier if there no organizations with a name for this tier
      tiers = sorted.filter(t => {
        return t && t.organizations && t.organizations.length;
      });

      u.tiers = tiers;
    });
  }

  getPaginationParameters(res) {
    this.totalResults = res.total;
    this.itemsPerPage = res.limit;
    this.totalPages = Math.floor((res.total - 1) / res.limit) + 1;
    if (typeof res.offset === 'number' && typeof res.limit === 'number' && res.limit !== 0) {
      this.currentPage = Math.floor(res.offset / res.limit) + 1;
    } else {
      this.currentPage = 1;
    }
  }

  onOrganizationChange(org) {
    if (org && org.orgKey) {
      this.selectedOrganization = org.orgKey;
    } else {
      this.selectedOrganization = undefined;
    }
    this.doSearch();
  }

  onSelectDomain() {
    this.doSearch();
  }

  onSelectRole() {
    this.doSearch();
  }

  onPageChange($event) {
    this.currentPage = $event;
    this.doSearch();
  }

  onUserChange(user) {
    if (typeof user === 'string') {
      this.userSearchValue = user;
    } else if (typeof  user === 'object') {
      this.userSearchValue = user && user.key;
    }
    this.doSearch();
  }

  formatOrgName(org) {
    if (typeof org.name === 'number') {
      return ''+org.name
    } else if (typeof org.name === 'string') {
      return this.capitalize.transform(org.name);
    } else {
      return '';
    }
  }

  onBulkUpdate() {
    this.router.navigate(['/role-management/bulk-update']);
  }

  fullName(user) {
    if (!user) return '';
    let first = user.firstName;
    let last = user.lastName;
    if (first && !last)  return first;
    if (last  && !first) return last;
    if (first && last)   return `${first} ${last}`;
    return '';
  }

  userHasActions(user) {
    const hasView = getProp(user, 'user._links.view_access');
    const hasGrant = getProp(user, 'user._links.grant_access');
    return hasView || hasGrant;
  }

  onUserAction(action, user) {
    const userName = user.user.email;
    if (action.name === 'grant_access') {
      this.router.navigate(['/role-management', 'users', userName, 'assign-roles']);
    } else {
      this.router.navigate(['/role-management', 'users', userName, 'access']);
    }
  }

  initializeAutoComplete() {
    this.request = this.userAutoComplete.keyEvents
      .switchMap(
        input => {
          return this.userAccessService.getUserAutoComplete(input)
            .catch(e => {
              return Observable.of([]);
            });
        }
      )
      .map(
        users => {
          if (!users) {
            return [];
          }
          return users.map(user => {
            return {
              key: user.email,
              value: `${user.firstName} ${user.lastName} (${user.email })`
            };
          });
        }
      );
  }
}
