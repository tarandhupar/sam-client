import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { FHService } from 'api-kit';
import { ReplaySubject } from 'rxjs';

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
  private pageNum = 0;
  private totalCount: any = 0;
  private totalPages: any = 0;
  private pageNumPaginationPadding = 2;
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
      //this.totalPages = (this.organization.hierarchy.length + this.showPerPage - 1)/this.showPerPage;
      this.totalPages = Math.ceil(this.organization.hierarchy.length / this.showPerPage);
      this.pageNum++;
      this.organizationPerPage = this.filterHierarchy(this.pageNum, this.organization.hierarchy);
      console.log("Organization: ", this.organization);
      console.log("OrganizationPerPage: ", this.organizationPerPage);
    }, err => {
      console.log('Error logging', err);
    });

    return apiSubject;
  }

  filterHierarchy(page,array){
    this.min = page * this.showPerPage - this.showPerPage;
    this.max = page * this.showPerPage;
    return array.slice(this.min,this.max);
  }

  pageChange(pagenumber){
    this.pageNum = pagenumber;
    this.organizationPerPage = this.filterHierarchy(this.pageNum, this.organization.hierarchy);
    let navigationExtras: NavigationExtras = {
      queryParams: {page: this.pageNum}
    };
    this.router.navigate(['/organization',this.organization.orgKey],navigationExtras);
  }

  private isModActive(){
    return (this.organization.modStatus == null || this.organization.modStatus == "inactive") ? false : true;
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
