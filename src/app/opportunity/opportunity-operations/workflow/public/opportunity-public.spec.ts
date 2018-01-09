import { Location, LocationStrategy, HashLocationStrategy } from '@angular/common';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {IBreadcrumb} from "sam-ui-elements/src/ui-kit/types";
import { BaseRequestOptions, Http, HttpModule } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { By }              from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import { ProgramService } from 'api-kit/program/program.service';

import { FHService, OpportunityService, EntityService, DictionaryService} from 'api-kit';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { Observable } from 'rxjs';
import { SamAPIKitModule } from 'api-kit/api-kit.module';

import { SamUIKitModule } from 'sam-ui-elements/src/ui-kit';
import { AppComponentsModule } from 'app/app-components/app-components.module';
import { OppComponentsModule } from 'app/opportunity/components';
import {FormsModule} from '@angular/forms';
import { SidenavService } from 'sam-ui-elements/src/ui-kit/components/sidenav/services';
import { SidenavHelper } from 'app/app-utils/sidenav-helper';
import { OpportunityTypeLabelPipe } from 'app/opportunity/pipes/opportunity-type-label.pipe';
import { TimezoneLabelPipe } from 'app/opportunity/pipes/timezone-label.pipe';
import { FixHTMLPipe } from 'app/opportunity/pipes/fix-html.pipe';
import { FilesizePipe } from 'app/opportunity/pipes/filesize.pipe';
import { PipesModule } from 'app/app-pipes/app-pipes.module';
import { OpportunityFields } from 'app/opportunity/opportunity.fields';
import { OpportunityPublicPage } from 'app/opportunity/opportunity-operations/workflow/public/opportunity-public.page';
import * as Cookies from 'js-cookie';
import { FeedbackFormService } from 'app/app-components/feedback-form/feedback-form.service';
import { Cookie } from 'ng2-cookies';

let comp: OpportunityPublicPage;
let fixture: ComponentFixture<OpportunityPublicPage>;
let MockActivatedRoute = {
  params: Observable.of({id:"213ji321hu3jk123"}),
  snapshot: {
    params: {
      id: jasmine.createSpy('id')
    },
    url: {
      path: jasmine.createSpy('path')
    },
    _routeConfig: {
      path: jasmine.createSpy('path')
    }
  },
  data: {
    subscribe: jasmine.createSpy('subscribe')
  },
  fragment: {
    subscribe: jasmine.createSpy('subscribe')
  }

};

