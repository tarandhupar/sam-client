import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { UserAccessService } from "api-kit/access/access.service";
import { UserAccessModel } from "../../access.model";
import { ActivatedRoute, Router } from "@angular/router";

import { AlertFooterService } from "../../../alerts/alert-footer/alert-footer.service";
import { UserAccessInterface } from "api-kit/access/access.interface";
import { PropertyCollector } from "../../../app-utils/property-collector";
import { PageScrollService, PageScrollInstance, PageScrollConfig } from "ng2-page-scroll";

@Component({
  templateUrl: 'grant-access.template.html'
})
export class GrantAccessPage implements OnInit {

  private errors = {
    role: '',
    domain: ''
  };
  private orgError = '';

  private userName: string = "";
  public orgs = [];
  private domain;
  private domainOptions = [];
  private role;
  public roleOptions = [];

  private permissions: any;
  private objects = [];

  private messages: string = "";
  private isEdit: boolean = false;

  constructor(
    private userService: UserAccessService,
    private route: ActivatedRoute,
    private footerAlert: AlertFooterService,
    public router: Router,
    private pageScrollService: PageScrollService,
  ) {
    PageScrollConfig.defaultDuration = 500;
  }

  ngOnInit() {
    this.userName = this.route.parent.snapshot.params['id'];

    this.route.queryParams.subscribe(queryParams => {
      this.role = queryParams["role"];
      this.domain = queryParams["domain"];
    });

    let match = this.router.url.match('edit-access');
    this.isEdit = !!(match && match.length);

    this.userService.getDomains().subscribe(
      domains => {
        this.domainOptions = domains._embedded.domainList.map(domain => {
          return { value: domain.pk_domain, label: domain.domainName };
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

  public goToHead(): void {
    let pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(document, '#form-top');
    this.pageScrollService.start(pageScrollInstance);
  };

  permissionId(permission, object) {
    return permission.val + '_' + object.function.val;
  }

  onOrganizationsChange(orgs) {
    this.orgs = orgs;
  }

  onRoleChange(role) {
    if (role) {
      this.errors.role = '';
    }
    this.role = role;

    let r = this.permissions.find(role => {
      return +role.role.id === +this.role;
    });

    if (r) {
      this.objects = r.DomainContent[0].FunctionContent;
    } else {
      this.objects = [];
    }
  }

  onDomainChange(domain) {
    if (domain) {
      this.errors.role = '';
    }

    this.domain = domain;
    this.role = null;
    this.roleOptions = [];
    this.objects = [];

    this.userService.getPermissions({domainID: domain}).subscribe(
      perms => {
        this.permissions = perms;
        let c = new PropertyCollector(perms);
        let roles = c.collect([[], 'role']);
        this.roleOptions = roles.map(role => {
          return { label: role.val, value: role.id };
        });
      },
      err => {
        this.roleOptions = [];
        this.footerAlert.registerFooterAlert({
          title:"Unable to fetch permission information.",
          description:"",
          type:'error',
          timer:0
        });
      }
    );
  }

  goToAccessPage() {
    this.router.navigate(['../access'], { relativeTo: this.route });
  }

  isFormValid() {
    return this.orgs && this.orgs.length && this.domain && this.role;
  }

  showErrors() {
    if (!this.orgs || !this.orgs.length) {
      this.orgError = 'Organization is required';
    }

    if (!this.role) {
      this.errors.role = 'Role is required';
    }

    if (!this.domain && this.domainOptions.length) {
      this.errors.domain = 'Domain is required';
    }
    this.goToHead();
  }

  onGrantClick() {
    if (!this.isFormValid()) {
      this.showErrors();
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
    let access: UserAccessInterface = UserAccessModel.FormInputToAccessObject(
      this.userName,
      parseInt(this.role),
      parseInt(this.domain),
      orgIds,
      funcs,
      this.messages,
    );

    this.userService.putAccess(access).subscribe(
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
