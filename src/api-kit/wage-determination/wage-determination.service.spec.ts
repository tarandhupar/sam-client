import { BaseRequestOptions, ResponseOptions, Http, Response } from '@angular/http';
import { inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { WrapperService } from '../wrapper/wrapper.service'
import { WageDeterminationService } from './wage-determination.service';

describe('Wage Determination Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WageDeterminationService,
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

  beforeEach(inject([MockBackend], (backend: MockBackend) => {
    let mockData = {
      "fullReferenceNumber": "2002-0261",
      "revisionNumber": 8,
      "location": [
        {
          "state": "Texas",
          "counties": [
            "Angelina",
            "Austin",
            "Brazoria",
            "Calhoun",
            "Chambers",
            "Colorado",
            "Fayette",
            "Fort Bend",
            "Galveston",
            "Grimes",
            "Harris",
            "Houston",
            "Jackson",
            "Jasper",
            "Jefferson",
            "Lavaca",
            "Leon",
            "Liberty",
            "Madison",
            "Matagorda",
            "Montgomery",
            "Newton",
            "Orange",
            "Polk",
            "Sabine",
            "Trinity",
            "Tyler",
            "Victoria",
            "Walker",
            "Washington",
            "Wharton"
          ]
        }
      ],
      "services": [
        "Barber and Beauty Services",
        "Diver Services",
        "Residential and Halfway House Services",
        "Towing and Tender"
      ],
      "publishDate": "2007-05-28 19:00:00",
      "active": false,
      "standard": false,
      "_links": {
        "self": {
          "href": "http://10.98.29.81:124/wdol/v1/wd/2002-0261/8"
        }
      }
    };

    const baseResponse = new Response(new ResponseOptions({ body: mockData }));
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(baseResponse));
  }));

  it('should return response when subscribed to getWageDeterminationByReferenceNumberAndRevisionNumber', inject([WageDeterminationService], (testService: WageDeterminationService) => {
    testService.getWageDeterminationByReferenceNumberAndRevisionNumber("2002-0261", 8).subscribe((res: Response) => {
      expect(res['fullReferenceNumber']).toBeDefined();
      expect(res['revisionNumber']).toBeDefined();
      expect(res['fullReferenceNumber']).toBe('2002-0261');
      expect(res['revisionNumber']).toBe(8);
    });
  }));
});

