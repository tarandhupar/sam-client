import { BaseRequestOptions, ResponseOptions, Http, Response } from '@angular/http';
import { inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { ChangeRequestService } from './change-request.service';
import { WrapperService } from '../wrapper/wrapper.service';

xdescribe('src/api-kit/program/change-request.service.spec.ts', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ChangeRequestService,
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

  it('Change Request Service: should return response when subscribed to submit()', inject([ChangeRequestService, MockBackend], (testService: ChangeRequestService, backend: MockBackend) => {
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(new Response(new ResponseOptions({ body: '{"id":"0x123"}' }))));

    testService.submitRequest({}, '').subscribe((res: Response) => {
      expect(res['response']).toBeDefined();
      expect(res['response']).toBe('0x123');
    });
  }));
});