import { Component } from "@angular/core";
import { IBreadcrumb } from "sam-ui-kit/types";
import { ActivatedRoute } from "@angular/router";

@Component({
  templateUrl: 'user-role-details.template.html'
})
export class UserRoleDetailsPage {

  private crumbs: Array<IBreadcrumb> = [
    { url: '/role-management', breadcrumb: 'Role Management' },
    { url: '/users/1/access', breadcrumb: 'Access' },
    { breadcrumb: 'Role Details' },
  ];

  private details: any;

  constructor(private route: ActivatedRoute) {
    console.log('route', route);

  }

  ngOnInit() {
    console.log('deets', this.details);
    this.details = this.route.snapshot.data['details'];
    let uid = this.route.snapshot.params['id'];
    this.crumbs[1].url = `/users/${uid}/access`;
  }
}
