import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { UserAccessService } from "../../api-kit/access/access.service";
import { AlertFooterService } from "../alerts/alert-footer/alert-footer.service";

@Component({
  templateUrl: 'role-details.page.html'
})
export class RoleDetailsPage {
  mode: 'edit'|'new' = 'new';
  perms = [0, 2];

  roles = [{ vals: [], name: 'Assistance Listing'}, {vals: [], name: 'IDV'}, {vals: [], name: 'Regional Offices'}];
  role;
  domains: any[] = [];
  domainOptions: {label: string}[] = [];
  selectedDomain;
  domainRoleOptions = [{label: 'Agency User', value: 0}, {label: 'Agency Admin', value: 1}, {label: 'Agency Admin Lite', value: 2}];

  constructor(
    private router: Router
    , private accessService: UserAccessService
    , private footerAlert: AlertFooterService
  ) { }

  ngOnInit() {
    this.determineMode();
    this.getAllDomains();
  }

  determineMode() {
    if(/edit\/?^/.test(this.router.url)) {
      this.mode = 'edit';
    }
  }

  getAllDomains() {
    this.accessService.getDomains().subscribe(res => {
      this.domains = res._embedded.domainList;
      this.domainOptions = this.domains.map(d => {
        return {
          label: d.domainName,
          value: d.id,
        };
      })
    },
    err => {
      this.showGenericServicesError();
    });
  }

  showGenericServicesError() {
    this.footerAlert.registerFooterAlert({
      title: 'Something went wrong with a required service',
      type: 'error'
    })
  }

  onRoleBlur() {
    if (this.domainRoleOptions.find(d => d.label === this.role)) {
      this.footerAlert.registerFooterAlert({
        title: 'Role exists',
        type: 'error'
      });
      return;
    }
    this.domainRoleOptions.push({
      label: this.role,
      value: null,
    });
  }
}
