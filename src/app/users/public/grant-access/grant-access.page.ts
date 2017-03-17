import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { UserAccessService } from "api-kit/access/access.service";
import { UserAccessModel } from "../../access.model";
import { ActivatedRoute, Router } from "@angular/router";

import { AlertFooterService } from "../../../alerts/alert-footer/alert-footer.service";
import { UserAccessInterface } from "api-kit/access/access.interface";
import { PropertyCollector } from "../../../app-utils/property-collector";
import { PageScrollService, PageScrollInstance, PageScrollConfig } from "ng2-page-scroll";
import { FHService } from "../../../../api-kit/fh/fh.service";
import { Observable } from "rxjs";
import { Organization } from "../../../organization/organization.model";
import { IRole } from "../../../../api-kit/access/role.interface";

@Component({
  templateUrl: 'grant-access.template.html'
})
export class GrantAccessPage implements OnInit {

  private errors = {
    role: '',
    domain: '',
    org: '',
    supervisorName: '',
    supervisorEmail: '',
    messages: ''
  };

  private userName: string = "";
  public orgs = [];
  private domain;
  private domainOptions = [];
  private role;
  public roleOptions = [];

  private roles: Array<IRole> = [];
  private objects = [];

  private messages: string = "";
  private mode: 'edit'|'grant'|'request' = 'grant';

  // Request page only
  private supervisorName: string = "";
  private supervisorEmail: string = "";

  constructor(
    private userService: UserAccessService,
    private route: ActivatedRoute,
    private footerAlert: AlertFooterService,
    public router: Router,
    private pageScrollService: PageScrollService,
    private fhService: FHService,
  ) {
    PageScrollConfig.defaultDuration = 500;
  }

  ngOnInit() {
    this.userName = this.route.parent.snapshot.params['id'];
    this.determinePageMode();
    this.getDomains();
    if (this.mode === 'edit') {
      this.initializePageFromQueryParameters();
    }

  }

  getDomains() {
    this.userService.getDomains().subscribe(
      domains => {
        this.domainOptions = domains._embedded.domainList.map(domain => {
          return { value: domain.id, label: domain.domainName };
        });
      },
      error => {
        this.footerAlert.registerFooterAlert({
          title:"Unable to fetch access information.",
          description:"",
          type:'error',
          timer:0
        });
      }
    );
  }

  initializePageFromQueryParameters() {
    this.route.queryParams.subscribe(queryParams => {
      this.role = parseInt(queryParams["role"]);
      this.domain = parseInt(queryParams["domain"]);
      this.getRoles();
      if (queryParams['orgs']) {
        let orgIds = queryParams["orgs"].split(',');
        if (orgIds.length) {
          this.prePopulateOrgs(orgIds);
        }
      }
    });
  }

  determinePageMode() {
    let match = this.router.url.match('edit-access');
    if(match && match.length) {
      this.mode = 'edit';
    }
    match = this.router.url.match('grant-access');
    if (match && match.length) {
      this.mode = 'grant';
    }
    match = this.router.url.match('request-access');
    if (match && match.length) {
      this.mode = 'request';
    }
  }

  prePopulateOrgs(orgIds) {
    let sources = orgIds.map(orgId => this.fhService.getOrganizationById(orgId, false, true));
    Observable.forkJoin(sources).subscribe(
      orgs => {
        this.orgs = orgs.map(org => Organization.FromResponse(org)).map(org => {
          return {
            name: org.orgName,
            value: org.id
          };
        });
      },
      err => {
        this.footerAlert.registerFooterAlert({
          title:"Unable to get organization data",
          description:"",
          type:'error',
          timer:2000
        });
      }
    );
  }

  public scrollToHead(): void {
    let pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(document, '#form-top');
    this.pageScrollService.start(pageScrollInstance);
  };

  permissionId(permission, object) {
    return permission.val + '_' + object.function.val;
  }

  labelForDomain(domainId: number) {
    if (!this.domainOptions.length) {
      return;
    }
    let domain = this.domainOptions.find(dom => +dom.value === +domainId);
    if (domain) {
      return domain.label;
    } else {
      console.error('domain:', domainId, ' not found');
    }
  }

