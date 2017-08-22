// angular
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Title } from "@angular/platform-browser";

// 3rd party
import { PageScrollService, PageScrollInstance, PageScrollConfig } from "ng2-page-scroll";

// services
import { UserAccessService } from "api-kit/access/access.service";
import { IRole } from "api-kit/access/role.interface";

// other
import { AlertFooterService } from "../../alerts/alert-footer/alert-footer.service";
import { UserAccessModel } from "../access.model";
import { PropertyCollector } from "../../app-utils/property-collector";
import { SamModalComponent } from "sam-ui-kit/components/modal";
import { UserService } from "../user.service";
import { CapitalizePipe } from "../../app-pipes/capitalize.pipe";
import { IBreadcrumb } from "sam-ui-kit/types";

@Component({
  templateUrl: 'grant-access.template.html'
})
export class GrantAccessPage implements OnInit {
  breadCrumbs: Array<IBreadcrumb> = [
    { url: '/workspace', breadcrumb: 'Workspace' },
    { url: '/access/user-roles-directory', breadcrumb: 'Role Management'},
    { url: '' /* '/users/{uname}/access'*/, breadcrumb: '' /*'{uname}'*/},
    { breadcrumb: '{mode} Access' }
  ];

  private errors = {
    role: '',
    domain: '',
    org: '',
    supervisorName: '',
    supervisorEmail: '',
    messages: ''
  };

  private userName: string = "";
  public org;
  private initialOrg;
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
  private user: any;

  @ViewChild('deleteModal') deleteModal: SamModalComponent;

  constructor(
    private userService: UserAccessService,
    private route: ActivatedRoute,
    private footerAlert: AlertFooterService,
    public router: Router,
    private pageScrollService: PageScrollService,
    private titleService: Title,
    private userCookieService: UserService,
    private capitalize: CapitalizePipe,
  ) {
    PageScrollConfig.defaultDuration = 500;
  }

  ngOnInit() {
    this.titleService.setTitle('User Access');
    this.userName = this.route.snapshot.params['id'];

    this.userCameFromRoleWorkspace = !!this.route.snapshot.queryParams['ref'];

    if (this.userCameFromRoleWorkspace) {
      this.domain = +this.route.snapshot.queryParams['domain'];
      this.requestId = this.route.snapshot.queryParams['request'];
      this.request = this.route.snapshot.data['request'];
      this.getRoles();
    }

    //this.determinePageModeFromURL();
    this.mode = this.route.snapshot.data['mode'];
    this.getDomains();
    if (this.mode === 'edit') {
      this.initializePageFromQueryParameters();
    }
    this.user = this.userCookieService.getUser();

    this.breadCrumbs[2].breadcrumb = this.userName;
    this.breadCrumbs[2].url = `/users/${this.userName}/access`;
    let m = this.mode === 'grant' ? "Grant" : "Edit";
    this.breadCrumbs[3].breadcrumb = `${m} Access`;
  }

  getAccess() {
    return this.userService.getAccess(this.userName, {
      domainKey: this.domain,
      roleKey: this.role,
      orgKey: this.org.value,
    });
  }

  getDomains() {
    this.userService.getDomains().subscribe(
      domains => {
        this.domainOptions = domains._embedded.domainList.map(domain => {
          return { value: domain.id, label: this.capitalize.transform(domain.domainName) };
        });

        if (this.userCameFromRoleWorkspace) {
          this.request.domainName = this.labelForDomain(this.request.domainId);
        }
      },
      error => {
        this.footerAlert.registerFooterAlert({
          title:"Unable to fetch domain information.",
          description:"",
          type:'error',
          timer:3200
        });
      }
    );
  }

