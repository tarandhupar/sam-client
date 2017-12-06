import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {BaseRequestOptions, Http} from '@angular/http';
import {MockBackend} from '@angular/http/testing';
import { Observable } from 'rxjs';

import { SearchPage } from './search.page';
import { SearchService, SamAPIKitModule } from 'api-kit';
import { SamUIKitModule } from 'sam-ui-elements/src/ui-kit';
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
import {SamModalComponent} from 'sam-ui-elements/src/ui-kit/components/modal/modal.component';
import { SamComponentsModule } from 'sam-ui-elements/src/ui-kit/components';
import { FeedbackFormService } from 'app/app-components/feedback-form/feedback-form.service';


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
  getSavedSearch: ()=> {
    return Observable.of({
      "preferenceId": "abcde-12345",
      "userId": "cfda.test.use.rsrloca@gmail.com",
      "type": "saved_search",
      "title": "Test Saved Search",
      "createdOn": null,
      "modifiedOn": "2017/09/27T17:43:16+0000",
      "lastUsageDate": "2017/09/27T17:43:16+0000",
      "numberOfUsages": 1,
      "data": {
        "index": ["cfda"],
        "key": "test_saved_search",
        "parameters": {
          "is_active": true,
          "beneficiary_type": "10",
          "assistance_type": "0001001",
          "organization_id": "100004222"
        }
      },
      "_links": {
        "self": {
          "href": "https://gsaiae-dev02.reisys.com/preferences/v1/search/85e220d4-a48e-480f-8fe1-db3cd0bf4625"
        }
      }
    });
  },
  createSavedSearch: ()=> {
  return Observable.of({
    _body: "abcd"
  });
  },
  updateSavedSearch: ()=> {
    return Observable.of();
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
      schemas: [],
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
        },
        FeedbackFormService
      ],
      imports: [
        SamUIKitModule,
        SamAPIKitModule,
        AppComponentsModule,
        SamComponentsModule,
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
           {provide: ActivatedRoute, useValue: {'queryParams': Observable.from([{'page': '1', 'index': 'cfda', 'keywords': 'education', 'assistance_type': '0001001', 'preference_id': 'abcde-12345'}])}}
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
    fixture.componentInstance.keywords = "test";
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

  it('SearchPage: should "check" if the agency picker model variable is populated', () => {
    fixture.componentInstance.keywords = "test";
    fixture.componentInstance.pageNum = 0;
    fixture.componentInstance.organizationId = "100111929,100111828"
    fixture.agencyPickerModel = fixture.componentInstance.setupOrgsFromQS(fixture.componentInstance.organizationId);
    
    expect(fixture.agencyPickerModel).toEqual(['100111929', '100111828']);
  });

  it('SearchPage: should "check" if FAL filters are defined', () => {
    fixture.componentInstance.index = "cfda";
    fixture.componentInstance.keywords = "";
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
    fixture.componentInstance.keywords = "";
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
      expect(fixture.componentInstance.totalCount).toBe(123);
      expect(fixture.componentInstance.showSavedSearches).toBe(false);
    });
  });

  it('SearchPage: should show error message when trying to save without giving a name', () => {
    fixture.componentInstance.index = "cfda";
    fixture.componentInstance.keywords = "education";
    fixture.componentInstance.pageNum = 0;
    fixture.componentInstance.assistanceTypeFilterModel = "0001001";
    let event = { name: 'save', label: 'Save Search', icon: 'fa fa-floppy-o', callback: this.actionsCallback };
    Cookies.set('iPlanetDirectoryPro', 'anything');
    fixture.componentInstance.saveNewSearch(null);

    spyOn(fixture.componentInstance, 'handleAction'); 
    fixture.componentInstance.handleAction(event);

    fixture.whenStable().then(() => {
      expect(fixture.componentInstance.handleAction).toHaveBeenCalled();
      expect(fixture.componentInstance.textConfig.errorMessage).toBe("Please provide a name");
      expect(fixture.componentInstance.searchName).toBe('');
    });
  });

  // it('SearchPage: should save a new search', () => {
  //   fixture.componentInstance.index = "cfda";
  //   fixture.componentInstance.keywords = "education";
  //   fixture.componentInstance.assistanceTypeFilterModel = "0001001";
  //   fixture.componentInstance.savedSearchName = "Test save search";
  //   Cookies.set('iPlanetDirectoryPro', 'anything');
  //   fixture.componentInstance.saveNewSearch(null);
  //   fixture.detectChanges();

  //   fixture.whenStable().then(() => {
  //     expect(fixture.componentInstance.showSavedSearches).toBe(true);
  //     expect(fixture.componentInstance.searchName).toBe("Test save search");
  //     expect(fixture.componentInstance.preferenceId).toBe("abcd");
  //     expect(fixture.componentInstance.actions.length).toBe(2);
  //   });
  // });

  it('SearchPage: should save same search', () => {
    fixture.componentInstance.index = "cfda";
    fixture.componentInstance.keywords = "education";
    fixture.componentInstance.assistanceTypeFilterModel = "0001001";
    let id = "abcde-12345";
    Cookies.set('iPlanetDirectoryPro', 'anything');
    spyOn(fixture.componentInstance, 'saveSearch');
    fixture.componentInstance.getSavedSearch(id);
    fixture.componentInstance.handleAction({ name: 'save', label: 'Save Search', icon: 'fa fa-floppy-o', callback: this.actionsCallback });
    
    fixture.whenStable().then(() => {
      expect(fixture.componentInstance.preferenceId).toBe("abcde-12345");
      expect(fixture.componentInstance.saveSearch).toHaveBeenCalled();
      expect(fixture.componentInstance.searchName).toBe("Test Saved Search");
      expect(fixture.componentInstance.actions.length).toBe(2);
      expect(fixture.componentInstance.savedSearch['numberOfUsages']).toBe(1);
    });
  });

  it('SearchPage: should not run saved search due to null cookie', () => {    
    expect(fixture.componentInstance.cookieValue).toBeFalsy();
    expect(fixture.componentInstance.showSavedSearches).toBe(false);
  });

  it('SearchPage: error checking SavedSearchService init call', () => {
    Cookies.set('iPlanetDirectoryPro', 'anything');    
    const savedSearchService = fixture.debugElement.injector.get(SavedSearchService);
    const mockCall = spyOn(savedSearchService, 'getAllSavedSearches').and.returnValue(Observable.throw({status: 404}));
    
    expect(fixture.componentInstance.showSavedSearches).toBe(false);
  });

  it('SearchPage: should get all saved searches on init', () => {
    Cookies.set('iPlanetDirectoryPro', 'anything');
    fixture.detectChanges();
    //spyOn(fixture.componentInstance.savedSearchService, 'getAllSavedSearches');
    expect(fixture.componentInstance.cookieValue).toBe('anything');
    //expect(fixture.componentInstance.savedSearchService.getAllSavedSearches).toHaveBeenCalled();
    expect(fixture.componentInstance.showSavedSearches).toBe(true);
  });

  it('should initialize feedback to form service instance', () => {
    expect(fixture.componentInstance.feedback).toEqual(fixture.componentInstance.formService.componentInstance);
  });

});
