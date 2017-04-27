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
    service.getAccess("bob@gmail.com", { sex: 'male' });
  })));

  it('should update permissions for a user', inject([UserAccessService, MockBackend], fakeAsync((service: UserAccessService, backend: MockBackend) => {
    backend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.method).toBe(RequestMethod.Post);
      expect(connection.request.url).toMatch(/access/);
    });
    service.postAccess({mode: 'grant'}, 'Timmy!');
  })));

  it('should get roles', inject([UserAccessService, MockBackend], fakeAsync((service: UserAccessService, backend: MockBackend) => {
    backend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.method).toBe(RequestMethod.Get);
      expect(connection.request.url).toMatch(/uiroles/);
    });
    service.getRoles({}, 'john');
  })));

  it('should get domains', inject([UserAccessService, MockBackend], fakeAsync((service: UserAccessService, backend: MockBackend) => {
    backend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.method).toBe(RequestMethod.Get);
      expect(connection.request.url).toMatch(/domains\?/);
    });
    service.getDomains();
  })));

  it('should get permissions', inject([UserAccessService, MockBackend], fakeAsync((service: UserAccessService, backend: MockBackend) => {
    backend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.method).toBe(RequestMethod.Get);
      expect(connection.request.url).toMatch(/permissions\?/);
    });
    service.getPermissions();
  })));

  it('should get individual functions', inject([UserAccessService, MockBackend], fakeAsync((service: UserAccessService, backend: MockBackend) => {
    backend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.method).toBe(RequestMethod.Get);
      expect(connection.request.url).toMatch(/functions/);
    });
    service.getFunctionById(1);
  })));

  it('should get create domains', inject([UserAccessService, MockBackend], fakeAsync((service: UserAccessService, backend: MockBackend) => {
    backend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.method).toBe(RequestMethod.Post);
      expect(connection.request.url).toMatch(/domains/);
    });
    service.postDomain({ name: 'uber domain'});
  })));

  it('should fetch role object definitions', inject([UserAccessService, MockBackend], fakeAsync((service: UserAccessService, backend: MockBackend) => {
    backend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.method).toBe(RequestMethod.Get);
      expect(connection.request.url).toMatch(/domainDefinition/i);
    });
    service.getRoleObjDefinitions('mode', 'domainKey', 1);
  })));

  it('should create objects', inject([UserAccessService, MockBackend], fakeAsync((service: UserAccessService, backend: MockBackend) => {
    backend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.method).toBe(RequestMethod.Post);
      expect(connection.request.url).toMatch(/domainDefinition/i);
    });
    service.createObject(1, 'objectname', [1, 2, 3], 1)
  })));

  it('should put access objects', inject([UserAccessService, MockBackend], fakeAsync((service: UserAccessService, backend: MockBackend) => {
    backend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.method).toBe(RequestMethod.Post);
      expect(connection.request.url).toMatch(/requestaccess/i);
    });
    service.requestAccess({ superVisorName: 'tim', message: 'no'}, 'timothy');
  })));

  it('should put roles', inject([UserAccessService, MockBackend], fakeAsync((service: UserAccessService, backend: MockBackend) => {
    backend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.method).toBe(RequestMethod.Post);
      expect(connection.request.url).toMatch(/domainDefinition/i);
    });
    service.putRole({ name: 'newrole' });
  })));

  it('should delete functions', inject([UserAccessService, MockBackend], fakeAsync((service: UserAccessService, backend: MockBackend) => {
    backend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.method).toBe(RequestMethod.Delete);
      expect(connection.request.url).toMatch(/functions/i);
    });
    service.deleteFunction('domainkey', 'functionid');
  })));

  it('should get pending requests', inject([UserAccessService, MockBackend], fakeAsync((service: UserAccessService, backend: MockBackend) => {
    backend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.method).toBe(RequestMethod.Get);
      expect(connection.request.url).toMatch(/requestaccess/i);
    });
    service.getPendingRequests('user_id');
  })));

  it('should update requests', inject([UserAccessService, MockBackend], fakeAsync((service: UserAccessService, backend: MockBackend) => {
    backend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.method).toBe(RequestMethod.Put);
      expect(connection.request.url).toMatch(/requestaccess/i);
    });
    service.updateRequest('reqid', { status: 'pending' });
  })));
});
