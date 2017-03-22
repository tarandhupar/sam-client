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
  domains: any[] = [];
  domain;
  domainOptions: {label: string}[] = [];
  selectedDomain;
  domainRoleOptions: any = [{label: 'Agency User', value: 0}, {label: 'Agency Admin', value: 1}, {label: 'Agency Admin Lite', value: 2}];
  domainDefinitions: any = null;
  permissionOptions: any = [];

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
    this.titleService.setTitle(this.mode === 'edit' ? 'Edit Role' : 'New Role');
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

  onDomainChange() {
    console.log('change');
    this.domainRoleOptions = null;
    this.accessService.getDomainDefinition(this.domain).subscribe(
      defs => {
        console.log(defs);
        this.domainDefinitions = defs;
        this.domainRoleOptions = defs.roleDefinitionMapContent.map(r => {
          return {
            label: r.role.val,
            value: r.role.id,
          };
        });
        this.permissionOptions = defs.functionMapContent.map(f => {
          return {
            name: f.function.val,
            permissions: f.permission.map(perm => {
              return {
                label: perm.val,
                value: perm.id
              };
            })
          }
        });
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
