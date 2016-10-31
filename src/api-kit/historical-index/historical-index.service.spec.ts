import {Http, Response, BaseRequestOptions, ResponseOptions} from '@angular/http';
import { inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { HistoricalIndexService } from './historical-index.service';
import { WrapperService } from '../wrapper/wrapper.service'

describe('HistoricalIndexService unit tests TestBed', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HistoricalIndexService,
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

  let mockedData = {
    "_embedded": {
      "historicalIndex": [
        {
          "organizationId": "100006809",
          "fiscalYear": 1965,
          "statusCode": "B",
          "changeDescription": "Agricultural Research Service",
          "reason": null,
          "actionType": "publish",
          "programNumber": "10.001",
          "index": 1,
          "createdDate": 1087776000000,
          "isManual": "1",
          "_links": {
            "self": {
              "href": "http://XYZ.XYZ/v1/historicalChange/35463abf12a7c255d8de84d5f94376dd"
            }
          },
          "id": "35463abf12a7c255d8de84d5f94376dd"
        },
        {
          "organizationId": "100006809",
          "fiscalYear": 1969,
          "statusCode": "B",
          "changeDescription": "Agricultural Research_Basic and Applied Research",
          "reason": null,
          "actionType": "title",
          "programNumber": "10.001",
          "index": 2,
          "createdDate": 1087776000000,
          "isManual": "1",
          "_links": {
            "self": {
              "href": "http://XYZ.XYZ/v1/historicalChange/ed357710efc9ac8f0511a1d50918ef42"
            }
          },
          "id": "ed357710efc9ac8f0511a1d50918ef42"
        }
      ]
    },
    "_links": {
      "self": {
        "href": "http://XYZ.XYZ/v1/historicalIndex/ee2e956dbb639a67bb9a43722bd63ede?programNumber=10.001"
      }
    }
  };

  beforeEach(inject([MockBackend], (backend: MockBackend) => {
    const baseResponse = new Response(new ResponseOptions({ body: mockedData }));
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(baseResponse));
  }));

  it('should return response when subscribed to getHistoricalIndexByProgramNumber', inject([HistoricalIndexService], (testService: HistoricalIndexService) => {
    testService.getHistoricalIndexByProgramNumber("5eb2b1a06998d59eb179a8e7fd76c173", "10.001").subscribe((res: Response) => {
      console.log('getHistoricalIndexByProgramNumber res', res)
      expect(res).toBeDefined();
      expect(res['_embedded']).toBeDefined();
      expect(res['_embedded']['historicalIndex']).toBeDefined();
      expect(res['_embedded']['historicalIndex'].length).toBe(2);
    });
  }));
});
