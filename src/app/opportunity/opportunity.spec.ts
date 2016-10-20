import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By }              from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, HashLocationStrategy } from '@angular/common';

import { OpportunityPageComponent } from './opportunity.page';
import { SearchService } from 'api-kit';
import { Observable } from 'rxjs';

let comp:    OpportunityPageComponent;
let fixture: ComponentFixture<OpportunityPageComponent>;

let MockSearchService = {
  runSearch: (obj) => {
    return Observable.of({
      _embedded: {
        results: [
        {
          _links: {
            self: {
              href: "/notice/2c1820ae561f521a499e995f2696052c/view"
            }
          },
          procurementTitle: "D--FY16 Software Maintenance Renewal â€“ NetEx TAC-16-23777",
          officeName: "VA Technology Acquisition Center",
          procurementPostedDate: "2015-10-16T04:58:16.000-04:00",
          _rScore: 0,
          procurementDescription: "No Description Provided",
          _type: "FBO",
          agencyId: "ce16ded7f375e40d26c629ff49bdf38e",
          parentAgencyName: "Department of Veterans Affairs",
          archive: true,
          procurementTypeValue: "Justification and Approval (J&A)",
          agencyName: "VA Technology Acquisition Center",
          solicitationNumber: "VA11815Q0598",
          parentAgencyId: "6e8d2e2e8eef856f8905b0b163163f08",
          officeId: "feb42329b007219da2e809e2ff56873e",
          _id: "2c1820ae561f521a499e995f2696052c",
          procurementType: "j"
        }]
      },
      _links: {
        self: {
          href: "/sgs/v1/search?index=fbo&page=0&size=10"
        }
      },
      page: {
        size: 1,
        totalElements: 1,
        totalPages: 1,
        number: 0,
        maxAllowedRecords: 30000
      }
    });
  }
};

describe('OpportunityPageComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ OpportunityPageComponent ], // declare the test component
      imports: [
        HttpModule,
        RouterTestingModule
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

    TestBed.overrideComponent(OpportunityPageComponent, {
      set: {
        providers: [
          { provide: SearchService, useValue: MockSearchService }
        ]
      }
    });

    fixture = TestBed.createComponent(OpportunityPageComponent);
    comp = fixture.componentInstance; // BannerComponent test instance
    fixture.detectChanges();
  });

  it('Should init & load data', () => {
    expect(comp.oNotice).toBeDefined();
    expect(comp.oSub).toBeDefined();
    expect(comp.oNotice.procurementTitle).toBe("D--FY16 Software Maintenance Renewal â€“ NetEx TAC-16-23777");
    expect(fixture.debugElement.query(By.css('h1')).nativeElement.innerHTML).toContain('D--FY16 Software Maintenance Renewal â€“ NetEx TAC-16-23777');
  });
});
