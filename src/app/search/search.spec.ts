import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';

import { SearchPage } from './search.page';
import { SearchService, SamAPIKitModule } from 'api-kit';
import { SamUIKitModule } from 'samUIKit';
import { AppComponentsModule } from '../app-components/app-components.module';
import { AssistanceListingResult } from '../assistance-listing/search-result/assistance-listing-result.component';
import { OpportunitiesResult } from '../opportunity/search-result/opportunities-result.component';
import { FederalHierarchyResult } from '../organization/search-result/federal-hierarchy-result.component';
import { EntitiesResult } from '../entity/search-result/entities-result.component';
import { ExclusionsResult } from '../exclusion/search-result/exclusions-result.component';
import { WageDeterminationResult } from '../wage-determination/search-result/wage-determination-result.component';
import { FHFeaturedResult } from '../organization/featured-result/featured-result.component';
import { FHService } from '../../api-kit/fh/fh.service';
import { PipesModule } from '../app-pipes/app-pipes.module';

let fixture;

let searchServiceStub = {
  runSearch: () => {
    return Observable.of({
      _embedded: {
        results: [{
          _type:"assistanceListing",
          title:"Dummy Result 1"
        },{
          _type:"opportunity",
          procurementTitle:"Dummy Result 2"
        },{
          _type:"federalorganization",
          title:"Dummy Result 3"
        },{
          _type:"entity",
          title:"Dummy Result 4"
        },{
          _type:"exclusion",
          title:"Dummy Result 5"
        },{
          _type:"wdSCA",
          title:"Dummy Result 6"
        }],
      },
      page: {
        size:10,
        totalElements: 123,
        totalPages: 123,
        number: 0
      }
    });
  },
  featuredSearch: ()=> {
    return Observable.of({
      _embedded: {
        featuredResult: [{
          alternativeNames: null,
          code: "abcd1234",
          name: "SAMPLE NAME",
          description: "",
          _id: "1234",
          type: "DEPARTMENT",
          shortName: "abcd",
          isActive: true,
          parentOrganizationHierarchy: null
        }]
      }
    });
  }
};

let fhServiceStub = {};

describe('SearchPage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchPage,OpportunitiesResult,AssistanceListingResult,FederalHierarchyResult,EntitiesResult,ExclusionsResult,WageDeterminationResult,FHFeaturedResult ],
      providers: [ ],
      imports: [
        SamUIKitModule,
        SamAPIKitModule,
        AppComponentsModule,
        RouterTestingModule.withRoutes([
          { path: 'search', component: SearchPage }
        ]),
        PipesModule
      ]
    }).overrideComponent(SearchPage, {
       set: {
         providers: [
           {provide: SearchService, useValue: searchServiceStub},
           {provide: FHService, useValue: fhServiceStub}
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

  it('should "run" a featured search', () => {
    fixture.componentInstance.keyword = "test";
    fixture.componentInstance.pageNum = 0;
    fixture.componentInstance.runSearch();
    fixture.whenStable().then(() => {
      expect(fixture.componentInstance.featuredData.featuredResult[0].name).toBe("SAMPLE NAME");
    });
  });

});
