import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SamModalComponent } from "sam-ui-elements/src/ui-kit/components/modal";
import { HistoryNodeType,IBreadcrumb } from "sam-ui-elements/src/ui-kit/types";
import { UserAccessService } from "../../../api-kit/access/access.service";
import { AlertFooterService } from "../../app-components/alert-footer/alert-footer.service";
import { Location } from "@angular/common";
import { Observable } from "rxjs/Observable";
import { ShortDatePipe } from "sam-ui-elements/src/ui-kit/pipes/short-date/short-date.pipe";
import { Comment } from "sam-ui-elements/src/ui-kit/components/comments/interfaces";

@Component({
  templateUrl: 'view-request.template.html',
  providers: [ShortDatePipe]
})
export class ViewRequestPage implements OnInit {
  request: any;
  rawRequest: any;
  errors = { comment: '' };
  @ViewChild('deleteModal') deleteModal: SamModalComponent;

  myCrumbs: Array<IBreadcrumb> = [
    { url: '/workspace', breadcrumb: 'Workspace' },
    { url: '/workspace/myfeed/requests', breadcrumb: 'Requests', queryParams: {statIds: 1, reqIds: 1}},
    { breadcrumb: 'Role Request' },
  ];
  historyNodes: Array<HistoryNodeType> = [];
  latestNodeId: string;
  comments: Array<Comment> = [];

  post: (text: string) => Observable<Comment> = (comment) => {
    return this.userAccessService.postRequestComment(this.request.id, comment).map(
      res => {
        return <Comment>{
          username: res.createdBy,
          datetime: res.createdDate,
          text: res.content,
          extra: res.systemGeneratedComment,
        };
      }
    )
  };

  constructor(
    private route: ActivatedRoute,
    private userAccessService: UserAccessService,
    private router: Router,
    private alertFooter: AlertFooterService,
    private shortDate: ShortDatePipe,
    private location: Location,
  ) {

  }

  ngOnInit() {
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
    };

    if (req.comments && req.comments.length) {
      this.comments = req.comments.map(com => {
        return {
          username: com.createdBy,
          datetime: com.createdDate.split(' ')[0],
          text: com.content,
          extra: com.systemGeneratedComment,
        };
      });
    } else {
      this.comments = [];
    }


    if (req.createdDate) {
      const nodeCreated: HistoryNodeType = {
        id: 'created',
        date: this.shortDate.transform(req.createdDate.split(' ')[0]),
        description: '<em>Status: Pending</em>',
      };
      this.historyNodes = [nodeCreated];
      this.latestNodeId = 'created';
      if (req.updatedDate) {
        const nodeUpdated: HistoryNodeType = {
          id: 'updated',
          date: this.shortDate.transform(req.updatedDate.split(' ')[0]),
          description: `<em>Status: ${statusString}</em>`
        };
        this.historyNodes.unshift(nodeUpdated);
        this.latestNodeId = 'updated';
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
    this.setRequestStatus('rejected');
  }

  isCanceled(req) {
    return req.status === 'Canceled';
  }

  areNewCommentsEnabled() {
    const status = this.request.status;
    return !(status === 'Canceled' || status === 'Rejected' || status === 'Approved');
  }

  setRequestStatus(status) {
    let newStatus = {
      status: status,
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

  getLatestDate(){
    let dateStr = this.request.updatedDate || this.request.createdDate;
    return dateStr.split(' ')[0];
  }
}
