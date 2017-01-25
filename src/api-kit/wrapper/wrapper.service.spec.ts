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
    expect(resource.APIs.dictionary).toBeDefined();
    expect(resource.APIs.historicalIndex).toBeDefined();
    expect(resource.APIs.suggestions).toBeDefined();
    expect(resource.APIs.featuredSearch).toBeDefined();
  }));

  it('should have APIs property data set', inject([WrapperService], (resource) => {
    expect(resource.APIs.search).toBe('/sgs/v1/search');
    expect(resource.APIs.program).toBe('/cfda/v1/program');
    expect(resource.APIs.federalHierarchy).toBe('/federalorganizations/v1/organizations');
    expect(resource.APIs.dictionary).toBe('/cfda/v1/dictionary');
    expect(resource.APIs.historicalIndex).toBe('/cfda/v1/historicalIndex');
    expect(resource.APIs.suggestions).toBe('/sgs/v1/suggestions');
    expect(resource.APIs.featuredSearch).toBe('/sgs/v1/search/featured');
  }));
});
