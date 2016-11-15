import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  sub: Subscription;
  currentUrl: string;
  organizations:any;

  constructor(
    private route:ActivatedRoute,
    private location: Location,
    private fhService:FHService) {}

  ngOnInit() {
    this.currentUrl = this.location.path();
    this.loadOrganizations();

  }

  private loadOrganizations() {
    let apiSubject = new ReplaySubject(1); // broadcasts the api data to multiple subscribers
    let apiStream = this.route.params.switchMap(params => { // construct a stream of api data
      return this.fhService.getOrganizationsById(params['id']);
    });
    apiStream.subscribe(apiSubject);

    apiSubject.subscribe(api => { // run whenever api data is updated
      let jsonData:any = api;
      this.organizations= jsonData._embedded[0].org;
    }, err => {
      console.log('Error logging', err);
    });

    return apiSubject;
  }

  private isModActive(){
    if (this.organizations.modStatus == null || this.organizations.modStatus == "inactive"){
      return "inactive";
    } else {
      return "active";
    }
  }


  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
