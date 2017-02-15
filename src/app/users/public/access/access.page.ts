import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { UserService, UserAccessFilterOptions } from "api-kit/user/user.service";
import { UserAccessModel } from "../../access.model";
import { ActivatedRoute} from "@angular/router";
import { FHService } from "api-kit/fh/fh.service";
import { Organization } from "../../../organization/organization.model";
import { Observable } from "rxjs";
import { SamAccordionComponent } from "ui-kit/accordion/accordion.component";
import { CapitalizePipe } from "../../../app-pipes/capitalize.pipe";


@Component({
  templateUrl: 'access.template.html'
})
export class UserAccessPage implements OnInit {

  private userAccessModel: UserAccessModel;

  private filters = {
    organizations: { label: 'Organizations', options: [ ], value: [] },
    roles: { label: 'Roles', options: [ ], value: [] },
    domains: { label: 'Domains', options: [ ], value: [] },
    permissions: { label: 'Permissions', options: [ ], value: [] },
    objects: { label: 'Objects', options: [ ], value: [] }
  };

  private userName: string;
  private organizations: Organization[];

  @ViewChildren(SamAccordionComponent) allAccordions: QueryList<SamAccordionComponent>;

  private showCollapse = false;
  private capitalize = new CapitalizePipe();

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private fhService: FHService,
  ) { }

  ngOnInit() {
    this.userName = this.route.parent.snapshot.params['id'];

    this.userService.getAccess(this.userName).subscribe(res => {
      this.userAccessModel = UserAccessModel.FromResponse(res);
      this.filters.domains.options = this.userAccessModel.allDomains().map(this.mapLabelAndName);
      this.filters.organizations.options = this.userAccessModel.allOrganizations().map(org => {
        return { label: org, value: org};
      });
      this.filters.roles.options = this.userAccessModel.allRoles().map(this.mapLabelAndName);
      this.filters.permissions.options = this.userAccessModel.allPermissions().map(this.mapLabelAndName);
      this.filters.objects.options = this.userAccessModel.allObjects().map(this.mapLabelAndName);

      this.getOrganizationData(this.userAccessModel.allOrganizations());
    });
  }

  mapLabelAndName(val) {
    return { label: val.val, value: val.id };
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

    this.userService.getAccess(this.userName, filterOptions).subscribe(res => {
      this.userAccessModel = UserAccessModel.FromResponse(res);
    });
  }

  orgLevel(orgId) {
    if (this.organizations) {
      let orgNumber = parseInt(orgId);
      if (isNaN(orgNumber)) {
        return;
      }
      let org: Organization = this.organizations.find(org => orgNumber === org.id);
      if (org) {
        return this.capitalize.transform(org.orgLevel);
      }
    }
  }

  // call the endpoint for all organizations in parallel, wait for each to finish and assign to this.organizations
  getOrganizationData(orgIds: any[]) {
    let sources = orgIds.map(orgId => this.fhService.getOrganizationById(orgId, false, true));
    Observable.forkJoin(sources).subscribe(
      orgs => {
        this.organizations = orgs.map(org => Organization.FromResponse(org));
      },
      err => {
        console.error('Unabled to fetch org data. Error', err);
      }
    );
  }

  collapseAll() {
    this.allAccordions.forEach(acc => acc.setExpandIndex(-1));
    this.showCollapse = false;
  }

  expandAll() {
    this.allAccordions.forEach(acc => acc.setExpandIndex(0));
    this.showCollapse = true;
  }
}
