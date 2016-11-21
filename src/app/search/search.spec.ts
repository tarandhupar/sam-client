import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';

import { SearchPage } from './search.page';
import { SearchService, SamAPIKitModule } from 'api-kit';
import { SamUIKitModule } from 'ui-kit';
import { AssistanceListingResult } from '../assistance-listing/search-result/assistance-listing-result.component';
import { OpportunitiesResult } from '../opportunity/search-result/opportunities-result.component';
import { FederalHierarchyResult } from '../organization/search-result/federal-hierarchy-result.component';
import { EntitiesResult } from '../entity/search-result/entities-result.component';
import { FHInputComponent } from './agency-selector/agency-selector.component';

var fixture;

var searchServiceStub = {
  runSearch: ()=>{
    return Observable.of({
      _embedded: {
        results: [{
          _type:"CFDA",
          title:"Dummy Result 1"
        },{
          _type:"FBO",
          procurementTitle:"Dummy Result 2"
        },{
          _type:"FH",
          title:"Dummy Result 3"
        },{
          _type:"ENT",
          title:"Dummy Result 4"
        }],
      },
      page: {
        size:10,
        totalElements: 123,
        totalPages: 123,
        number: 0
      }
    });
  }
};

describe('SearchPage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchPage,OpportunitiesResult,AssistanceListingResult,FederalHierarchyResult,EntitiesResult,FHInputComponent ],
      providers: [ ],
      imports: [
        SamUIKitModule,
        SamAPIKitModule,
        RouterTestingModule.withRoutes([
          { path: 'search', component: SearchPage }
        ])
      ]
    }).overrideComponent(SearchPage, {
       set: {
         providers: [
           {provide: SearchService, useValue: searchServiceStub}
         ]
      }
    }).compileComponents();

    fixture = TestBed.createComponent(SearchPage);
  });

  it('should "run" a search', () => {
    fixture.componentInstance.runSearch();
    fixture.whenStable().then(() => {
      expect(fixture.componentInstance.data.results[0].title).toBe("Dummy Result 1");
    });
	});

});
