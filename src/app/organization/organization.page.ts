import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router, NavigationEnd,Params } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { FHService } from 'api-kit';
import { ReplaySubject, Observable } from 'rxjs';
import { CapitalizePipe } from "../app-pipes/capitalize.pipe";
import * as _ from 'lodash';

@Component({
  moduleId: __filename,
  templateUrl: 'organization.page.html'
})
export class OrganizationPage implements OnInit, OnDestroy {
  subscription: Subscription;
  currentUrl: string;
  organization: any;
  hierarchy: any = [];
  organizationPerPage: any;
  min: number;
  max: number;
  totalOrganizationNumber: number;
  errorOrganization: any;
  errorLogo: any;
  private pageNum = 1;
  private totalPages: any = 0;
  private showPerPage = 10;
  public logoUrl: string;
  public logoInfo: any;
  errorOrgId: string;
  qParams: any = {};
  private hierarchySubscription;

  constructor(
    private activatedRoute:ActivatedRoute,
    private router: Router,
    private location: Location,
    private fhService:FHService) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(data => {
      this.qParams['keyword'] = typeof data['keyword'] === "string" ? decodeURI(data['keyword']) : "";
      this.qParams['index'] = typeof data['index'] === "string" ? decodeURI(data['index']) : "";
      this.pageNum = typeof data['page'] === "string" ? parseInt(data['page']) : this.pageNum;
    });
    this.currentUrl = this.location.path();
    this.loadOrganization();
  }

  private loadOrganization() {
    let orgSubject = new ReplaySubject(1); // broadcasts the api data to multiple subscribers
    Observable.combineLatest(this.activatedRoute.params, this.activatedRoute.queryParams, (params: Params, queryParams: Params) => ({ params, queryParams })).switchMap(allParams => {
      this.errorOrgId = allParams.params['id'];
      return this.fhService.getOrganizationById(allParams.params['id'], true, false, 'all', 10, this.pageNum);
    }).subscribe(orgSubject); // orgSubject contains a stream of organization api data

    this.subscription = orgSubject.subscribe(jsonData => { // whenever the api data is updated
      this.organization = jsonData['_embedded'][0]['org'];
      this.totalOrganizationNumber =jsonData['_embedded'][0]['count'];
      this.totalPages = Math.ceil(this.totalOrganizationNumber / this.showPerPage);
      this.organizationPerPage = this.sortHierarchyAlphabetically(this.organization.hierarchy);
      this.setUpMinMax(this.pageNum);
      this.hierarchy = [];
      this.loadHierarchy(Observable.of(jsonData));
    }, err => {
      console.log('Error logging', err);
      this.errorOrganization = true;
    });

    this.fhService.getOrganizationLogo(orgSubject,
      (logoData) => {
        if (logoData != null) {
          this.logoUrl = logoData.logo;
          this.logoInfo = logoData.info;
        } else {
          this.errorLogo = true;
        }
      }, (err) => {
        this.errorLogo = true;
    });

    return orgSubject;
  }

  private loadHierarchy(organizationAPI: Observable<any>) {
     organizationAPI.subscribe(org => {
      // Do some basic null checks
      if(org == null || org['_embedded'] == null || org['_embedded'][0] == null || org['_embedded'][0]['org'] == null) {
        return;
      }

      // Add the organization to the hierarchy list if it is not the current organization
      if(org['_embedded'][0]['org']['orgKey'] != null && org['_embedded'][0]['org']['orgKey'] !== this.organization.orgKey) {
        this.hierarchy.push(org['_embedded'][0]['org']);
      }

      if(org['_embedded'][0]['org']['parentOrgKey'] == null) {
        // Base case: If no parent exists, then stop
        return;
      } else {
        // Recursive case: If parent orgranization exists, try to load it recursively
        this.loadHierarchy(this.fhService.getOrganizationById(org['_embedded'][0]['org']['parentOrgKey'], false));
      }
    }, err => {
      console.log('Error: could not load organization hierarchy');
      return;
    });
  }

  sortHierarchyAlphabetically(hierarchy) {
    let array = [];
    for (let element of hierarchy){
      let item = {name: this.getAgencyName(element).toString(), orgId: element.org.orgKey};
      array.push(item);
    }
    return _.sortBy(array, ['name']);
  }

  setUpMinMax(page) {
    this.min = page * this.showPerPage - this.showPerPage;
    this.max = page * this.showPerPage;
  }

  pageChange(pageNumber) {
    this.pageNum = pageNumber;
    this.organizationPerPage = this.sortHierarchyAlphabetically(this.organization.hierarchy);
    this.setUpMinMax(this.pageNum);
    let navigationExtras: NavigationExtras = {
      queryParams: {keyword: this.qParams['keyword'],
                    index: this.qParams['index'],
                    page: this.pageNum},
      fragment: 'organization-sub-hierarchy'
    };
    document.getElementById('org-pagination').getElementsByTagName('li')[0].focus();
    this.router.navigate(['/organization',this.organization.orgKey],navigationExtras);
  }

  private isModActive() {
    return (this.organization.modStatus == null || _.lowerCase(this.organization.modStatus) == "active") ? true : false;
  }

  private getAgencyName(element) {
    if (element.org.agencyName) {
      return element.org.agencyName;
    } else if (element.org.name) {
      return (new CapitalizePipe().transform(element.org.name));
    } else {
      return element.org.orgKey;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
