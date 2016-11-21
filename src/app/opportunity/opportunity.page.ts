import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { OpportunityService, FHService } from 'api-kit';
import { ReplaySubject, Observable, Subscription } from 'rxjs';

@Component({
  moduleId: __filename,
  templateUrl: 'opportunity.page.html',
  styleUrls: ['opportunity.style.css'],
  providers: [
    OpportunityService
  ]
})
export class OpportunityPage implements OnInit, OnDestroy {
  opportunity: any;
  originalOpportunity: any;
  opportunityLocation: any;
  organization: any;
  currentUrl: string;

  private organizationSubscription: Subscription;
  private opportunitySubscription: Subscription;

  constructor(
    private route:ActivatedRoute,
    private opportunityService:OpportunityService,
    private fhService:FHService,
    private location: Location) {}

  ngOnInit() {
    this.currentUrl = this.location.path();

    let opportunityApiStream = this.loadOpportunity();
    this.loadOrganization(opportunityApiStream);
    this.loadOpportunityLocation(opportunityApiStream);
  }

  private loadOpportunity() {
    var apiSubject = new ReplaySubject(1); // broadcasts the api data to multiple subscribers

    this.route.params.subscribe((params: Params) => { // construct a stream of api data
      this.opportunityService.getOpportunityById(params['id']).subscribe(apiSubject);
    });

    this.opportunitySubscription = apiSubject.subscribe(api => {
      // run whenever api data is updated
      this.opportunity = api;

      this.opportunityService.getOpportunityById(api['parentProgramId']).subscribe(parent => {
        this.originalOpportunity = parent;
      });
    }, err => {
      console.log('Error logging', err);
    });

    return apiSubject;
  }

  private loadOrganization(opportunityApiStream: Observable<any>) {
    let apiSubject = new ReplaySubject(1);

    opportunityApiStream.subscribe(api => {
      this.fhService.getFederalHierarchyV2ById(api.data.organizationId).subscribe(apiSubject);
    });

    this.organizationSubscription = apiSubject.subscribe(organization => {
      this.organization = organization['_embedded'][0]['org'];
    });

    return apiSubject;
  }

  private loadOpportunityLocation(opportunityApiStream: Observable<any>) {
    opportunityApiStream.subscribe(opAPI => {
      if(opAPI.data.organizationLocationId != '') {
        //TODO create new endpoint to load location
        this.opportunityLocation = opAPI.data.organizationLocationId;
      }
    });
  }

  ngOnDestroy() {
    if(this.organizationSubscription) this.organizationSubscription.unsubscribe();
    if(this.opportunitySubscription) this.opportunitySubscription.unsubscribe();
  }
}
