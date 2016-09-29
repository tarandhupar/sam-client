import { DictionaryService } from './dictionary.service';
import {APIService} from '../../common/service/api/api.service'
import {Http, Headers, RequestOptions, Request, RequestMethod, Response, URLSearchParams} from '@angular/http';


import { inject, TestBed } from '@angular/core/testing';
import { BaseRequestOptions, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';


describe('DictionaryService unit tests using TestBed', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DictionaryService,
        APIService,
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
    const baseResponse = new Response(new ResponseOptions({ body: '{"response":"got response!!"}' }));
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(baseResponse));
  }));


  it('should return response when subscribed to getHistoricalIndexByProgramNumber', inject([DictionaryService], (testService: DictionaryService) => {
    testService.getHistoricalIndexByProgramNumber("5eb2b1a06998d59eb179a8e7fd76c173", "11.111").subscribe((res: Response) => {
      expect(res['response']).toBe('got response!!');
    });
  }));


});
