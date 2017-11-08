import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CfdaNumbersPage} from "./cfda-numbers.page";
import {ProgramService} from "../../../../api-kit/program/program.service";
import {IBreadcrumb} from "sam-ui-elements/src/ui-kit/types";
import {Observable} from "rxjs/Observable";
import {SamUIKitModule} from "sam-ui-elements/src/ui-kit/index";
import {SamAPIKitModule} from "../../../../api-kit/api-kit.module";
import {AppComponentsModule} from "../../../app-components/app-components.module";
// import {AppTemplatesModule} from "../../../app-templates/index";
import {FALFormModule} from "../../assistance-listing-operations/fal-form.module";
import {FALComponentsModule} from "../../components/index";
import {PipesModule} from "../../../app-pipes/app-pipes.module";
import {CFDANumberManagementComponent} from "../cfda-number-management/fal-form-cfda-number-management.component";
import {FormatFederalHierarchyType} from "../../pipes/format-federal-hierarchy-type.pipe";
import {FALPublishComponent} from "../../assistance-listing-operations/workflow/publish/fal-publish.component";
import {FALRegionalAssistanceFormComponent} from "../../regional-assistance-locations/regional-assistance-operations/regional-assistance-form.component";
import {RequestTypeLabelPipe} from "../../pipes/request-type-label.pipe";
import {ActionHistoryLabelPipe} from "../../pipes/action-history-label.pipe";
import {ActionHistoryPipe} from "../../pipes/action-history.pipe";
import {FALReviewComponent} from "../../assistance-listing-operations/workflow/review/fal-review.component";
import {RegionalAssistanceLocationResult} from "../../regional-assistance-locations/location-result/regional-assistance-location-result.component";
import {FalRegionalAssistanceLocationsPage} from "../../regional-assistance-locations/regional-assistance-location.page";
import {RequestLabelPipe} from "../../pipes/request-label.pipe";
import {FALSubmitComponent} from "../../assistance-listing-operations/workflow/submit/fal-form-submit.component";
import {FALFormChangeRequestComponent} from "../../assistance-listing-change-request/fal-form-change-request.component";
import {FALFormChangeRequestActionComponent} from "../../assistance-listing-change-request/fal-form-change-request-action.component";
import {FeedsPage} from "../feeds/feeds.page";
import {RejectFALComponent} from "../../assistance-listing-operations/workflow/reject/reject-fal.component";
import {FalWorkspacePage} from "../assistance-listing-workspace.page";
import {AssistanceProgramResult} from "../program-result/assistance-program-result.component";
import {HistoricalIndexLabelPipe} from "../../pipes/historical-index-label.pipe";
import {FinancialObligationChart} from "../../assistance-listing.chart";
import {ProgramPage} from "../../assistance-listing.page";
import {AuthorizationPipe} from "../../pipes/authorization.pipe";
import {AccessRestrictedPage} from "../program-result/testauthenvironment.page";
import {routing} from "../../assistance-listing.route";
import {FHService} from "../../../../api-kit/fh/fh.service";
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import { async } from '@angular/core/testing';
import {Observable} from 'rxjs';
import * as Cookies from 'js-cookie';

let comp;
let fixture;

