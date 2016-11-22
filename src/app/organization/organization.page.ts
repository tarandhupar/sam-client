import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { FHService } from 'api-kit';
import { ReplaySubject } from 'rxjs';
import {CapitalizePipe} from "../app-pipes/capitalize.pipe";
import * as _ from 'lodash';

@Component({
  moduleId: __filename,
  templateUrl: 'organization.page.html',
  styleUrls: ['organization.style.css'],
  providers: [
    FHService
  ]
})
export class OrganizationPage implements OnInit, OnDestroy {
  subscription: Subscription;
  currentUrl: string;
  organization: any;
  organizationPerPage: any;
  min: number;
  max: number;
  private pageNum = 1;
  private totalPages: any = 0;
  private showPerPage = 20;

  constructor(
    private activatedRoute:ActivatedRoute,
    private router: Router,
    private location: Location,
    private fhService:FHService) {}

  ngOnInit() {
    this.currentUrl = this.location.path();
    this.loadOrganization();

  }

  private loadOrganization() {
    let apiSubject = new ReplaySubject(1); // broadcasts the api data to multiple subscribers
    let apiStream = this.activatedRoute.params.switchMap(params => { // construct a stream of api data
      return this.fhService.getOrganizationById(params['id']);
    });
    apiStream.subscribe(apiSubject);

    this.subscription = apiSubject.subscribe(api => { // run whenever api data is updated
      let jsonData:any = api;
      this.organization = jsonData._embedded[0].org;
      this.totalPages = Math.ceil(this.organization.hierarchy.length / this.showPerPage);
      this.organizationPerPage = this.filterHierarchy(this.pageNum, this.sortHierarchyAlphabetically(this.organization.hierarchy));
    }, err => {
      console.log('Error logging', err);
    });

    return apiSubject;
  }

  sortHierarchyAlphabetically(hierarchy){
    let array = [];
    for (let element of hierarchy){
      let item = {name: this.getAgencyName(element), url: "organization/" + element.org.orgKey};
      array.push(item);
    }
    _.sortBy(array, ['name']);
    return _.sortBy(array, ['name']);
  }

  filterHierarchy(page,array){
    this.min = page * this.showPerPage - this.showPerPage;
    this.max = page * this.showPerPage;
    return array.slice(this.min,this.max);
  }

  pageChange(pagenumber){
    this.pageNum = pagenumber;
    this.organizationPerPage = this.filterHierarchy(this.pageNum, this.sortHierarchyAlphabetically(this.organization.hierarchy));
    let navigationExtras: NavigationExtras = {
      queryParams: {page: this.pageNum}
    };
    this.router.navigate(['/organization',this.organization.orgKey],navigationExtras);
  }

  private isModActive(){
    return (this.organization.modStatus == null || this.organization.modStatus == "active") ? true : false;
  }

  private getAgencyName(element){
    if (element.org.agencyName){
      return element.org.agencyName;
    } else if (element.org.name){
      return (new CapitalizePipe().transform(element.org.name));
    } else {
      return element.org.orgKey;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
