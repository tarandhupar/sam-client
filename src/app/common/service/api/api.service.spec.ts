import {APIService} from './api.service';

describe('Service: ApiService', () => {

 beforeEach(function() {
   this.oApiService = new APIService();
 });

 it('should have APIs property set', function() {
    expect(this.oApiService.APIs).toBeDefined();
    expect(this.oApiService.APIs.search).toBeDefined();
    expect(this.oApiService.APIs.program).toBeDefined();
    expect(this.oApiService.APIs.federalHierarchy).toBeDefined();
    expect(this.oApiService.APIs.dictionary).toBeDefined();
    expect(this.oApiService.APIs.historicalIndex).toBeDefined();
 });

 it('should have APIs property data set', function() {
    expect(this.oApiService.APIs.search).toBe('/sgs/v1/search');
    expect(this.oApiService.APIs.program).toBe('/cfda/v1/program');
    expect(this.oApiService.APIs.federalHierarchy).toBe('/cfda/v1/fh');
    expect(this.oApiService.APIs.dictionary).toBe('/cfda/v1/dictionary');
    expect(this.oApiService.APIs.historicalIndex).toBe('/cfda/v1/historicalIndex');
 });

});
