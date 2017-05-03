import { Component, OnInit, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { UserAccessService, UserAccessFilterOptions } from "api-kit/access/access.service";
import { UserAccessModel } from "../../access.model";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { FHService } from "api-kit/fh/fh.service";
import { Organization } from "../../../organization/organization.model";
import { Observable } from "rxjs";
import { SamAccordionComponent } from "sam-ui-kit/components/accordion/accordion.component";
import { CapitalizePipe } from "../../../app-pipes/capitalize.pipe";
import { SamModalComponent } from "sam-ui-kit/components/modal";
import { AlertFooterService } from "../../../alerts/alert-footer/alert-footer.service";
import { Cookie } from 'ng2-cookies';

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
  private isAdmin: boolean = false;
  private organizations: Organization[];
  private allDomains: any[] = [];

  @ViewChildren(SamAccordionComponent) allAccordions: QueryList<SamAccordionComponent>;
  @ViewChild('deleteModal') deleteModal: SamModalComponent;

  private showCollapse = false;
  private capitalize = new CapitalizePipe();
  private modalRole = {
    role: {
      id: null,
      val: null
    },
    organizationMapContent: [
      { organizations: []}
    ]
  };
  private modalDomain = {
    id: null,
    val: null,
  };

  private requests: any[] = [];

  constructor(
    private userService: UserAccessService,
    private route: ActivatedRoute,
    private fhService: FHService,
    private router: Router,
    private footerAlert: AlertFooterService,
  ) { }

  ngOnInit() {
    this.isAdmin = Cookie.get('isAdmin') === 'true';
    this.userName = this.route.parent.snapshot.params['id'];

    this.userService.getAccess(this.userName).subscribe(
      res => {
        this.userAccessModel = UserAccessModel.FromResponse(res);
        this.filters.domains.options = this.userAccessModel.allDomains().map(this.mapLabelAndName);
        this.filters.roles.options = this.userAccessModel.allRoles().map(this.mapLabelAndName);
        this.filters.permissions.options = this.userAccessModel.allPermissions().map(this.mapLabelAndName);
        this.filters.objects.options = this.userAccessModel.allObjects().map(this.mapLabelAndName);
        this.getOrganizationData(this.userAccessModel.allOrganizations());
      },
      err => {
        this.footerAlert.registerFooterAlert({
          title: "Error",
          description: "Unable to access information for: "+this.userName,
          type:'error',
          timer:3000
        });
      }
    );

    this.userService.getPendingRequests(this.userName, { status: 'pending' }).subscribe(reqs => {
      this.requests = reqs;
    }, err => {
      this.showGenericError();
    });

    this.userService.getDomains().subscribe(
      doms => {
        this.allDomains = doms._embedded.domainList;
      },
      errs => {
        this.footerAlert.registerFooterAlert({
          title: "Error",
          description: "There was an error with a required service",
          type:'error',
          timer:2000
        });
      }
    );
  }

  trimRequest(message) {
    if (message.length > 70) {
      return message.slice(0, 70) + '...';
    } else {
      return message;
    }
  }



  onDeleteRoleClick(role, domain) {
    this.modalRole = role;
    this.modalDomain = domain;
    this.deleteModal.openModal();
  }

  onEditClick(role, domain, orgs) {
    let extras: NavigationExtras = {
      relativeTo: this.route,
      queryParams: {
        role: role.role.id,
        domain: domain.domain.id,
        orgs: orgs.join(',')
      }
    };
    this.router.navigate(['../edit-access'], extras);
  }

  onDeleteConfirm() {
    let deleteBody = UserAccessModel.CreateDeletePartial(this.userName, this.modalRole.role.id, this.modalDomain.id, this.modalRole.organizationMapContent[0].organizations);
    this.userService.postAccess(deleteBody, this.userName).subscribe(
      res => {
        window.location.reload();
      },
      err => {
        this.footerAlert.registerFooterAlert({
          title: "Error",
          description: "Delete failed",
          type:'error',
          timer:3000
        });
      }
    );
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
    const queryParams: any = { };

    if (this.filters.domains.value && this.filters.domains.value.length) {
      queryParams.domainKey = this.filters.domains.value.join(',');
    }

    if (this.filters.objects.value && this.filters.objects.value.length) {
      queryParams.functionKey = this.filters.objects.value.join(',');
    }

    if (this.filters.roles.value && this.filters.roles.value.length) {
      queryParams.roleKey = this.filters.roles.value.join(',');
    }

    if (this.filters.organizations.value && this.filters.organizations.value.length) {
      queryParams.orgKey = this.filters.organizations.value.join(',');
    }

    if (this.filters.permissions.value && this.filters.permissions.value.length) {
      queryParams.permissionKey = this.filters.permissions.value.join(',');
    }

    this.userService.getAccess(this.userName, queryParams).subscribe(res => {
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
    let sources = orgIds.map(orgId => {
      return this.fhService.getOrganizationById(orgId, false, true)
        .catch(err => {
          return Observable.of(null);
        });
    });
    Observable
      .forkJoin(sources)
      .subscribe(
        orgs => {
          // filter out the null organizations. If the services returns a 4xx-5xx we set org to null
          this.organizations = orgs.filter(o => o);
          this.organizations = this.organizations.map(org => Organization.FromResponse(org));
          this.filters.organizations.options = this.organizations.map(o => {
            return { label: o.orgName, value: o.id }
          });
        },
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

  onShowPermissionsClick(role) {
    role.isOpen = !role.isOpen;
  }

  hasSelectAll(options) {
    return options.length > 4;
  }

  onCancelRequestClick(requestId, i) {
    let newStatus = {
      status: 'cancel',
    };
    this.userService.updateRequest(requestId, newStatus).subscribe(
      res => {
        this.requests.splice(i, 1);
        this.footerAlert.registerFooterAlert({
          title:"Request canceled.",
          description:"Request for access successfully canceled.",
          type:'success',
          timer:3000
        });
      },
      err => {
        this.showGenericError();
      }
    );

  }

  getDomainNameById(domainId: any) {
    let dom = this.allDomains.find(d => ''+d.id === ''+domainId);
    if (dom) {
      return dom.domainName;
    }
  }

  showGenericError() {
    this.footerAlert.registerFooterAlert({
      title: "Service Error",
      description: "There was an error with a required service",
      type:'error',
      timer:2000
    });
  }
}
