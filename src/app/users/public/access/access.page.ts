import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { UserAccessService, UserAccessFilterOptions } from "api-kit/access/access.service";
import { UserAccessModel } from "../../access.model";
import { ActivatedRoute} from "@angular/router";
import { FHService } from "api-kit/fh/fh.service";
import { Organization } from "../../../organization/organization.model";
import { Observable } from "rxjs";
import { SamAccordionComponent } from "samUIKit/components/accordion/accordion.component";
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
    private userService: UserAccessService,
    private route: ActivatedRoute,
    private fhService: FHService,
  ) { }

  ngOnInit() {
    this.userName = this.route.parent.snapshot.params['id'];

    this.userService.getAccess(this.userName).subscribe(res => {
      this.userAccessModel = UserAccessModel.FromResponse(res);
      this.filters.domains.options = this.userAccessModel.allDomains().map(this.mapLabelAndName);
      this.filters.roles.options = this.userAccessModel.allRoles().map(this.mapLabelAndName);
      this.filters.permissions.options = this.userAccessModel.allPermissions().map(this.mapLabelAndName);
      this.filters.objects.options = this.userAccessModel.allObjects().map(this.mapLabelAndName);

      this.getOrganizationData(this.userAccessModel.allOrganizations());
    });
  }

  mapLabelAndName(val) {
    return { label: val.val, value: val.id };
  }

  orgsChanged(orgs) {
    this.filters.organizations.value = orgs;
    this.filterChanged();
  }

  rolesChanged(roles) {
    this.filters.roles.value = roles;
    this.filterChanged();
  }

  domainsChanged(domains) {
    this.filters.domains.value = domains;
    this.filterChanged();
  }

  objectsChanged(objects) {
    this.filters.objects.value = objects;
    this.filterChanged();
  }

  permissionsChanged(perms) {
    this.filters.permissions.value = perms;
    this.filterChanged();
  }

  filterChanged() {
    const filterOptions: UserAccessFilterOptions = {
      organizationIds: this.filters.organizations.value,
      domainIds: this.filters.domains.value,
      roleIds: this.filters.roles.value,
      permissionIds: this.filters.permissions.value,
      functionIds: this.filters.objects.value,
    };

    this.userService.getAccess(this.userName, filterOptions).subscribe(res => {
      this.userAccessModel = UserAccessModel.FromResponse(res);
      this.expandAll();
    });
  }

  findOrg(orgId): Organization {
    if (this.organizations && orgId && orgId.trim()) {
      let orgNumber = parseInt(orgId.trim());
      if (isNaN(orgNumber)) {
        return;
      }
      return this.organizations.find(org => orgNumber === org.id);
    }
  }

  orgLevel(orgId) {
    let org: Organization = this.findOrg(orgId);
    if (org) {
      return this.capitalize.transform(org.orgLevel);
    }
  }

  orgName(orgId) {
    let org: Organization = this.findOrg(orgId);
    if (org) {
      return org.orgName;
    }
  }

  // call the endpoint for all organizations in parallel, wait for each to finish and assign to this.organizations
  getOrganizationData(orgIds: any[]) {
    let sources = orgIds.map(orgId => this.fhService.getOrganizationById(orgId, false, true));
    Observable.forkJoin(sources).subscribe(
      orgs => {
        this.organizations = orgs.map(org => Organization.FromResponse(org));
        this.filters.organizations.options = this.organizations.map(o => {
          return { label: o.orgName, value: o.id }
        });
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
