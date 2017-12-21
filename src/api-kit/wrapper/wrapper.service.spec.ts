import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import {
  BaseRequestOptions,
  HttpModule,
  Http,
  Response,
  ResponseOptions, RequestMethod,
} from '@angular/http';

import { WrapperService } from '../wrapper/wrapper.service';
import { UserAccessService } from '../access/access.service';

describe('src/api-kit/wrapper/wrapper.service.spec.ts', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
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

  it('should call the base url if no parameters are set',
    inject([WrapperService, MockBackend], fakeAsync((service: WrapperService, backend: MockBackend) => {
    backend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.method).toBe(RequestMethod.Get);
    });
    service.call({});
  })));

  it('should construct urls by concating the prefix/name/suffix',
    inject([WrapperService, MockBackend],
      fakeAsync((service: WrapperService, backend: MockBackend) => {
        const name = 'search';
        const nameLookup = service.APIs[name];
        const combined = `1${nameLookup}/2`;

        backend.connections.subscribe((connection: MockConnection) => {
          expect(connection.request.method).toBe(RequestMethod.Get);
          expect(connection.request.url).toContain(combined);
        });

        service.call({prefix: '1', name, suffix: '/2'});
      })));

  it('prefix is optional',
    inject([WrapperService, MockBackend],
      fakeAsync((service: WrapperService, backend: MockBackend) => {
        const name = 'search';
        const suffix = '2';
        const nameLookup = service.APIs[name];
        const combined = `${nameLookup}${suffix}`;

        backend.connections.subscribe((connection: MockConnection) => {
          expect(connection.request.method).toBe(RequestMethod.Get);
          expect(connection.request.url).toContain(combined);
        });

        service.call({name, suffix});
      })));

  it('name is optional',
    inject([WrapperService, MockBackend],
      fakeAsync((service: WrapperService, backend: MockBackend) => {
        backend.connections.subscribe((connection: MockConnection) => {
          expect(connection.request.method).toBe(RequestMethod.Get);
          expect(connection.request.url).toContain('1/2');
        });

        service.call({prefix: '1/', suffix: '2'});
      })));

  it('suffix is optional',
    inject([WrapperService, MockBackend],
      fakeAsync((service: WrapperService, backend: MockBackend) => {
        const name = 'search';
        const nameLookup = service.APIs[name];
        const prefix = '1';
        const combined = `1${nameLookup}`;

        backend.connections.subscribe((connection: MockConnection) => {
          expect(connection.request.method).toBe(RequestMethod.Get);
          expect(connection.request.url).toContain(combined);
        });

        service.call({prefix, name});
      })));


  it('Service: ApiService: should have APIs property set', inject([WrapperService], (resource) => {
    expect(resource.APIs).toBeDefined();
    expect(resource.APIs.search).toBeDefined();
    expect(resource.APIs.program).toBeDefined();
    expect(resource.APIs.federalHierarchy).toBeDefined();
    expect(resource.APIs.suggestions).toBeDefined();
    expect(resource.APIs.featuredSearch).toBeDefined();
    expect(resource.APIs.opportunity).toBeDefined();
    expect(resource.APIs.wageDetermination).toBeDefined();
  }));

  it('Service: ApiService: should have APIs property data set', inject([WrapperService], (resource) => {
    expect(resource.APIs.search).toBe('/sgs/v1/search');
    expect(resource.APIs.program).toBe('/fac/v1/programs');
    expect(resource.APIs.federalHierarchy).toBe('/federalorganizations/v1/organizations');
    expect(resource.APIs.suggestions).toBe('/sgs/v1/suggestions');
    expect(resource.APIs.featuredSearch).toBe('/sgs/v1/search/featured');
    expect(resource.APIs.opportunity).toBe('/opps/v1');
    expect(resource.APIs.wageDetermination).toBe('/wdol/v1');
  }));

});
