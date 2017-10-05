import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {BaseRequestOptions, Http} from '@angular/http';
import {MockBackend} from '@angular/http/testing';
import { Observable } from 'rxjs';

import { SearchPage } from './search.page';
import { SearchService, SamAPIKitModule } from 'api-kit';
import { SamUIKitModule } from 'sam-ui-kit';
import { AppComponentsModule } from '../app-components/app-components.module';
import { AssistanceListingResult } from '../assistance-listing/search-result/assistance-listing-result.component';
import { OpportunitiesResult } from '../opportunity/search-result/opportunities-result.component';
import { FederalHierarchyResult } from '../organization/search-result/federal-hierarchy-result.component';
import { EntitiesResult } from '../entity/search-result/entities-result.component';
import { ExclusionsResult } from '../exclusion/search-result/exclusions-result.component';
import { WageDeterminationResult } from '../wage-determination/search-result/wage-determination-result.component';
import { AwardsResult } from '../awards/search-result/awards-result.component';
import { FHFeaturedResult } from '../organization/featured-result/featured-result.component';
import { FHService } from '../../api-kit/fh/fh.service';
import { PipesModule } from '../app-pipes/app-pipes.module';
import { AlertFooterService } from '../app-components/alert-footer';
import {SearchMultiSelectFilter} from "./search-multi-select-filter/search-multi-select-filter.component";
import {SamNaicsPscFilter} from "./naics-psc-filter/naics-psc-filter.component";
import { RegionalOfficeListingResult } from "../assistance-listing/regional-office-listing-search-result/regional-office-listing-result.component";
import {FormsModule} from "@angular/forms";
import {DunsEntityAutoCompleteWrapper} from "../../api-kit/autoCompleteWrapper/entityDunsAutoCompleteWrapper.service";
import { SamEligibilityFilter } from "./eligibility-filter/eligibility-filter.component";
import {SearchDictionariesService} from "../../api-kit/search/search-dictionaries.service";
import {DictionaryService} from "../../api-kit/dictionary/dictionary.service";
import {ActivatedRoute} from "@angular/router";
//other library
import * as Cookies from 'js-cookie';
import {SavedSearchService} from "../../api-kit/search/saved-search.service";
import {SearchModule} from "./search.module";

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
        },{
          _type:"awards",
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
  },
  loadParams: ()=> {
  }
};

let savedSearchServiceStub = {
  getAllSavedSearches: ()=> {
   return Observable.of({
     _links: {
       self: {
         href: "https://gsaiae-dev02.reisys.com/preferences/v1/search?page=0&size=0&sort=-relevance"
       }
     },
     page: {
       size:0,
       totalElements: 0,
       totalPages: 0,
       number: 0
    }
  });
  },
  createSavedSearch: ()=> {
  return Observable.of("abcd");
  }
};

let fhServiceStub = {
  getDepartments: ()=> {
    return Observable.of({
      "_embedded": [
        {
          "org": {
            "orgKey": 1,
            "categoryDesc": "DEPARTMENT",
            "categoryId": "CAT-1",
            "createdBy": "MIGRATOR",
            "createdDate": 1064880000000,
            "description": "POSTAL SERVICE",
            "fpdsOrgId": "1",
            "cgac": "0",
            "fullParentPath": "10",
            "fullParentPathName": "POSTAL_SERVICE",
            "isSourceFpds": true,
            "lastModifiedBy": "FPDSADMIN",
            "lastModifiedDate": 1152144000000,
            "name": "POSTAL SERVICE",
            "orgCode": "ORG-1",
            "type": "DEPARTMENT",
            "level": 1,
            "code": "1",
            "orgAddresses": [],
            "hierarchy": [],
            "l1Name": "POSTAL SERVICE",
            "l1OrgKey": 10
          },
          "_link": {
            "self": {
              "href": "http://csp-api.sam.gov/minc/federalorganizations/v1/organizations/100040731"
            }
          }
        }
      ]
    });
  }
};

