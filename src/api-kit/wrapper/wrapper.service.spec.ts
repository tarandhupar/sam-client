import {WrapperService} from './wrapper.service';

describe('Service: ApiService', () => {

 beforeEach(function() {
   this.oApiService = new WrapperService();
 });

 it('should have APIs property set', function() {
    expect(this.oApiService.APIs).toBeDefined();
    expect(this.oApiService.APIs.search).toBeDefined();
    expect(this.oApiService.APIs.program).toBeDefined();
    expect(this.oApiService.APIs.federalHierarchy).toBeDefined();
    expect(this.oApiService.APIs.dictionary).toBeDefined();
    expect(this.oApiService.APIs.historicalIndex).toBeDefined();
    expect(this.oApiService.APIs.suggestions).toBeDefined();
    expect(this.oApiService.APIs.featuredSearch).toBeDefined();
 });

 it('should have APIs property data set', function() {
    expect(this.oApiService.APIs.search).toBe('/sgs/v1/search');
    expect(this.oApiService.APIs.program).toBe('/cfda/v1/program');
    expect(this.oApiService.APIs.federalHierarchy).toBe('/federalorganizations/v1/organizations/');
    expect(this.oApiService.APIs.dictionary).toBe('/cfda/v1/dictionary');
    expect(this.oApiService.APIs.historicalIndex).toBe('/cfda/v1/historicalIndex');
    expect(this.oApiService.APIs.suggestions).toBe('/sgs/v1/search/suggestions');
    expect(this.oApiService.APIs.featuredSearch).toBe('/sgs/v1/search/featured');
 });

});
