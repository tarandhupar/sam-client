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
  domains: any[] = [];
  domainOptions: {label: string, value: any}[] = [];
  selectedDomain;

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
}
