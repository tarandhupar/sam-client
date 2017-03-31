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
  originalRole;
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

  setObjectPermissions() {
    this.domainDefinitions.roleDefinitionMapContent[0].functionContent.forEach(rd => {
      if (+rd.function.id === 0) {
        // check domain roles
        let droles = rd.permission;
        this.domainRoleOptions.forEach(dopt => {
          if (droles.find(dr => +dopt.id === +dr.id)) {
            dopt.isSelected = true;
          }
        });
      } else {
        let perms = rd.permission;
        let fid = rd.function.id;
        let fun = this.permissionOptions.find(popt => +popt.id === +fid);
        if (fun) {
          fun.permissions.forEach(pp => {
            let ppx = perms.find(p => +p.id === pp.value );
            if (ppx) {
              pp.isSelected = true;
              pp.isDefault = !!ppx.isDefault;
            }
          });
        }
      }
    });
  }

  onDomainChange() {
    this.domainRoleOptions = null;
    let domain = this.domain || this.selectedDomain;
    let mode = this.mode === 'edit' ? null : 'object';
    this.accessService.getRoleObjDefinitions(mode, ''+domain, this.roleId).subscribe(
      defs => {
        this.domainDefinitions = defs[0];
        this.domainRoleOptions = [];
        this.permissionOptions = [];
        if (!defs || !defs.length) {
          return;
        }

        let func0 = this.domainDefinitions.functionMapContent.find(func => +func.function.id === 0);

        this.domainRoleOptions = func0.permission.map(dr => {
          return {
            label: dr.val,
            id: dr.id,
          };
        });

        if (this.domainDefinitions.functionMapContent && this.domainDefinitions.functionMapContent.length){
          this.permissionOptions = this.domainDefinitions.functionMapContent.map(f => {
            if (this.mode === 'new') {
              return {
                id: f.function.id,
                name: f.function.val,
                permissions: f.permission.map(perm => {
                  return {
                    label: perm.val,
                    value: perm.id,
                    isDefault: false,
                    isSelected: false,
                  };
                })
              };
            } else if (this.mode === 'edit') {
              // Check to see if the permission is set for this domain/role combo

              //let roleDefitionMapContent = this.domainDefinitions.roleDefinitionMapContent;

              // Find this function
              //let fun = roleDefitionMapContent.find(r => +r.role.id === f.)

              return {
                id: f.function.id,
                name: f.function.val,
                permissions: f.permission.map(perm => {
                  return {
                    label: perm.val,
                    value: perm.id,
                    isDefault: false,
                    isSelected: false,
                  };
                })
              };
            } else {
              console.error('mode not found');
            }
          });
          this.permissionOptions = this.permissionOptions.filter(p => +p.id !== 0);
        }

        if (this.mode === 'edit') {
          // find the text label for role
          let r = this.domainRoleOptions.find(dr => +this.roleId === +dr.id);
          if (r) {
            this.role = r.label;
            this.originalRole = _.clone(this.role);
          } else {
            this.footerAlert.registerFooterAlert({
              title: 'Role '+this.roleId+' not found',
              type: 'error'
            });
            this.domainRoleOptions = null;
            this.domainDefinitions = null;
            return;
          }
          this.setObjectPermissions();
        }
      },
      err => {
        this.showGenericServicesError();
      }
    )
  }

  showGenericServicesError() {
    this.footerAlert.registerFooterAlert({
      description: 'Something went wrong with a required service',
      type: 'error'
    })
  }

  clearLastDomainRole() {
    let lastRole = _.last(this.domainRoleOptions);
    if (lastRole && lastRole.isNew) {
      this.domainRoleOptions.pop();
    }
  }

  showNameModifiedAlert() {
    // we need to wait on some ajax calls
    if (this.mode !== 'edit' || !this.roleId || !this.domainRoles.length) {
      return false;
    }
    let dr = this.domainRoles.find(dr => +dr.role.id === +this.roleId);
    if (!dr) {
      return false;
    }
    return dr.role.val !== this.role;
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
      let opt = this.domainRoleOptions.find(ro => +ro.id === +this.roleId);
      let dr = this.domainRoles.find(dr => +dr.role.id === +this.roleId);
      if (!opt) {
        console.error('unable to update role label');
        return;
      }
      opt.label = this.role;
    }

  }

  roleIsNew() {

  }

  roleExists() {
    return !!this.domainRoleOptions.find(d => {
      return d.label.toUpperCase() === this.role.toUpperCase() && !d.isNew;
    });
  }

  validate() {
    if (this.mode === 'edit') {
      return this.role;
    } else {
      return this.selectedDomain && this.role && !this.roleExists();
    }
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
    } else if (this.mode === 'new' && this.roleExists()) {
      this.errors.role = 'Cannot create role. Role name already exists';
    }
  }

  onSubmitClick() {
    if (this.validate()) {
      this.requestObject = this.getRequestObject();
      this.accessService.putRole(this.requestObject).subscribe(
        res => {
          let verb = this.mode === 'new' ? 'created' : 'editted';
          this.footerAlert.registerFooterAlert({
            description: 'Successfully '+verb+' new role.',
            type: 'success'
          });
          this.router.navigateByUrl('/access/workspace');
        },
        err => {
          this.showGenericServicesError();
        }
      );

    } else {
      this.showValidationErrors();
    }
  }

  getRequestObject() {
    let allDomainRoles = this.domainRoleOptions.filter(dr => dr.isSelected);
    let domainRoles = allDomainRoles.map(dr => {
      return {
        id: dr.id,
      };
    });
    domainRoles = domainRoles.filter(dr => {
      return typeof dr.id !== 'undefined';
    });

    let allFuncs = this.permissionOptions.map(obj => {
      if (+obj.id === 0) {
        return;
      }
      let permissions = obj.permissions.filter(perm => perm.isSelected);
      permissions = permissions.map(perm => {
        return {
          id: perm.value,
          isDefault: perm.isDefault
        };
      });

      return {
        function: {
          id: obj.id,
        },
        permission: permissions
      };
    });

    let role = { };

    if (this.mode === 'edit') {
      role['id'] = this.roleId;
      if (this.role.toUpperCase() !== this.originalRole.toUpperCase()) {
        role['val'] = this.role;
      }
    } else {
      role['val'] = this.role;
    }

    let ret = {
      "domain":{
        "id": +this.selectedDomain || +this.domain
      },
      "roleDefinitionMapContent":[
        {
          role: role,
          "functionContent":[
            {
              function: {
                id: 0
              },
              permission: domainRoles
            },
          ]
        }
      ]
    };

    ret.roleDefinitionMapContent[0].functionContent = ret.roleDefinitionMapContent[0].functionContent.concat(allFuncs);
    return ret;

  }
}