let MockOpportunityService = {
  getContractOpportunityById(id: string, authToken: string = null) {
    return Observable.of({
      "id": "213ji321hu3jk123",
      "parent":{
        "opportunityId":"0000b08b003c3a28ae6f9dd254e4a9c8"
      },
      "description": [
        {
          "descriptionId": "Description Id goes here",
          "body": "Content goes here",
          "modifiedOn": "Date goes here",
          "opportunityId": "0000b08b003c3a28ae6f9dd254e4a9c8"
        }
      ],
      "data": {
        "type": "l",
        "solicitationNumber": "Solicitation Number goes here",
        "title": "Title Goes here",
        "organizationId": "100010393",
        "organizationLocationId": "100010393",
        "relatedOpportunityId": "Related Opportunity Id goes here",
        "link": {
          "href": "Link href goes here",
          "additionalInfo": {
            "content": "Link Additional Info content goes here"
          }
        },
        "classificationCode": "1",
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
        }
      },
      "latest": true,
      "status": {
        "code": "published",
        "value": "Published"
      },
      "archived": false,
      "cancelled": false,
      "postedDate": "2016-11-16 17:21:55",
      "modifiedDate": "2016-11-16 17:21:55",
      "_links": {
        "self": {
          "href": "http://10.98.29.81:122/v1/opportunity/123dqw"
        }
      }
    })
  },

  getContractOpportunityPackages(id: String) {
    return Observable.of({
      packages: [
        {
          packageId: "1ccd07afdd57069cedb998a7cf02a85d",
          name: "Solicitation 1",
          type: "Solicitation",
          postedDate: 1452124800000,
          access: "Public",
          attachments: [
            {
              attachmentId: "221e068991250e6e3dfd42920592e6a6",
              resourceId: "3a6434285f304b1c0210af324320a33c"
            },
            {
              attachmentId: "2bc535a8a9413df6378f2073a1dce418",
              resourceId: "5b8be0a5def80f9cd690d9c41b3a01c1"
            }
          ]
        },
        {
          packageId: "18fd4a18e69c946b517963756590a0af",
          name: "Solicitation 1",
          type: "Solicitation",
          postedDate: 1452124800000,
          access: "Public",
          attachments: [
            {
              attachmentId: "6ba9fd3a836e2cc9a6b9a6f6bda76c6f",
              resourceId: "6ba9fd3a836e2cc9a6b9a6f6bda76c6f"
            }
          ]
        }
      ],
      resources: [
        {
          resourceId: "6ba9fd3a836e2cc9a6b9a6f6bda76c6f",
          name: "",
          type: "link",
          uri: "http://www.wdol.gov/wdol/scafiles",
          description: "Wage Determination",
          mimeType: ""
        },
        {
          resourceId: "3a6434285f304b1c0210af324320a33c",
          name: "506-09b_Blank_vendor_questionnaire.docx",
          type: "file",
          uri: "506-09b_Blank_vendor_questionnaire.docx",
          description: "Vendor Questionnaire",
          mimeType: "application/vnd.openxmlformats-o"
        },
        {
          resourceId: "5b8be0a5def80f9cd690d9c41b3a01c1",
          name: "STLJC2016-001_REKEYING.docx",
          type: "file",
          uri: "STLJC2016-001_REKEYING.docx",
          description: "Scope of Work",
          mimeType: "application/vnd.openxmlformats-o"
        }
      ],
      _links: {
        self: {
          href: "http://10.98.29.81:122/v1/opportunity/attachments?noticeIds=9e14590f674ab3ffbf8da6b85ddc8581&noticeIds=a2c630c37084d373200cc1bc6121bdf6"
        }
      }});
  },
  getContractOpportunityPackagesCount(id: String) {
    return Observable.of(
      "6"
    );
  },
  getContractOpportunityHistoryById(id: String){
    return Observable.of({
      content: {
        history: [
          {
            cancel_notice: "0",
            procurement_type: "p",
            authoritative: "0",
            parent_notice: null,
            index: "1",
            notice_id: "213ji321hu3jk123",
            posted_date: "2012-04-13 19:07:05+00"
          },
          {
            cancel_notice: "0",
            procurement_type: "m",
            authoritative: "0",
            parent_notice: "6a3618f68f95542fa075fe97baab1fd4",
            index: "2",
            notice_id: "9e14590f674ab3ffbf8da6b85ddc8581",
            posted_date: "2012-04-13 19:30:51+00"
          },
          {
            cancel_notice: "0",
            procurement_type: "m",
            authoritative: "1",
            parent_notice: "6a3618f68f95542fa075fe97baab1fd4",
            index: "3",
            notice_id: "a2c630c37084d373200cc1bc6121bdf6",
            posted_date: "2012-04-13 19:36:13+00"
          }
        ]
      },
      _links: {
        self: {
          href: "not a real link"
        }
      }
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
  },
};

let MockDictionaryService = {
  dictionaries: {
    set_aside_type:{}
  },
  filterDictionariesToRetrieve(ids: String) {
    return "set_aside_type";
  },
  getContractOpportunityDictionary(ids: String) {
    return Observable.of({
      _embedded: {
        dictionaries: [{
          elements: [
            {
              elementId: "1",
              value: "10 -- Weapons",
              description: null,
              elements: null
            }],
          id: "set_aside_type"
        }]
      },
      "_links": {
        "self": {
          "href": "/opps/v1/dictionaries?ids=set_aside_type"
        }
      }
    });
  },
};

let MockFHService = {
  getFHOrganizationById(id: string, includeChildren: boolean) {
    return Observable.of({
      "_embedded": [
        {
          "org": {}
        }
      ]
    });
  },
  getOrganizationLogo(organizationAPI: Observable<any>, cbSuccessFn: any, cbErrorFn: any) {
    return Observable.of("");
  }
};



xdescribe('src/app/opportunity/opportunity-operations/workflow/ublic/opportunity-public.page.ts', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
          declarations: [
            OpportunityPublicPage,
            OpportunityTypeLabelPipe,
            TimezoneLabelPipe,
            FixHTMLPipe,
            FilesizePipe,
          ],
          imports: [
            SamUIKitModule,
            BrowserAnimationsModule,
            FormsModule,
            AppComponentsModule,
            OppComponentsModule,
            PipesModule,
            HttpModule,
            RouterTestingModule.withRoutes([
              {path: 'opp/:id/view', component: OpportunityPublicPage}
            ])
          ],
          providers: [
               BaseRequestOptions,
               MockBackend,
               SidenavService,
               { provide: ActivatedRoute, useValue: MockActivatedRoute},
               EntityService,
               { provide: OpportunityService, useValue: MockOpportunityService},
               { provide: FHService, useValue: MockFHService},
               { provide: DictionaryService, useValue: MockDictionaryService},
               FeedbackFormService,
               {
                provide: Http,
                useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
                  return new Http(backend, defaultOptions);
                },
                deps: [MockBackend, BaseRequestOptions],
              },
          ],
        });
  
        fixture = TestBed.createComponent(OpportunityPublicPage);
        comp = fixture.componentInstance;
        comp.authToken = 'erwerwer';
        Cookie.set('iPlanetDirectoryPro', 'erwerwer');
        
        fixture.detectChanges();
    });

    // Generic function to construct mock api with specified opportunity type
    var mockAPIDataType = type => {
        return Observable.of([{
        "data": {"type": type}
        }, null]);
    };

    it('OpportunityPublicPage: Should load & init variables', () => {
        fixture.detectChanges();        
        expect(comp).toBeDefined();
        expect(true).toBeTruthy();
        expect(comp.authToken).toBe('erwerwer');
        expect(comp.currentUrl).toBe(document.location.href);
        expect(comp.dictionariesUpdated).toBeTruthy();
        expect(comp.opportunityAPI).toBeDefined();
        //expect(comp.opportunityLocation).toBeDefined();
        // expect(comp.organization).toBeDefined();
        // expect(comp.attachments).toBeDefined();
        // expect(comp.relatedOpportunities).toBeDefined();
        //console.log("Opportunity object: ", comp.opportunity);
        expect(comp.opportunity.id).toBe('213ji321hu3jk123');
        expect(fixture.debugElement.query(By.css('h1')).nativeElement.innerHTML).toContain('Title Goes here');
        expect(comp.originalOpportunity).toBeDefined();
        expect(comp.processedHistory).toBeDefined();
    //    expect(comp.dictionary).toBeDefined();
        expect(comp.packages).toBeDefined();
        expect(comp.attachments).toBeDefined();
    });


    

});