var MockProgramService = {
  getPermissions: (cookie: string, permissions: any) => {
    return Observable.of({
      "ORG_LEVELS":
      {
        "org":"100004222",
        "level":"all"
      }
    });
  },
  getFederalHierarchyConfigurations: (orgKeys: string) => {
    return Observable.of({
      "_embedded": {
        "federalHierarchyConfigurationList": [
          {
            "organizationId": "100532605",
            "programNumberLow": 0,
            "programNumberHigh": 999,
            "modifiedDate": 1505416810244,
            "programNumberAuto": false
          },
          {
            "organizationId": "100500345",
            "programNumberLow": 0,
            "programNumberHigh": 999,
            "modifiedDate": 1246995080000,
            "programNumberAuto": true
          },
          {
            "organizationId": "100075508",
            "programNumberLow": 0,
            "programNumberHigh": 999,
            "modifiedDate": 1505844943886,
            "programNumberAuto": false
          },
          {
            "organizationId": "100035685",
            "programNumberLow": 0,
            "programNumberHigh": 999,
            "modifiedDate": 1496776456000,
            "programNumberAuto": false
          },
          {
            "organizationId": "100008531",
            "programNumberLow": 0,
            "programNumberHigh": 999,
            "modifiedDate": 1426163736000,
            "programNumberAuto": false
          },
          {
            "organizationId": "100008023",
            "programNumberLow": 0,
            "programNumberHigh": 999,
            "modifiedDate": 1330551892000,
            "programNumberAuto": false
          },
          {
            "organizationId": "100004343",
            "programNumberLow": 0,
            "programNumberHigh": 999,
            "modifiedDate": 1505843186776,
            "programNumberAuto": false
          },
          {
            "organizationId": "100004223",
            "programNumberLow": 0,
            "programNumberHigh": 999,
            "modifiedDate": 1505416854902,
            "programNumberAuto": false
          },
          {
            "organizationId": "100004222",
            "programNumberLow": 0,
            "programNumberHigh": 999,
            "modifiedDate": 1444334431000,
            "programNumberAuto": false
          }
        ]
      },
      "_links": {
        "self": {
          "href": "https://gsaiae-dev02.reisys.com/fac/v1/programs/federalHierarchyConfigurations/?orgKeys=100004222,100004343,100075508,100532605,100500345,100516475,100516474,100004223,100004455,100035685,100038381,100079595,100071017,100008023,100008531,100036688,100532953,100004570,100164040,100533198"
        }
      },
      "page": {
        "size": 20,
        "totalElements": 9,
        "totalPages": 1,
        "number": 0
      }
    });
  }
};

var MockFHService = {
  getOrganizationById: (id: string, includeChildrenLevels: boolean, includeOrgTypes: boolean = false, status: string = 'all', pageSize: number = 10, pageNum: number = 1, orderBy: string = "asc") => {
  return Observable.of({
    "_embedded": [
      {
        "org": {
          "orgKey": 100004222,
          "agencyName": "Department of Health and Human Services",
          "categoryDesc": "DEPARTMENT",
          "categoryId": "CAT-1",
          "cfdaCode": "93",
          "fpdsCode": "7500",
          "fpdsOrgId": "7500",
          "cgac": "075",
          "fullParentPath": "100004222",
          "fullParentPathName": "HEALTH_AND_HUMAN_SERVICES_DEPARTMENT_OF",
          "name": "HEALTH AND HUMAN SERVICES, DEPARTMENT OF",
          "shortName": "HHS",
          "summary": "The Secretary of HHS advises the President on health, welfare, and income security plans, policies, and programs of the Federal government. The Secretary administers these functions through the Office of the Secretary and the Department's 11 operating divisions, including a budget of $460 billion and a workforce of 65,000 employees.  Supports cross-cutting research on health care systems, health care quality and cost issues, and effectiveness of medical treatments. Provides a system of health surveillance to monitor and prevent the outbreak of diseases.  With the assistance of States and other partners, CDC guards against international disease transmission, maintains national health statistics and provides for immunization services, and supports research into disease and injury prevention. Supports a network of 37 hospitals, 60 health centers, 3 school health centers, 46 health stations and 34 urban Indian health centers to provide services to nearly 1.5 million American Indians and Alaska Natives of 557 federally recognized tribes.  Administers the Medicare and Medicaid programs, that provide health care to America's aged and indigenous populations.  About one in every four Americans, including nearly 18 million children and nursing homes for low-income elderly persons are covered.  CMS also administers the new Children's Health Insurance Program through approved State plans that cover more than 2.2 million children.",
          "type": "DEPARTMENT",
          "level": 1,
          "code": "7500",
          "hierarchy": [
            {
              "org": {
                "orgKey": 100004343,
                "categoryDesc": "AGENCY",
                "categoryId": "CAT-2",
                "cfdaCode": "",
                "fpdsCode": "7503",
                "fpdsOrgId": "7503",
                "cgac": "075",
                "fullParentPath": "100004222.100004343",
                "fullParentPathName": "HEALTH_AND_HUMAN_SERVICES_DEPARTMENT_OF.OFFICE_OF_THE_GENERAL_COUNSEL",
                "name": "OFFICE OF THE GENERAL COUNSEL",
                "parentOrgKey": 100004222,
                "type": "AGENCY",
                "level": 2,
                "code": "7503",
                "hierarchy": [],
                "parentOrg": "HEALTH AND HUMAN SERVICES DEPARTMENT OF",
                "l1Name": "HEALTH AND HUMAN SERVICES DEPARTMENT OF",
                "l2Name": "OFFICE OF THE GENERAL COUNSEL",
                "l1OrgKey": 100004222
              },
              "_link": {
                "self": {
                  "href": "http://csp-api.sam.gov/comp/federalorganizations/v1/organizations/100004343"
                }
              }
            },
            {
              "org": {
                "orgKey": 100075508,
                "categoryDesc": "AGENCY",
                "categoryId": "CAT-2",
                "cfdaCode": "",
                "fpdsCode": "7530",
                "fpdsOrgId": "7530",
                "cgac": "075",
                "fullParentPath": "100004222.100075508",
                "fullParentPathName": "HEALTH_AND_HUMAN_SERVICES_DEPARTMENT_OF.CENTERS_FOR_MEDICARE_AND_MEDICAID_SERVICES",
                "name": "CENTERS FOR MEDICARE AND MEDICAID SERVICES",
                "parentOrgKey": 100004222,
                "type": "AGENCY",
                "level": 2,
                "code": "7530",
                "hierarchy": [],
                "parentOrg": "HEALTH AND HUMAN SERVICES DEPARTMENT OF",
                "l1Name": "HEALTH AND HUMAN SERVICES DEPARTMENT OF",
                "l2Name": "CENTERS FOR MEDICARE AND MEDICAID SERVICES",
                "l1OrgKey": 100004222
              },
              "_link": {
                "self": {
                  "href": "http://csp-api.sam.gov/comp/federalorganizations/v1/organizations/100075508"
                }
              }
            }
          ],
          "l1Name": "HEALTH AND HUMAN SERVICES DEPARTMENT OF",
          "l1OrgKey": 100004222
        },
        "_link": {
          "self": {
            "href": "http://csp-api.sam.gov/comp/federalorganizations/v1/organizations/100004222"
          }
        }
      }
    ]
  });
}
};





