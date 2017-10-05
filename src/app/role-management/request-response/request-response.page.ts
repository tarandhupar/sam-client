import { Component, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { UserAccessService } from "../../../api-kit/access/access.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertFooterService } from "../../app-components/alert-footer/alert-footer.service";
import { UserService } from "../user.service";
import { SamModalComponent } from "sam-ui-kit/components/modal/modal.component";

@Component({
  templateUrl: 'request-response.template.html',
})
export class RequestResponsePage {
  errors = {
    org: '',
    role: '',
    domains: '',
    comment: '',
  };
  form: FormGroup;
  roleOptions = [];
  domainOptionsByRole: any = {};
  functions = [];
  request: any;
  userId;
  editingOrg: boolean = false;
  errorMessage: string = '';
  domains: Array<number> = [];
  existingAccess = {};
  submitEnabled: boolean = true;
  rawRequest;

  @ViewChild('rejectModal') rejectModal: SamModalComponent;

  constructor(
    private fb: FormBuilder,
    private userAccessService: UserAccessService,
    private route: ActivatedRoute,
    private router: Router,
    private alertFooter: AlertFooterService,
  ) {

  }

  ngOnInit() {
    this.rawRequest = this.route.snapshot.data['request'];
    this.parseRequest(this.rawRequest);
    this.getPermittedRoleAndDomains();
  }

  parseRequest(req) {
    this.form = this.fb.group({
      org: [''+req.organizationId, Validators.required],
      role: [''+req.role.id, Validators.required],
      domain: [''+req.domain.id, Validators.required], // update domains after determining what we have access to
      comment: ['', Validators.required],
    });

    this.existingAccess = {
      organizations: [''+req.organizationId],
      role: +req.role.id,
      domains: [+req.domain.id]
    };

    this.request = {
      requestorName: req.requestorName,
      organization: req.organization.val,
      role: req.role.val,
      domains: [req.domain.val],
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

  }

  orgName() {
    return this.form.get('org').value.name || "";
  }

  getDomainOptions() {
    let role = this.form.value.role;
    return this.domainOptionsByRole[''+role] || [];
  }

  getPermittedRoleAndDomains() {
    this.userAccessService.checkAccess(`users/:id/grant-access`).map(r => r.json()).subscribe((a: any) => {
      try {
        this.domainOptionsByRole = {};
        this.roleOptions = a.grantRoles.map(r => {
          this.domainOptionsByRole[r.id] = r.supportedDomains.map(d => ({label: d.val, value: ''+d.id}));
          return { label: r.val, value: ''+r.id };
        });
        this.onDomainChange(this.form.value.domain);
      } catch(err) {
        console.error(err);
        this.alertFooter.registerFooterAlert({
          type: 'error',
          title: 'Error',
          description: 'Unable to parse network response.',
          timer: 3200,
        });
      }
    }, err => {
      console.error(err);
      this.alertFooter.registerFooterAlert({
        type: 'error',
        title: 'Error',
        description: 'Unable to fetch grant privileges for logged in user.',
        timer: 3200,
      });
    });
  }

  onRoleChange() {
    this.form.patchValue({domains: []});
  }

  onDomainChange(domain) {
    if (!domain) {
      this.functions = [];
      return;
    }
    let r = this.form.value.role;

    this.userAccessService.getDomainDefinition('role', domain, r, this.userId).subscribe(
      res => {
        try {
          this.functions = res[0].roleDefinitionMapContent[0].functionContent.map(
            functionAndPermissions => {
              return {
                id: functionAndPermissions.function.id,
                name: functionAndPermissions.function.val,
                permissions: functionAndPermissions.permission.filter(p => p).map(
                  perm => {
                    return {
                      id: perm.id,
                      name: perm.val,
                      checked: perm.isCheckable || !!perm.isDefault,
                      disabled: !!perm.isDefault,
                    };
                  }
                )
              }
            }
          );
        } catch (error) {
          console.error(error);
          this.alertFooter.registerFooterAlert({
            type: 'error',
            title: 'Error',
            description: 'Unable to parse permission data',
            timer: 3200,
          });
        }
      },
      err => {
        this.alertFooter.registerFooterAlert({
          type: 'error',
          title: 'Error',
          description: 'Unable to fetch permission information for logged in user.',
          timer: 3200,
        });
      }
    );
  }

  onOrganizationChange(org) {
    if (org) {
      this.editingOrg = false;
    }
  }

  onClickEditOrg() {
    this.editingOrg = true;
  }

  pageTitle() {
    return "Respond to Request";
  }

  showErrors() {
    const keys = Object.keys(this.form.controls);
    keys.forEach(key => {
      let control = this.form.controls[key];
      if (control.errors) {
        if (control.errors['required'] || control.errors['arrayHasElement']) {
          this.errors[key] = `This field is required`;
        } else if (control.errors['email']) {
          this.errors[key] = `Invalid email format`;
        }
      } else {
        this.errors[key] = '';
      }
    });
  }

  getDomainData(funcs) {
    if (!funcs) {
      return [];
    }

    return [
      {
        domain: this.form.value.domain,
        functionContent: this.functions.map(
          f => {
            return {
              "function": f.id,
              permission: f.permissions && f.permissions.filter(p => !p.checked).map(p => +p.id)
            }
          }
        )
      }
    ];
  }

  validate() {
    return this.form.valid;
  }

  onSubmit() {
    this.errorMessage = '';
    if (!this.validate()) {
      this.showErrors();
      return;
    }

    let domains = this.getDomainData(this.functions);
    let val = this.form.value;

    let body: any = {
      users: [this.userId],
      updatedAccess: {
        organizations: [''+val.org.orgKey],
        role: +val.role,
        domainData: domains,
      },
      message: val.comment,
      mode: "APPROVE",
    };

    body.existingAccess = this.existingAccess;

    let apiMethod = "postAccess";
    this.userAccessService[apiMethod](body, { userAccessRequestId: this.rawRequest.id }).subscribe(
      res => {
        this.router.navigate(["/role-management/requests"]);
      },
      err => {
        if (err && err.status === 409) {
          console.error(err);
          let e: string = 'The user already has access for this domain at one or more of the selected organization(s)';
          this.errorMessage = e;
        } else {
          console.error(err);
          this.alertFooter.registerFooterAlert({
            description: 'There was an error with a required service',
            type: "error",
            timer: 3200
          });
        }

      }
    )
  }

  onRejectClick() {
    this.rejectModal.openModal();
  }

  onRejectConfirm() {
    let newStatus = {
      status: 'rejected',
      adminMessage: this.form.value.comment,
    };

    this.userAccessService.updateRequest(this.rawRequest.id, newStatus).subscribe(
      () => {
        this.alertFooter.registerFooterAlert({
          title: 'Success',
          description: `The request was rejected.`,
          type: 'success',
          timer: 3200
        });
        this.router.navigate(['/role-management/requests']);
      },
      error => {
        this.alertFooter.registerFooterAlert({
          title: 'Error',
          description: `The request cannot be rejected at this time.`,
          type: 'error',
          timer: 3200
        });
      });
  }
}


// import { Component, ViewChild } from "@angular/core";
// import { UserAccessService } from "../../../api-kit/access/access.service";
// import { ActivatedRoute, Router } from "@angular/router";
// import { AlertFooterService } from "../../app-components/alert-footer/alert-footer.service";
// import { UserAccessModel } from "../access.model";
// import {  Location } from "@angular/common";
// import { IBreadcrumb } from "sam-ui-kit/types";
// import { PropertyCollector } from "../../app-utils/property-collector";
// import { CapitalizePipe } from "../../app-pipes/capitalize.pipe";
//
//
// import { SamModalComponent } from "sam-ui-kit/components/modal/modal.component";
//
// @Component({
//   templateUrl: 'request-response.template.html',
// })
// export class RequestResponsePage {
//   private request: any;
//   private rawRequest: any;
//   private comment: string = '';
//   private errors = {
//     comment: '',
//     org: '',
//     role: '',
//     domain: '',
//   };
//   private initialOrg;
//   private org;
//   private domain;
//   private domainOptions = [];
//   private roleOptions = [];
//   private username : string = '';
//   private userId : string = '';
//   private objects = [];
//   private role = '';
//   private roles = [];
//   private myCrumbs: Array<IBreadcrumb> = [];
//
//   @ViewChild('rejectModal') rejectModal: SamModalComponent;
//
//   constructor(
//     private route: ActivatedRoute,
//     private userAccessService: UserAccessService,
//     private router: Router,
//     private footerAlerts: AlertFooterService,
//     private location: Location,
//     private capitalize: CapitalizePipe,
//   ) {
//
//   }
//
//   ngOnInit() {
//     this.rawRequest = this.route.snapshot.data['request'];
//     this.parseRequest(this.rawRequest);
//     this.getDomains();
//     this.getRoles();
//   }
//
//   getDomains() {
//     this.userAccessService.getDomains().subscribe(
//       domains => {
//         this.domainOptions = domains._embedded.domainList.map(domain => {
//           return { value: domain.id, label: domain.domainName };
//         });
//       },
//       error => {
//         this.footerAlerts.registerFooterAlert({
//           title:"Unable to fetch domain information.",
//           description:"",
//           type:'error',
//           timer:3200
//         });
//       }
//     );
//   }
//
//   onDomainChange(domain) {
//     this.domain = domain;
//     this.role = null;
//     this.roleOptions = [];
//     this.objects = [];
//     this.getRoles(true);
//   }
//
//   getRoles(selectFirstRole?: boolean) {
//     let options: any = {domainKey: this.domain};
//     if (this.role) {
//       options.keepRoles = this.role;
//     }
//     this.userAccessService
//       .getUiRoles(options)
//       .subscribe(
//         perms => {
//           this.roles = perms;
//           let c = new PropertyCollector(perms);
//           let roles = c.collect([[], 'role']);
//           this.roleOptions = roles.map(role => {
//             return { label: role.val, value: role.id };
//           });
//           if (selectFirstRole && this.roles[0] && this.roles[0].role) {
//             this.onRoleChange(this.roles[0].role.id);
//           }
//         },
//         err => {
//           this.roleOptions = [];
//           this.footerAlerts.registerFooterAlert({
//             title:"Error",
//             description:"Unable to retrieve permission data",
//             type:'error',
//             timer:3200
//           });
//         }
//       );
//   }
//
//   parseRequest(req) {
//     this.initialOrg = ''+req.organizationId;
//     this.org = { orgKey: req.organizationId };
//     this.role = req.role.id;
//     this.domain = req.domain.id;
//
//     this.request = {
//       requestorName: req.requestorName,
//       organization: req.organization.val,
//       role: req.role.val,
//       domains: req.domain.val,
//       supervisorName: req.supervisorName,
//       supervisorEmail: req.supervisorEmail,
//       status: req.status.val,
//       _links: req._links,
//       comments: []
//     };
//     if (req.requestorMessage && req.requestorMessage.length) {
//       this.request.comments.push({
//         userName: req.requestorName,
//         text: req.requestorMessage,
//         date: req.createdDate,
//       });
//     }
//     if (req.adminMessage && req.adminMessage.length) {
//       this.request.comments.push({
//         userName: req.updatedBy,
//         text: req.adminMessage,
//         date: req.updatedDate,
//       });
//     }
//     this.userId = req.requestorName;
//
//     let queryParam : any ={};
//     if(req.domain){
//       queryParam.domainKey = req.domain.id;
//     }
//     if(req.role){
//       queryParam.roleKey = req.role.id;
//     }
//     if(req.organization){
//       queryParam.orgKey = req.organization.id;
//     }
//
//     this.userAccessService.getAllUserRoles(req.requestorName,queryParam).subscribe(res => {
//       this.username = `${res.user.firstName} ${res.user.lastName}`;
//       this.myCrumbs.push({ url: '/workspace', breadcrumb: 'Workspace' });
//       this.myCrumbs.push({ url: '/role-management/requests', breadcrumb: 'Role Requests'});
//       this.myCrumbs.push({ url: `/users/${this.userId}/access`,breadcrumb : this.username == "undefined undefined" ? "No User Name" :this.username });
//       this.myCrumbs.push({breadcrumb: 'Respond to Request'});
//     });
//
//     this.userAccessService.getUiRoles({domainKey: this.domain}).subscribe(
//       perms => {
//         this.roles = perms;
//         this.onRoleChange(this.role);
//       },
//       err => {
//         this.footerAlerts.registerFooterAlert({
//           title:"Error",
//           description:"Unable to retreive permission information",
//           type:'error',
//           timer:2000
//         });
//       }
//     );
//   }
//
//   onOrganizationsChange(org) {
//     this.org = org;
//   }
//
//   permissionId(permission, object) {
//     return permission.val + '_' + object.function.val;
//   }
//
//   onPermissionClick(perm) {
//     perm.isCheckable = !perm.isCheckable;
//   }
//
//   onApproveClick() {
//     this.updateRequest('approve');
//   }
//
//   onEscalateClick() {
//     this.updateRequest('escalate');
//   }
//
//   validateForm() {
//     return this.comment && this.comment.length && this.role && this.org && this.domain;
//   }
//
//   showErrors() {
//     if (!this.comment || !this.comment.length) {
//       this.errors.comment = 'A comment is required.';
//     }
//
//     if (!this.domain) {
//       this.errors.domain = 'A domain is required.';
//     }
//
//     if (!this.role) {
//       this.errors.role = 'A role is required';
//     }
//
//     if (!this.org) {
//       this.footerAlerts.registerFooterAlert({
//         type: 'error',
//         description: 'An organization is required. Select an organization.',
//         timer: 3200,
//       })
//     }
//   }
//
//   updateRequest(status: string) {
//     let newStatus: any = {
//       adminMessage: '',
//       status: '',
//     };
//     switch (status) {
//       case 'approve':
//         this.approveRequest();
//         return;
//       case 'reject':
//         newStatus = { status: 'rejected' };
//         break;
//       case 'escalate':
//         newStatus = { status: 'escalated' };
//         break;
//     }
//
//     newStatus.adminMessage = this.comment;
//
//     this.userAccessService.updateRequest(this.rawRequest.id, newStatus).subscribe(() => {
//       let verb;
//
//       switch (status) {
//         case 'reject': verb = 'rejected'; break;
//         case 'escalate': verb = 'escalated'; break;
//         case 'approve': verb = 'approved'; break;
//       }
//
//       this.footerAlerts.registerFooterAlert({
//         title: 'Success',
//         description: `The request was ${verb}.`,
//         type: 'success',
//         timer: 3200
//       });
//       this.router.navigate(['/role-management/requests']);
//     });
//   }
//
//   clearErrors() {
//     this.errors = {
//       comment: '',
//         org: '',
//       role: '',
//       domain: '',
//     };
//   }
//
//   approveRequest() {
//     this.clearErrors();
//     if (!this.validateForm()) {
//       this.showErrors();
//       return;
//     }
//     let orgIds = [''+this.org.value];
//     let funcs: any = this.objects.map(obj => {
//       let perms = obj.permission.filter((p: any) => !p.isCheckable).map(p => p.id);
//       return {
//         id: obj.function.id,
//         permissions: perms
//       }
//     });
//     let role = parseInt(this.role);
//     let domain = parseInt(this.domain);
//
//     let access : any = UserAccessModel.CreateGrantObject(
//       this.rawRequest.requestorName,
//       role,
//       domain,
//       orgIds,
//       funcs,
//       this.comment,
//     );
//
//     access.mode = "approve";
//     let params = {
//       userAccessRequestId: this.rawRequest.id
//     };
//
//     this.userAccessService.postAccessDeprecated(access, this.rawRequest.requestorName, params).delay(2000).subscribe(
//       res => {
//         this.footerAlerts.registerFooterAlert({
//           title:`Access granted.`,
//           description:`You have successfully granted this user access`,
//           type:'success',
//           timer:3000
//         });
//         this.goToRoleWorkspace();
//       },
//       error => {
//         if (error.status === 409) {
//           let error = 'The user already has access for this domain at one or more of the selected organization(s)';
//           this.footerAlerts.registerFooterAlert({
//             title:'',
//             description:error,
//             type:'error',
//             timer:3000
//           });
//         } else {
//           this.footerAlerts.registerFooterAlert({
//             title:"Unable to save access information.",
//             description:"",
//             type:'error',
//             timer:3200
//           });
//         }
//
//       }
//     );
//   }
//
//   onRoleChange(role) {
//     this.role = role;
//
//     if (role) {
//       this.errors.role = '';
//     }
//
//     let r = this.roles.find(role => {
//       return +role.role.id === +this.role;
//     });
//
//     if (r) {
//       this.objects = r.functionContent;
//     } else {
//       // the user selected a role that is not in the roles table (it may not have been fetched yet)
//       this.footerAlerts.registerFooterAlert({
//         title:"Error",
//         description:"Unable to find permissions for role",
//         type:'error',
//         timer: 3200
//       });
//     }
//   }
//
//   goToRoleWorkspace() {
//     this.router.navigate(['/role-management/requests']);
//   }
//
//   onRejectClick() {
//     this.rejectModal.openModal();
//   }
//
//   onRejectConfirm() {
//     this.updateRequest('reject');
//   }
// }
