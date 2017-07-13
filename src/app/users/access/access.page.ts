import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import 'rxjs/add/operator/pairwise';
import { AlertFooterService } from "../../../alerts/alert-footer/alert-footer.service";
import { Cookie } from 'ng2-cookies';
import { IBreadcrumb, OptionsType } from "sam-ui-kit/types";
import { RoleTableRow } from "../role-table/role-table.component";
import { UserAccessService } from "api-kit/access/access.service";
import { ActivatedRoute } from "@angular/router";
import { AgencyPickerComponent } from "../../app-components/agency-picker/agency-picker.component";

@Component({
  templateUrl: 'access.template.html'
})
export class UserAccessPage implements OnInit {

  private sortOptions: Array<OptionsType> = [
    { value: 'asc', label: 'Organization A-Z', name: 'Organization A-Z'},
    { value: 'desc', label: 'Organization Z-A', name: 'Organization Z-A'}
  ];
  private sort: 'asc'|'dsc' = 'asc';

  private myCrumbs: Array<IBreadcrumb> = [
    { url: '/profile/details', breadcrumb: 'Profile' },
    { breadcrumb: 'My Access' }
  ];

  private adminCrumbs: Array<IBreadcrumb> = [
    { url: '/workspace', breadcrumb: 'Workspace' },
    { url: '/access/user-roles-directory', breadcrumb: 'Role Management'}
  ];

  private title: string = 'PROFILE';
  private subTitle : string = 'My Access';

  private crumbs: Array<IBreadcrumb>;

  private roles: Array<RoleTableRow> = [];
  private response: any = null;

  private domainOptions: Array<OptionsType> = [];
  private selectedDomain: any = null;
  private roleOptions: Array<OptionsType> = [];
  private selectedRole: any = null;
  private selectedOrg;

  // pagination
  private totalPages: number;
  private currentPage: number = 1;

  private user: any = {};
  private userName = '';
  private domainCounts: any = {};

  // pending requests
  private requests = [];

  private isAdmin: boolean;
  private isFirstRequest: boolean = true;
  private hideFilters: boolean = true;

  @ViewChild('picker') agencyPicker: AgencyPickerComponent;

  constructor(
    private userService: UserAccessService,
    private route: ActivatedRoute,
    private router: Router,
    )
  {

    this.isAdmin = this.route.snapshot.data['isAdminView'];
    this.crumbs = this.isAdmin ? this.adminCrumbs : this.myCrumbs;
    this.title = this.isAdmin ? 'ROLE MANAGEMENT' : 'PROFILE';
  }

  ngOnInit( ) {
    this.userName = this.isAdmin ? this.route.snapshot.params['id'] : this.route.snapshot.data['userName'];
    this.user.email = this.userName;
    this.onSearchParamChange();
    this.getPendingRequests();

  }

  onClearAllClick() {
    this.selectedRole = null;
    this.selectedOrg = null;
    this.selectedDomain = null;
    this.agencyPicker.onResetClick();
    this.onSearchParamChange();
  }

  getPendingRequests() {
    this.userService.getOpenRequests(this.userName).subscribe(reqs => {
      this.requests = reqs.userAccessRequestList;
      //console.log(this.requests);
    });
  }

  onSearchParamChange() {
    let queryParams: any = {
      page: this.currentPage,
      order: this.sort,
    };

    if (this.selectedDomain) {
      queryParams.domainKey = this.selectedDomain;
    }

    if (this.selectedRole) {
      queryParams.roleKey = this.selectedRole;
    }

    if (this.selectedOrg) {
      queryParams.orgKey = this.selectedOrg;
    }

    this.userService.getAllUserRoles(this.userName, queryParams).subscribe(res => {
      if (res.total === 0) {
        this.totalPages = 0;
      } else {
        this.totalPages = Math.floor((res.total-1) / res.limit)+1;
      }

      if (this.isFirstRequest && res.total > 0) {
        this.hideFilters = false;
      }

      this.isFirstRequest = false;

      if (Number.isInteger(res.offset)) {
        this.currentPage = Math.floor(res.offset / res.limit) + 1;
      }

      this.response = res;
      this.user = {
        name: `${res.user.firstName} ${res.user.lastName}`,
        email: res.user.email,
      };
      if (this.adminCrumbs.length < 3) {
        this.adminCrumbs.push({breadcrumb: this.user.name == "undefined undefined" ? " " : this.user.name});
      }
      this.roles = res.access.map(acc => {
        let path = this.isAdmin ? `/users/${this.userName}/edit-access` : '';
        this.subTitle = this.isAdmin ? this.user.name : 'My Access';
        return {
          organization: acc.organization.val,
          organizationId: acc.organization.id,
          domain: acc.domain.val,
          domainId: acc.domain.id,
          path: path,
          queryParams: {
            domain: acc.domain.id,
            orgs: acc.organization.id,
            role: acc.role.id,
          },
          role: acc.role.val,
          roleId: acc.role.id,
          isDeletable: !!(acc.links && acc.links.find(l => {
            if (!l.rel || !l.rel.toUpperCase) {
              return false;
            }
            return l.rel.toUpperCase() === 'REMOVE';
          })),
        };
      });

      this.domainCounts = res.countSummary;
      this.updateRoleOptions();
      this.setDomainOptions();
    });
  }

  onOrganizationsChange(org) {
    if (org){
      this.selectedOrg = org.value;
    } else {
      this.selectedOrg = undefined;
    }
    this.onSearchParamChange();
  }

  updateRoleOptions() {
    let domain = this.domainCounts.find(d => {
      return ''+d.id === ''+this.selectedDomain;
    });

    if (!domain) {
      this.roleOptions = [];
      return;
    }

    this.roleOptions = domain.roles.map(r => {
      let label = `${r.val} (${r.count})`;
      return {
        label: label,
        name: label,
        value: r.id
      };
    });
  }

  setDomainOptions() {
    this.domainOptions = this.domainCounts.map(d => {
      let label = `${d.val} (${d.count})`;
      return {
        label: label,
        name: label,
        value: d.id,
      };
    });
  }

  onDeleteRow(index) {
    this.onSearchParamChange();
  }

  onDomainChange() {
    this.selectedRole = null;
    this.onSearchParamChange();
  }

  onRoleChange() {
    this.onSearchParamChange();
  }

  onPageChange($event) {
    this.currentPage = $event;
    this.onSearchParamChange();
  }

  resultCountText() {
    if (!this.response || !this.roles.length) {
      return;
    }
    if (this.roles.length === 1) {
      return `Showing 1 or 1 result`;
    }
    let start = this.response.offset + 1;
    let end = start + this.roles.length - 1;
    let total = this.response.total;
    return `Showing ${start}-${end} of ${total} results`;
  }
}
