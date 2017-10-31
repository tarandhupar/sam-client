import { Component,ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SamModalComponent } from "sam-ui-kit/components/modal";
import { IBreadcrumb } from "sam-ui-kit/types";
import { UserAccessService } from "../../../api-kit/access/access.service";
import { AlertFooterService } from "../../app-components/alert-footer/alert-footer.service";
import { Location } from "@angular/common";

@Component({
  templateUrl: 'view-request.template.html',
})
export class ViewRequestPage {
  request: any;
  rawRequest: any;
  comment: string = '';
  errors = { comment: '' };
  @ViewChild('deleteRoleModal') deleteRoleModal: SamModalComponent;

  private myCrumbs: Array<IBreadcrumb> = [];

  constructor(
    private route: ActivatedRoute,
    private userAccessService: UserAccessService,
    private router: Router,
    private alertFooter: AlertFooterService,
    private location: Location,
  ) {
    let req = this.route.snapshot.data['request'];
    this.rawRequest = req;
    this.parseRequest(req);
  }

  canCancel() {
    return this.rawRequest && this.rawRequest._links && this.rawRequest._links.cancel_request;
  }

  canReject() {
    return this.rawRequest && this.rawRequest._links && this.rawRequest._links.reject_request;
  }

  canAssignRoles() {
    return this.rawRequest && this.rawRequest._links && this.rawRequest._links.approve_request;
  }

  parseRequest(req) {
    this.request = {
      createdDate: req.createdDate,
      updatedDate: req.updatedDate,
      user: req.requestorName,
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

    let uName = req.requestorName;
    this.myCrumbs = [
      { url: '/workspace', breadcrumb: 'Workspace' },
      { url: '/role-management/roles-directory', breadcrumb: 'Role Directory'},
      { url: this.userRolesUrl(), breadcrumb: uName},
      { breadcrumb: 'Role Request' },
    ];
  }

  onDeleteClick(){
    this.deleteRoleModal.openModal();
  }

  onDeleteConfirm() {
    this.userAccessService.updateRequest(this.request.id,{status: 'cancel'}).subscribe(res => {
      this.deleteRoleModal.closeModal();
      this.router.navigate(['/profile', 'access']);
    });
  }

  assignRolesUrl() {
    return `/role-management/users/${this.rawRequest.requestorName}/assign-roles`;
  }

  userRolesUrl() {
    return `/role-management/users/${this.rawRequest.requestorName}/access`;
  }

  assignRolesQueryParams() {
    return {
      org: this.rawRequest.organization.id,
      role: this.rawRequest.role.id,
      domains: this.rawRequest.domain.id,
      request: this.rawRequest.id,
    };
  }

  onCancelClick() {
   this.setRequestStatus('cancel');
  }

  onRejectClick() {
    this.errors.comment = '';
    if (!this.comment) {
      this.errors.comment = 'A comment is required';
      return;
    }

    this.setRequestStatus('rejected');
  }

  setRequestStatus(status) {
    let newStatus = {
      status: status,
      adminMessage: this.comment,
    };

    this.userAccessService.updateRequest(this.rawRequest.id, newStatus).subscribe(
      () => {
        let verb = 'status' === 'rejected' ? 'rejected' : 'canceled';
        this.alertFooter.registerFooterAlert({
          title: 'Success',
          description: `The request was ${verb}.`,
          type: 'success',
          timer: 3200
        });
        this.router.navigate([this.userRolesUrl()]);
      },
      error => {
        this.alertFooter.registerFooterAlert({
          title: 'Error',
          description: `The action cannot be completed. Try again later.`,
          type: 'error',
          timer: 3200
        });
      });
  }

}
