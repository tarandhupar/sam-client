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
import { Title } from "@angular/platform-browser";
import { Cookie } from "ng2-cookies";

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

  // Edit page only
  private userAccess: UserAccessModel;

  private userCameFromRoleWorkspace: boolean = false;

  private objectsEditable: boolean = true;
  private requestId: any = null;
  private request: any;
  private adminLevel: number;

  constructor(
    private userService: UserAccessService,
    private route: ActivatedRoute,
    private footerAlert: AlertFooterService,
    public router: Router,
    private pageScrollService: PageScrollService,
    private fhService: FHService,
    private titleService: Title,
  ) {
    PageScrollConfig.defaultDuration = 500;
  }

  ngOnInit() {
    this.titleService.setTitle('User Access');
    let adminLevel = parseInt(Cookie.get('adminLevel'));
    this.adminLevel = isNaN(adminLevel) ? null : adminLevel;
    this.userName = this.route.snapshot.params['id'];
    this.userCameFromRoleWorkspace = !!this.route.snapshot.queryParams['ref'];

    if (this.userCameFromRoleWorkspace) {
      this.domain = +this.route.snapshot.queryParams['domain'];
      this.requestId = this.route.snapshot.queryParams['request'];
      this.request = this.route.snapshot.data['request'];
      this.getRoles();
    }

    this.determinePageModeFromURL();
    this.getDomains();
    if (this.mode === 'edit') {
      this.initializePageFromQueryParameters();
    }
  }

  getAccess() {
    return this.userService.getAccess(this.userName, {
      domainKey: this.domain,
      roleKey: this.role,
      orgKey: this.orgs.join(',')
    });
  }

  getDomains() {
    this.userService.getDomains().subscribe(
      domains => {
        this.domainOptions = domains._embedded.domainList.map(domain => {
          return { value: domain.id, label: domain.domainName };
        });

        if (this.userCameFromRoleWorkspace) {
          this.request.domainName = this.labelForDomain(this.request.domainId);
        }
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
      this.orgs = queryParams["orgs"].split(',');
      let obsAccess = this.getAccess();
      this.getRoles().switchMap(() => obsAccess).subscribe(
        res => {
          this.userAccess = UserAccessModel.FromResponse(res);
          this.onRoleChange(this.role);
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

      if (queryParams['orgs']) {
        let orgIds = queryParams["orgs"].split(',');
        if (orgIds.length) {
          this.prePopulateOrgs(orgIds);
        }
      }
    });
  }

  determinePageModeFromURL() {
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
    let roleIsCurrentRole = false;
    this.role = role;

    let userRole;
    if (this.userAccess) {
      userRole = this.userAccess.raw().domainMapContent[0].roleMapContent[0];
      if (+userRole.role.id === +this.role) {
        roleIsCurrentRole = true;
      }
    }

    if (role) {
      this.errors.role = '';
    }

    let r = this.roles.find(role => {
      return +role.role.id === +this.role;
    });

    if (r) {
      this.objects = r.functionContent;
    } else {
      // the user selected a role that is not in the roles table (it may not have been fetched yet)
      this.objects = [];
    }
  }

  userHasPermission(fid, pid) {
    let userFunctions =  this.userAccess.raw().domainMapContent[0].roleMapContent[0].organizationMapContent[0].functionMapContent;
    let found = false;
    userFunctions.forEach(fun => {
      if (fun.function.id === fid) {
        fun.permission.forEach(perm => {
          if (perm.id === pid) {
            found = true;
          }
        });
      }
    });
    return found;
  }

  getRoles() {
    let obs;
    if (this.mode === 'edit') {
      obs = this.userService.getRoles({domainID: this.domain, keepRoles: this.role}, this.userName, this.adminLevel).share();
    } else {
      obs = this.userService.getRoles({domainID: this.domain}, undefined, this.adminLevel).share();
    }

    obs.subscribe(
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

    return obs;
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

  goToRoleWorkspace() {
    this.router.navigate(['/access/requests']);
  }

  isFormValid() {
    if (this.userCameFromRoleWorkspace) {
      return this.orgs && this.orgs.length && this.domain && this.role && this.messages;
    }

    switch (this.mode) {
      case 'edit':
      case 'grant':
        return this.orgs && this.orgs.length  && this.domain && this.role;
      case 'request':
        return this.domain
          && this.messages
          && this.supervisorName
          && this.supervisorName.length
          && this.supervisorEmail
          && this.supervisorEmail.length;
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
      if (!this.supervisorName || !this.supervisorName.length) {
        this.errors.supervisorName = 'Supervisor name is required';
      }
      if (!this.supervisorEmail || !this.supervisorEmail.length) {
        this.errors.supervisorEmail = 'Supervisor email is required';
      }
      if (!this.messages || !this.messages.length) {
        this.errors.messages = "A message is required";
      }
    }

    if (this.userCameFromRoleWorkspace) {
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
      return "Send your Role Administrator the names of the organizations and roles you are requesting and why."
    } else {
      if (this.userCameFromRoleWorkspace) {
        return "Include a message with your response.";
      } else {
        return "(Optional) Include a message with your response.";
      }
    }
  }

  isMessageRequired() {
    return this.mode === 'request' || this.userCameFromRoleWorkspace;
  }

  onCancelClick() {
    if (this.userCameFromRoleWorkspace) {
      this.goToRoleWorkspace();
    } else {
      this.goToAccessPage();
    }
  }

  onGrantClick() {
    if (!this.isFormValid()) {
      this.showErrors();
      return;
    }

    if (this.mode === 'request') {
      let obj = UserAccessModel.CreateRequestObject(this.userName, this.supervisorName, this.supervisorEmail, this.domain, this.messages);
      this.userService.requestAccess(obj, this.userName).delay(1000).subscribe(
        res => {
          this.footerAlert.registerFooterAlert({
            title:"Success",
            description: 'Your request has been submitted',
            type:'success',
            timer:3000
          });
          this.goToAccessPage();
        },
        err => {
          this.footerAlert.registerFooterAlert({
            title:"There was an error while trying to grant access.",
            description:"",
            type:'error',
            timer:3200
          });
        }
      );

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
    let role = parseInt(this.role);
    let domain = parseInt(this.domain);

    let access;
    let params = {};
    if (this.mode === 'grant') {
      if (!this.userCameFromRoleWorkspace) {
        access = UserAccessModel.CreateGrantObject(
          this.userName,
          role,
          domain,
          orgIds,
          funcs,
          this.messages,
        );
      } else {
        let funcs2: any = this.objects.map(obj => {
          let perms = obj.permission.filter(p => !p.notChecked).map(p => p.id);
          return {
            function: obj.function.id,
            permission: perms
          }
        });

        params = {
          userAccessRequestId: this.requestId
        };
        access = UserAccessModel.CreateGrantAndAcceptObject(this.messages, this.userName, domain, role, orgIds, funcs2);
      }

    } else if (this.mode === 'edit') {
      access = UserAccessModel.CreateEditObject(
        this.userName,
        role,
        domain,
        orgIds,
        funcs,
        this.messages,
        this.userAccess
      );
    }

    this.userService.postAccess(access, this.userName, params).delay(2000).subscribe(
      res => {
        let verb = this.mode === 'edit' ? 'Updated' : this.mode === 'grant' ? 'Granted' : 'Updated';
        this.footerAlert.registerFooterAlert({
          title:`Access ${verb}.`,
          description:`You have successfully ${verb.toLowerCase()} this user access`,
          type:'success',
          timer:3000
        });

        if (this.userCameFromRoleWorkspace) {
          this.goToRoleWorkspace();
        } else {
          this.goToAccessPage();
        }
      },
      error => {
        if (error.status === 409) {
          this.errors.org = 'The user already has access for this domain at one or more of the selected organization(s)';
          this.scrollToHead();
        } else {
          this.footerAlert.registerFooterAlert({
            title:"Unable to save access information.",
            description:"",
            type:'error',
            timer:3200
          });
        }

      }
    );
  }

  onPermissionClick(perm) {
    perm.notChecked = !perm.notChecked;
  }

  submitButtonText() {
    if (this.userCameFromRoleWorkspace) {
      return "Approve";
    } else {
      return "Submit";
    }
  }
}
