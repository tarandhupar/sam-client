import { Component } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { UserAccessService } from "../../../api-kit/access/access.service";
import { AlertFooterService } from "../../alerts/alert-footer/alert-footer.service";
import * as _ from 'lodash';
import { Title } from "@angular/platform-browser";

@Component({
  templateUrl: 'role-details.page.html'
})
export class RoleDetailsPage {
  mode: 'edit'|'new' = 'new';

  roles = [{ vals: [], name: 'Assistance Listing'}, {vals: [], name: 'IDV'}, {vals: [], name: 'Regional Offices'}];
  role;
  roleId;
  domains: any[] = [];
  domain;
  domainOptions: {label: string, value: any}[] = [];
  selectedDomain;
  domainRoles: any[] = [];
  domainRoleOptions: any = [];
  domainDefinitions: any = null;
  permissionOptions: any = [];
  requestObject;
  errors = {
    role: '',
    domain: '',
  };

  constructor(
    private router: Router
    , private accessService: UserAccessService
    , private footerAlert: AlertFooterService
    , private route: ActivatedRoute
    , private titleService: Title
  ) { }

  ngOnInit() {
    this.determineMode();
    this.setTitle();
    this.getAllDomains();
    if (this.mode === 'edit') {
      this.getDomainAndDefaultRole();
    }
  }

  setTitle() {
    this.titleService.setTitle(this.mode === 'edit' ? 'Edit Role' : 'Create New Role');
  }

  getDomainAndDefaultRole() {
    this.route.params.switchMap(params => {
      this.roleId = +params['roleId'];
      return this.route.queryParams;
    }).subscribe(qp => {
      this.domain = +qp['domain'];
      this.onDomainChange();
    });
  }

  getLabelForDomain(domainId) {
    let d = this.domainOptions.find(dom => +dom.value === +domainId);
    if (d) {
      return d.label;
    } else {
      return 'Domain not found.';
    }
  }

  determineMode() {
    if(/\/edit/.test(this.router.url)) {
      this.mode = 'edit';
    }
  }

  getAllDomains() {
    this.domains = this.route.parent.snapshot.data['domains']._embedded.domainList;
    this.domainOptions = this.domains.map(d => {
      return {
        label: d.domainName,
        value: d.id,
      };
    });

    if (this.mode === 'new' && !this.selectedDomain && this.domainOptions.length) {
      this.selectedDomain = this.domainOptions[0].value;
      this.onDomainChange();
    }

  }

  onDomainChange() {
    this.domainRoleOptions = null;
    let domain = this.domain || this.selectedDomain;
    this.accessService.getRoleObjDefinitions(null, ''+domain).subscribe(
      defs => {
        this.domainDefinitions = defs[0];
        this.domainRoleOptions = [];
        this.permissionOptions = [];
        if (!defs || !defs.length) {
          return;
        }

        if (this.domainDefinitions.roleDefinitionMapContent && this.domainDefinitions.roleDefinitionMapContent.length) {
          this.domainRoles = this.domainDefinitions.roleDefinitionMapContent;
          this.domainRoleOptions = this.domainDefinitions.roleDefinitionMapContent.map(r => {
            return {
              label: r.role.val,
              value: r.role.id,
            };
          });
        }

        if (this.domainDefinitions.functionMapContent && this.domainDefinitions.functionMapContent.length){
          this.permissionOptions = this.domainDefinitions.functionMapContent.map(f => {
            return {
              name: f.function.val,
              permissions: f.permission.map(perm => {
                return {
                  label: perm.val,
                  value: perm.id,
                  isDefault: true,
                  isSelected: true,
                };
              })
            };
          });
        }

        if (this.mode === 'edit') {
          // find the text label for role
          let r = this.domainRoleOptions.find(dr => +this.roleId === +dr.value);
          if (r) {
            this.role = r.label;
          } else {
            this.footerAlert.registerFooterAlert({
              title: 'Role '+this.roleId+' not found',
              type: 'error'
            });
            this.domainRoleOptions = null;
            this.domainDefinitions = null;
            return;
          }
          //updatePermissions(this.domainRoleOptions)
        }
      },
      err => {
        this.showGenericServicesError();
      }
    )
  }

  showGenericServicesError() {
    this.footerAlert.registerFooterAlert({
      title: 'Something went wrong with a required service',
      type: 'error'
    })
  }

  clearLastDomainRole() {
    let lastRole = _.last(this.domainRoleOptions);
    if (lastRole && lastRole.isNew) {
      this.domainRoleOptions.pop();
    }
  }

  onRoleBlur() {
    this.clearLastDomainRole();

    if (this.mode === 'new') {
      if (this.roleExists()) {
        this.errors.role = 'Cannot create role. Role name already exists';
        return;
      }

      if (this.role) {
        this.domainRoleOptions.push({
          label: this.role,
          value: null,
          isNew: true,
        });
      }
    } else {
      let opt = this.domainRoleOptions.find(ro => +ro.value === +this.roleId);
      let dr = this.domainRoles.find(dr => +dr.role.id === +this.roleId);
      if (!opt) {
        console.error('unable to update role label');
        return;
      }
      //opt.isModified = dr.role.val !== this.role;
      opt.label = this.role;
    }

  }

  roleExists() {
    return this.domainRoleOptions.find(d => d.label.toUpperCase() === this.role.toUpperCase());
  }

  validate() {
    return this.domain && this.role && !this.roleExists();
  }

  onDomainFocus() {
    this.errors.domain = '';
  }

  onRoleFocus() {
    this.errors.role = '';
  }

  showValidationErrors() {
    if (!this.selectedDomain) {
      this.errors.domain = "Domain is required";
    }
    if (!this.role) {
      this.errors.role = "Role is required";
    } else if (this.roleExists()) {
      this.errors.role = 'Cannot create role. Role name already exists';
    }
  }

  onSubmitClick() {
    if (this.validate()) {
      this.requestObject = this.getRequestObject();
      this.footerAlert.registerFooterAlert({
        title: 'Successfully create new role.',
        type: 'success'
      });
    } else {
      this.showValidationErrors();
    }

    //this.router.navigateByUrl('/access/roles');
  }

  getRequestObject() {
    return {
      'domain': this.domain,
      'domainRoles': this.domainRoleOptions,
      'functions': this.permissionOptions
    };
  }
}
