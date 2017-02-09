import { Component, OnInit } from '@angular/core';
import {UserService, UserAccessFilterOptions} from "api-kit/user/user.service";
import { UserAccessModel } from "../../access.model";
import {ActivatedRoute} from "@angular/router";


@Component({
  templateUrl: 'access.template.html'
})
export class UserAccessPage implements OnInit {

  private userAccessModel: UserAccessModel;
  private userName: string;

  private filters = {
    organizations: { label: 'Organizations', options: [ ], value: [] },
    roles: { label: 'Roles', options: [ ], value: [] },
    domains: { label: 'Domains', options: [ ], value: [] },
    permissions: { label: 'Permissions', options: [ ], value: [] },
    objects: { label: 'Objects', options: [ ], value: [] }
  };

  private orgData;

  constructor(private userService: UserService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log(params);
      this.userName = params['id'];
      this.userService.getAccess(this.userName).subscribe(res => {
        this.userAccessModel = UserAccessModel.FromResponse(res);
        this.filters.domains.options = this.userAccessModel.allDomains().map(this.mapLabelAndName);
        this.filters.organizations.options = this.userAccessModel.allOrganizations().map(this.mapLabelAndName);
        this.filters.roles.options = this.userAccessModel.allRoles().map(this.mapLabelAndName);
        this.filters.permissions.options = this.userAccessModel.allPermissions().map(this.mapLabelAndName);
        this.filters.objects.options = this.userAccessModel.allObjects().map(this.mapLabelAndName);
      });
    });
  }

  mapLabelAndName(val) {
    return { label: val, value: val };
  }

  filterChanged() {
    const orgs = this.filters.organizations.value;
    const domains = this.filters.domains.value;
    const roles = this.filters.roles.value;
    const permissions = this.filters.permissions.value;
    const objects = this.filters.objects.value;

    const filterOptions: UserAccessFilterOptions = {
      organizationIds: orgs,
      domainIds: domains,
      roleIds: roles,
      permissionIds: permissions,
      functionIds: objects,
    };

    this.userService.getAccess('00.T.BRENDAN.MCDONOUGH@GSA.GOV', filterOptions).subscribe(res => {
      this.userAccessModel = UserAccessModel.FromResponse(res);
    });
  }

  orgLevel(orgId) {
    return "USA Department of Agriculture";
  }
}
