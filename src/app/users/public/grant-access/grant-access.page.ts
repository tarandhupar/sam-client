import { Component, OnInit } from '@angular/core';
import { UserAccessService } from "../../../../api-kit/access/access.service";
import { UserAccessModel } from "../../access.model";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { AlertFooterService } from "../../../alerts/alert-footer/alert-footer.service";
import { UserAccessInterface } from "../../../../api-kit/access/access.interface";


@Component({
  templateUrl: 'grant-access.template.html'
})
export class GrantAccessPage implements OnInit {

  private userAccessModel: UserAccessModel;
  private userName: string = "";
  private orgs = [];
  private domain;
  private domainOptions = [];
  private role;
  private roleOptions = [];

  // these two will be replaced with real data on the access object
  private permissions = [];
  private objects = [];

  // the form model for functions and permissions
  private functions = [];

  private messages: string = "";

  constructor(
    private userService: UserAccessService,
    private route: ActivatedRoute,
    private footerAlert: AlertFooterService,
    private router: Router
  ) { }

  ngOnInit() {
    this.userName = this.route.parent.snapshot.params['id'];

    let getAccessAndRoles = [this.userService.getAccess(this.userName), this.userService.getRoles()];
    Observable.forkJoin(getAccessAndRoles).subscribe(
      accessRoles => {
        let roles = accessRoles[1];
        this.roleOptions = roles.map(role => {
          return { value: role.id, label: role.roleName };
        });

        let access = accessRoles[0];
        this.userAccessModel = UserAccessModel.FromResponse(access);
        this.domainOptions = this.userAccessModel.allDomains().map(this.mapLabelAndName);
        this.permissions = this.userAccessModel.allPermissions().map(this.mapLabelAndName);
        this.objects = this.userAccessModel.allObjects().map(this.mapLabelAndName);
      },
      error => {
        this.footerAlert.registerFooterAlert({
          title:"Unable to fetch access information. A required service may be down.",
          description:"",
          type:'error',
          timer:0
        });
      }
    );
  }

  permissionId(permission, object) {
    return permission.label + '_' + object.label;
  }

  mapLabelAndName(val) {
    return { label: val.val, value: val.id };
  }

  onOrganizationsChange(orgs) {
    this.orgs = orgs;
    this.updatePermissions();
  }

  onDomainChange(domain) {
    this.domain = domain;
    this.updatePermissions();
  }

  onRoleChange(role) {
    this.role = role;
    this.updatePermissions();
  }

  updatePermissions() {
    if (this.orgs.length && this.domain && this.role) {
      this.userService.getPermissions(this.role).subscribe(
        perms => {
          /*

           */
        },
        err => {
          this.footerAlert.registerFooterAlert({
            title:"Unable to fetch permission information. A required service may be down.",
            description:"",
            type:'error',
            timer:0
          });
        }
      );
    }
  }

  arePermissionsFetched() {
    return this.role && this.domain && this.orgs.length;
  }

  isGrantDisabled() {
    return !this.arePermissionsFetched();
  }

  grantButtonStyle() {
    return {
      "usa-button-disabled": this.isGrantDisabled(),
      "usa-button-primary": !this.isGrantDisabled()
    };
  }

  onGrantClick() {
    let orgIds = this.orgs.map(org => org.value);
    let funcs = this.objects.map(obj => {
      return {
        id: obj.value,
        permissions: this.permissions.filter(perm => perm.isChecked).map(perm => perm.id)
      }
    });

    let access: UserAccessInterface = UserAccessModel.FormInputToAccessObject(
      this.userName,
      this.role,
      this.domain,
      orgIds,
      funcs
    );

    this.userService.putAccess(access).subscribe(
      res => {
        this.router.navigate(['../access']);
      },
      error => {
        this.footerAlert.registerFooterAlert({
          title:"Unable to save access information. A required service may be down.",
          description:"",
          type:'error',
          timer:0
        });
      }
    )
  }
}
