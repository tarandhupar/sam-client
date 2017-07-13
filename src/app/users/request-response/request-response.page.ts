import { Component } from "@angular/core";
import { UserAccessService } from "api-kit/access/access.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertFooterService } from "../../alerts/alert-footer/alert-footer.service";
import { UserAccessModel } from "../access.model";
import { Location } from "@angular/common";
import { IBreadcrumb, OptionsType } from "sam-ui-kit/types";

@Component({
  templateUrl: './request-response.template.html',
})
export class RequestResponsePage {
  private request: any;
  private rawRequest: any;
  private comment: string = '';
  private commentError: string = '';
  private username : string = '';
  private userId : string = '';
  private objects = [
    {
      function: { id: 1, val: 'Awards/IDV'},
      permission: [
        {id: 0, val: 'Approve'},
        {id: 1, val: 'Create'},
        {id: 2, val: 'Edit'},
        {id: 3, val: 'Delete'},
      ]
    },
    {
      function: { id: 2, val: 'Admin'},
      permission: [
        {id: 0, val: 'Approve'},
        {id: 1, val: 'Create'},
        {id: 2, val: 'Edit'},
        {id: 3, val: 'Delete'},
      ]
    },
    {
      function: { id: 3, val: 'Some other function'},
      permission: [
        {id: 0, val: 'Approve'},
        {id: 1, val: 'Create'},
        {id: 2, val: 'Edit'},
        {id: 3, val: 'Delete'},
        {id: 4, val: 'Reject'},
        {id: 5, val: 'Promote'},
        {id: 6, val: 'Demote'},
        {id: 7, val: 'Fire'},
      ]
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private userAccessService: UserAccessService,
    private router: Router,
    private footerAlerts: AlertFooterService,
    private location: Location
  ) {
    this.rawRequest = this.route.snapshot.data['request'];
    this.parseRequest(this.rawRequest);
    
  }

  private myCrumbs: Array<IBreadcrumb> = [];

  parseRequest(req) {
    this.request = {
      organization: req.organization.val,
      role: req.role.val,
      domains: req.domain.val,
      supervisorName: req.supervisorName,
      supervisorEmail: req.supervisorEmail,
      status: req.status.val,
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
    this.userId = req.requestorName;

    let queryParam : any ={};
    if(req.domain){
      queryParam.domainKey = req.domain.id;
    }
    if(req.role){
      queryParam.roleKey = req.role.id;
    }
    if(req.organization){
      queryParam.orgKey = req.organization.id;
    }
    
    this.userAccessService.getAllUserRoles(req.requestorName,queryParam).subscribe(res => {
      this.username = `${res.user.firstName} ${res.user.lastName}`;
      this.myCrumbs.push({ url: '/workspace', breadcrumb: 'Workspace' });
      this.myCrumbs.push({ url: '/access/user-roles-directory', breadcrumb: 'Role Management'});
      this.myCrumbs.push({ url: `/users/${this.userId}/access`,breadcrumb : this.username == "undefined undefined" ? "No User Name" :this.username });
      this.myCrumbs.push({breadcrumb: 'Respond to Request'});      
    });

    
    
  }

  permissionId(permission, object) {
    return permission.val + '_' + object.function.val;
  }

  onPermissionClick(perm) {
    perm.notChecked = !perm.notChecked;
  }

  onApproveClick() {
    this.updateRequest('approve');
  }

  onRejectClick() {
    this.updateRequest('reject');
  }

  onEscalateClick() {
    this.updateRequest('escalate');
  }

  updateRequest(status: string, ) {
    if (!this.comment || !this.comment.length) {
      this.commentError = 'A message is required';
      return;
    }

    let newStatus: any = {
      adminMessage: '',
      status: '',
    };
    switch (status) {
      case 'approve':
        this.approveRequest();
        return;
      case 'reject':
        newStatus = { status: 'rejected' };
        break;
      case 'escalate':
        newStatus = { status: 'escalated' };
        break;
    }

    newStatus.adminMessage = this.comment;

    this.userAccessService.updateRequest(this.rawRequest.id, newStatus).subscribe(() => {
      let verb;

      switch (status) {
        case 'reject': verb = 'rejected'; break;
        case 'escalate': verb = 'escalated'; break;
        case 'approve': verb = 'approved'; break;
      }

      this.footerAlerts.registerFooterAlert({
        title: 'Success',
        description: `The request was ${verb}.`,
        type: 'success',
        timer: 3200
      });
      this.router.navigate(['/access/requests']);
    });
  }

  approveRequest() {
    let orgIds = [this.rawRequest.organizationID];
    let funcs: any = this.objects.map(obj => {
      let perms = obj.permission.filter((p: any) => p.notChecked).map(p => p.id);
      return {
        id: obj.function.id,
        permissions: perms
      }
    });
    let role = parseInt(this.rawRequest.roleId);
    let domain = parseInt(this.rawRequest.domainId);

    let access;
    let params = {};

    access = UserAccessModel.CreateGrantObject(
      this.rawRequest.requestorName,
      role,
      domain,
      orgIds,
      funcs,
      this.comment,
    );


    this.userAccessService.postAccess(access, this.rawRequest.requestorName, params).delay(2000).subscribe(
      res => {
        this.footerAlerts.registerFooterAlert({
          title:`Access granted.`,
          description:`You have successfully granted this user access`,
          type:'success',
          timer:3000
        });
        this.goToRoleWorkspace();
      },
      error => {
        if (error.status === 409) {
          let error = 'The user already has access for this domain at one or more of the selected organization(s)';
          this.footerAlerts.registerFooterAlert({
            title:'',
            description:error,
            type:'success',
            timer:3000
          });
        } else {
          this.footerAlerts.registerFooterAlert({
            title:"Unable to save access information.",
            description:"",
            type:'error',
            timer:3200
          });
        }

      }
    );
  }

  goToRoleWorkspace() {
    this.router.navigate(['/access/requests']);
  }
}
