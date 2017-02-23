import { Http, BaseRequestOptions, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { TestBed, fakeAsync, inject } from "@angular/core/testing";
import { WrapperService } from "../wrapper/wrapper.service";
import { UserAccessService } from "./access.service";


describe('UserAccessService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserAccessService,
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

  it('should get permissions for a user', inject([UserAccessService, MockBackend], fakeAsync((service: UserAccessService, backend: MockBackend) => {
    backend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.method).toBe(RequestMethod.Get);
      expect(connection.request.url).toMatch(/access/);
    });
    service.getAccess("bob@gmail.com");
  })));

  it('should put permissions for a user', inject([UserAccessService, MockBackend], fakeAsync((service: UserAccessService, backend: MockBackend) => {
    backend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.method).toBe(RequestMethod.Put);
      expect(connection.request.url).toMatch(/access/);
    });
    service.putAccess({});
  })));


  it('should get roles', inject([UserAccessService, MockBackend], fakeAsync((service: UserAccessService, backend: MockBackend) => {
    backend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.method).toBe(RequestMethod.Get);
      expect(connection.request.url).toMatch(/roles\?/);
    });
    service.getRoles();
  })));

});
