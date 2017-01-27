import { BaseRequestOptions, ResponseOptions, Http, Response } from '@angular/http';
import { inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { ProgramService } from './program.service';
import { WrapperService } from '../wrapper/wrapper.service'
import { AlertFooterService } from "../../app/alerts/alert-footer/alert-footer.service";

describe('Program Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProgramService,
        WrapperService,
        AlertFooterService,
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

  it('should return response when subscribed to getProgramById', inject([ProgramService], (testService: ProgramService) => {
    testService.getProgramById("fee2e0e30ce63b7bc136aeff32096c1d").subscribe((res: Response) => {
      expect(res['response']).toBeDefined();
      expect(res['response']).toBe('sot response!!');
    });
  }));
});