  initializePageFromQueryParameters() {
    let queryParams = this.route.snapshot.queryParams;
    this.role = parseInt(queryParams["role"]);
    this.domain = parseInt(queryParams["domain"]);
    if (queryParams['orgs']) {
      let oid = queryParams["orgs"]
      this.org = { value: oid };
      this.initialOrg = [oid];
    }
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

  onDeleteClick() {
    this.deleteModal.openModal();
  }

  onDeleteConfirm() {
    let queryParams = this.route.snapshot.queryParams;
    let roleId = parseInt(queryParams["role"]);
    let domainId = parseInt(queryParams["domain"]);
    let orgId = queryParams["orgs"];
    let deleteBody = UserAccessModel.CreateDeletePartial(this.userName, roleId, domainId, [orgId]);
    this.userService.postAccess(deleteBody, this.userName).subscribe(
      res => {
        this.deleteModal.closeModal();
        this.footerAlert.registerFooterAlert({
          title:"",
          description:"Successfully deleted this access.",
          type:'success',
          timer:3200
        });
        this.goToUserAccessPage();
      }, err => {
        this.footerAlert.registerFooterAlert({
          title:"",
          description:"Unable to delete access object.",
          type:'error',
          timer:3200
        });
      });
  }

  onOrganizationsChange(org) {
    this.org = org;
  }

  onRoleChange(role) {
    let roleIsCurrentRole = false;
    this.role = role;

    let userRole;
    if (this.userAccess) {
      let userRL = this.userAccess.raw();
      userRole = userRL.domainMapContent[0].roleMapContent[0];

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

      if (roleIsCurrentRole) {
        this.objects.forEach(fun => {
          let fid = fun.function.id;
          fun.permission.forEach(perm => {
            let pid = perm.id;

            if (!this.userHasPermission(fid, pid)) {
              perm.isCheckable = false;
            }
          });
        });
      }
    } else {
      // the user selected a role that is not in the roles table (it may not have been fetched yet)
      this.objects = [];
    }
  }

  userHasPermission(fid, pid) {
    let userRL = this.userAccess.raw();
    let userFunctions =  userRL.domainMapContent[0].roleMapContent[0].organizationMapContent[0].functionMapContent;
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
      obs = this.userService.getRoles({domainID: this.domain, keepRoles: this.role}, this.userName).share();
    } else {
      obs = this.userService.getRoles({domainID: this.domain}, undefined).share();
    }

    obs.subscribe(
      perms => {
        this.roles = perms;
        let c = new PropertyCollector(perms);
        let roles = c.collect([[], 'role']);
        this.roleOptions = roles.map(role => {
          return { label: this.capitalize.transform(role.val), value: role.id };
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

  goToUserAccessPage() {
    this.router.navigate(['/users', this.userName, 'access'])
  }

  goToMyAccessPage() {
    this.router.navigate(['../access'], { relativeTo: this.route });
  }

  goToRoleWorkspace() {
    this.router.navigate(['/access/requests']);
  }

  isFormValid() {
    if (this.userCameFromRoleWorkspace) {
      return this.org && this.domain && this.role && this.messages;
    }

    switch (this.mode) {
      case 'edit':
      case 'grant':
        return this.org && this.domain && this.role;
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
    if (!this.org) {
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
      this.goToMyAccessPage();
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
          this.goToMyAccessPage();
        },
        err => {
          this.footerAlert.registerFooterAlert({
            title:"",
            description:"There was an error while updating access.",
            type:'error',
            timer:3200
          });
        }
      );

      return;
    }

    //let orgIds = this.orgs.map(org => ''+org.value);
    let orgId = this.org.value;
    let funcs: any = this.objects.map(obj => {
      let perms = obj.permission.filter(p => !p.isCheckable).map(p => p.id);
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
          [orgId],
          funcs,
          this.messages,
        );
      } else {
        let funcs2: any = this.objects.map(obj => {
          let perms = obj.permission.filter(p => !p.isCheckable).map(p => p.id);
          return {
            function: obj.function.id,
            permission: perms
          }
        });

        params = {
          userAccessRequestId: this.requestId
        };
        access = UserAccessModel.CreateGrantAndAcceptObject(this.messages, this.userName, domain, role, [orgId], funcs2);
      }

    } else if (this.mode === 'edit') {
      access = UserAccessModel.CreateEditObject(
        this.userName,
        role,
        domain,
        [orgId],
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
          this.goToMyAccessPage();
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
    perm.notChecked = !perm.isCheckable;
  }

  submitButtonText() {
    if (this.userCameFromRoleWorkspace) {
      return "Approve";
    } else {
      return "Submit";
    }
  }
}
