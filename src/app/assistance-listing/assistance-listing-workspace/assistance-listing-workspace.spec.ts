import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  TestBed,
  ComponentFixture
} from '@angular/core/testing';
import {BaseRequestOptions, Http} from '@angular/http';
import {MockBackend} from '@angular/http/testing';
import {ActivatedRoute} from '@angular/router';
import {RouterTestingModule} from "@angular/router/testing";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Observable} from 'rxjs';

//KITs
import {SamErrorService} from '../../../api-kit/error-service';
import {ProgramService, SamAPIKitModule, FHService, DictionaryService} from 'api-kit';
import {SamUIKitModule} from 'sam-ui-elements/src/ui-kit';

//app-component
import {FalWorkspacePage} from './assistance-listing-workspace.page';
import {FALFormService} from "../assistance-listing-operations/fal-form.service";

//Module
// import {AppTemplatesModule} from "../../app-templates/index";
import {ProgramModule} from "../assistance-listing.module";
import {AppComponentsModule} from '../../app-components/app-components.module';

//Service
import {AlertFooterService} from "../../app-components/alert-footer/alert-footer.service";

//other library
import * as Cookies from 'js-cookie';

let component: FalWorkspacePage;
let fixture: ComponentFixture<FalWorkspacePage>;

let mockProgramService = {
  runProgram: (param: any) => {
    return Observable.of({
      "_embedded": {
        "program": [
          {
            "data": {
              "title": "Yukon River Salmon Research and Management Assistance",
              "programNumber": "15.671",
              "organizationId": '100156642',
            },
            "status": {
              "code": "published",
              "value": "Published"
            }
          }
        ],
        "facets": [
          {
            "name": "status",
            "buckets": [
              {
                "name": "total_active_listing",
                "count": 115
              },
              {
                "name": "total_draft_listing",
                "count": 24
              },
              {
                "name": "total_pending_listing",
                "count": 1
              },
              {
                "name": "total_published_listing",
                "count": 84
              },
              {
                "name": "total_rejected_listing",
                "count": 2
              },
              {
                "name": "total_archived_listing",
                "count": 41
              },
              {
                "name": "total_draft_review_listing",
                "count": 4
              }
            ]
          },
          {
            "name": "pendingChangeRequest",
            "buckets": [
              {
                "name": "total_change_requests",
                "count": null
              },
              {
                "name": "archive_request",
                "count": null
              },
              {
                "name": "unarchive_request",
                "count": null
              },
              {
                "name": "title_request",
                "count": null
              },
              {
                "name": "agency_request",
                "count": null
              },
              {
                "name": "program_number_request",
                "count": null
              }
            ]
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
  },
  getPermissions: (cookieValue: string, perms: string) => {
    return Observable.of({
      'FAL_REQUESTS': true,
      'ORG_LEVELS': {
        'level': 'all'
      }
    });
  },
  getCountPendingRequests: (cookieValue: string) => {
    return Observable.of(1);
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
              orgKey: "100156642",
              parentOrgKey: "100010393",
              name: 'U.S. FISH AND WILDLIFE SERVICE',
              type: 'AGENCY'
            }
          }
        ]
      }
    });
  }
};

describe('FalWorkspacePage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [ ],
      providers: [
        DictionaryService,
        FALFormService,
        ProgramService,
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
        ProgramModule,
        // AppTemplatesModule,
        SamUIKitModule,
        SamAPIKitModule,
        FormsModule,
        ReactiveFormsModule,
        AppComponentsModule,
        RouterTestingModule.withRoutes([
          {path: 'falworkspace', component: FalWorkspacePage}
        ])
      ]
    }).overrideComponent(FalWorkspacePage, {
      set: {
        providers: [
          {provide: ProgramService, useValue: mockProgramService},
          {provide: FHService, useValue: MockFHService},
        ]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(FalWorkspacePage);
    component = fixture.componentInstance;
    Cookies.set('iPlanetDirectoryPro', 'anyting');
    fixture.detectChanges();
  });

  it('Initialize the component', () => {
    expect(component.statusCheckboxConfig.options.length).toBe(6);
  });
});
