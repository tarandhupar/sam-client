import * as Cookies from 'js-cookie';
import {Component, OnInit, Input, ViewChild} from "@angular/core";
import {Router, ActivatedRoute, NavigationExtras} from '@angular/router';
import {ProgramService} from 'api-kit';
import { IBreadcrumb } from "sam-ui-elements/src/ui-kit/types";
import {ReplaySubject} from "rxjs/ReplaySubject";
import {FHService} from "../../../../api-kit/fh/fh.service";
import {OrganizationConfigurationPipe} from "../../pipes/organization-configuration.pipe.ts";
import {Observable} from "rxjs/Observable";
import * as _ from 'lodash';


@Component({
  providers: [FHService],
  templateUrl: 'cfda-numbers.template.html'
})

export class CfdaNumbersPage implements OnInit {
  private currentPage:number = 0;
  alerts = [];
  cookieValue: string;
  processedCfdaNumbers: any;
  crumbs: Array<IBreadcrumb> = [
    { breadcrumb: 'Workspace', url: '/workspace' },
    { breadcrumb: 'CFDA Number Assignment'}
  ];
  cfdaNumbersApi: any;
  totalPages: any;
  orgLevels:any;
  organizations: any;
  organizationsPerPage: any;
  private showPerPage = 20;
  min: number;
  max: number;
  checkboxModel: any = [];
  checkboxConfig = {
    options: [
      {value: 'automatic', label: 'Automatic', name: 'checkbox-automatic'},
      {value: 'manual', label: 'Manual', name: 'checkbox-manual'}
    ],
    name: 'my-sr-name',
  };
  toggleAgencyPicker: boolean = true;
  orgRoot: any;
  defaultDept: any;

  private selectedOrganization;


  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private programService: ProgramService,
              private fhService: FHService) {
  }

  ngOnInit(){
    this.cookieValue = Cookies.get('iPlanetDirectoryPro');
    let orgLevelsAPI = this.getOrganizationLevels();
    this.loadCfdaNumbers(orgLevelsAPI);

  }
  getOrganizationLevels() {
    let orgLevelsSubject = new ReplaySubject(1);
    this.programService.getPermissions(this.cookieValue, 'ORG_LEVELS').subscribe(orgLevelsSubject);
    orgLevelsSubject.subscribe(res => {
    }, err => {
      console.log('Error organization levels: ', err);
    });
    return orgLevelsSubject;
  }


  private loadCfdaNumbers(orgLevelsAPI: Observable<any>){
    orgLevelsAPI.subscribe((res) => {
      this.orgLevels = res.ORG_LEVELS;
      if (res && res.ORG_LEVELS) {
        if (res.ORG_LEVELS.org === 'all') {
          this.orgRoot = [];
          this.onOrganizationChange(null);
        } else if (res.ORG_LEVELS.level !== 'none') {
          this.orgRoot = [res.ORG_LEVELS.org];
          let org = {
            orgKey: this.orgRoot
          };
          this.onOrganizationChange(org);
        } else {
          this.router.navigate(['/403']);
        }
        this.selectedOrganization = this.orgRoot;
      } else {
        this.router.navigate(['/403']);
      }
    }, error => {
      this.router.navigate(['/403']);
    });
  }

  pageChange(pagenumber) {
    this.currentPage = pagenumber - 1;
    this.organizationsPerPage = this.filterHierarchy(this.currentPage, this.organizations);
    this.getConfigurations(this.organizationsPerPage);
  }

  onEditClick(orgId){
    let url = '/fal/cfda-management/' + orgId + '/edit';
    this.router.navigateByUrl(url);
  }


  assignValues(obj) {
  return {
    id: obj['org']['orgKey'],
    name: obj['org']['name'] || obj['org']['agencyName'],
    type: obj['org']['categoryDesc'] || obj['org']['type']
  };
}

  getOrganization(orgId){
    if (orgId == null){
      this.fhService.getDepartments().subscribe(res => {
        this.organizations = _.map(res._embedded, this.assignValues);
        this.processPagesAndConfigurations();
      })
    }else {
      this.fhService.getOrganizationById(orgId, true, false, 'all', 300).subscribe(res => {
        this.organizations = _.map(res._embedded[0].org.hierarchy, this.assignValues);
        this.organizations.unshift(this.assignValues(res._embedded[0]));
        this.processPagesAndConfigurations();
      })
    }
  }

  processPagesAndConfigurations(){
    this.totalPages = Math.ceil(this.organizations.length / this.showPerPage);
    this.organizationsPerPage = this.filterHierarchy(this.currentPage, this.organizations);
    this.getConfigurations(this.organizationsPerPage);
  }

  filterHierarchy(page,array) {
    this.min = (page + 1) * this.showPerPage - this.showPerPage;
    this.max = (page + 1) * this.showPerPage;
    return array.slice(this.min,this.max);
  }

  onOrganizationChange(org) {
    this.currentPage = 0;
    if (org && org.orgKey) {
      this.getOrganization(org.orgKey);
    } else {
      if (this.orgRoot.length != 0){
        this.selectedOrganization = this.orgRoot;
        this.getOrganization(this.selectedOrganization);
      }else{
        this.getOrganization(org);
      }
    }
  }

  getConfigurations(organizationsPerPage){
    this.programService.getFederalHierarchyConfigurations(_.map(organizationsPerPage,'id').join()).subscribe(res => {
      this.cfdaNumbersApi = res;
      let organizationConfigurationPipe = new OrganizationConfigurationPipe();
      let list;
      (this.cfdaNumbersApi != null && this.cfdaNumbersApi._embedded != null && this.cfdaNumbersApi._embedded.federalHierarchyConfigurationList != null) ? list = this.cfdaNumbersApi._embedded.federalHierarchyConfigurationList : list = [];
      this.processedCfdaNumbers = organizationConfigurationPipe.transform(organizationsPerPage, list);
    }, error => {
      let errorRes = error.json();
      if (error && error.status === 401) {
        this.alerts.push({
          type: 'error',
          title: 'Unauthorized',
          description: 'Insufficient privileges to get user permission.'
        });
      } else if (error && (error.status === 502 || error.status === 504)) {
        this.alerts.push({
          type: 'error',
          title: errorRes.error,
          description: errorRes.message
        });
      }
    });
  }
}
