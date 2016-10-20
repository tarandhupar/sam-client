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

  beforeEach(inject([MockBackend], (backend: MockBackend) => {
    const baseResponse = new Response(new ResponseOptions({ body: '{"response":"got response!!"}' }));
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(baseResponse));
  }));

  it('should return response when subscribed to getHistoricalIndexByProgramNumber', inject([HistoricalIndexService], (testService: HistoricalIndexService) => {
    testService.getHistoricalIndexByProgramNumber("5eb2b1a06998d59eb179a8e7fd76c173", "11.111").subscribe((res: Response) => {
      expect(res['response']).toBeDefined();
      expect(res['response']).toBe('got response!!');
    });
  }));
});
