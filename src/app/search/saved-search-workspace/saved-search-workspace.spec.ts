import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import {BaseRequestOptions, Http} from '@angular/http';
import {MockBackend} from '@angular/http/testing';
import {ActivatedRoute} from '@angular/router';
import {RouterTestingModule} from "@angular/router/testing";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Observable} from 'rxjs';

//KITs
import {SamErrorService} from '../../../api-kit/error-service';
import {SavedSearchService, SamAPIKitModule, FHService, DictionaryService} from 'api-kit';
import {SamUIKitModule} from 'sam-ui-kit';

//app-component
import {SavedSearchWorkspacePage} from './saved-search-workspace.page';

//Module
import {SearchModule} from "../search.module";
import {AppComponentsModule} from '../../app-components/app-components.module';

//Service
import {AlertFooterService} from "../../app-components/alert-footer/alert-footer.service";

//other library
import * as Cookies from 'js-cookie';

let component: SavedSearchWorkspacePage;
let fixture: ComponentFixture<SavedSearchWorkspacePage>;

let mockSavedSearchService = {
  getAllSavedSearches: (obj: any) => {
    return Observable.of({
      _embedded: {
        preferences : [
          {
            "preferenceId": "85e220d4-a48e-480f-8fe1-db3cd0bf4625",
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
                "beneficiary": "10",
                "assistance_type": "0001001",
                "organization_id": "1"
              }
            }
          },
          {
            "preferenceId": "85e220d4-a48e-480f-8fe1-db3cd0bf4625",
            "userId": "cfda.test.use.rsrloca@gmail.com",
            "type": "saved_search",
            "title": "Test Saved Search 1",
            "createdOn": null,
            "modifiedOn": "2017/09/27T17:43:16+0000",
            "lastUsageDate": "2017/09/27T17:43:16+0000",
            "numberOfUsages": 1,
            "data": {
              "index": ["opp"],
              "key": "test_saved_search_1",
              "parameters": {
                "is_active": true,
                "naics": "541511",
                "notice_type": "p",
                "organization_id": "1"
              }
            }
          }
        ]
      },
      "page": {
        "size": 10,
        "totalElements": 2,
        "totalPages": 1,
        "number": 0
      }
    });
  }
};

let MockFHService = {
  getOrganizationsByIds: (ids) => {
    return Observable.of({
      "_embedded":
      {
        "orgs": [
          {
            org: {
              orgKey: "1",
              parentOrgKey: "100010393",
              name: 'FISH AND WILDLIFE SERVICE',
              type: 'AGENCY'
            }
          }
        ]
      }
    });
  }
};

let MockDictionaryService = {
  filterDictionariesToRetrieve: (id) => {
    return "anything";
  },
  getOpportunityDictionary: (ids: string) => {
    return Observable.of({
      "procurement_type": [
        {
          "elementId": "p",
          "code": "p",
          "value": "Presolicitation",
          "description": null,
          "elements": null
        },
        {
          "elementId": "a",
          "code": "a",
          "value": "Award Notice",
          "description": null,
          "elements": null
        }
      ]
    });
  },
  getProgramDictionaryById: (ids: string) => {
    return Observable.of({
      "assistance_type": [
        {
          "element_id": "0001001",
          "code": "A",
          "value": "Formula Grants",
          "description": null,
          "elements": null
        },
        {
          "element_id": "001",
          "code": "A",
          "value": "New Formula Grants",
          "description": null,
          "elements": null
        }
      ]
    });
  }
};

describe('src/app/search/saved-search-workspace/saved-search-workspace.spec.ts', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [ ],
      providers: [
        DictionaryService,
        SavedSearchService,
        BaseRequestOptions,
        MockBackend,
        {
          provide: Http,
          useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions],
        },
        SamErrorService,
        AlertFooterService,
        FHService,
        {provide: ActivatedRoute, useValue: {'queryParams': Observable.from([{'page': ''}])}}
      ],
      imports: [
        SearchModule,
        SamUIKitModule,
        SamAPIKitModule,
        FormsModule,
        ReactiveFormsModule,
        AppComponentsModule,
        RouterTestingModule.withRoutes([
          {path: 'savedsearches/workspace', component: SavedSearchWorkspacePage}
        ])
      ]
    }).overrideComponent(SavedSearchWorkspacePage, {
      set: {
        providers: [
          {provide: SavedSearchService, useValue: mockSavedSearchService},
          {provide: FHService, useValue: MockFHService},
          {provide: DictionaryService, useValue: MockDictionaryService}
        ]
      }
    })
      .compileComponents();

    fixture = TestBed.createComponent(SavedSearchWorkspacePage);
    component = fixture.componentInstance;
    Cookies.set('iPlanetDirectoryPro', 'anything');
  });

  it('Initialize Saved Searches Workspace component', () => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.totalCount).toBe(2);
      expect(component.totalPages).toBe(1);
      expect(component.data[0].data.parameters['assistance_type']).toBe("A-Formula Grants");
      expect(component.data[1].data.parameters['notice_type']).toBe("Presolicitation");
      expect(component.data[0].data.parameters['organization_id']).toBe("FISH AND WILDLIFE SERVICE");
    });
  });

});
