import { Component, ViewChild } from "@angular/core";
import { IBreadcrumb } from "sam-ui-kit/types";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { UserAccessService } from "../../../api-kit/access/access.service";
import { SamAutocompleteComponent } from "sam-ui-kit/form-controls/autocomplete";

@Component({
  templateUrl: 'user-role-details.template.html'
})
export class UserRoleDetailsPage {

  private myCrumbs: Array<IBreadcrumb> = [
    { url: '/profile/details', breadcrumb: 'Profile' },
    { url: '/profile/access', breadcrumb: 'Access' },
    { breadcrumb: 'Role Details' },
  ];

  private adminCrumbs: Array<IBreadcrumb> = [
    { url: '/access/requests', breadcrumb: 'Role Management' },
    { url: '/users/1/access', breadcrumb: 'User Access' },
    { breadcrumb: 'Role Details' },
  ];

  private crumbs = [

  ];

  private details: any;
  private isAdmin: boolean = false;
  private editLink: Array<any>;
  private editQueryParams;

  constructor(private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.isAdmin = this.route.snapshot.data['isAdminView'];
    this.details = this.route.snapshot.data['details'];
    this.crumbs = this.isAdmin ? this.adminCrumbs : this.myCrumbs;
    if (this.isAdmin) {
      let uid = this.route.snapshot.params['id'];
      this.crumbs[1].url = `/users/${uid}/access`;
      this.editLink = ['/users', uid, 'edit-access'];
      this.editQueryParams = {
        role: this.details.roleId,
        domain: this.details.domainId,
        orgs: this.details.organizationId,
      }
    }

  }
}
