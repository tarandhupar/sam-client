import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { OpportunityService, FHService } from 'api-kit';
import { ReplaySubject, Observable } from 'rxjs';
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
export class OpportunityPage implements OnInit {
  /**
   * Steps to add a new field:
   * 1. Add the field to OpportunityFields enum (opportunity.fields.ts)
   * 2. Add an element for the field in html template (opportunity.page.html)
   *  2a. (optional) Give the element an ID by calling generateID(...)
   *  2b. Add an *ngIf condition to the element that checks shouldBeShown(...), as well as any null checks required
   * 3. In setDisplayFields(...), set this.displayField[newField] = false for any conditions where it should be hidden
   * 4. Update unit tests (opportunity.spec.ts) as appropriate
   *
   * Steps to add a new opportunity type:
   * 1. Add the type to type labels pipe (opportunity-type-label.pipe.ts)
   * 2. In setDisplayFields(...), set this.displayField[someField] = false for any fields this type does not show
   * 3. Update unit tests (opportunity.spec.ts) as appropriate
   */
  public opportunityFields = OpportunityFields; // expose the OpportunityFields enum for use in html template
  public displayField = {}; // object containing boolean flags for whether fields should be displayed

  originalOpportunity: any;
  opportunityLocation: any;
  opportunity: any;
  organization: any;
  currentUrl: string;
  dictionary: any;
  attachment: any;

  constructor(
    private route:ActivatedRoute,
    private opportunityService:OpportunityService,
    private fhService:FHService,
    private location: Location) {}

  ngOnInit() {
    this.currentUrl = this.location.path();
    this.loadDictionary();
    let opportunityAPI = this.loadOpportunity();
    let parentOpportunityAPI = this.loadParentOpportunity(opportunityAPI);
    this.loadOrganization(opportunityAPI);
    this.loadOpportunityLocation(opportunityAPI);
    this.loadAttachments(opportunityAPI);

    // Construct a new observable that emits both opportunity and its parent as a tuple
    // Combined observable will not trigger until both APIs have emitted at least one value
    let combinedOpportunityAPI = opportunityAPI.zip(parentOpportunityAPI);
    this.setDisplayFields(combinedOpportunityAPI);
  }

  private loadOpportunity() {
    let opportunitySubject = new ReplaySubject(1); // broadcasts the opportunity to multiple subscribers

    this.route.params.subscribe((params: Params) => { // construct a stream of opportunity data
      this.opportunityService.getOpportunityById(params['id']).subscribe(opportunitySubject); // attach subject to stream
    });

    opportunitySubject.subscribe(api => { // do something with the opportunity api
      this.opportunity = api;
      console.log("This opportunity: ", this.opportunity);
    }, err => {
      console.log('Error loading opportunity: ', err);
    });

    return opportunitySubject;
  }

  private loadParentOpportunity(opportunityAPI: Observable<any>){
    let parentOpportunitySubject = new ReplaySubject(1); // broadcasts the parent opportunity to multiple subscribers

    opportunityAPI.subscribe(api => {
      if (api.parent != null) { // if this opportunity has a parent
        // then call the opportunity api again for parent and attach the subject to the result
        this.opportunityService.getOpportunityById(api.parent.opportunityId).subscribe(parentOpportunitySubject);
      } else {
        return Observable.of(null).subscribe(parentOpportunitySubject); // if there is no parent, just return a single null
      }
    });

    parentOpportunitySubject.subscribe(parent => { // do something with the parent opportunity api
      this.originalOpportunity = parent;
    }, err => {
      console.log('Error loading parent opportunity: ', err);
    });

    return parentOpportunitySubject;
  }

  private loadOrganization(opportunityAPI: Observable<any>) {
    let organizationSubject = new ReplaySubject(1); // broadcasts the organization to multiple subscribers

    opportunityAPI.subscribe(api => {
      //organizationId length >= 30 -> call opportunity org End Point
      if(api.data.organizationId.length >= 30) {
        this.opportunityService.getOpportunityOrganizationById(api.data.organizationId).subscribe(organizationSubject);
      }
      //organizationId less than 30 character then call Octo's FH End point
      else {
        this.fhService.getOrganizationById(api.data.organizationId).subscribe(organizationSubject);
      }
    });

    organizationSubject.subscribe(organization => { // do something with the organization api
      this.organization = organization['_embedded'][0]['org'];
    }, err => {
      console.log('Error loading organization: ', err)
    });

    return organizationSubject;
  }

  private loadOpportunityLocation(opportunityApiStream: Observable<any>) {
    opportunityApiStream.subscribe(opAPI => {
      if(opAPI.data.organizationLocationId != '' && typeof opAPI.data.organizationLocationId !== 'undefined') {
        this.opportunityService.getOpportunityLocationById(opAPI.data.organizationLocationId).subscribe(data => {
          this.opportunityLocation = data;
        });
      }
    });
  }

  private loadAttachments(opportunityAPI: Observable<any>){
    let attachmentSubject = new ReplaySubject(1); // broadcasts the organization to multiple subscribers
      opportunityAPI.subscribe(api => {
        this.opportunityService.getAttachmentById(api.opportunityId).subscribe(attachmentSubject);

    });

    attachmentSubject.subscribe(attachment => { // do something with the organization api
      this.attachment = attachment;
      console.log("Attachment: ", this.attachment);
    }, err => {
      console.log('Error loading organization: ', err)
    });

    return attachmentSubject;
  }

