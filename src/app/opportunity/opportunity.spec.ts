import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By }              from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, HashLocationStrategy } from '@angular/common';

import { OpportunityPage } from './opportunity.page';
import { OpportunityService, FHService } from 'api-kit';
import { Observable } from 'rxjs';
import { PipesModule } from "../app-pipes/app-pipes.module";
import { OpportunityTypeLabelPipe } from "./pipes/opportunity-type-label.pipe";
import { TimezoneLabelPipe } from "./pipes/timezone-label.pipe";

let comp:    OpportunityPage;
let fixture: ComponentFixture<OpportunityPage>;

let MockOpportunityService = {
  getOpportunityById(id: string) {
    return Observable.of({
      "opportunityId": "213ji321hu3jk123",
      "data": {
        "type": "Type Goes here",
        "solicitationNumber": "Solicitation Number goes here",
        "title": "Title Goes here",
        "organizationId": "100010393",
        "organizationLocationId": "100010393",
        "relatedOpportunityId": "Related Opportunity Id goes here",
        "statuses": {
          "publishStatus": "Statuses publish status goes here",
          "isArchived": false,
          "isCanceled": false
        },
        "descriptions": [
          {
            "descriptionId": "Description Id goes here",
            "content": "Content goes here"
          }
        ],
        "link": {
          "href": "Link href goes here",
          "additionalInfo": {
            "content": "Link Additional Info content goes here"
          }
        },
        "classificationCode": "Classification Code goes here",
        "naicsCode": [
          "naics Code 1 goes here",
          "naics Code 2 goes here"
        ],
        "isRecoveryRelated": true,
        "isScheduleOpportunity": true,
        "pointOfContact": [
          {
            "type": "point of contact type goes here",
            "title": "point of contact title goes here",
            "fullName": "point of contact full name goes here",
            "email": "point of contact email goes here",
            "phone": "point of contact email goes here",
            "fax": "point of contact fax goes here",
            "additionalInfo": {
              "content": "poc additional info content goes here"
            }
          }
        ],
        "placeOfPerformance": {
          "streetAddress": "awardee Street Address goes here",
          "streetAddress2": "awardee Street Address2 goes here",
          "city": "awardee City goes here",
          "state": "awardee State goes here",
          "zip": "awardee Zip goes here",
          "country": "awardee Country goes here"
        },
        "archive": {
          "type": "Archive type goes here",
          "date": "2016-11-16 22:21:55"
        },
        "permissions": {
          "area": {}
        },
        "solicitation": {
          "setAside": "solicitation SetAside goes here",
          "deadlines": {
            "response": "2016-11-16 22:21:55"
          }
        },
        "award": {
          "date": "2016-11-16",
          "number": "award Number goes here",
          "deliveryOrderNumber": "award Delivery Orde rNumber goes here",
          "amount": "award Amount goes here",
          "lineItemNumber": "award Line Item Number goes here",
          "awardee": {
            "name": "Awardee name goes here",
            "duns": "DUNS goes here",
            "location": {
              "streetAddress": "awardee Street Address goes here",
              "streetAddress2": "awardee Street Address2 goes here",
              "city": "awardee City goes here",
              "state": "awardee State goes here",
              "zip": "awardee Zip goes here",
              "country": "awardee Country goes here"
            }
          },
          "justificationAuthority": {
            "modificationNumber": "Justification Authority Modification Number goes here",
            "authority": "Justification Authority goes here"
          },
          "fairOpportunity": {
            "authority": "Authority goes here"
          }
        }
      },
      "latest": true,
      "packages": {
        "content": [],
        "resources": []
      },
      "postedDate": "2016-11-16 17:21:55",
      "modifiedDate": "2016-11-16 17:21:55",
      "_links": {
        "self": {
          "href": "http://10.98.29.81:122/v1/opportunity/123dqw"
        }
      }
    })
  }
};

let MockFHService = {
  //TODO: remove this function and replace it with getOrganizationById once SAM-492 is merged to comp
  getFederalHierarchyV2ById(id: string){
    return Observable.of({
      "_embedded": [
        {
          "org": {}
        }
      ]
    });
  }
};

describe('OpportunityPage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ OpportunityPage, OpportunityTypeLabelPipe, TimezoneLabelPipe ], // declare the test component
      imports: [
        PipesModule,
        HttpModule,
        RouterTestingModule,
      ],
      providers: [
        BaseRequestOptions,
        MockBackend,
        {
          provide: Http,
          useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions],
        },
        { provide: Location, useClass: Location },
        { provide: ActivatedRoute, useValue: { 'params': Observable.from([{ 'id': '2c1820ae561f521a499e995f2696052c' }]) } },
        { provide: LocationStrategy, useClass: HashLocationStrategy },
      ]
    });

    TestBed.overrideComponent(OpportunityPage, {
      set: {
        providers: [
          { provide: OpportunityService, useValue: MockOpportunityService },
          { provide: FHService, useValue: MockFHService },
        ]
      }
    });

    fixture = TestBed.createComponent(OpportunityPage);
    comp = fixture.componentInstance; // BannerComponent test instance
    fixture.detectChanges();
  });

  it('Should init & load data', () => {
    expect(comp.opportunity).toBeDefined();
    expect(comp.opportunityLocation).toBeDefined();
    expect(comp.organization).toBeDefined();
    expect(comp.opportunity.opportunityId).toBe("213ji321hu3jk123");
    expect(fixture.debugElement.query(By.css('h1')).nativeElement.innerHTML).toContain('Title Goes here');
  });
});
