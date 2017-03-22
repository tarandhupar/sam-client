import { Component } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { UserAccessService } from "../../../api-kit/access/access.service";
import { AlertFooterService } from "../../alerts/alert-footer/alert-footer.service";
import * as _ from 'lodash';

@Component({
  templateUrl: 'role-details.page.html'
})
export class RoleDetailsPage {
  mode: 'edit'|'new' = 'new';
  perms = [0, 2];

  roles = [{ vals: [], name: 'Assistance Listing'}, {vals: [], name: 'IDV'}, {vals: [], name: 'Regional Offices'}];
  role;
  domains: any[] = [];
  domain;
  domainOptions: {label: string}[] = [];
  selectedDomain;
  domainRoleOptions: any = [{label: 'Agency User', value: 0}, {label: 'Agency Admin', value: 1}, {label: 'Agency Admin Lite', value: 2}];

  constructor(
    private router: Router
    , private accessService: UserAccessService
    , private footerAlert: AlertFooterService
    , private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.determineMode();
    this.getAllDomains();
    if (this.mode === 'edit') {
      this.getDomainAndDefaultRole();
    }
  }

  getDomainAndDefaultRole() {
    this.route.params.switchMap(params => {
      this.role = +params['roleId'];
      return this.route.queryParams;
    }).subscribe(qp => {
      this.domain = +qp['domain'];
    });
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
    let lastRole = _.last(this.domainRoleOptions);
    if (lastRole.isNew) {
      this.domainRoleOptions.pop();
    }
    this.domainRoleOptions.push({
      label: this.role,
      value: null,
      isNew: true,
    });
  }

  onSubmitClick() {
    this.footerAlert.registerFooterAlert({
      title: 'Role exists',
      type: 'success'
    });
    this.router.navigateByUrl('/access/roles');
    return;
  }
}
