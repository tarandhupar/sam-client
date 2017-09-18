import { Component, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { UserAccessService } from "../../../api-kit/access/access.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertFooterService } from "../../app-components/alert-footer/alert-footer.service";
import { UserService } from "../user.service";
import * as moment from 'moment';
import { SamModalComponent } from "sam-ui-kit/components/modal/modal.component";

function arrayIsRequired(c: FormControl) {
  if (!c.value || !c.value.length) {
    return { arrayHasElement: { valid: false } };
  }
}

@Component({
  templateUrl: 'grant-or-edit-access.html',
})
export class GrantOrEditAccess {
  form: FormGroup;
  errors = {
    org: '',
    role: '',
    domains: '',
    superName: '',
    superEmail: '',
    comment: '',
  };

  user = {firstName: '', lastName: '', email: ''};
  roleOptions = [];
  domainOptionsByRole: any = {};
  domainTabs = [];

  comment = {
    userName: 'Justin Babbs',
    text: 'Lorem Ipsum Dolor Money Lorem Ipsum Dolor Money Lorem Ipsum Dolor Money Lorem Ipsum Dolor Money Lorem Ipsum Dolor Money Lorem Ipsum Dolor Money Lorem Ipsum Dolor Money Lorem Ipsum Dolor Money ',
    date: moment().subtract('minutes', 5).format(),
  };

  editingOrg: boolean = false;
  grantOrEdit: 'grant'|'edit' = 'grant';
  errorMessage: string = '';
  domainsString: string = '';
  existingAccess = {};
  submitEnabled: boolean = true;

  @ViewChild('deleteModal') deleteModal: SamModalComponent;

  constructor(
    fb: FormBuilder,
    private userAccessService: UserAccessService,
    private route: ActivatedRoute,
    private router: Router,
    private alertFooter: AlertFooterService,
    private userService: UserService,
  ) {
    let defaultOrg = userService.getUser().departmentID;

    if (!defaultOrg) {
      this.errorMessage = 'Unable to determine your department id';
      this.submitEnabled = false;
    }

    this.form = fb.group({
      org: [defaultOrg, Validators.required],
      role: ['', Validators.required],
      domains: ['', arrayIsRequired],
      comment: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.user = {
      email: this.route.snapshot.params['id'],
      firstName: '',
      lastName: '',
    };
    this.grantOrEdit = this.route.snapshot.data['grantOrEdit'];
    this.getPermittedRoleAndDomains();

    if (this.isEdit()) {
      this.parseInitialRolesAndDomains();
    }
  }

  parseInitialRolesAndDomains() {
    let qp = this.route.snapshot.queryParams;
    let role = +qp['role'];
    let domainsString = qp['domains'];
    let org = qp['org'];

    if (!role || !domainsString || !qp) {
      this.errorMessage = 'Parameters missing from route';
      return;
    }

    this.existingAccess = {
      organizations: [org],
      role: +role,
      domains: domainsString.split(',').map(d => +d)
    };

    // we update the form value, for domains, once we get the text label from /checkaccess
    this.domainsString = domainsString;

    this.form.patchValue({
      role: role,
    });
  }

  getDomainOptions() {
    let role = this.form.value.role;
    return this.domainOptionsByRole[role] || [];
  }

  getPermittedRoleAndDomains() {
    this.userAccessService.checkAccess(`users/:id/grant-access`).map(r => r.json()).subscribe(a => {
      try {
        this.domainOptionsByRole = {};
        this.roleOptions = a.grantRoles.map(r => {
          this.domainOptionsByRole[r.id] = r.supportedDomains.map(d => ({value: d.val, key: ''+d.id}));
          return { label: r.val, value: r.id };
        });

        if (this.isEdit()) {
          this.setFormDomains();
        }
      } catch(err) {
        console.error(err);
        this.alertFooter.registerFooterAlert({
          type: 'error',
          title: 'Error',
          description: 'Grant role not available for logged in user',
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

  setFormDomains() {
    let selectedDomains: string[] = this.domainsString.split(',');
    this.form.patchValue({
      domains: this.domainOptionsByRole[this.form.value.role].filter(d => {
        return selectedDomains.find(dParam => ''+d.key === dParam);
      })
    });
  }

  userFullName() {
    let user = this.user;
    let firstName = user.firstName;
    let lastName = user.lastName;
    let email = user.email;
    let fullName = '';

    if (firstName && !lastName) {
      fullName = firstName;
    } else if (lastName && !firstName) {
      fullName = lastName;
    } else if (firstName && lastName) {
      fullName = `${firstName} ${lastName}`;
    } else if (email) {
      fullName = email;
    } else {
      console.warn('user name missing');
      fullName = "";
    }
    return fullName;
  }

  onRoleChange() {
    this.form.patchValue({domains: []});
  }

  onDomainChange(domains) {
    if (!domains || !domains.length) {
      this.domainTabs = [];
      return;
    }
    let d = domains.map(i => i.key).join(',');
    let r = this.form.value.role;

    this.userAccessService.getDomainDefinition('role', d, r, this.isEdit() ? this.user.email : undefined).subscribe(
      res => {
        try {
          this.domainTabs = res.map(
            domainAndFunctions => {
              return {
                id: domainAndFunctions.domain.id,
                name: domainAndFunctions.domain.val,
                functions: domainAndFunctions.roleDefinitionMapContent[0].functionContent.filter(f => f).map(
                  functionAndPermissions => {
                    return {
                      id: functionAndPermissions.function.id,
                      name: functionAndPermissions.function.val,
                      permissions: functionAndPermissions.permission.filter(p => p).map(
                        perm => {
                          return {
                            id: perm.id,
                            name: perm.val,
                            checked: !perm.isCheckable || !!perm.isDefault,
                            disabled: !!perm.isDefault,
                          };
                        }
                      )
                    }
                  }
                )
              };
            }
          )
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
    return this.isGrant() ? 'Grant Access' : 'Edit Access';
  }

  isGrant() {
    return this.grantOrEdit === 'grant';
  }

  isEdit() {
    return this.grantOrEdit === 'edit';
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

  getDomainData(dom) {
    if (!dom) {
      return [];
    }
    let ret = dom.map(
      d => {
        return {
          domain: d.id,
          functionContent: d.functions && d.functions.map(
            f => {
              return {
                "function": f.id,
                permission: f.permissions && f.permissions.filter(p => !p.checked).map(p => +p.id)
              }
            }
          )
        }
      }
    );
    return ret;
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

    let domains = this.getDomainData(this.domainTabs);
    let val = this.form.value;

    let body: any = {
      users: [this.user.email],
      updatedAccess: {
        organizations: [''+val.org.orgKey],
        role: +val.role,
        domainData: domains,
      },
      message: val.comment,
      mode: this.isGrant() ? "GRANT" : "EDIT",
    };

    if (this.isEdit()) {
      body.existingAccess = this.existingAccess;
    }

    let apiMethod = this.isGrant() ? "postAccess" : "putAccess";
    this.userAccessService[apiMethod](body).subscribe(
      res => {
        this.router.navigate(["../access"], { relativeTo: this.route});
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

  onDeleteClick() {
    this.deleteModal.openModal();
  }

  onDeleteConfirm() {
    let body = {
      existingAccess: this.existingAccess,
      users: [this.user.email],
      mode: 'DELETE',
    };

    this.userAccessService.deleteAccess(body).subscribe(
      () => {
        this.router.navigate(["../access"], { relativeTo: this.route});
      },
      err => {
        console.error(err);
        this.alertFooter.registerFooterAlert({
          description: 'There was an error with a required service',
          type: "error",
          timer: 3200
        });
      }
    )
  }
}
