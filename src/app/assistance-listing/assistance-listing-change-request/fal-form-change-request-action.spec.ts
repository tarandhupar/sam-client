
import {FALFormChangeRequestActionComponent} from "./fal-form-change-request-action.component";
import { TestBed, ComponentFixture } from '@angular/core/testing';
import {ChangeRequestService} from "../../../api-kit/program/change-request.service";
import {AppComponentsModule} from "../../app-components/app-components.module";
import {SamAPIKitModule} from "../../../api-kit/api-kit.module";
import {SamUIKitModule} from "../../../sam-ui-elements/src/ui-kit/index";
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {Observable} from "rxjs/Observable";
// import Http = XRay.Http;
import { MockBackend } from '@angular/http/testing';
import {ProgramService} from "../../../api-kit/program/program.service";
import {DateFormatPipe} from "../../app-pipes/date-format.pipe";
import {PipesModule} from "../../app-pipes/app-pipes.module";
import {CapitalizePipe} from "../../app-pipes/capitalize.pipe";
import { RouterTestingModule } from '@angular/router/testing';

let comp: FALFormChangeRequestActionComponent;
let fixture: ComponentFixture<FALFormChangeRequestActionComponent>;

let MockProgramService = {
  getFederalHierarchyConfigurations: (orgId: string, cookie: string) => {
    return Observable.of({
      "organizationId":"100004222",
      "programNumberLow":0,
      "programNumberHigh":999,
      "programNumberAuto":true,
      "_links":{
        "self":{
          "href":"https://gsaiae-dev02.reisys.com/fac/v1/programs/federalHierarchyConfigurations/100004222"
        }
      }
    });
  },
  getNextAvailableProgramNumber: (orgId: string, cookie: string) => {
    return Observable.of({
      "content": {
        "isProgramNumberOutsideRange": false,
        "nextAvailableCode": "93.349"
      },
      "_links": {
        "self": {
          "href": "https://gsaiae-dev02.reisys.com/fac/v1/programs/nextAvailableProgramNumber?organizationId=100008531"
        }
      }
    });
  },
  getCfdaCode: (orgId) => {
    return Observable.of({
      "content": {
        "cfdaCode": "93",
        "orgKey": ""
      },
      "_links": {
        "self": {
          "href": "https://gsaiae-dev02.reisys.com/fac/v1/programs/getCfdaCode?organizationId="
        }
      }
    });
  },
  getPermissions: (cookie: string, permissions: any, orgId: string = null) => {
    return Observable.of({
      "INITIATE_CANCEL_ARCHIVE_CR":true,
      "INITIATE_CANCEL_NUMBER_CR":true,
      "INITIATE_CANCEL_TITLE_CR":true,
      "APPROVE_REJECT_TITLE_CR":true,
      "APPROVE_REJECT_UNARCHIVE_CR":true,
      "INITIATE_CANCEL_AGENCY_CR":true,
      "APPROVE_REJECT_AGENCY_CR":true,
      "INITIATE_CANCEL_UNARCHIVE_CR":true,
      "APPROVE_REJECT_NUMBER_CR":true,
      "APPROVE_REJECT_ARCHIVE_CR":true
    });
  },
};