describe('src/app/search/search.spec.ts', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [ SearchPage,OpportunitiesResult,AssistanceListingResult,FederalHierarchyResult,
        EntitiesResult,ExclusionsResult,WageDeterminationResult,AwardsResult,FHFeaturedResult,
        SearchMultiSelectFilter, SamNaicsPscFilter, RegionalOfficeListingResult,
        SamEligibilityFilter],
      providers: [
        AlertFooterService,
        SavedSearchService,
        DunsEntityAutoCompleteWrapper,
        SearchDictionariesService,
        DictionaryService,
        BaseRequestOptions,
        MockBackend,
        {
          provide: Http,
          useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions],
        }
      ],
      imports: [
        SamUIKitModule,
        SamAPIKitModule,
        AppComponentsModule,
        RouterTestingModule.withRoutes([
          { path: 'search', component: SearchPage }
        ]),
        PipesModule,
        FormsModule
      ]
    }).overrideComponent(SearchPage, {
       set: {
         providers: [
           {provide: SearchService, useValue: searchServiceStub},
           {provide: SavedSearchService, useValue: savedSearchServiceStub},
           {provide: FHService, useValue: fhServiceStub},
           {provide: ActivatedRoute, useValue: {'queryParams': Observable.from([{'page': '1', 'index': 'cfda', 'keywords': 'education', 'assistance_type': '0001001'}])}
         ]
      }
    }).compileComponents();

    fixture = TestBed.createComponent(SearchPage);
  });

  it('SearchPage: should "run" a search', () => {
    fixture.componentInstance.runSearch();
    fixture.whenStable().then(() => {
      expect(fixture.componentInstance.data.results[0].title).toBe("Dummy Result 1");
    });
	});

  it('SearchPage: should "run" a featured search', () => {
    fixture.componentInstance.keyword = "test";
    fixture.componentInstance.pageNum = 0;
    fixture.componentInstance.runSearch();
    fixture.whenStable().then(() => {
      expect(fixture.componentInstance.featuredData.featuredResult[0].name).toBe("SAMPLE NAME");
    });
  });

  it('SearchPage: should "check" if clear filters is clearing models', () => {
    fixture.componentInstance.isActive = false;
    fixture.componentInstance.wdStateModel = "AK";
    fixture.componentInstance.wdCountyModel = "17606";
    fixture.componentInstance.awardTypeModel = "xyz";
    fixture.componentInstance.contractTypeModel = "abc";
    fixture.componentInstance.naicsTypeModel = "naics";
    fixture.componentInstance.pscTypeModel = "psc";
    fixture.componentInstance.benElSearchString = "beneficiary";
    fixture.componentInstance.appElSearchString = "applicant";
    fixture.componentInstance.assistanceTypeFilterModel = "assistance";
    fixture.componentInstance.dunsListString = "duns";
    fixture.componentInstance.clearAllFilters();
    fixture.whenStable().then(() => {
      expect(fixture.componentInstance.isActive).toBe(true);
      expect(fixture.componentInstance.wdStateModel).toBe("");
      expect(fixture.componentInstance.wdCountyModel).toBe("");
      expect(fixture.componentInstance.awardTypeModel).toBe("");
      expect(fixture.componentInstance.contractTypeModel).toBe("");
      expect(fixture.componentInstance.naicsTypeModel).toBe("");
      expect(fixture.componentInstance.pscTypeModel).toBe("");
      expect(fixture.componentInstance.benElSearchString).toBe("");
      expect(fixture.componentInstance.appElSearchString).toBe("");
      expect(fixture.componentInstance.assistanceTypeFilterModel).toBe("");
      expect(fixture.componentInstance.dunsListString).toBe("");
    });
  });

  it('SearchPage: should "check" if the agency picker variable is receiving a value', () => {
    fixture.componentInstance.keyword = "test";
    fixture.componentInstance.pageNum = 0;
    fixture.componentInstance.runSearch();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(fixture.componentInstance.agencyPickerV2).toBeDefined();
    });
  });

  it('SearchPage: should "check" if FAL filters are defined', () => {
    fixture.componentInstance.index = "cfda";
    fixture.componentInstance.keyword = "";
    fixture.componentInstance.pageNum = 0;
    fixture.componentInstance.runSearch();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(fixture.componentInstance.benElType).toBeDefined();
      expect(fixture.componentInstance.appElType).toBeDefined();
      expect(fixture.componentInstance.assistanceTypeOptions).toBeDefined();
    });
  });

  it('SearchPage: should "check" if award type filters are defined', () => {
    fixture.componentInstance.index = "fpds";
    fixture.componentInstance.keyword = "";
    fixture.componentInstance.pageNum = 0;
    fixture.componentInstance.runSearch();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(fixture.componentInstance.awardType).toBeDefined();
      expect(fixture.componentInstance.contractType).toBeDefined();
      expect(fixture.componentInstance.naicsType).toBeDefined();
      expect(fixture.componentInstance.pscType).toBeDefined();
      expect(fixture.componentInstance.dunsConfiguration).toBeDefined();
    });
  });

  it('SearchPage: should check for displayed results', () => {
    fixture.componentInstance.runSearch();

    fixture.whenStable().then(() => {
      expect(fixture.componentInstance.data.page.size).toBe(10);
      expect(fixture.componentInstance.data.page.totalElements).toBe(123);
      expect(fixture.componentInstance.showSavedSearches).toBe(false);
    });
  });

  it('SearchPage: should show error message when trying to save without giving a name', () => {
    fixture.componentInstance.index = "cfda";
    fixture.componentInstance.keywords = "education";
    fixture.componentInstance.pageNum = 0;
    fixture.componentInstance.assistanceTypeFilterModel = "0001001";
    Cookies.set('iPlanetDirectoryPro', 'anything');
    fixture.componentInstance.saveSearch(null);

    fixture.whenStable().then(() => {
      expect(fixture.componentInstance.handleAction()).toHaveBeenCalled();
      expect(fixture.componentInstance.modal1.open()).toHaveBeenCalled();
      expect(fixture.componentInstance.textConfig.errorMessage).toBe("Please provide a name");
      expect(fixture.componentInstance.modal1.closeModal()).toHaveBeenCalledTimes(0);
      expect(fixture.componentInstance.searchName).toBe('');
    });
  });

  it('SearchPage: should save a search', () => {
    fixture.componentInstance.index = "cfda";
    fixture.componentInstance.keywords = "education";
    fixture.componentInstance.assistanceTypeFilterModel = "0001001";
    fixture.savedSearchName = "Test save search";
    Cookies.set('iPlanetDirectoryPro', 'anything');
    fixture.detectChanges();
    fixture.componentInstance.saveSearch(null);

    fixture.whenStable().then(() => {
      expect(fixture.componentInstance.modal1.closeModal()).toHaveBeenCalledTimes(1);
      expect(fixture.componentInstance.showSavedSearches).toBe(true);
      expect(fixture.componentInstance.searchName).toBe("Test save search");
    });
  });

});
