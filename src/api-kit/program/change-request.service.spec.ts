import { BaseRequestOptions, ResponseOptions, Http, Response } from '@angular/http';
import { inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { ChangeRequestService } from './change-request.service';
import { WrapperService } from '../wrapper/wrapper.service';

describe('src/api-kit/program/change-request.service.spec.ts', () => {
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

  it('Change Request Service: should return response when subscribed to submitRequest()', inject([ChangeRequestService, MockBackend], (testService: ChangeRequestService, backend: MockBackend) => {
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(new Response(new ResponseOptions({ body: '{"id":"0x123"}' }))));

    testService.submitRequest({}, '').subscribe((res: Response) => {
      expect(res).toBeDefined();
      expect(res["id"]).toBe('0x123');
    });
  }));

  it('Change Request Service: should return response when subscribed to submitRequestAction()', inject([ChangeRequestService, MockBackend], (testService: ChangeRequestService, backend: MockBackend) => {
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(new Response(new ResponseOptions({ body: '{"id":"0x123"}' }))));

    testService.submitRequestAction({}, '').subscribe((res: Response) => {
      expect(res).toBeDefined();
      expect(res["id"]).toBe('0x123');
    });
  }));
  
  it('Change Request Service: should return response when subscribed to getRequest()', inject([ChangeRequestService, MockBackend], (testService: ChangeRequestService, backend: MockBackend) => {
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(new Response(new ResponseOptions({ body: '{"id":"0x123"}' }))));

    testService.getRequest("aaa", "bbb").subscribe((res: Response) => {
      expect(res).toBeDefined();
      expect(res["id"]).toBe('0x123');
    });
  }));
  
  it('Change Request Service: should return response when subscribed to getRequestActionByRequestId()', inject([ChangeRequestService, MockBackend], (testService: ChangeRequestService, backend: MockBackend) => {
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(new Response(new ResponseOptions({ body: '{"id":"0x123"}' }))));

    testService.getRequestActionByRequestId("aaa", "bbb").subscribe((res: Response) => {
      expect(res).toBeDefined();
      expect(res["id"]).toBe('0x123');
    });
  }));
});