let MockChangeRequestService = {
  getRequest: (id: string, cookie: string): Observable<any> => {
    return Observable.of({
      "programId": "fda6d3ffc3774f69b860efdbbf83c303",
      "requestType": {"publicValue": "Request Agency Change", "value": "agency_request"},
      "entryDate": 1500414402724,
      "createdBy": "AGENCY_SUBMITTER",
      "modifiedDate": null,
      "modifiedBy": null,
      "reason": "agency request test",
      "data": "{\"organizationId\": \"100004222\"}",
      "completed": false,
      "program": {
        "title": "Health Care and Other Facilities",
        "website": "http://www.hrsa.gov/hcofconstruction/  ",
        "contacts": {
          "local": {
            "flag": "none",
            "description": "Program Contact:  Mr. David Colwander, Chief, Facilities Services Branch, Division of Poison Control and Healthcare Facilities, Healthcare Systems Bureau,  5600 Fishers Lane, Room 10-105, Rockville, Maryland 20857 Phone: (301) 443-7858. "
          },
          "headquarters": [{
            "fax": "",
            "zip": "20857",
            "city": "Rockville",
            "email": "test@gmail.com",
            "phone": "5158684132",
            "state": "MD",
            "title": "Chief, Facilities Monitoring Branch, Division of Facilities Comp",
            "country": "US",
            "fullName": "David Colwander",
            "contactId": "a3c237192013dcc814453f123efe20ee",
            "streetAddress": "5600 Fishers Lane, Room 08W-50"
          }]
        },
        "projects": {"list": [], "isApplicable": false},
        "financial": {
          "accounts": [{"code": "75-0350-0-1-550", "description": null}],
          "treasury": {
            "tafs": [{
              "fy1": null,
              "fy2": null,
              "accountCode": "75-0350",
              "departmentCode": "75",
              "subAccountCode": null,
              "allocationTransferAgency": null
            }]
          },
          "obligations": [{
            "values": [{"year": 2016, "actual": null}, {"year": 2017, "estimate": null}, {
              "year": 2018,
              "estimate": null
            }, {"year": 2015, "estimate": 0}, {"year": 2014, "actual": 0, "estimate": 0}],
            "description": "Last award year was fiscal year 2010. No funds authorized for fiscal years 2011, 2012, 2013 and 2014, and 2015.\r\n",
            "obligationId": "3d0b69c4e7682e463b5b1cd1e550defc",
            "isRecoveryAct": false,
            "assistanceType": "0003003"
          }],
          "accomplishments": {
            "list": [{"fiscalYear": 2014, "description": "No Data Available "}],
            "isApplicable": true
          },
          "isFundedCurrentFY": false
        },
        "objective": "test",
        "assistance": {
          "appeal": {"interval": "8"},
          "renewal": {"interval": "8"},
          "approval": {"interval": "9", "description": "Approximately 3 to 6 months."},
          "deadlines": {"flag": "contact"},
          "awardProcedure": {"description": "Only Congressional-directed funded organizations may receive an award. \r\nAll applicants are required to apply electronically through Grants.gov.  \r\nAwards are made subsequent to proposal evaluations carried out by HRSA staff.\r\nNotification is made in writing by a Notice of Award."},
          "selectionCriteria": {},
          "applicationProcedure": {
            "description": "Application materials are provided to organizations that were specifically earmarked in the Appropriation Bill or Conference Report, based upon information in HRSA's annual appropriation.",
            "isApplicable": true
          },
          "preApplicationCoordination": {
            "description": "dfdg",
            "environmentalImpact": {
              "reports": [{"isSelected": true, "reportCode": "statement"}, {
                "isSelected": true,
                "reportCode": "assessment"
              }, {"isSelected": true, "reportCode": "otherRequired"}, {
                "isSelected": true,
                "reportCode": "ExecutiveOrder12372"
              }]
            }
          }
        },
        "compliance": {
          "audit": {"description": "sdfsdf", "isApplicable": true},
          "records": {"description": "Grantees are required to maintain grant accounting records 3 years after the date they submit the Federal Financial Report (FFR).  If any litigation, claim, negotiation, audit or other action involving the award has been started before the expiration of the 3-year period, the records shall be retained until completion of the action and resolution of all issues which arise from it, or until the end of the regular 3-year period, whichever is later."},
          "reports": [{
            "code": "program",
            "isSelected": true,
            "description": "At the conclusion of the project, recipients must submit a final report on project costs (424C) and a list of equipment purchased with funds. "
          }, {"code": "cash", "isSelected": false, "description": ""}, {
            "code": "progress",
            "isSelected": true,
            "description": "The awardee will be required to submit performance and progress reports as well as status-federal financial reports (see the program announcement and notice of award for details for each required report). The awardee must submit a quarterly electronic Federal Financial Report (FFR) Cash Transaction Report via the Payment Management System within 30 days of the end of each calendar quarter.  A Federal Financial Report (SF-425) according to the following schedule:  http://www.hrsa.gov/grants/manage/technicalassistance/federalfinancialreport/ffrschedule.pdf.  A final report is due within 90 days after the project period ends. If applicable, the awardee must submit a Tangible Personal Property Report (SF-428) and any related forms within 90 days after the project period ends. New awards (“Type 1”) issued under this funding opportunity announcement are subject to the reporting requirements of the Federal Funding Accountability and Transparency Act (FFATA) of 2006 (Pub. L. 109–282), as amended by section 6202 of Public Law 110–252, and implemented by 2 CFR Part 170. Grant and cooperative agreement recipients must report information for each first-tier subaward of $25,000 or more in federal funds and executive total compensation for the recipient’s and subrecipient’s five most highly compensated executives as outlined in Appendix A to 2 CFR Part 170 (FFATA details are available online at http://www.hrsa.gov/grants/ffata.html). Competing continuation awardees, etc. may be subject to this requirement and will be so notified in the Notice of Award"
          }, {"code": "expenditure", "isSelected": false, "description": ""}, {
            "code": "performanceMonitoring",
            "isSelected": false,
            "description": ""
          }],
          "documents": {
            "description": "This program is subject to the provisions of 45 CFR Part 92 for State, local and tribal governments and 45 CFR Part 74 for institutions of higher education, hospitals, other nonprofit organizations and commercial organizations, as applicable. HRSA awards are subject to the requirements of the HHS Grants Policy Statement (HHS GPS) that are applicable based on recipient type and purpose of award.  The HHS GPS is available at http://www.hrsa.gov/grants.",
            "isApplicable": true
          },
          "CFR200Requirements": {
            "questions": [{"code": "subpartB", "isSelected": false}, {
              "code": "subpartC",
              "isSelected": true
            }, {"code": "subpartD", "isSelected": false}, {"code": "subpartE", "isSelected": true}, {
              "code": "subpartF",
              "isSelected": true
            }],
            "description": "Application materials are provided to organizations that were specifically earmarked in the Appropriation Bill or Conference Report, based upon information in HRSA's annual appropriation."
          },
          "formulaAndMatching": {
            "moe": {"description": ""},
            "types": {"moe": false, "formula": false, "matching": false},
            "formula": {"part": "", "title": "", "chapter": "", "subPart": "", "publicLaw": "", "description": ""},
            "matching": {"description": ""}
          }
        },
        "fiscalYear": 2017,
        "description": "",
        "eligibility": {
          "usage": {
            "rules": {"description": "All funds awarded should be expended solely for carrying out the approved projects in accordance with the provisions of the fiscal year."},
            "loanTerms": {"description": "", "isApplicable": false},
            "restrictions": {"description": "", "isApplicable": false},
            "discretionaryFund": {"description": "", "isApplicable": false}
          },
          "applicant": {
            "types": ["0009", "0015", "0017", "0019", "0021", "0035", "0037", "0039", "0040", "0043", "0001"],
            "description": "Eligible applicants include State and local governments, including their universities and colleges, quasi- governmental agencies, federally recognized Indian Tribal Governments, Native American organizations, private universities and colleges, and private profit and nonprofit organizations.  Organizations must be specifically earmarked in the Congressional Appropriation Bill."
          },
          "limitation": {
            "awarded": "other",
            "description": "Awards are usually issued for a 3-year project period. Funds must be expended in 5 years.",
            "awardedDescription": "Grantees drawdown funds, as necessary, from the Payment Management System (PMS).  PMS is the centralized web based payment system for HHS awards.\r\n\r\n"
          },
          "beneficiary": {
            "types": ["10", "15", "16", "17", "18", "20", "4", "5", "7", "8", "9", "1"],
            "description": "Public or other entities will benefit.",
            "isSameAsApplicant": false
          },
          "documentation": {
            "description": "Applicants should review the individual HRSA funding opportunity announcement issued under this CFDA program for any required proof or certifications which must be submitted prior to or simultaneous with submission of an application package.",
            "isApplicable": true
          },
          "assistanceUsage": {"types": ["16", "1"], "description": "dfgdfg"}
        },
        "subjectTerms": ["1011", "0455", "0683", "0687", "0019015", "0019022", "0019024", "0019030", "0019035", "0025003", "0025006", "0025009", "0025010", "0029014", "0029019", "0029025"],
        "programNumber": "93.887",
        "authorizations": {
          "list": [{
            "USC": null,
            "act": {
              "part": null,
              "title": null,
              "section": null,
              "description": "Consolidated Appropriations Act, 2010 (P. L. 111-117)"
            },
            "statute": null,
            "publicLaw": null,
            "executiveOrder": null,
            "authorizationId": "87bb2bc51738eb7cb5ae36da1e4fe3ff",
            "authorizationTypes": {
              "USC": null,
              "act": true,
              "statute": null,
              "publicLaw": null,
              "executiveOrder": null
            },
            "parentAuthorizationId": null
          }], "description": ""
        },
        "organizationId": "100008531",
        "assistanceTypes": ["0003012"],
        "functionalCodes": ["0012008", "0001008", "0001001", "0001002", "0001003", "0001004", "0001005", "0001006", "0001007", "0002006", "0003001", "0003012", "0004001", "0007010"],
        "relatedPrograms": [],
        "alternativeNames": ["Renovation or Construction Projectsvvvv"],
        "status": "published",
        "archived": false
      },
      "id": "5ecb1237838647e7b5d6bfd6ccc3dee8"
    });
  }
};

