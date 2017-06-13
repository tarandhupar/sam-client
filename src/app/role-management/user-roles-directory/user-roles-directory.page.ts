import {Component, ViewChild} from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { OptionsType, IBreadcrumb } from "sam-ui-kit/types";
import { UserAccessService } from "api-kit/access/access.service";
import * as _ from "lodash";
import { AgencyPickerComponent } from "../../app-components/agency-picker/agency-picker.component";

@Component({
  templateUrl: './user-roles-directory.template.html'
})
export class UserRolesDirectoryPage {
  crumbs: Array<IBreadcrumb> = [
    { breadcrumb: 'Back to my workspace', url: '/workspace' },
    { breadcrumb: '...'}
  ];

  allDomains: Array<any> = [];
  rolesForDomainId: any = {};
  users: any = null;

  //filters
  domainOptions: Array<OptionsType> = [];
  roleOptions: Array<OptionsType> = [];
  selectedDomainId: string|number = null;
  selectedRoleId: string|number = null;
  selectedOrganization: string|number|undefined;
  userSearchValue: string = '';

  sortOptions = [
    { value: 'asc', label: 'Last name (A-Z)' },
    { value: 'desc', label: 'Last name (Z-A)' }
  ];
  sort: 'asc'|'desc' = 'asc';

  // pagination
  page: number = 1;
  pageOffset: number;
  itemsPerPage: number;
  resultsOnThisPage: number;
  totalResults: number;
  totalPages: number;

  @ViewChild('picker') agencyPicker: AgencyPickerComponent;

  constructor(private route: ActivatedRoute, private userAccessService: UserAccessService) {
    this.allDomains = this.route.parent.snapshot.data['domains']._embedded.domainList;
    this.domainOptions = this.allDomains.map(dom => {
      return {
        label: dom.domainName,
        value: dom.id,
        name: dom.domainName
      };
    });

    let domainDefinition = this.route.snapshot.data['domainDefinition'];
    let byId = _.keyBy(domainDefinition, (domain) => {
      return domain.domain.id;
    });
    Object.keys(byId).forEach(key => {
      byId[key] = byId[key].roleDefinitionMapContent || [];
    });
    this.rolesForDomainId = byId;
    this.doSearch();
  }

  onClearAllClick() {
    this.selectedOrganization = null;
    this.agencyPicker.onResetClick();
    this.selectedDomainId = null;
    this.selectedRoleId = null;
    this.doSearch();
  }

  getOptionsForDomain(domainId): Array<OptionsType> {
    if (!this.rolesForDomainId[domainId] || !this.rolesForDomainId[domainId].length) {
      return [];
    }
    return this.rolesForDomainId[domainId].map(role => {
      return {
        value: role.role.id,
        label: role.role.val,
        name: role.role.val
      };
    });
  }

  onSortChange(sort) {
    this.doSearch();
  }

  doSearch() {
    let filterOptions: any = {
      order: this.sort,
      page: this.page,
    };

    if (this.selectedDomainId) {
      filterOptions.domainKey = this.selectedDomainId;
    }
    if (this.selectedRoleId) {
      filterOptions.roleKey = this.selectedRoleId;
    }
    if (this.selectedOrganization) {
      filterOptions.orgKey = this.selectedOrganization;
    }
    if (this.userSearchValue) {
      filterOptions.user = this.userSearchValue;
    }

    this.userAccessService.getUserDirectory(filterOptions)
      .subscribe(res => {
        this.users = res.users;

        this.resultsOnThisPage = this.users.length;
        this.totalResults = res.total;
        this.itemsPerPage = res.limit;
        this.pageOffset = res.offset;
        this.totalPages = Math.floor((res.total-1) / res.limit)+1;

        // group user organizations by tier
        this.users.forEach(u => {
          let orgsByTier = _.groupBy(u.access, acc => {
            return acc.organization.type || 'Uncategorized';
          });

          let tiers = [];
          _.forOwn(orgsByTier, (value, key) => {
            let orgs = value.map(o => {
              let v = {
                name: o.organization.val,
                isSelected: o.organization.isSelected
              };
              return v;
            });
            // do not display orgs with no name
            orgs = orgs.filter(o => {
              return o && o.name;
            });
            tiers.push({ name: key, organizations: orgs});
          });

          // do not display tier if there no organizations with a name for this tier
          tiers = tiers.filter(t => {
            return t.organizations.length;
          });
          u.tiers = tiers;
        });
      }
    );
  }

  onOrganizationChange(org) {
    if (org && org.value) {
      this.selectedOrganization = org.value;
    } else {
      this.selectedOrganization = undefined;
    }
    this.doSearch();
  }

  onSelectDomain($event) {
    this.selectedRoleId = null;
    this.roleOptions = this.getOptionsForDomain($event);
    this.doSearch();
  }

  onSelectRole($event) {
    this.doSearch();
  }

  onPageChange($event) {
    this.page = $event;
    this.doSearch();
  }

  resultCount() {
    let pageStart = this.pageOffset + 1;
    let pageEnd = pageStart + this.resultsOnThisPage - 1;
    let total = this.totalResults;
    return `${pageStart}-${pageEnd} of ${total}`;
  }
}
