import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OptionsType, IBreadcrumb } from "sam-ui-elements/src/ui-kit/types";
import { UserAccessService } from "api-kit/access/access.service";
import { ActivatedRoute } from "@angular/router";
import { AgencyPickerComponent } from "../../app-components/agency-picker/agency-picker.component";
import { CapitalizePipe } from "../../app-pipes/capitalize.pipe";
import { UserService } from "../../role-management/user.service";
import { get as getProp } from "lodash";
import { SamModalComponent } from "sam-ui-elements/src/ui-kit/components";
import { AlertFooterService } from "../../app-components/alert-footer/alert-footer.service";
import { SamTitleService } from "../../../api-kit/title-service/title.service";
import { ToggleService } from "api-kit/toggle/toggle.service";
import { get as getProperty } from 'lodash';

@Component({
  templateUrl: 'my-access.template.html',
  providers: [CapitalizePipe],
})
export class MyAccessPage implements OnInit {

  private navLinks = [
    { text: 'Personal Details', routerLink: ['/profile/details'] },
    { text: 'Reset Password',   routerLink: ['/profile/password'] },
    { text: 'My Roles', active: true },
    { text: 'Role Migrations',  routerLink: ['/profile/migrations'] },
    { text: 'Manage Subscriptions',  routerLink: ['/profile/subscriptions'] },
  ];
  sort: any = {type:'org', sort:'asc'};
  sortOptions = [
    { value: 'org', label: 'Organization' },
  ];
  private access: Array<any> = [];
  private domainOptions: Array<OptionsType> = [];
  private selectedDomainIds: any = [];
  private roleOptions: Array<OptionsType> = [];
  private selectedRoleIds: any = [];
  // pagination
  private totalPages: number = 0;
  private totalElements: number = 0;
  private currentPage: number = 1;
  private showing: number = 0;

  private userName = '';
  private fullName = '';
  private requests = [];
  private canRequest: boolean = false;
  private canGrant: boolean = false;
  private result: 'success'|'error'|'pending' = 'pending';
  private errorMessage: string = '';
  private isMyAccess: boolean = false;
  private crumbs = [];

  @ViewChild('picker') agencyPicker: AgencyPickerComponent;
  @ViewChild('deleteModal') deleteModal: SamModalComponent;

  constructor(
    private userAccessService: UserAccessService,
    private capitalize: CapitalizePipe,
    private userCookieService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private alertFooter: AlertFooterService,
    private samTitle: SamTitleService,
    private toggleService: ToggleService
  )
  {

  }

  ngOnInit( ) {
    this.toggleService.getToggleStatus('enablemanagesubscription','/wl').subscribe(isEnabled => {
          if(!isEnabled){
             for(var i=this.navLinks.length-1; i>=0; i--) {
               if( this.navLinks[i].text == "Manage Subscriptions") {
                  this.navLinks.splice(i,1); break;
               }
             }
         }
     }) ;
    this.isMyAccess = !!this.route.snapshot.data['isMyAccess'];
    let cookieUser = this.userCookieService.getUser() && this.userCookieService.getUser().uid;
    this.userName = this.route.snapshot.params['id'] || cookieUser;
    this.onSearchParamChange();
  }

  getPendingRequests() {
    this.userAccessService.getOpenRequests(this.userName).subscribe(reqs => {
      this.requests = reqs.userAccessRequestList;
    });
  }

  areFiltersSelected() {
    return this.selectedDomainIds.length || this.selectedRoleIds.length;
  }

  shouldShowActions() {
    return !this.domainOptions.length && !this.roleOptions.length;
  }

  shouldShowNoResults() {
    return this.areFiltersSelected() && !this.access.length;
  }

  onSearchParamChange() {
    this.result = 'pending';

    let queryParams: any = {
      page: this.currentPage,
      order: this.sort.sort,
    };

    if (this.selectedDomainIds && this.selectedDomainIds.length) {
      queryParams.domainKey = this.selectedDomainIds.join(',');
    }

    if (this.selectedRoleIds && this.selectedRoleIds.length) {
      queryParams.roleKey = this.selectedRoleIds.join(',');
    }

    this.userAccessService.getAllUserRoles(this.userName, queryParams).subscribe(
      res => {
        try {
          this.result = 'success';

          this.getPendingRequests();

          if (!this.isMyAccess) {
            this.getUserDisplayName(res);
            this.samTitle.setTitleString(this.fullName);
          }

          if (!res) {
            this.access = [];
            return;
          }

          this.getAccessPriveleges(res);
          this.getPaginationVariables(res);

          this.access = res.access;

          if (res.roles) {
            this.setRoleOptions(res.roles);
          }

          if (res.domains) {
            this.setDomainOptions(res.domains);
          }
        } catch(error) {
          console.error('Invalid syntax for role data', error);
          this.result = 'error';
          this.errorMessage = "There was a syntax error while processing role data.";
        }
      },
      err => {
        console.error('Error while loading access data. Details: ', err);
        this.result = 'error';
        this.errorMessage = "There was an error with the role service.";
      }
    );
  }

