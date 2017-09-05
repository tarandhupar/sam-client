import {Component, OnInit, ViewChild} from '@angular/core';
import { AlertFooterService } from "../../../alerts/alert-footer/alert-footer.service";
import { OptionsType } from "sam-ui-kit/types";
import { UserAccessService } from "api-kit/access/access.service";
import { ActivatedRoute } from "@angular/router";
import { AgencyPickerComponent } from "../../app-components/agency-picker/agency-picker.component";
import { CapitalizePipe } from "../../app-pipes/capitalize.pipe";
import { UserService } from "../user.service";
import { get as getProp } from "lodash";

@Component({
  templateUrl: 'my-access.template.html',
  providers: [CapitalizePipe],
})
export class MyAccessPage implements OnInit {

  private navLinks = [
    { text: 'Personal Details', routerLink: ['/profile/details'] },
    { text: 'Reset Password',   routerLink: ['/profile/password'] },
    { text: 'Role Migrations',  routerLink: ['/profile/migrations'] },
    { text: 'My Roles', active: true },
  ];
  sort: any = {type:'org', sort:'asc'};
  sortOptions = [
    { value: 'org', label: 'Organization' },
  ];
  private access: any = null;
  private domainOptions: Array<OptionsType> = [];
  private selectedDomainIds: any = [];
  private roleOptions: Array<OptionsType> = [];
  private selectedRoleIds: any = [];
  // pagination
  private totalPages: number = 0;
  private currentPage: number = 1;

  private userName = '';
  private fullName = '';
  private requests = [];
  private canRequest: boolean = false;
  private canGrant: boolean = false;
  private result: 'success'|'error'|'pending' = 'pending';
  private errorMessage: string = '';
  private isMyAccess: boolean = false;
  private numberOfSearches: number = 0;

  @ViewChild('picker') agencyPicker: AgencyPickerComponent;

  constructor(
    private userService: UserAccessService,
    private capitalize: CapitalizePipe,
    private userCookieService: UserService,
    private route: ActivatedRoute,
  )
  {

  }

  ngOnInit( ) {
    this.isMyAccess = !!this.route.snapshot.data['isMyAccess'];
    let cookieUser = this.userCookieService.getUser() && this.userCookieService.getUser().uid;
    this.userName = this.route.snapshot.params['id'] || cookieUser;
    this.onSearchParamChange();
  }

  getPendingRequests() {
    this.userService.getOpenRequests(this.userName).subscribe(reqs => {
      this.requests = reqs.userAccessRequestList;
    });
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

    this.userService.getAllUserRoles(this.userName, queryParams).subscribe(
      res => {
        try {
          this.getPaginationVariables(res);
          this.getAccessPriveleges(res);

          this.access = res.access;

          this.setRoleOptions(res.roles);
          this.setDomainOptions(res.domains);
          this.result = 'success';

          if (!this.isMyAccess) {
            this.getUserDisplayName(res);
          }

          if (this.numberOfSearches === 0) {
            this.getPendingRequests();
          }

          this.numberOfSearches++;
        } catch(error) {
          console.error('Invalid syntax for role data');
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
    if (res._links && res._links.grant_access && !this.isMyAccess) {
      this.canGrant = true;
    }
  }

  getPaginationVariables(res) {
    if (res.total === 0) {
      this.totalPages = 0;
    } else {
      this.totalPages = Math.floor((res.total-1) / res.limit)+1;
    }

    if (Number.isInteger(res.offset)) {
      this.currentPage = Math.floor(res.offset / res.limit) + 1;
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
  }

  setRoleOptions(roles) {
    this.roleOptions = roles.map(r => {
      return {
        label: this.capitalize.transform(r.val),
        value: r.id,
        name: r.val,
      }
    });
  }

  setDomainOptions(domains) {
    this.domainOptions = domains.map(d => {
      return {
        label: this.capitalize.transform(d.val),
        value: d.id,
        name: d.val,
      }
    });
  }

  onDomainChange() {
    this.onSearchParamChange();
  }

  onRoleChange() {
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
}
