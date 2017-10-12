import { Component, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { UserAccessService } from "../../../api-kit/access/access.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertFooterService } from "../../app-components/alert-footer/alert-footer.service";
import { UserService } from "../user.service";
import { SamModalComponent } from "sam-ui-kit/components/modal/modal.component";
import { SamTitleService } from "../../../api-kit/title-service/title.service";
import { Location } from "@angular/common";

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
    private samTitle: SamTitleService,
    private location: Location,
  ) {

  }

  ngOnInit() {
    this.samTitle.setTitle("Respond to Request");
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
