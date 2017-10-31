import {
  inject,
  TestBed,
  ComponentFixture
} from '@angular/core/testing';
import {BaseRequestOptions, Http} from '@angular/http';
import {MockBackend} from '@angular/http/testing';
import {ActivatedRoute} from '@angular/router';
import {RouterTestingModule} from "@angular/router/testing";

// Load the implementations that should be tested
import {SamUIKitModule} from "sam-ui-kit";
import {SamAPIKitModule} from "api-kit";
import {WorkspaceModule} from "../../workspace.module";
import {ProgramService} from "../../../../api-kit/program/program.service";
import {SamErrorService} from '../../../../api-kit/error-service';
import {AlertFooterService} from "../../../app-components/alert-footer/alert-footer.service";
import {AssistanceListingWidgetComponent} from "./assistance-listing-widget.component";
import {Observable} from 'rxjs';
import * as Cookies from 'js-cookie';
import {FALAuthGuard} from "../../../assistance-listing/components/authguard/authguard.service";
import {FALFormErrorService} from "../../../assistance-listing/assistance-listing-operations/fal-form-error.service";
import {FALFormService} from "../../../assistance-listing/assistance-listing-operations/fal-form.service";
import {DictionaryService} from "../../../../api-kit/dictionary/dictionary.service";

let component: AssistanceListingWidgetComponent;
let fixture: ComponentFixture<AssistanceListingWidgetComponent>;

let MockProgramService = {
  runProgram: (param: any) => {
    return Observable.of({
      _embedded: {
        program: [],
        facets: [
          {
            "name": "status",
            "buckets": [
              {
                "name": "total_active_listing",
                "count": 906
              },
              {
                "name": "total_draft_listing",
                "count": 376
              },
              {
                "name": "total_pending_listing",
                "count": 5
              },
              {
                "name": "total_published_listing",
                "count": 519
              },
              {
                "name": "total_rejected_listing",
                "count": 2
              },
              {
                "name": "total_archived_listing",
                "count": 137
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
                "count": 3
              },
              {
                "name": "archive_request",
                "count": 0
              },
              {
                "name": "unarchive_request",
                "count": 0
              },
              {
                "name": "title_request",
                "count": 0
              },
              {
                "name": "agency_request",
                "count": 3
              },
              {
                "name": "program_number_request",
                "count": 0
              }
            ]
          }
        ]
      }
    });
  },
  getPermissions: (cookieValue: string, perms: string) => {
    return Observable.of({
      'ORG_LEVELS': {
        'level': 'all'
      }
    });
  }
};

describe('Workspace Page: Assistance Listing Widget', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        SamUIKitModule,
        SamAPIKitModule,
        RouterTestingModule,
        WorkspaceModule
      ],
      providers: [
        ProgramService,
        BaseRequestOptions,
        MockBackend,
        FALAuthGuard,
        FALFormErrorService,
        FALFormService,
        DictionaryService,
        {
          provide: Http,
          useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions],
        },
        AssistanceListingWidgetComponent,
        SamErrorService,
        AlertFooterService,
        {
          provide: ActivatedRoute,
        },
      ]
    })
      .overrideComponent(AssistanceListingWidgetComponent, {
        set: {
          providers: [
            {provide: ProgramService, useValue: MockProgramService},
          ]
        }
      });

    fixture = TestBed.createComponent(AssistanceListingWidgetComponent);
    component = fixture.componentInstance;
    Cookies.set('iPlanetDirectoryPro', 'anyting')
    fixture.detectChanges();
  });

  it("should compile without error", () => {
    expect(component.permissions).toEqual({
      'ORG_LEVELS': {
        'level': 'all'
      }
    });
    expect(component.pendingApprovalCount).toBe(5);
    expect(component.pendingRequestCount).toBe(3);
    expect(component.rejectedCount).toBe(2);
    expect(component.draftReviewCount).toBe(4);
  });
});
