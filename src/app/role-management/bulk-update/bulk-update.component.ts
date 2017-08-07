import { Component } from "@angular/core";
import { UserService } from "../../users/user.service";
import { UserAccessService } from "../../../api-kit/access/access.service";
import { AlertFooterService } from "../../alerts/alert-footer/alert-footer.service";
import { PropertyCollector } from "../../app-utils/property-collector";
import { Router } from "@angular/router";
import {CapitalizePipe} from "../../app-pipes/capitalize.pipe";

type TabName = 'filters'|'users'|'access'|'confirmation';

@Component({
  templateUrl: './bulk-update.template.html'
})
export class BulkUpdateComponent {
  tabs: Array<TabName> = ['filters', 'users', 'access', 'confirmation'];
  currentTab: TabName= 'filters';
  user: any = {};
  org;
  domainOptions = [];
  domain;
  roleOptions = [];
  existingRole;
  updatedRole;
  roles;
  errors = {
    domain: '',
    role: '',
    org: '',
  };
  objects = [];
  sortOptions = [
    { value: 'email-asc', label: 'Email (A-Z)' },
    { value: 'email-desc', label: 'Email (Z-A)' },
    { value: 'last-asc', label: 'Last name (A-Z)' },
    { value: 'last-desc', label: 'Last name (Z-A)' }
  ];
  sort = 'email-asc';
  showDeselect: boolean = true;
  mode: 'update'|'remove'|undefined = 'update';
  modeOptions = [
    { label: 'Update Access', value: 'update' },
    { label: 'Remove Access', value: 'remove' },
  ];
  users = [];
  areUsersLoading = false;
  comments = '';

  constructor(
    private userService: UserService,
    private userAccessService: UserAccessService,
    private footerAlerts: AlertFooterService,
    private router: Router,
    private capitalize: CapitalizePipe,
  ) {

  }

  ngOnInit() {
    this.user = this.userService.getUser();
    this.getDomains();
  }

  getDomains() {
    this.userAccessService.getDomains().subscribe(
      domains => {
        this.domainOptions = domains._embedded.domainList.map(domain => {
          return { value: domain.id, label: this.capitalize.transform(domain.domainName) };
        });
        this.domain = domains._embedded.domainList[0].id;
        this.getRoles(true);
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

  isRoleUpdated() {
    return this.updatedRole !== this.existingRole;
  }

  onDomainChange(domain) {
    this.domain = domain;
    this.existingRole = null;
    this.roleOptions = [];
    this.objects = [];
    this.getRoles(true);
  }

  getRoles(selectFirstRole?: boolean) {
    let options: any = {domainID: this.domain};
    this.userAccessService
      .getRoles(options)
      .subscribe(
        perms => {
          this.roles = perms;
          let c = new PropertyCollector(perms);
          let roles = c.collect([[], 'role']);
          this.roleOptions = roles.map(role => {
            return { label: this.capitalize.transform(role.val), value: role.id };
          });
          if (selectFirstRole && this.roles[0] && this.roles[0].role) {
            this.onExistingRoleChange(this.roles[0].role.id);
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

  onUpdatedRoleChange(role) {
    this.updatedRole = role;
    this.onRoleChange(role);
  }

  onExistingRoleChange(role) {
    this.existingRole = role;
    this.updatedRole = role;
    this.onRoleChange(role);
  }

  /*
   * If first only return "first - ";
   * If last only return "last - ";
   * If first and last return "first last - ";
   * If neither return empty string
   */
  formatUserName(user) {
    let first = user.firstName;
    let last = user.lastName;
    let name = '';
    if (first && last) {
      name = [first, last].join(' ') + ' - ';
    } else if (first) {
      name = first + ' - ';
    } else if (last) {
      name = last + ' - ';
    }
    return name;
  }

  onRoleChange(role) {
    let r = this.roles.find(r => {
      return +r.role.id === +role;
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
    let i = this.tabIndex();
    this.currentTab = this.tabs[i-1];
  }

  onNextClick() {
    if (this.currentTab === 'filters' && !this.validateFilters()) {
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
    if (this.currentTab === 'filters') {
      this.doUserSearch();
      return;
    }
    if (this.currentTab === 'users' && this.mode === 'remove') {
      this.currentTab = 'confirmation';
      return;
    }
    let i = this.tabIndex();
    this.currentTab = this.tabs[i+1];
  }

  validateFilters() {
    return this.org && this.domain;
  }

  showFilterErrors() {
    if (!this.domain) {
      this.errors.domain = 'A domain is required';
    }

    if (!this.org) {
      this.errors.org = 'An organization is required';
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

  getSelectedObjects() {
    return this.objects.filter(obj => {
      return obj.permission && obj.permission.length && this.getSelectedPermissions(obj).length
    });
  }

  getSelectedPermissions(object) {
    let permissions = object.permission.filter(perm => !perm.notChecked).map(perm => {
      return this.capitalize.transform(perm.val);
    });
    return permissions.join(', ');
  }

  onPermissionClick(perm) {
    perm.notChecked = !perm.notChecked;
  }

  getUnSelectedPermissions() {
    return this.objects.map(obj => {
      let perms = obj.permission.filter(p => p.notChecked).map(p => p.id);
      return {
        function: obj.function.id,
        permission: perms
      }
    });
  }

  onDoneClick() {
    let permissions = this.getUnSelectedPermissions();
    let users = this.getSelectedUserIds();

    let req = {
      organization: ''+this.org.value,
      domain: +this.domain,
      existingRole: +this.existingRole,
      updatedRole: this.isRoleUpdated() ? +this.updatedRole : null,
      functionContent: permissions,
      users: users,
      mode: this.mode === 'update' ? 'edit' : 'remove',
      message: this.comments
    };

    this.userAccessService.postAccess(req).subscribe(
      () => {
        this.router.navigate(['access/user-roles-directory']);
        this.footerAlerts.registerFooterAlert({
          description:`Succesfully updated access for ${users.length} user${users.length > 1 ? 's' : ''}.`,
          title: '',
          type:'success',
          timer:3200
        });
      },
      () => {
        this.footerAlerts.registerFooterAlert({
          description:"Something went wrong while trying to grant access.",
          title:"",
          type:'error',
          timer:3200
        });
      }
    );
  }

  onOrganizationChange(org) {
    this.org = org;
  }

  domainName() {
    let d = this.domainOptions.find(dom => ''+dom.value === ''+this.domain);
    if (d && d.label) {
      return d.label;
    }
    return '';
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

  doUserSearch() {
    this.areUsersLoading = true;
    this.users = [];
    let sort = 'email';
    let order = 'asc';

    switch (this.sort) {
      case 'email-asc': sort = 'email'; order = 'asc'; break;
      case 'email-desc': sort = 'email'; order = 'desc'; break;
      case 'last-asc': sort = 'name'; order = 'asc'; break;
      case 'last-desc': sort = 'name'; order = 'desc'; break;
    }
    let params = {
      domain: this.domain,
      roles: this.existingRole,
      orgKey: this.org.value,
      sort: sort,
      order: order,
    };
    this.userAccessService.getUsers(params).subscribe(
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