  private loadDictionary() {
    this.opportunityService.getOpportunityDictionary('classification_code,naics_code,set_aside_type,fo_justification_authority').subscribe(data => {
      // do something with the dictionary api
      this.dictionary = data;
    }, err => {
      console.log('Error loading dictionaries: ', err);
    });
  }

  // Sets the correct displayField flags for this opportunity type
  private setDisplayFields(combinedOpportunityAPI: Observable<any>) {
    combinedOpportunityAPI.subscribe(([opportunity, parent]) => {
      if(opportunity.data == null || opportunity.data.type == null) {
        console.log('Error: No opportunity type');
        return;
      }

      this.displayField = {}; // for safety, clear any existing values

      switch (opportunity.data.type) {
        // Base opportunity types
        // These types are a superset of 'j', using case fallthrough
        case 'p': // Presolicitation
        case 'r': // Sources Sought
        case 's': // Special Notice
        case 'g': // Sale of Surplus Property
        case 'f': // Foreign Government Standard
          this.displayField[OpportunityFields.Award] = false;
          this.displayField[OpportunityFields.StatutoryAuthority] = false;
          this.displayField[OpportunityFields.ModificationNumber] = false;
        // Other types
        case 'j': // Justification and Approval (J&A)
          this.displayField[OpportunityFields.AwardAmount] = false;
          this.displayField[OpportunityFields.LineItemNumber] = false;
          this.displayField[OpportunityFields.AwardedName] = false;
          this.displayField[OpportunityFields.AwardedDUNS] = false;
          this.displayField[OpportunityFields.AwardedAddress] = false;
          this.displayField[OpportunityFields.Contractor] = false;

          this.displayField[OpportunityFields.JustificationAuthority] = false;
          this.displayField[OpportunityFields.OrderNumber] = false;
          break;

        // Type 'i' is a superset of 'l', using case fallthrough
        case 'i': // Intent to Bundle Requirements (DoD-Funded)
          this.displayField[OpportunityFields.AwardDate] = false;
          this.displayField[OpportunityFields.JustificationAuthority] = false;
          this.displayField[OpportunityFields.ModificationNumber] = false;
        case 'l': // Fair Opportunity / Limited Sources Justification
          this.displayField[OpportunityFields.AwardAmount] = false;
          this.displayField[OpportunityFields.LineItemNumber] = false;
          this.displayField[OpportunityFields.AwardedName] = false;
          this.displayField[OpportunityFields.AwardedDUNS] = false;
          this.displayField[OpportunityFields.AwardedAddress] = false;
          this.displayField[OpportunityFields.Contractor] = false;
          this.displayField[OpportunityFields.StatutoryAuthority] = false;
        case 'a': // Award Notice
        case 'm': // Modification/Amendment/Cancel
        case 'k': // Combined Synopsis/Solicitation
          break;

        default:
          console.log('Error: Unknown opportunity type ' + opportunity.data.type);
          break;
      }

      /**
       * TODO: Check conditional logic with PO
       * TODO: Check if original archive date condition is needed (not mentioned in excel spreadsheet)
       * TODO: Find ways to refactor or simplify this logic
       */
      if(parent != null) {
        let originalPostedDateCondition = opportunity.postedDate != null
          && parent.postedDate != null
          && opportunity.postedDate !== parent.postedDate;

        this.displayField[OpportunityFields.OriginalPostedDate] = originalPostedDateCondition;

        let originalResponseDateCondition = opportunity.data != null
          && opportunity.solicitation != null && opportunity.solicitation.deadlines != null
          && opportunity.solicitation.deadlines.response != null && parent.data != null
          && parent.data.solicitation != null && parent.data.solicitation.deadlines != null
          && parent.data.solicitation.deadlines.response != null
          && opportunity.data.solicitation.deadlines.response !== parent.data.solicitation.deadlines.response;

        this.displayField[OpportunityFields.OriginalResponseDate] = originalResponseDateCondition;

        let originalArchiveDateCondition = opportunity.data != null && opportunity.data.archive != null
          && opportunity.data.archive.date != null && parent.data != null && parent.data.archive != null
          && parent.data.archive.date != null
          && opportunity.data.archive.date !== parent.data.archive.date;

        this.displayField[OpportunityFields.OriginalArchiveDate] = originalArchiveDateCondition;

        let originalSetAsideCondition = opportunity.data != null && opportunity.data.solicitation != null
          && opportunity.data.solicitation.setAside != null && parent.data != null
          && parent.data.solicitation != null && parent.data.solicitation.setAside != null
          && opportunity.data.solicitation.setAside !== parent.data.solicitation.setAside;

        this.displayField[OpportunityFields.OriginalSetAside] = originalSetAsideCondition;
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

  private isSecure(field: string){
    if(field === "Public"){
      return "No";
    } else {
      return "Yes"
    }
  }

  public getDownloadFileURL(fileID: string){
    return API_UMBRELLA_URL + '/cfda/v1/file/' + fileID + "?api_key=" + API_UMBRELLA_KEY;
  }
}
