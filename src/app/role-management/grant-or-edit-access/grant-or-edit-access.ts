import { Component } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { UserAccessService } from "../../../api-kit/access/access.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertFooterService } from "../../app-components/alert-footer/alert-footer.service";
import { UserService } from "../user.service";
import * as moment from 'moment';
import { SamTitleService } from "../../../api-kit/title-service/title.service";
import { Location } from "@angular/common";
import { IBreadcrumb } from "sam-ui-elements/src/ui-kit/types";
import { isArray } from 'lodash';

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
  crumbs: Array<IBreadcrumb> = [];
  comment = {
    userName: 'Justin Babbs',
    text: 'Lorem Ipsum Dolor Money Lorem Ipsum Dolor Money Lorem Ipsum Dolor Money Lorem Ipsum Dolor Money Lorem Ipsum Dolor Money Lorem Ipsum Dolor Money Lorem Ipsum Dolor Money Lorem Ipsum Dolor Money ',
    date: moment().subtract('minutes', 5).format(),
  };

  grantOrEdit: 'grant'|'edit' = 'grant';
  errorMessage: string = '';
  domains: Array<number> = [];
  existingAccess = {};
  submitEnabled: boolean = true;
  requestId: string;

  constructor(
    private fb: FormBuilder,
    private userAccessService: UserAccessService,
    private route: ActivatedRoute,
    private router: Router,
    private alertFooter: AlertFooterService,
    private userService: UserService,
    private samTitle: SamTitleService,
    private location: Location,
  ) {

  }

  ngOnInit() {
    this.grantOrEdit = this.route.snapshot.data['grantOrEdit'];

    let defaultOrg = this.route.snapshot.queryParams['org'] || this.userService.getUser().departmentID || '';

    if (!isArray(defaultOrg)) {
      // convert to array, remove empty elements
      defaultOrg = [defaultOrg].filter(o => o);
    }

    if (this.isGrant() && !defaultOrg) {
      this.errorMessage = 'Unable to determine your department id';
    }

    this.form = this.fb.group({
      org: [defaultOrg, Validators.required],
      role: ['', Validators.required],
      domains: ['', arrayIsRequired],
      comment: ['', Validators.required],
    });

    this.user = {
      email: this.route.snapshot.params['id'],
      firstName: '',
      lastName: '',
    };

    this.samTitle.setTitleString(this.isEdit() ? 'Edit Access' : 'Assign Role');
    this.getPermittedRoleAndDomains();
    this.parseInitialValues();
    this.setBreadCrumbsForRespondToRequest();
  }

  orgName() {
    return this.form.get('org').value.name || "";
  }

  // we only show breadcrumbs if we are responding to a request
  setBreadCrumbsForRespondToRequest() {
    if (!this.requestId) {
      return [];
    }

    this.crumbs = [
      { breadcrumb: 'Workspace', url: '/workspace' },
      { breadcrumb: 'Role Directory', url: '/role-management/roles-directory' },
      { breadcrumb: this.userFullName(), url: '../access' },
      { breadcrumb: 'Role Request', url: `/role-management/requests/${this.requestId}` },
      { breadcrumb: 'Assign Role' },
    ];
  }

  parseInitialValues() {
    let qp = this.route.snapshot.queryParams;
    let role = qp['role'] || '';
    let orgs = qp['org'] || [];
    let domains = qp['domains'] || [];

    if (orgs.toUpperCase) {
      orgs = [orgs];
    }

    this.requestId = qp['request'];

    if (domains.toUpperCase) {
      // convert a single domain to an array of domains
      domains = [domains];
    }

    // map domains to a number
    domains = domains.map(d => {
      let x = +d;
      if (isNaN(x)) {
        throw new Error('domain is not a number.');
      }
      return x;
    });

    if (role) {
      role = +role;
      if (isNaN(role)) {
        throw new Error("role is not a number");
      }
    }

    this.existingAccess = {
      organizations: orgs,
      role: role,
      domains: domains,
    };

    // we update the form value, for domains, once we get the text label from /checkaccess
    this.domains = domains;

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

        this.setFormDomains();
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

  // Set domains if a role is selected and checkaccess returns a set of domains for that role
  setFormDomains() {
    let role = this.form.value.role;
    if (!role) {
      return;
    }
    let options = this.domainOptionsByRole[this.form.value.role];
    if (!options) {
      return;
    }
    this.form.patchValue({
      domains: options.filter(d => {
        return this.domains.find(dParam => ''+d.key === ''+dParam);
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
    let o = this.isEdit() ? this.form.value.org.map(o => ''+o.orgKey).join(',') : '';

    this.userAccessService.getDomainDefinition('role', d, r, o, this.isEdit() ? this.user.email : undefined).subscribe(
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
                            checked: perm.isCheckable || !!perm.isDefault,
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

  pageTitle() {
    return this.isGrant() ? 'Assign Role' : 'Edit Access';
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

  goToRequests() {
    this.router.navigate(["/role-management/requests"]);
  }

  goToAccess() {
    this.router.navigate(["../access"], { relativeTo: this.route});
  }

  onSubmit() {
    this.errorMessage = '';
    if (!this.validate()) {
      this.showErrors();
      return;
    }

    let domains = this.getDomainData(this.domainTabs);
    let val = this.form.value;

    let orgs = (!val.org || !val.org.length) ? [] : val.org.map(o => ''+o.orgKey);
    const orgMap = (!val.org || !val.org.length) ? [] : val.org.map(o => ({
      orgKey: o.orgKey,
      name: o.name,
      level: o.level,
      fullParentPath: o.fullParentPath,
      type: o.type,
    }));
    let body: any = {
      users: [this.user.email],
      updatedAccess: {
        organizations: orgs,
        role: +val.role,
        domainData: domains,
      },
      message: val.comment,
      mode: this.requestId ? "APPROVE" : this.isGrant() ? "GRANT" : "EDIT",
      organizations: orgMap,
    };

    if (this.isEdit() || this.requestId) {
      body.existingAccess = this.existingAccess;
    }

    let apiMethod = this.isGrant() ? "postAccess" : "putAccess";
    let qp = this.requestId ? { userAccessRequestId: this.requestId } : undefined;
    this.submitEnabled = false;

    this.userAccessService[apiMethod](body, qp).subscribe(
      res => {
        this.goToAccess();
      },
      err => {
        this.submitEnabled = true;
        if (err && err.status === 409) {
          try {
            let resBody = err.json();
            if (Array.isArray(resBody.errors)) {
              this.errorMessage = resBody.errors.join('\n');
              return;
            } else if (typeof resBody.errors === 'string') {
              this.errorMessage = resBody.errors;
              return;
            }
          } catch(err) {

          }
          console.error(err);
          let e: string = 'The user already has access for this domain at one or more of the selected organization(s)';
          this.errorMessage = e;
        } else {
          console.error(err);
          this.alertFooter.registerFooterAlert({
            description: 'Unable to complete the requested action at this time. Please try again later.',
            type: "error",
            timer: 3200
          });
        }
      }
    )
  }
}
