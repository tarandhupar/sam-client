import {Http, Response, BaseRequestOptions, ResponseOptions} from '@angular/http';
import { inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { DictionaryService } from './dictionary.service';
import { APIService } from '../../common/service/api/api.service';

describe('DictionaryService unit tests using TestBed', () => {

  let mockedData = JSON.parse('{"_embedded":{"jSONObjectList":[{"content":{"elements":[{"code":"yes","elements":null,"description":"Yes","element_id":"yes","value":"Yes"},{"code":"no","elements":null,"description":"No","element_id":"no","value":"No"}],"id":"yes_no"},"_links":{"self":{"href":"https://gsaiae-dev02.reisys.com/v1/dictionary?ids=yes_no"}}}]},"_links":{"search":{"href":"https://gsaiae-dev02.reisys.com/v1/dictionary{ids}","templated":true},"self":{"href":"https://gsaiae-dev02.reisys.com/v1/dictionary?ids=yes_no"}}}');

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
    const baseResponse = new Response(new ResponseOptions({ body: mockedData }));
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(baseResponse));
  }));

  it('should return response when a dictionary is requested', inject([DictionaryService], (testService: DictionaryService) => {
    testService.getDictionaryById("yes_no").subscribe((res: Response) => {
      expect(res['yes_no']).toBeDefined();
      expect(res['yes_no'][0]['elements']).toBeDefined();
      expect(res['yes_no'][0]['description']).toBeDefined();
      expect(res['yes_no'][0]['displayValue']).toBeDefined();
    });
  }));

});