describe('src/app/assistance-listing/assistance-listing-change-request/fal-form-change-request-action.spec.ts', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FALFormChangeRequestActionComponent],
      providers: [],
      imports: [
        SamUIKitModule,
        SamAPIKitModule,
        FormsModule,
        ReactiveFormsModule,
        AppComponentsModule,
        PipesModule,
        RouterTestingModule.withRoutes([
          { path: 'change-request', component: FALFormChangeRequestActionComponent }
        ]),
      ]
    }).overrideComponent(FALFormChangeRequestActionComponent, {
      set: {
        providers: [
          { provide: ProgramService, useValue: MockProgramService },
          { provide: ChangeRequestService, useValue:MockChangeRequestService},
          MockBackend
        ]
      }
    }).compileComponents();

    fixture = TestBed.createComponent(FALFormChangeRequestActionComponent);
    comp = fixture.componentInstance; // BannerComponent test instance

    fixture.detectChanges();
  });

  it('FALFormChangeRequestActionComponent: Should init & load data', () => {
    expect(comp.falChangeRequestActionForm).toBeDefined();
    expect(comp.buttonType).toBeDefined();
    expect(comp.buttonType).toBeDefined();
    expect(comp.pageReady).toBeDefined();
    expect(comp.pageTitle).toBeDefined();
    expect(comp.permissionType).toBeDefined();
    expect(comp.requestType).toBeDefined();
    expect(comp.requestStatus).toBeDefined();
    expect(comp.programRequest).toBeDefined();
    expect(comp.programRequestData).toBeDefined();
    expect(comp.programNumberLow).toBeDefined();
    expect(comp.programNumberHigh).toBeDefined();
    expect(comp.cfdaCode).toBeDefined();
  });
});
