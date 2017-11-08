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
import {SamUIKitModule} from 'sam-ui-elements/src/ui-kit';

//app-component
import {OPPWorkspacePage} from './opportunity-workspace.page';

import {OpportunityModule} from "../opportunity.module";
import {AppComponentsModule} from '../../app-components/app-components.module';

//Service
import {AlertFooterService} from "../../app-components/alert-footer/alert-footer.service";

//other library
import * as Cookies from 'js-cookie';
import {UserService} from "../../role-management/user.service";
import {UserAccessService} from "../../../api-kit/access/access.service";

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
              "organizationId": '100000136',
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
              orgKey: "100000136",
              parentOrgKey: "100000136",
              name: 'TRANSPORTATION, DEPARTMENT OF',
              type: 'AGENCY'
            }
          }
        ]
      }
    });
  },
  getOrganizationById: (id, includeChildren, includeOrgTypes, status, size, page, orderBy, hasFpds) => {
    return Observable.of({
      "_embedded":
      [
        {
          org: {
            orgKey: 100000136,
            fpdsCode: "6900",
            fullParentPath: "100000136",
            hierarchy: [],
            level: 1,
            name: 'TRANSPORTATION, DEPARTMENT OF',
            l1Name: 'TRANSPORTATION, DEPARTMENT OF',
            l1OrgKey: 100000136,
            type: 'DEPARTMENT'
          }
        }
      ]
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

let MockUserService = {
  getUser: () => {
    return {
      lastName: "Administrator",
      _id: "FBO_AA@gsa.gov",
      email: "FBO_AA@gsa.gov",
      _links: {
        self: {
          href: "/comp/iam/auth/v4/session/"
        }
      }
    }
  }
};

let MockUserAccessService = {
  getAllUserRoles: (uid, queryParams) => {
    return Observable.of({
      access: [{organization: {id: 100000136, val: "TRANSPORTATION, DEPARTMENT OF"}}],
      domains: [{id: 2, val: "Contract Opportunities"}, {id: 5, val: "Federal Hierarchy"}],
      limit: 10,
      offset: 0,
      roles: [{id: 6, val: "Agency Admin"}],
      total: 1,
      user: {lastName: "Administrator", _id: "fbo.test.user.aa@gmail.com", email: "fbo.test.user.aa@gmail.com"},
      _links: {
        request_access: {
          href: "https://39rolemanagementcomp.apps.prod-iae.bsp.gsa.gov/rms/v1/requestaccess/"
        }
      }
    })
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
        UserService,
        UserAccessService,
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
          {provide: DictionaryService, useValue: MockDictionaryService},
          {provide: UserService, useValue: MockUserService},
          {provide: UserAccessService, useValue: MockUserAccessService}
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
    expect(component.data[0]['officeName']).toBe("TRANSPORTATION, DEPARTMENT OF");
  });

  it('Initializes the status checkbox options', () => {
    expect(component.statusCheckboxConfig.options.length).toBe(3);
  });

  it('Initializes the notice type checkbox options', () => {
    expect(component.noticeTypeCheckboxConfig.options.length).toBe(12);
  });

  it('Initializes the default sort', () => {
    expect(component.defaultSort.type).toBe('postedDate');
  });

  it('Initializes the default date tab', () => {
    expect(component.currDateTab).toBe('posted');
  });

  it('Initializes the agency picker', () => {
    expect(component.orgRoots).toContain(100000136);
  });

});
