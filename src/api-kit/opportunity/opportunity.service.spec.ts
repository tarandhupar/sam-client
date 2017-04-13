import { BaseRequestOptions, ResponseOptions, Http, Response } from '@angular/http';
import { inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { WrapperService } from '../wrapper/wrapper.service'
import { OpportunityService } from './opportunity.service';

describe('Opportunity Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OpportunityService,
        WrapperService,
        BaseRequestOptions,
        MockBackend,
        {
          provide: Http,
          useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions],
        },
      ],
    });
  });

  it('should return response when subscribed to getOpportunityById', inject([OpportunityService, MockBackend], (testService: OpportunityService, backend: MockBackend) => {
    let mockData = {
      "opportunityId": "213ji321hu3jk123",
      "data": {
        "type": "i",
        "solicitationNumber": "Solicitation Number goes here",
        "title": "Title Goes here",
        "organizationId": "100010393",
        "organizationLocationId": "100010393",
        "relatedOpportunityId": "Related Opportunity Id goes here",
        "statuses": {
          "publishStatus": "Statuses publish archived goes here",
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
    };
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(new Response(new ResponseOptions({ body: mockData }))));

    testService.getOpportunityById("fee2e0e30ce63b7bc136aeff32096c1d").subscribe((res: Response) => {
      expect(res['opportunityId']).toBeDefined();
      expect(res['opportunityId']).toBe('213ji321hu3jk123');
    });
  }));

  it('should return response when subscribed to getPackagesCount', inject([OpportunityService, MockBackend], (testService: OpportunityService, backend: MockBackend) => {
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(new Response(new ResponseOptions({ body: '6' }))));

    testService.getPackagesCount("fee2e0e30ce63b7bc136aeff32096c1d").subscribe((res: Response) => {
      expect(res).toBeDefined();
      expect(res).toBe(6);
    });
  }));

  it('should return response when subscribed to getPackages', inject([OpportunityService, MockBackend], (testService: OpportunityService, backend: MockBackend) => {

    let mockData = {
      "packages": [
        {
          "packageId": "1ccd07afdd57069cedb998a7cf02a85d",
          "name": "Solicitation 1",
          "type": "Solicitation",
          "postedDate": 1452124800000,
          "access": "Public",
          "attachments": [
            {
              "attachmentId": "221e068991250e6e3dfd42920592e6a6",
              "resourceId": "3a6434285f304b1c0210af324320a33c"
            },
            {
              "attachmentId": "2bc535a8a9413df6378f2073a1dce418",
              "resourceId": "5b8be0a5def80f9cd690d9c41b3a01c1"
            }
          ]
        },
        {
          "packageId": "18fd4a18e69c946b517963756590a0af",
          "name": "Solicitation 1",
          "type": "Solicitation",
          "postedDate": 1452124800000,
          "access": "Public",
          "attachments": [
            {
              "attachmentId": "6ba9fd3a836e2cc9a6b9a6f6bda76c6f",
              "resourceId": "6ba9fd3a836e2cc9a6b9a6f6bda76c6f"
            }
          ]
        }
      ],
      "resources": [
        {
          "resourceId": "6ba9fd3a836e2cc9a6b9a6f6bda76c6f",
          "name": "",
          "type": "link",
          "uri": "http://www.wdol.gov/wdol/scafiles",
          "description": "Wage Determination",
          "mimeType": ""
        },
        {
          "resourceId": "3a6434285f304b1c0210af324320a33c",
          "name": "506-09b_Blank_vendor_questionnaire.docx",
          "type": "file",
          "uri": "506-09b_Blank_vendor_questionnaire.docx",
          "description": "Vendor Questionnaire",
          "mimeType": "application/vnd.openxmlformats-o"
        },
        {
          "resourceId": "5b8be0a5def80f9cd690d9c41b3a01c1",
          "name": "STLJC2016-001_REKEYING.docx",
          "type": "file",
          "uri": "STLJC2016-001_REKEYING.docx",
          "description": "Scope of Work",
          "mimeType": "application/vnd.openxmlformats-o"
        }
      ],
      "_links": {
        "self": {
          "href": "http://10.98.29.81:122/v1/opportunity/attachments?noticeIds=9e14590f674ab3ffbf8da6b85ddc8581&noticeIds=a2c630c37084d373200cc1bc6121bdf6"
        }
      }
    };

    backend.connections.subscribe((c: MockConnection) => c.mockRespond(new Response(new ResponseOptions({ body: mockData }))));

    testService.getPackages("9e14590f674ab3ffbf8da6b85ddc8581, a2c630c37084d373200cc1bc6121bdf6").subscribe((res: Response) => {
      expect(res['packages']).toBeDefined();
      expect(res['resources']).toBeDefined();
    });
  }));

});

