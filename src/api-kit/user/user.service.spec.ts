import { Http, BaseRequestOptions, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { TestBed, fakeAsync, inject } from "@angular/core/testing";
import { WrapperService } from "../wrapper/wrapper.service";
import { UserService } from "./user.service";


describe('UserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
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

  it('should call the access endpoint', inject([UserService, MockBackend], fakeAsync((service: UserService, backend: MockBackend) => {
    backend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.method).toBe(RequestMethod.Get);
      expect(connection.request.url).toMatch(/access/);
    });
    service.getAccess(1);
  })));

});
