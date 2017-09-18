import { Component,ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SamModalComponent } from "sam-ui-kit/components/modal";
import { IBreadcrumb, OptionsType } from "sam-ui-kit/types";
import {UserAccessService} from "../../../api-kit/access/access.service";

@Component({
  templateUrl: 'view-request.template.html'
})
export class ViewRequestPage {
  request: any;
  @ViewChild('deleteRoleModal') deleteRoleModal: SamModalComponent;

  private myCrumbs: Array<IBreadcrumb> = [
    { url: '/profile/details', breadcrumb: 'Profile' },
    { url: '/profile/access', breadcrumb: 'My Access'},
    { breadcrumb: 'View Request' }
  ];

  constructor(
    private route: ActivatedRoute,
    private userService: UserAccessService,
    private router: Router,
  ) {
    let req = this.route.snapshot.data['request'];
    this.parseRequest(req);
  }

  parseRequest(req) {
    this.request = {
      organization: req.organization.val,
      role: req.role.val,
      domains: req.domain.val,
      supervisorName: req.supervisorName,
      supervisorEmail: req.supervisorEmail,
      status: req.status.val,
      links: req._links,
      id: req.id,
      comments: []
    };
    if (req.requestorMessage && req.requestorMessage.length) {
      this.request.comments.push({
        userName: req.requestorName,
        text: req.requestorMessage,
        date: req.createdDate,
      });
    }
    if (req.adminMessage && req.adminMessage.length) {
      this.request.comments.push({
        userName: req.updatedBy,
        text: req.adminMessage,
        date: req.updatedDate,
      });
    }
  }

  onDeleteClick(){

    this.deleteRoleModal.openModal();
  }

  onDeleteConfirm() {
    this.userService.updateRequest(this.request.id,{status: 'cancel'}).subscribe(res => {
      this.deleteRoleModal.closeModal();
      this.router.navigate(['/profile', 'access']);
    });
  }

}
