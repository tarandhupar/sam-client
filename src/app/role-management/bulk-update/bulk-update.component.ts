import { Component, Input, forwardRef, ElementRef } from "@angular/core";
import { UserService } from "../user.service";
import { UserAccessService } from "../../../api-kit/access/access.service";
import { AlertFooterService } from "../../app-components/alert-footer/alert-footer.service";
import { Router, ActivatedRoute } from "@angular/router";
import { IBreadcrumb } from "sam-ui-kit/types";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";
import { Location } from "@angular/common";

type TabName = 'filters'|'users'|'access'|'confirmation';

function labelCompare(a, b) {
  let aUpper = a.label.toUpperCase();
  let bUpper = b.label.toUpperCase();
  if (aUpper < bUpper) {
    return -1;
  }
  if (aUpper > bUpper) {
    return 1;
  }
  return 0;
}

@Component({
  selector: "sam-toggle",
  template: `
    <input type="checkbox" [(ngModel)]="_checked" [disabled]="disabled" (click)="onSwitchClick()" style="max-width: 200px">
    <label class="sam-toggle" [style.pointer-events]="disabled ? 'none' : 'all'">{{label}}</label>
  `,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SamToggle),
    multi: true
  }]
})
export class SamToggle implements ControlValueAccessor {
  @Input() label: string;
  @Input() disabled: boolean = false;
  private _checked: boolean = false;

  constructor() { }

  onSwitchClick(): void {
    this._checked = !this._checked;
    this.onTouched();
    this.onChange(this._checked);
  }

  /* ControlValueAccessor BoilerPlate */
  private onChange: any = () => { };
  private onTouched: any = () => { };
  registerOnChange(fn) { this.onChange = fn; }
  registerOnTouched(fn) { this.onTouched = fn; }
  setDisabledState(disabled) { this.disabled = disabled; }
  writeValue(value:boolean) { this._checked = value; }
}

@Component({
  templateUrl: './bulk-update.template.html'
})
export class BulkUpdateComponent {
  test: boolean = false;

  sideNavSections: Array<string> = [
    'Define Users', 'Validate Users', 'Update Users', 'Confirm'
  ];

  tabs: Array<TabName> = ['filters', 'users', 'access', 'confirmation'];
  currentTab: any = 'filters';
  user: any = {};
  org;
  domainOptionsByRole = {};
  existingDomains = [];
  updatedDomains = [];
  roleOptions = [];
  existingRole;
  updatedRole;
  role;
  errors = {
    domains: '',
    role: '',
    org: '',
  };
  accessErrors = {
    domains: '',
    role: '',
    comments: '',
  };
  domainTabs = [];
  sortOptions = [
    { value: 'email', label: 'Email' },
    { value: 'last', label: 'Last name' },
  ];
  sort = { type: 'last', sort: 'asc' };
  showDeselect: boolean = true;
  mode: 'update'|'remove'|undefined = 'update';
  modeOptions = [
    { label: 'Update Access', value: 'update' },
    { label: 'Remove Access', value: 'remove' },
  ];
  users = [];
  areUsersLoading = false;
  comments = '';
  breadCrumbs: Array<IBreadcrumb> = [
    { breadcrumb: 'Roles Directory', url: '/role-management/roles-directory' },
    { breadcrumb: 'Bulk Update'}
  ];
  existingAccess = {};
  staticContentStyle = {
    'border-radius': '3px',
    'background-color': 'white',
    'border': '1px solid lightgray',
    'padding': '.5em'
  };

  constructor(
    private userService: UserService,
    private userAccessService: UserAccessService,
    private footerAlerts: AlertFooterService,
    private router: Router,
    private route: ActivatedRoute,
    private el: ElementRef,
    private location: Location
  ) {

  }

  ngOnInit() {
    this.user = this.userService.getUser();
    this.getDomains();
  }

  getDomains() {
    this.userAccessService.checkAccess(`users/:id/grant-access`).map(r => r.json()).subscribe(
      (a: any) => {
        try {
          this.domainOptionsByRole = {};
          this.roleOptions = a.grantRoles.map(r => {
            this.domainOptionsByRole[r.id] = r.supportedDomains.map(d => ({value: d.val, key: ''+d.id}));
            return { label: r.val, value: r.id };
          }).sort(labelCompare);
        } catch(err) {
          console.error(err);
          this.footerAlerts.registerFooterAlert({
            type: 'error',
            title: 'Error',
            description: 'Unable to parse roles and domains for user',
            timer: 3200,
          });
        }
      },
      err => {
        console.error(err);
        this.footerAlerts.registerFooterAlert({
          type: 'error',
          title: 'Error',
          description: 'Unable to fetch grant privileges for logged in user.',
          timer: 3200,
        });
      }
    );
  }

  isRoleUpdated() {
    return this.updatedRole !== this.existingRole;
  }

