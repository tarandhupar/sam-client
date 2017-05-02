import { inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, Response, BaseRequestOptions, ResponseOptions } from '@angular/http';
import { FHService } from './fh.service';
import { FHWrapperService } from './fhWrapper.service';
import { WrapperService } from '../wrapper/wrapper.service'

describe('Federal Hierarchy Service', () => {

    //Todo MOCK DATA AND TEST OTHER FUNCTIONS
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FHService,
        FHWrapperService,
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
    const baseResponse = new Response(new ResponseOptions({ body: '{"response":"sot response!!"}' }));
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(baseResponse));
  }));

  it('should return response when subscribed to getOrganizationById', inject([FHService], (testService: FHService) => {
    testService.getOrganizationById("fee2e0e30ce63b7bc136aeff32096c1d", false).subscribe((res: Response) => {
      expect(res['response']).toBeDefined();
      expect(res['response']).toBe('sot response!!');
    });
  }));
});
