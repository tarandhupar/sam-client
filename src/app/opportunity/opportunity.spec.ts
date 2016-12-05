import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By }              from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, HashLocationStrategy } from '@angular/common';

import { OpportunityPage } from './opportunity.page';
import { OpportunityService, FHService } from 'api-kit';
import { OpportunityFields } from "./opportunity.fields";

import { Observable } from 'rxjs';
import { PipesModule } from "../app-pipes/app-pipes.module";
import { OpportunityTypeLabelPipe } from "./pipes/opportunity-type-label.pipe";
import { TimezoneLabelPipe } from "./pipes/timezone-label.pipe";
import { FixHTMLPipe } from "./pipes/fix-html.pipe";

let comp: OpportunityPage;
let fixture: ComponentFixture<OpportunityPage>;

let MockOpportunityService = {
  getOpportunityById(id: string) {
    return Observable.of({
      "opportunityId": "213ji321hu3jk123",
      "parentOpportunity": {
        "opportunityId": "0000b08b003c3a28ae6f9dd254e4a9c8"
      },
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
  },
  getOpportunityOrganizationById(id: String) {
    return Observable.of({
      _embedded: [
        {
          org: {
            "l2Name": "Naval Supply Systems Command",
            "l1Name": "Department of the Navy",
            "name": "DLA Maritime PSNS",
            "type": "OFFICE",
            "l3Name": "DLA Maritime PSNS",
            "agencyName": "DLA Maritime PSNS"
          }
        }
      ]
    });
  },
  getOpportunityDictionary(ids: String) {
    return Observable.of({
      classification_code: [
        {
          dictionary_name: "classification_code",
          code: "10",
          parent_element_id: null,
          description: null,
          element_id: "1",
          sort_index: "1",
          value: "10 -- Weapons"
        }
      ]
    });
  },
  getOpportunityLocationById(id: String) {
    return Observable.of({
      "zip": "77720",
      "country": null,
      "city": "Beaumont",
      "street": "PO Box 26015 5430 Knauth Road",
      "state": "TX"
    });
  }
};

let MockFHService = {
  getOrganizationById(id: string) {
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
      declarations: [OpportunityPage, OpportunityTypeLabelPipe, TimezoneLabelPipe, FixHTMLPipe], // declare the test component
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
    comp = fixture.componentInstance; // Opportunity Component test instance
    fixture.detectChanges();
  });

  // Generic function to construct mock api with specified opportunity type
  var mockAPIDataType = type => {
    return Observable.of([{
      "data": {"type": type}
    }, null]);
  };

  it('Should init & load data', () => {
    expect(comp.opportunity).toBeDefined();
    expect(comp.opportunityLocation).toBeDefined();
    expect(comp.organization).toBeDefined();
    expect(comp.opportunity.opportunityId).toBe('213ji321hu3jk123');
    expect(fixture.debugElement.query(By.css('h1')).nativeElement.innerHTML).toContain('Title Goes here');
  });

  it('Should generate ids', () => {
    let generateIDSpy = spyOn(comp, 'generateID').and.callThrough();
    expect(generateIDSpy('testID')).toBe('opportunity-testID'); // generate an id
    expect(generateIDSpy('testID', 'test-prefix')).toBe('opportunity-test-prefix-testID'); // generate an id with a prefix
  });

  it('Should set display flag for fields for base types', () => {
    let setDisplaySpy = spyOn(comp, 'setDisplayFields').and.callThrough().bind(comp);

    // These base types should all display the same fields
    let baseTypes = ['p', 'r', 'g', 's', 'f'];

    // For each base type, check setDisplayFields() against expected output
    let baseExpected = {};
    baseExpected[OpportunityFields.Award] = false;
    baseExpected[OpportunityFields.StatutoryAuthority] = false;
    baseExpected[OpportunityFields.JustificationAuthority] = false;
    baseExpected[OpportunityFields.OrderNumber] = false;
    baseExpected[OpportunityFields.ModificationNumber] = false;

    for (let type of baseTypes) {
      setDisplaySpy(mockAPIDataType(type));
      for (let field in baseExpected) {
        expect(comp.displayField[field]).toBe(baseExpected[field]);
      }
    }
  });

  it('Should set display flag for fields for J&A type', () => {
    let setDisplaySpy = spyOn(comp, 'setDisplayFields').and.callThrough().bind(comp);

    // Check J&A
    let jaExpected = {};
    jaExpected[OpportunityFields.AwardAmount] = false;
    jaExpected[OpportunityFields.LineItemNumber] = false;
    jaExpected[OpportunityFields.AwardedName] = false;
    jaExpected[OpportunityFields.AwardedDUNS] = false;
    jaExpected[OpportunityFields.AwardedAddress] = false;
    jaExpected[OpportunityFields.Contractor] = false;

    jaExpected[OpportunityFields.JustificationAuthority] = false;
    jaExpected[OpportunityFields.OrderNumber] = false;

    setDisplaySpy(mockAPIDataType('j'));
    for(let field in jaExpected) {
      expect(comp.displayField[field]).toBe(jaExpected[field]);
    }
  });

  it('Should set display flag for fields for intent to bundle type', () => {
    let setDisplaySpy = spyOn(comp, 'setDisplayFields').and.callThrough().bind(comp);

    // Check intent to bundle
    let itbExpected = {};
    itbExpected[OpportunityFields.AwardAmount] = false;
    itbExpected[OpportunityFields.AwardDate] = false;
    itbExpected[OpportunityFields.LineItemNumber] = false;
    itbExpected[OpportunityFields.AwardedName] = false;
    itbExpected[OpportunityFields.AwardedDUNS] = false;
    itbExpected[OpportunityFields.AwardedAddress] = false;
    itbExpected[OpportunityFields.Contractor] = false;

    itbExpected[OpportunityFields.StatutoryAuthority] = false;
    itbExpected[OpportunityFields.JustificationAuthority] = false;
    itbExpected[OpportunityFields.ModificationNumber] = false;

    setDisplaySpy(mockAPIDataType('i'));
    for (let field in itbExpected) {
      expect(comp.displayField[field]).toBe(itbExpected[field]);
    }
  });

  it('Should set display flag for fields for Fair Opportunity / Limited Sources Justification type', () => {
    let setDisplaySpy = spyOn(comp, 'setDisplayFields').and.callThrough().bind(comp);

    // Check fair opportunity / limited sources
    let fairOppExpected = {};
    fairOppExpected[OpportunityFields.AwardAmount] = false;
    fairOppExpected[OpportunityFields.LineItemNumber] = false;
    fairOppExpected[OpportunityFields.AwardedName] = false;
    fairOppExpected[OpportunityFields.AwardedDUNS] = false;
    fairOppExpected[OpportunityFields.AwardedAddress] = false;
    fairOppExpected[OpportunityFields.Contractor] = false;
    fairOppExpected[OpportunityFields.StatutoryAuthority] = false;

    setDisplaySpy(mockAPIDataType('l'));
    for(let field in fairOppExpected) {
      expect(comp.displayField[field]).toBe(fairOppExpected[field]);
    }
  });

  it('Should print error if invalid type', () => {
    let setDisplaySpy = spyOn(comp, 'setDisplayFields').and.callThrough().bind(comp);

    spyOn(console, 'log');

    setDisplaySpy(mockAPIDataType(null));
    expect(console.log).toHaveBeenCalledWith('Error: No opportunity type');

    setDisplaySpy(mockAPIDataType('non-existant type'));
    expect(console.log).toHaveBeenCalledWith('Error: Unknown opportunity type non-existant type');
  });

  it('Should check display flag for fields', () => {
    let shouldDisplaySpy = spyOn(comp, 'shouldBeDisplayed').and.callThrough().bind(comp);

    comp.displayField = { 'award': false, 'title': true };
    expect(shouldDisplaySpy('award')).toBe(false); // don't display if flag is set to false
    expect(shouldDisplaySpy('title')).toBe(true); // display if flag is set to true
  });

  it('Should display fields by default', () => {
    let shouldDisplaySpy = spyOn(comp, 'shouldBeDisplayed').and.callThrough().bind(comp);

    // Any field that is not explicitly and exactly set to false should be displayed
    comp.displayField = { 'award': null, 'title': undefined, 'header': 0, 'general': 'foo' };
    expect(shouldDisplaySpy('award')).toBe(true); // falsey but not false
    expect(shouldDisplaySpy('title')).toBe(true); // falsey
    expect(shouldDisplaySpy('header')).toBe(true); // falsey
    expect(shouldDisplaySpy('general')).toBe(true); // random string
    expect(shouldDisplaySpy('contact')).toBe(true); // not explicitly set
  });

  // TODO: Add unit tests for parentOpportunity conditionals
});