  onOrganizationsChange(orgs) {
    this.orgs = orgs;
  }

  onRoleChange(role) {
    if (role) {
      this.errors.role = '';
    }
    this.role = role;

    let r = this.roles.find(role => {
      return +role.role.id === +this.role;
    });

    if (r) {
      this.objects = r.functionContent;
    } else {
      this.objects = [];
    }
  }

  getRoles() {
    this.userService.getRoles({domainID: this.domain}).subscribe(
      perms => {
        this.roles = perms;
        let c = new PropertyCollector(perms);
        let roles = c.collect([[], 'role']);
        this.roleOptions = roles.map(role => {
          return { label: role.val, value: role.id };
        });
      },
      err => {
        this.roleOptions = [];
        this.footerAlert.registerFooterAlert({
          title:"Error",
          description:"Unable to retreive permissions for :"+this.labelForDomain(this.domain),
          type:'error',
          timer:2000
        });
      }
    );
  }

  onDomainChange(domain) {
    if (domain) {
      this.errors.domain = '';
    }
    this.domain = domain;
    this.role = null;
    this.roleOptions = [];
    this.objects = [];
    if (this.mode !== 'request') {
      this.getRoles();
    }
  }

  modeName() {
    switch (this.mode) {
      case 'edit': return 'Edit';
      case 'grant': return 'Grant';
      case 'request': return 'Request';
    }
  }

  goToAccessPage() {
    this.router.navigate(['../access'], { relativeTo: this.route });
  }

  isFormValid() {
    switch (this.mode) {
      case 'edit':
      case 'grant':
        return this.orgs && this.orgs.length && this.domain && this.role;
      case 'request':
        return this.domain && this.messages && this.supervisorName && this.supervisorName;
    }
  }

  showErrors() {
    if (!this.orgs || !this.orgs.length) {
      this.errors.org = 'Organization is required';
    }

    if (!this.role) {
      this.errors.role = 'Role is required';
    }

    if (!this.domain && this.domainOptions.length) {
      this.errors.domain = 'Domain is required';
    }

    if (this.mode === 'request') {
      if (!this.supervisorName) {
        this.errors.supervisorName = 'Supervisor name is required';
      }
      if (!this.supervisorEmail) {
        this.errors.supervisorEmail = 'Supervisor email is required';
      }
      if (!this.messages) {
        this.errors.messages = "A message is required";
      }
    }

    this.scrollToHead();
  }

  onSupervisorNameChange(name) {
    this.errors.supervisorName = '';
  }

  onSupervisorEmailChange(email) {
    this.errors.supervisorEmail = '';
  }

  onMessageChange(message) {
    this.errors.messages = '';
  }

  messagePlaceholder() {
    if (this.mode === 'request') {
      return "Please provide a message to your Role Administrator that includes the names of the organizations you need access to and why."
    } else {
      return "(Optional) Include a message with your response";
    }
  }

  onGrantClick() {
    if (!this.isFormValid()) {
      this.showErrors();
      return;
    }

    if (this.mode === 'request') {
      this.footerAlert.registerFooterAlert({
        title:"Success",
        description: 'Your request has been submitted',
        type:'success',
        timer:3000
      });
      this.goToAccessPage();
      return;
    }

    let orgIds = this.orgs.map(org => org.value);
    let funcs: any = this.objects.map(obj => {
      let perms = obj.permission.filter(p => !p.notChecked).map(p => p.id);
      return {
        id: obj.function.id,
        permissions: perms
      }
    });
    let access = UserAccessModel.CreateAccessObject(
      this.userName,
      parseInt(this.role),
      parseInt(this.domain),
      orgIds,
      funcs,
      this.messages,
    );

    this.userService.postAccess(access, this.userName).delay(2000).subscribe(
      res => {
        this.footerAlert.registerFooterAlert({
          title:"Access Granted.",
          description:'You have successfully granted this user access',
          type:'success',
          timer:3000
        });

        this.goToAccessPage();
      },
      error => {
        this.footerAlert.registerFooterAlert({
          title:"Unable to save access information.",
          description:"",
          type:'error',
          timer:0
        });
      }
    );
  }

  onPermissionClick(perm) {
    perm.notChecked = !perm.notChecked;
  }
}
