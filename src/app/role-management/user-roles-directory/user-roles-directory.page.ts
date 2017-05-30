import { Component } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { OptionsType } from "sam-ui-kit/types";
import { UserAccessService } from "api-kit/access/access.service";
import * as _ from "lodash";
import { Observable } from "rxjs";


@Component({
  templateUrl: './user-roles-directory.template.html'
})
export class UserRolesDirectoryPage {
  allDomains: Array<any> = [];
  rolesForDomainId: any = {};
  users: any = null;

  //filters
  domainOptions: Array<OptionsType> = [];
  roleOptions: Array<OptionsType> = [];
  isShowMyPeopleChecked: boolean = false;
  selectedDomainId: string|number = null;
  selectedRoleId: string|number = null;
  selectedOrganization: string|number|undefined;
  userSearchValue: string = '';

  // pagination
  pageOffset: number = 0;
  itemsPerPage: number = 10;
  resultsOnThisPage: number = 8;
  totalResults: number = 300000;

  constructor(private route: ActivatedRoute, private userAccessService: UserAccessService) {
    this.allDomains = this.route.parent.snapshot.data['domains']._embedded.domainList;
    this.domainOptions = this.allDomains.map(dom => {
      return {
        label: dom.domainName + `(${dom.id})`,
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

  getOptionsForDomain(domainId): Array<OptionsType> {
    if (!this.rolesForDomainId[domainId] || !this.rolesForDomainId[domainId].length) {
      return [];
    }
    return this.rolesForDomainId[domainId].map(role => {
      return {
        value: role.role.id,
        label: role.role.val + `(${role.role.id})`,
        name: role.role.val
      };
    });
  }

  doSearch() {
    // let filterOptions: any = {
    //   offset: this.pageOffset,
    //   limit: this.itemsPerPage,
    // };
    let filterOptions: any = {};
    if (this.selectedDomainId !== null) {
      filterOptions.domainKey = this.selectedDomainId;
    }
    if (this.selectedRoleId !== null) {
      filterOptions.roleKey = this.selectedRoleId;
    }
    if (this.selectedOrganization) {
      filterOptions.orgKey = this.selectedOrganization;
    }
    if (this.userSearchValue) {
      filterOptions.userKey = this.userSearchValue;
    }
    // if (this.isShowMyPeopleChecked) {
    //   filterOptions.myPeople = "true";
    // }
    this.userAccessService.getAccessODR(filterOptions)
      .catch(err => {
        console.error(err);
        return Observable.of([]);
      })
      .subscribe(res => {
        this.users = res;
        this.initializeSelectedOrgs();
      }
    );
  }

  initializeSelectedOrgs() {
    this.users.forEach(user => {
      user.selectedOrganization = user.organizations[0];
    });
  }

  onOrganizationChange($event) {
    this.selectedOrganization = $event.value;
    this.doSearch();
  }

  classForOrganization(user, org) {
    if (user.selectedOrganization === org) {
      return 'org-row-selected';
    }
    return '';
  }

  onOrgRowClick(user, org) {
    if (user.selectedOrganization === org) {
      return;
    }
    user.selectedOrganization = org;
  }

  userHasOrganizations(user) {
    return user.organizations && user.organizations.length;
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
    this.pageOffset = $event - 1;
    this.doSearch();
  }

  resultCount() {
    let pageStart = this.pageOffset * this.itemsPerPage + 1;
    let pageEnd = pageStart + this.resultsOnThisPage - 1;
    let total = this.totalResults;
    return `${pageStart}-${pageEnd} of ${total}`;
  }
}
