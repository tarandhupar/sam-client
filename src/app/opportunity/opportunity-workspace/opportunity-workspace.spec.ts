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
import {OpportunityService, SamAPIKitModule, FHService, DictionaryService} from 'api-kit';
import {SamUIKitModule} from 'sam-ui-kit';

//app-component
import {OPPWorkspacePage} from './opportunity-workspace.page';

//Module
// import {AppTemplatesModule} from "../../app-templates/index";
import {OpportunityModule} from "../opportunity.module";
import {AppComponentsModule} from '../../app-components/app-components.module';

//Service
import {AlertFooterService} from "../../app-components/alert-footer/alert-footer.service";

//other library
import * as Cookies from 'js-cookie';

let component: OPPWorkspacePage;
let fixture: ComponentFixture<OPPWorkspacePage>;

let mockOpportunityService = {
  runOpportunity: (param: any) => {
    return Observable.of({
      "_embedded": {
        "opportunity": [
          {
            "data": {
              "title": "Intent to Bundle Test Opportunity",
              "solicitationNumber": "AAA-AAA-11-1116",
              "organizationId": '1',
              "type": 'a'
            },
            "status": {
              "code": "published",
              "value": "Published"
            }
          }
        ]
      },
      "page": {
        "size": 10,
        "totalElements": 4,
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
  getOpportunityDictionary: (id) => {
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
  }
};

describe('OPPWorkspacePage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [ ],
      providers: [
        DictionaryService,
        OpportunityService,
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
        OpportunityModule,
        // AppTemplatesModule,
        SamUIKitModule,
        SamAPIKitModule,
        FormsModule,
        ReactiveFormsModule,
        AppComponentsModule,
        RouterTestingModule.withRoutes([
          {path: 'opp/workspace', component: OPPWorkspacePage}
        ])
      ]
    }).overrideComponent(OPPWorkspacePage, {
      set: {
        providers: [
          {provide: OpportunityService, useValue: mockOpportunityService},
          {provide: FHService, useValue: MockFHService},
          {provide: DictionaryService, useValue: MockDictionaryService}
        ]
      }
    })
      .compileComponents();

    fixture = TestBed.createComponent(OPPWorkspacePage);
    component = fixture.componentInstance;
    Cookies.set('iPlanetDirectoryPro', 'anything');
    fixture.detectChanges();
  });

  it('Initialize the OPP Workspace component', () => {
    expect(component.totalCount).toBe(4);
    expect(component.totalPages).toBe(1);
    expect(component.data[0]['noticeType']).toBe("Award Notice");
    expect(component.data[0]['officeName']).toBe("FISH AND WILDLIFE SERVICE");
  });

  it('Initializes the status checkbox options', () => {
    expect(component.statusCheckboxConfig.options.length).toBe(3);
  });

  it('Initializes the notice type checkbox options', () => {
    expect(component.noticeTypeCheckboxConfig.options.length).toBe(11);
  });

  it('Initializes the default sort', () =>{
    expect(component.defaultSort.type).toBe('postedDate');
  });

  it('Initializes the default date tab', () =>{
    expect(component.currDateTab).toBe('posted');
  });

});
