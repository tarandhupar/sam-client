import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { OpportunityService, FHService } from 'api-kit';
import { ReplaySubject, Observable, Subscription } from 'rxjs';
import { FilterMultiArrayObjectPipe } from '../app-pipes/filter-multi-array-object.pipe';
import { OpportunityFields } from "./opportunity.fields";

@Component({
  moduleId: __filename,
  templateUrl: 'opportunity.page.html',
  styleUrls: ['opportunity.style.css'],
  providers: [
    OpportunityService,
    FilterMultiArrayObjectPipe
  ]
})
export class OpportunityPage implements OnInit, OnDestroy {
  public opportunityFields = OpportunityFields;
  public displayField = {};

  originalOpportunity: any;
  // opportunityLocation: any;
  opportunity: any;
  organization: any;
  currentUrl: string;
  dictionary: any;

  private organizationSubscription: Subscription;
  private opportunitySubscription: Subscription;
  private parentOpportunitySubscription: Subscription;

  constructor(
    private route:ActivatedRoute,
    private opportunityService:OpportunityService,
    private fhService:FHService,
    private location: Location) {}

  ngOnInit() {
    this.currentUrl = this.location.path();

    let opportunityApiStream = this.loadOpportunity();
    this.loadOrganization(opportunityApiStream);
    // this.loadOpportunityLocation(opportunityApiStream);
    this.loadDictionary();
    this.setDisplayFields(opportunityApiStream);
  }

  private loadOpportunity() {
    var apiSubject = new ReplaySubject(2); // broadcasts the api data to multiple subscribers

    this.route.params.subscribe((params: Params) => { // construct a stream of api data
      this.opportunityService.getOpportunityById(params['id']).subscribe(apiSubject);
    });

    this.opportunitySubscription = apiSubject.subscribe(api => {
      // run whenever api data is updated
      this.opportunity = api;
      if(this.opportunity.parentOpportunity != null) {
        this.opportunityService.getOpportunityById(this.opportunity.parentOpportunity.opportunityId).subscribe(apiSubject);
        this.parentOpportunitySubscription = apiSubject.subscribe(parent => {
          this.originalOpportunity = parent;
        });
      }
    }, err => {
      console.log('Error logging', err);
    });
    return apiSubject;
  }

  // private loadParentOrganization(opportunityApiStream: Observable<any>){
  //   let apiSubject = new ReplaySubject(1);
  // }

  private loadOrganization(opportunityApiStream: Observable<any>) {
    let apiSubject = new ReplaySubject(1);

    opportunityApiStream.subscribe(api => {
      //organizationId length >= 30 -> call opportunity org End Point
      if(api.data.organizationId.length >= 30) {
        this.opportunityService.getOpportunityOrganizationById(api.data.organizationId).subscribe(apiSubject);
      }
      //organizationId less than 30 character then call Octo's FH End point
      else {
        this.fhService.getOrganizationById(api.data.organizationId).subscribe(apiSubject);
      }
    });

    this.organizationSubscription = apiSubject.subscribe(organization => {
      this.organization = organization['_embedded'][0]['org'];
    });

    return apiSubject;
  }

  // private loadOpportunityLocation(opportunityApiStream: Observable<any>) {
  //   opportunityApiStream.subscribe(opAPI => {
  //     if(opAPI.data.organizationLocationId != '' && typeof opAPI.data.organizationLocationId !== 'undefined') {
  //       this.opportunityService.getOpportunityLocationById(opAPI.data.organizationLocationId).subscribe(data => {
  //         this.opportunityLocation = data;
  //       });
  //     }
  //   });
  // }

  private loadDictionary() {
    this.opportunityService.getOpportunityDictionary('classification_code,naics_code,set_aside_type').subscribe(data => {
      this.dictionary = data;
    });
  }

  // Sets the correct displayField flags for this opportunity type
  private setDisplayFields(opportunityApiStream: Observable<any>) {
    opportunityApiStream.subscribe(api => {
      if(api.data == null || api.data.type == null) {
        console.log('Error: No opportunity type');
        return;
      }
      // if (api.postedDate.equals(api.modifiedDate)){
      //   this.displayIds[OpportunityFields.OriginalPostedDate] = false;
      // }
      // if (api.postedDate.equals(api.modifiedDate)){
      //   this.displayIds[OpportunityFields.OriginalPostedDate] = false;
      // }

      switch (api.data.type) {
        // Base opportunity types
        case 'p':
        case 'r':
        case 's':
        case 'g':
        case 'f':
          this.displayField[OpportunityFields.Award] = false;
          this.displayField[OpportunityFields.StatutoryAuthority] = false;
          this.displayField[OpportunityFields.JustificationAuthority] = false;
          this.displayField[OpportunityFields.OrderNumber] = false;
          this.displayField[OpportunityFields.ModificationNumber] = false;
          break;

        // Other types
        case 'a':
        case 'm':
        case 'k':
        case 'j':
        case 'i':
        case 'l':
          break;

        default:
          console.log('Error: Unknown opportunity type ' + api.data.type);
          break;
      }
    });
  }

  // Input should be one of the fields defined in OpportunityFields enum
  // To hide a field, set the flag displayField[field] to false
  // A field is always displayed by default, unless it is explicitly set not to
  private shouldBeDisplayed(field: OpportunityFields) {
    return this.displayField[field] !== false;
  }

  // Given a field name, generates an id for it by adding the correct prefixes
  private generateID(name: string, prefix?: string) {
    let id = name;
    if(prefix != null) { id = prefix + '-' + id; }
    return 'opportunity-' + id;
  }

  // If any part of a POC exists, then we consider the entire POC to exist
  // If a POC does not exist, its section header is hidden
  private hasPOC(index: number): boolean {
    if(this.opportunity && this.opportunity.data && this.opportunity.data.pointOfContact[index]) {
      return (this.opportunity.data.pointOfContact[index].email != null
        || this.opportunity.data.pointOfContact[index].phone != null
        || this.opportunity.data.pointOfContact[index].fullName != null
        || this.opportunity.data.pointOfContact[index].title != null
        || this.opportunity.data.pointOfContact[index].fax != null);
    }
    return false;
  }

  ngOnDestroy() {
    if(this.organizationSubscription) this.organizationSubscription.unsubscribe();
    if(this.opportunitySubscription) this.opportunitySubscription.unsubscribe();
  }
}