describe('src/app/assistance-listing/assistance-listing-workspace/cfda-numbers/cfda-numbers.page.ts', () => {
  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [AuthorizationPipe,
        ProgramPage,
        FinancialObligationChart,
        HistoricalIndexLabelPipe,
        AssistanceProgramResult,
        FalWorkspacePage,
        AccessRestrictedPage,
        RejectFALComponent,
        FeedsPage,
        FALFormChangeRequestActionComponent,
        FALFormChangeRequestComponent,
        FALSubmitComponent,
        RequestLabelPipe,
        FALReviewComponent,
        FalRegionalAssistanceLocationsPage,
        RegionalAssistanceLocationResult,
        FALReviewComponent,
        ActionHistoryPipe,
        ActionHistoryLabelPipe,
        RequestTypeLabelPipe,
        FALRegionalAssistanceFormComponent,
        FALPublishComponent,
        FormatFederalHierarchyType,
        CfdaNumbersPage,
        CFDANumberManagementComponent],
      providers: [FHService],
      imports: [
        PipesModule,
        // CommonModule,
        SamUIKitModule,
        AppComponentsModule,
        routing,
        ReactiveFormsModule,
        FormsModule,
        FALComponentsModule,
        FALFormModule,
        // AppTemplatesModule,
        RouterTestingModule.withRoutes([
          {path: 'cfda-numbers', component: CfdaNumbersPage}
        ])
      ]
    }).overrideComponent(CfdaNumbersPage, {
      set: {
        providers: [
          {provide: ProgramService, useValue: MockProgramService},
          {provide: FHService, useValue: MockFHService}
        ]
      }
    }).compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CfdaNumbersPage);
    comp = fixture.componentInstance;
    Cookies.set('iPlanetDirectoryPro', 'anything');
    fixture.detectChanges();
    comp.crumbs = [
      { breadcrumb:'Home', url:'/',},
      { breadcrumb: 'Workspace', url: '/workspace' },
      { breadcrumb: 'CFDA Number Management'}
    ];
  });

  it('Should init & load data', () => {
    expect(comp.processedCfdaNumbers).toBeDefined();
    expect(comp.cfdaNumbersApi).toBeDefined();
    expect(comp.totalPages).toBeDefined();
    expect(comp.orgLevels).toBeDefined();
    expect(comp.organizations).toBeDefined();
    expect(comp.organizationsPerPage).toBeDefined();
    expect(comp.min).toBeDefined();
    expect(comp.max).toBeDefined();
    expect(comp.checkboxModel).toBeDefined();
    expect(comp.checkboxConfig).toBeDefined();
    expect(comp.orgRoot).toBeDefined();
  });
});