  isDomainUpdated() {
    return !this.arraysEqual(this.existingDomains, this.updatedDomains);
  }

  // this function assumes there are no duplicate items in either array
  arraysEqual(a1, a2) {
    if (a1.length !== a2.length) {
      return false;
    }
    // check if the two arrays are equal
    let a = a1.slice();
    let b = a2.slice();
    a.forEach(ai => {
      // remove item from b if it is in a
      b = b.filter(bi => bi.key !== ai.key);
    });
    return b.length === 0;
  }

  onExistingDomainChange(domains) {
    this.updatedDomains = domains;
    this.onDomainChange(domains);
  }

  onUpdatedDomainChange(domains) {
    this.onDomainChange(domains);
  }

  currentIndex() {
    return this.tabs.indexOf(this.currentTab);
  }

  getExistingDomainOptions() {
    let role = +this.existingRole;
    return this.domainOptionsByRole[role] || [];
  }

  getUpdatedDomainOptions() {
    let role = +this.updatedRole;
    return this.domainOptionsByRole[role] || [];
  }

  onUpdatedRoleChange(role) {
    this.updatedRole = role;
    this.updatedDomains = [];
    this.onRoleChange(role);
  }

  onExistingRoleChange(role) {
    this.existingDomains = [];
    this.existingRole = role;
    this.updatedRole = role;
  }

  onUserRowClick(user) {
    user.isSelected = !user.isSelected;
  }

  formatUserName(user) {
    if (!user) {
      return '';
    }
    return [user.firstName, user.lastName].filter(o => o).join(' ');
  }

  onRoleChange(role) {
    this.resetObjects();
  }

  resetObjects() {
    this.domainTabs = [];
  }

  isCurrentTab(tabName : TabName) {
    return tabName === this.currentTab;
  }

  tabIndex() {
    return this.tabs.indexOf(this.currentTab);
  }

  onBackClick() {
    if (this.currentTab === 'confirmation' && this.mode === 'remove') {
      this.currentTab = 'users';
      return;
    }
    if (this.currentTab === 'confirmation' && this.mode === 'update') {
      this.selectFirstPermissionTab();
    }
    let i = this.tabIndex();
    this.currentTab = this.tabs[i-1];
  }

  permissionsForFunction(func) {
    return func.permissions.filter(p => p.checked).map(p => p.name).join(',');
  }

  clearFilterErrors() {
    this.errors = {
      domains: '',
      role: '',
      org: '',
    };
  }

  clearAccessErrors() {
    this.accessErrors = {
      domains: '',
      role: '',
      comments: '',
    }
  }

  onNextClick() {
    if (this.currentTab === 'filters' && !this.validateFilters()) {
      this.clearFilterErrors();
      this.showFilterErrors();
      return;
    }
    if (this.currentTab === 'users' && !this.getSelectedUsers().length) {
      this.footerAlerts.registerFooterAlert({
        description: 'Select at least one user.',
        title: '',
        type:'error',
        timer:3200
      });
      return;
    }
    if (this.currentTab === 'users') {
      this.selectFirstPermissionTab();
    }
    if (this.currentTab === 'filters') {
      this.doUserSearch();
      this.updateExistingAccess();
      return;
    }
    if (this.currentTab === 'users' && this.mode === 'remove') {
      this.currentTab = 'confirmation';
      return;
    }
    if (this.currentTab === 'access' && !this.validateAccess()) {
      this.clearAccessErrors();
      this.showAccessErrors();
      return;
    }
    let i = this.tabIndex();
    this.currentTab = this.tabs[i+1];
  }

  updateExistingAccess() {
    this.existingAccess = {
      organizations: [''+this.org.orgKey],
      role: +this.existingRole,
      domains: this.existingDomains.map(d => +d.key)
    };
  }

  validateFilters() {
    return this.org && this.org.value && this.existingDomains && this.existingDomains.length && this.existingRole;
  }

  validateAccess() {
    return this.updatedDomains && this.updatedDomains.length && this.updatedRole && this.comments;
  }

  showFilterErrors() {
    if (!this.existingDomains || !this.existingDomains.length) {
      this.errors.domains = 'A domain is required';
    }

    if (!this.org || !this.org.value) {
      this.errors.org = 'An organization is required';
    }

    if (!this.existingRole) {
      this.errors.role = 'A role is required';
    }
  }

  showAccessErrors() {
    if (!this.updatedDomains || !this.updatedDomains.length) {
      this.accessErrors.domains = 'A domain is required';
    }
    if (!this.updatedRole) {
      this.accessErrors.role = 'A role is required';
    }
    if (!this.comments) {
      this.accessErrors.comments = 'A comment is required';
    }
  }

  getSelectedUsers() {
    if (!this.user || !this.users.length) {
      return [];
    }
    return this.users.filter(u => u.isSelected);
  }

  getSelectedUserIds() {
    let selected = this.getSelectedUsers();
    return selected.map(u => u.email);
  }