  getAccessPriveleges(res) {
    if (res._links && res._links.request_access) {
      this.canRequest = true;
    }
    if (res._links && res._links.grant_access) {
      this.canGrant = true;
    }
  }

  getPaginationVariables(res) {
    if (res.limit) {
      this.showing = res.limit;
    } else {
      this.showing = 0;
    }

    this.totalElements = res.total;

    if (res.total === 0) {
      this.totalPages = 0;
    } else {
      this.totalPages = Math.floor((res.total-1) / res.limit)+1;
    }

    if (Number.isInteger(res.offset)) {
      this.currentPage = Math.floor(res.offset / res.limit) + 1;
    } else {
      this.currentPage = 0;
    }
  }

  getUserDisplayName(res) {
    let firstName = getProp(res, 'user.firstName');
    let lastName = getProp(res, 'user.lastName');
    let email = getProp(res, 'user.email');

    if (firstName && !lastName) {
      this.fullName = firstName;
    } else if (lastName && !firstName) {
      this.fullName = lastName;
    } else if (firstName && lastName) {
      this.fullName = `${res.user.firstName} ${res.user.lastName}`;
    } else if (email) {
      this.fullName = email;
    } else {
      console.warn('user name missing');
      this.fullName = "";
    }

    let c: Array<IBreadcrumb> = [
      { breadcrumb: 'Workspace', url: '/workspace' },
      { breadcrumb: 'Roles Directory', url: '/role-management/roles-directory' },
      { breadcrumb: this.fullName },
    ];
    this.crumbs = c;
  }

  setRoleOptions(roles) {
    this.roleOptions = roles.map(r => {
      return {
        label: r.val,
        value: r.id,
        name: r.val,
      }
    });
  }

  setDomainOptions(domains) {
    this.domainOptions = domains.map(d => {
      return {
        label: d.val,
        value: d.id,
        name: d.val,
      }
    });
  }

  onDomainChange() {
    this.currentPage = 1;
    this.onSearchParamChange();
  }

  onRoleChange() {
    this.currentPage = 1;
    this.onSearchParamChange();
  }

  orgName(org) {
    if (org.val && org.val.length) {
      return this.capitalize.transform(org.val);
    } else if (org.id === 0) {
      return 'Organization not found';
    }
    return org.id;
  }

  onPageChange($event) {
    this.currentPage = $event;
    this.onSearchParamChange();
  }

  getPageTitle() {
    return this.isMyAccess ? 'My Roles' : this.fullName;
  }

  isRowDeletable(roleOrg) {
    return !this.isMyAccess && getProperty(roleOrg, '_links.delete_access');
  }

  isRowEditable(roleOrg) {
    return !this.isMyAccess && getProperty(roleOrg, '_links.edit_access');
  }

  onRowClick(access) {
    if (!this.isRowEditable(access)) {
      return;
    }

    try {
      let qp = {
        domains: access.domain.map(d => d.id),
        role: access.role.id,
        org: access.organization.id,
        orgName: access.organization.val,
      };
      this.router.navigate(["../edit-access"], { queryParams: qp, relativeTo: this.route});
    } catch(err) {
      console.error(err);
    }
  }

  existingAccessToDelete: any;
  indexToDelete: number;

  onDeleteClick($event, org, role, domains, index) {
    $event.stopPropagation();

    this.indexToDelete = index;

    this.existingAccessToDelete = {
      organizations: [org],
      role: +role,
      domains: domains.map(d => +d.id)
    };


    this.deleteModal.openModal();
  }

  onDeleteConfirm() {
    this.deleteModal.closeModal();
    let body = {
      existingAccess: this.existingAccessToDelete,
      users: [this.userName],
      mode: 'DELETE',
    };

    this.userAccessService.deleteAccess(body).subscribe(
      () => {
        this.access.splice(this.indexToDelete, 1);
        this.onSearchParamChange();
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

  getAssignRoleLink() {
    if (this.isMyAccess) {
      return `/role-management/users/${this.userName}/assign-roles`;
    } else {
      return '../assign-roles';
    }
  }
}
