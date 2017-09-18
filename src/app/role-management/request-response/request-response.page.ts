import { Component, ViewChild } from "@angular/core";
import { UserAccessService } from "../../../api-kit/access/access.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertFooterService } from "../../app-components/alert-footer/alert-footer.service";
import { UserAccessModel } from "../access.model";
import {  Location } from "@angular/common";
import { IBreadcrumb } from "sam-ui-kit/types";
import { PropertyCollector } from "../../app-utils/property-collector";
import { CapitalizePipe } from "../../app-pipes/capitalize.pipe";
import { SamModalComponent } from "sam-ui-kit/components/modal/modal.component";

@Component({
  templateUrl: 'request-response.template.html',
})
export class RequestResponsePage {
  private request: any;
  private rawRequest: any;
  private comment: string = '';
  private errors = {
    comment: '',
    org: '',
    role: '',
    domain: '',
  };
  private initialOrg;
  private org;
  private domain;
  private domainOptions = [];
  private roleOptions = [];
  private username : string = '';
  private userId : string = '';
  private objects = [];
  private role = '';
  private roles = [];
  private myCrumbs: Array<IBreadcrumb> = [];

  @ViewChild('rejectModal') rejectModal: SamModalComponent;

  constructor(
    private route: ActivatedRoute,
    private userAccessService: UserAccessService,
    private router: Router,
    private footerAlerts: AlertFooterService,
    private location: Location,
    private capitalize: CapitalizePipe,
  ) {

  }

  ngOnInit() {
    this.rawRequest = this.route.snapshot.data['request'];
    this.parseRequest(this.rawRequest);
    this.getDomains();
    this.getRoles();
  }

  getDomains() {
    this.userAccessService.getDomains().subscribe(
      domains => {
        this.domainOptions = domains._embedded.domainList.map(domain => {
          return { value: domain.id, label: domain.domainName };
        });
      },
      error => {
        this.footerAlerts.registerFooterAlert({
          title:"Unable to fetch domain information.",
          description:"",
          type:'error',
          timer:3200
        });
      }
    );
  }

  onDomainChange(domain) {
    this.domain = domain;
    this.role = null;
    this.roleOptions = [];
    this.objects = [];
    this.getRoles(true);
  }

  getRoles(selectFirstRole?: boolean) {
    let options: any = {domainKey: this.domain};
    if (this.role) {
      options.keepRoles = this.role;
    }
    this.userAccessService
      .getUiRoles(options)
      .subscribe(
        perms => {
          this.roles = perms;
          let c = new PropertyCollector(perms);
          let roles = c.collect([[], 'role']);
          this.roleOptions = roles.map(role => {
            return { label: role.val, value: role.id };
          });
          if (selectFirstRole && this.roles[0] && this.roles[0].role) {
            this.onRoleChange(this.roles[0].role.id);
          }
        },
        err => {
          this.roleOptions = [];
          this.footerAlerts.registerFooterAlert({
            title:"Error",
            description:"Unable to retrieve permission data",
            type:'error',
            timer:3200
          });
        }
      );
  }

  parseRequest(req) {
    this.initialOrg = ''+req.organizationId;
    this.org = { orgKey: req.organizationId };
    this.role = req.role.id;
    this.domain = req.domain.id;

    this.request = {
      requestorName: req.requestorName,
      organization: req.organization.val,
      role: req.role.val,
      domains: req.domain.val,
      supervisorName: req.supervisorName,
      supervisorEmail: req.supervisorEmail,
      status: req.status.val,
      _links: req._links,
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
      this.myCrumbs.push({ url: '/role-management/requests', breadcrumb: 'Role Requests'});
      this.myCrumbs.push({ url: `/users/${this.userId}/access`,breadcrumb : this.username == "undefined undefined" ? "No User Name" :this.username });
      this.myCrumbs.push({breadcrumb: 'Respond to Request'});
    });

    this.userAccessService.getUiRoles({domainKey: this.domain}).subscribe(
      perms => {
        this.roles = perms;
        this.onRoleChange(this.role);
      },
      err => {
        this.footerAlerts.registerFooterAlert({
          title:"Error",
          description:"Unable to retreive permission information",
          type:'error',
          timer:2000
        });
      }
    );
  }

  onOrganizationsChange(org) {
    this.org = org;
  }

  permissionId(permission, object) {
    return permission.val + '_' + object.function.val;
  }

  onPermissionClick(perm) {
    perm.isCheckable = !perm.isCheckable;
  }

  onApproveClick() {
    this.updateRequest('approve');
  }

  onEscalateClick() {
    this.updateRequest('escalate');
  }

  validateForm() {
    return this.comment && this.comment.length && this.role && this.org && this.domain;
  }

  showErrors() {
    if (!this.comment || !this.comment.length) {
      this.errors.comment = 'A comment is required.';
    }

    if (!this.domain) {
      this.errors.domain = 'A domain is required.';
    }

    if (!this.role) {
      this.errors.role = 'A role is required';
    }

    if (!this.org) {
      this.footerAlerts.registerFooterAlert({
        type: 'error',
        description: 'An organization is required. Select an organization.',
        timer: 3200,
      })
    }
  }

  updateRequest(status: string) {
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
      this.router.navigate(['/role-management/requests']);
    });
  }

  clearErrors() {
    this.errors = {
      comment: '',
        org: '',
      role: '',
      domain: '',
    };
  }

  approveRequest() {
    this.clearErrors();
    if (!this.validateForm()) {
      this.showErrors();
      return;
    }
    let orgIds = [''+this.org.value];
    let funcs: any = this.objects.map(obj => {
      let perms = obj.permission.filter((p: any) => !p.isCheckable).map(p => p.id);
      return {
        id: obj.function.id,
        permissions: perms
      }
    });
    let role = parseInt(this.role);
    let domain = parseInt(this.domain);

    let access : any = UserAccessModel.CreateGrantObject(
      this.rawRequest.requestorName,
      role,
      domain,
      orgIds,
      funcs,
      this.comment,
    );

    access.mode = "approve";
    let params = {
      userAccessRequestId: this.rawRequest.id
    };

    this.userAccessService.postAccessDeprecated(access, this.rawRequest.requestorName, params).delay(2000).subscribe(
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
            type:'error',
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

  onRoleChange(role) {
    this.role = role;

    if (role) {
      this.errors.role = '';
    }

    let r = this.roles.find(role => {
      return +role.role.id === +this.role;
    });

    if (r) {
      this.objects = r.functionContent;
    } else {
      // the user selected a role that is not in the roles table (it may not have been fetched yet)
      this.footerAlerts.registerFooterAlert({
        title:"Error",
        description:"Unable to find permissions for role",
        type:'error',
        timer: 3200
      });
    }
  }

  goToRoleWorkspace() {
    this.router.navigate(['/role-management/requests']);
  }

  onRejectClick() {
    this.rejectModal.openModal();
  }

  onRejectConfirm() {
    this.updateRequest('reject');
  }
}
