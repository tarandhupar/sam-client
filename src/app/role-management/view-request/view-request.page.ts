import { Component,ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SamModalComponent } from "sam-ui-elements/src/ui-kit/components/modal";
import { HistoryNodeType,IBreadcrumb } from "sam-ui-elements/src/ui-kit/types";
import { UserAccessService } from "../../../api-kit/access/access.service";
import { AlertFooterService } from "../../app-components/alert-footer/alert-footer.service";
import { Location } from "@angular/common";
import { ShortDatePipe } from "../../app-pipes/short-date.pipe";

@Component({
  templateUrl: 'view-request.template.html',
  providers: [ShortDatePipe]
})
export class ViewRequestPage {
  request: any;
  rawRequest: any;
  comment: string = '';
  errors = { comment: '' };
  @ViewChild('deleteModal') deleteModal: SamModalComponent;

  myCrumbs: Array<IBreadcrumb> = [
    { url: '/workspace', breadcrumb: 'Workspace' },
    { url: '/workspace/myfeed/requests', breadcrumb: 'Requests', queryParams: {statIds: 1, reqIds: 1}},
    { breadcrumb: 'Role Request' },
  ];

  historyNodes: Array<HistoryNodeType> = [];

  constructor(
    private route: ActivatedRoute,
    private userAccessService: UserAccessService,
    private router: Router,
    private alertFooter: AlertFooterService,
    private shortDate: ShortDatePipe,
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
    const statusString = this.initialCaps(req.status.val);
    this.request = {
      createdDate: req.createdDate,
      updatedDate: req.updatedDate,
      updatedBy: req.updatedBy,
      user: req.requestorName,
      organization: req.organization.val,
      role: req.role.val,
      domains: req.domain.val,
      supervisorName: req.supervisorName,
      supervisorEmail: req.supervisorEmail,
      status: statusString,
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

    if (req.createdDate) {
      const nodeCreated: HistoryNodeType = {
        id: 'created',
        date: this.shortDate.transform(req.createdDate),
        description: '<em>Status: Pending</em>',
      };
      this.historyNodes = [nodeCreated];

      if (req.updatedDate) {
        const nodeUpdated: HistoryNodeType = {
          id: 'updated',
          date: this.shortDate.transform(req.updatedDate),
          description: `<em>Status: ${statusString}</em>`
        };
        this.historyNodes.unshift(nodeUpdated);
      }
    }
  }

  initialCaps(s) {
    if (!s || !s.length) {
      return '';
    }
    if (s.length === 1) {
      return s[0].toUpperCase();
    }
    return s[0].toUpperCase() + s.slice(1).toLowerCase();
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

  onDeleteClick() {
    this.deleteModal.openModal();
  }

  onDeleteConfirm() {
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

  isCanceled(req) {
    return req.status === 'Canceled';
  }

  setRequestStatus(status) {
    let newStatus = {
      status: status,
      adminMessage: this.comment,
    };

    this.userAccessService.updateRequest(this.rawRequest.id, newStatus).subscribe(
      () => {
        let verb;
        switch (status) {
          case 'cancel': verb = 'canceled'; break;
          case 'rejected': verb = 'rejected'; break;
          default: verb = 'updated'; break;
        }
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
