import { Component, OnInit } from '@angular/core';
import { UserService } from "api-kit/user/user.service";
import { UserAccessModel } from "../../access.model";
import { ActivatedRoute } from "@angular/router";


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

  private messages: string = "";

  constructor(private userService: UserService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.userName = this.route.parent.snapshot.params['id'];

    this.userService.getAccess(this.userName).subscribe(res => {
      this.userAccessModel = UserAccessModel.FromResponse(res);
      this.domainOptions = this.userAccessModel.allDomains().map(this.mapLabelAndName);
      this.roleOptions = this.userAccessModel.allRoles().map(this.mapLabelAndName);
      this.permissions = this.userAccessModel.allPermissions().map(this.mapLabelAndName);
      this.objects = this.userAccessModel.allObjects().map(this.mapLabelAndName);
    });
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

    }
  }

}