  getSelectedPermissions(object) {
    let permissions = object.permission.filter(perm => perm.isCheckable).map(perm => perm.val).join(', ');
    return permissions.join(', ');
  }

  onPermissionClick(perm) {
    perm.isCheckable = !perm.isCheckable;
  }

  onDomainChange(domains) {
    if (!domains || !domains.length) {
      this.domainTabs = [];
      return;
    }
    let d = domains.map(i => ''+i.key).join(',');
    let r = ''+this.role;

    this.userAccessService.getDomainDefinition('role', d, r).subscribe(
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
          this.footerAlerts.registerFooterAlert({
            type: 'error',
            title: 'Error',
            description: 'Unable to parse permission data',
            timer: 3200,
          });
        }
      },
      err => {
        console.error(err);
        this.footerAlerts.registerFooterAlert({
          type: 'error',
          title: 'Error',
          description: 'Unable to fetch permission information for logged in user.',
          timer: 3200,
        });
      }
    );
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

  onDoneClick() {
    let users = this.getSelectedUserIds();
    let domains = this.getDomainData(this.domainTabs);

    let body: any = {
      users: users,
      existingAccess: this.existingAccess,
      message: this.comments,
    };

    if (this.mode === 'update') {
      body.mode = 'EDIT';
      body.updatedAccess = {
        organizations: [''+this.org.orgKey],
        role: +this.updatedRole,
        domainData: domains,
      };
    } else {
      body.mode = 'DELETE';
    }

    let method = this.mode === 'update' ? 'putAccess' : 'deleteAccess';

    this.userAccessService[method](body).subscribe(
      res => {
        this.footerAlerts.registerFooterAlert({
          type: 'success',
          description: `${users.length} users updated.`
        });
        this.router.navigate(["../roles-directory"], { relativeTo: this.route});
      },
      err => {
        if (err && err.status === 409) {
          console.error(err);
          let e: string = 'The user already has access for this domain at one or more of the selected organization(s)';
          this.footerAlerts.registerFooterAlert({
            description: e,
            type: "error",
            timer: 3200
          });
        } else {
          console.error(err);
          this.footerAlerts.registerFooterAlert({
            description: 'There was an error with a required service',
            type: "error",
            timer: 3200
          });
        }

      }
    );
  }

  onOrganizationChange(org) {
    this.org = org;
  }

  getExistingDomainNames() {
    if (!this.existingDomains || !this.existingDomains.length) {
      return '';
    }
    return this.existingDomains.map(d => d.value).join(', ');
  }

  getUpdatedDomainNames() {
    return this.updatedDomains.map(d => d.value).join(', ');
  }

  getRoleName(roleId) {
    let r = this.roleOptions.find(rol => ''+rol.value === ''+roleId);
    if (r && r.label) {
      return r.label;
    }
    return '';
  }

  getExistingRoleName() {
    return this.getRoleName(this.existingRole);
  }

  getUpdatedRoleName() {
    return this.getRoleName(this.updatedRole);
  }

  selectFirstPermissionTab() {
    let that = this;
    setTimeout(() => {
      let item = that.el.nativeElement.querySelector('sam-tabs .item');
      if (item) {
        item.click();
      }
    }, 0);
  }

  doUserSearch() {
    this.areUsersLoading = true;
    this.users = [];
    let sort = this.sort.type;
    let order = this.sort.sort;

    let params = {
      domainKey: this.existingDomains.map(d => +d.key).join(','),
      roleKey: this.existingRole,
      orgKey: this.org.orgKey,
      sort: sort,
      order: order,
    };
    this.userAccessService.getUsersV1(params).subscribe(
      users => {
        if (!users || !users.length) {
          this.footerAlerts.registerFooterAlert({
            description:"No users found for selected criteria.",
            title:"",
            type:'warning',
            timer:3200
          });
          return;
        }

        this.users = users;
        this.users.forEach(u => {
          u.isSelected = true;
        });

        this.currentTab = 'users';
      },
      err => {
        this.footerAlerts.registerFooterAlert({
          title:"There was an error while searching for users.",
          description:"",
          type:'error',
          timer:3200
        });
      },
      () => {
        this.areUsersLoading = false;
      }
    );
  }

  sideNavClass(tabIndex) {
    let currentIndex = this.currentIndex();

    if (tabIndex < currentIndex) {
      return 'completed';
    } else if (tabIndex === currentIndex) {
      return 'active';
    } else if (tabIndex > currentIndex) {
      return 'pending';
    }
  }

  toggleSelectAll() {
    this.showDeselect = !this.showDeselect;
    this.users.forEach(u => u.isSelected = this.showDeselect);
  }

  permissionId(permission, object) {
    return permission.val + '_' + object.function.val;
  }

  shouldShowNextSpinner() {
    return this.areUsersLoading && this.isCurrentTab('filters');
  }

}
