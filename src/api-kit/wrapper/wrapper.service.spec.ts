import { TestBed, inject } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import {
  BaseRequestOptions,
  HttpModule,
  Http,
  Response,
  ResponseOptions
} from '@angular/http';

import { WrapperService } from '../wrapper/wrapper.service'

describe('Service: ApiService', () => {
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

it('should have APIs property set', inject([WrapperService], (resource) => {
    expect(resource.APIs).toBeDefined();
    expect(resource.APIs.search).toBeDefined();
    expect(resource.APIs.program).toBeDefined();
    expect(resource.APIs.federalHierarchy).toBeDefined();
    expect(resource.APIs.suggestions).toBeDefined();
    expect(resource.APIs.featuredSearch).toBeDefined();
    expect(resource.APIs.opportunity).toBeDefined();
    expect(resource.APIs.wageDetermination).toBeDefined();
  }));

  it('should have APIs property data set', inject([WrapperService], (resource) => {
    expect(resource.APIs.search).toBe('/sgs/v1/search');
    expect(resource.APIs.program).toBe('/fac/v1/programs');
    expect(resource.APIs.federalHierarchy).toBe('/federalorganizations/v1/organizations');
    expect(resource.APIs.suggestions).toBe('/sgs/v1/suggestions');
    expect(resource.APIs.featuredSearch).toBe('/sgs/v1/search/featured');
    expect(resource.APIs.opportunity).toBe('/opps/v1');
    expect(resource.APIs.wageDetermination).toBe('/wdol/v1');
  }));
});
