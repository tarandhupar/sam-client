import { TestBed, ComponentFixture } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, HashLocationStrategy, CommonModule } from '@angular/common';
import { PipeTransform } from '@angular/core';
import { By } from '@angular/platform-browser';

import { ProgramPage } from './assistance-listing.page';
import { FHService, ProgramService, DictionaryService, HistoricalIndexService } from 'api-kit';
import { KeysPipe } from '../app-pipes/keyspipe.pipe';
import { FilterMultiArrayObjectPipe } from '../app-pipes/filter-multi-array-object.pipe';
import { DateFormatPipe } from '../app-pipes/date-format.pipe';
import { AuthorizationPipe } from './pipes/authorization.pipe';
import { HistoricalIndexLabelPipe } from './pipes/historical-index-label.pipe';
import { SamUIKitModule } from 'sam-ui-kit';
import { Observable } from 'rxjs';
import { FinancialObligationChart } from './assistance-listing.chart';
import {RouterTestingModule} from "@angular/router/testing";

let comp: ProgramPage;
let fixture: ComponentFixture<ProgramPage>;

let MockFHService = {
  getOrganizationById: (id: string, includeChildrenLevels: boolean) => {
    return Observable.of({
      "_embedded": [
        {
          "org": {
            orgKey: "100156642",
            parentOrgKey: "100010393",
            name: 'U.S. FISH AND WILDLIFE SERVICE',
            type: 'AGENCY',
          },
          "_link": {
            "self": {
              "href": "URL"
            },
            "logo": {
              "href": "URL"
            }
          }
        }
      ]
    });
  },
  getOrganizationLogo(organizationAPI: Observable<any>, cbSuccessFn: any, cbErrorFn: any) {
    return Observable.of("");
  }
};

let MockProgramService = {
  getProgramById: (id: string) => {
    return Observable.of({
    "data": {
      "title": "Wood Utilization Assistance",
      "website": "http://www.epa.gov/owow/estuaries/",
      "contacts": {
        "local": {
          "flag": "appendix",
          "description": "Office of Ecosystem Protection, EPA, Region I, 1 Congress Street, Boston, MA 02114-2023; Telephone:(617) 918-1511. Division of Environmental"
        },
        "headquarters": [
          {
            "zip": "20460",
            "city": "Washington",
            "email": "smith.bernicel@epa.gov",
            "phone": "(202) 566-1244.",
            "state": "DC",
            "title": "Chief",
            "country": "US",
            "fullName": "Bernice L. Smith,",
            "contactId": "7dca7ac9ed0fb728ed2bfe960409ae23",
            "streetAddress": "Coastal Management Branch (4504T), Oceans and Coastal Protection Division,\r\nOffice of Wetlands, Oceans, and Watersheds, EPA"
          }
        ]
      },
      "projects": {
        "list": [
          {
            "fiscalYear": 2012,
            "description": "Assistance agreements awarded to States, interstate agencies, academic institutions and other nonprofit organizations to"
          },
          {
            "fiscalYear": 2011,
            "description": "Assistance agreements awarded to States, interstate agencies, academic institutions and other nonprofit organizations to: (1) conduct water quality monitoring and assessment; (2) protect and restore habitat and living resources by implementing local stormwater "
          }
        ],
        "isApplicable": true
      },
      "financial": {
        "accounts": [
          {
            "code": "68-0108-0-1-304"
          }
        ],
        "treasury": {
          "tafs": [
            {
              "accountCode": "68-0108",
              "departmentCode": "68"
            }
          ]
        },
        "description": "For FY 11, each of the NEPs received base funding in the amount of $600,000. For FY 12, each of the NEPs will receive base funding in the amount of $600,000. ",
        "obligations": [
          {
            "values": [
              {
                "year": 2011,
                "actual": 20326100,
                "estimate": 27233000
              },
              {
                "year": 2013,
                "estimate": 16800000
              },
              {
                "year": 2012,
                "estimate": 16773400
              }
            ],
            "obligationId": "d08f2427c93d061ce188572782459cc8",
            "isRecoveryAct": false,
            "assistanceType": "0003003"
          }
        ],
        "accomplishments": {
          "list": [
            {
              "fiscalYear": 2012,
              "description": "In FY 12, grants will support the NEP's CCMP implementation by funding NEP efforts that include: protecting and restoring "
            },
            {
              "fiscalYear": 2011,
              "description": "In FY 11, grants will support the NEPs CCMP implementation by funding NEP efforts that include: protecting and restoring up "
            }
          ],
          "isApplicable": true
        },
        "isFundedCurrentFY": false
      },
      "objective": "The National Estuary Program (NEP) goal is to protect and restore the water quality and estuarine resources of estuaries and . ",
      "assistance": {
        "appeal": {
          "interval": "9",
          "description": "Assistance agreement competition-related disputes will be resolved in accordance with the dispute resolution procedures published in 70 FR (Federal Register) 3629, 3630 (January 26, 2005). Copies of these procedures may also be requested by contacting the individual(s) listed as \"Information Contacts.\" Disputes relating to matters other than the competitive selection of recipients will be resolved under 40 CFR 30.63 or 40 CFR 31.70, as applicable. "
        },
        "renewal": {
          "interval": "9",
          "description": "Renewals are subject to approval of the individual estuary management organization. Contact the appropriate EPA Regional office for guidance."
        },
        "approval": {
          "interval": "9",
          "description": "Approximately 90 days after deadline for application submission."
        },
        "deadlines": {
          "flag": "contact"
        },
        "awardProcedure": {
          "description": "Each application is reviewed by EPA Regional Offices to determine the adequacy of the application under grant regulations and National Estuary Program objectives, including technical merit and relevance of the project. Awards are issued by the EPA Regional Offices after approval by the appropriate Division Director. For competitive awards, EPA will review and evaluate applications, proposals, and/or submissions in accordance with the terms, conditions, and criteria stated in the competitive announcement. Competitions will be conducted in accordance with EPA policies/regulations for competing assistance agreements.\r\n"
        },
        "selectionCriteria": {
          "description": "The evaluation and selection criteria for competitive awards under this CFDA description will be described in the competitive announcement. Grants are awarded to the NEPs that satisfy the requirements outlined in the application procedure section. ",
          "isApplicable": true
        },
        "applicationProcedure": {
          "description": "The standard application forms, as furnished by the Federal agency and required by OMB Circular No. A-102, must be used for ",
          "isApplicable": true
        },
        "preApplicationCoordination": {
          "description": "Preapplication assistance may be obtained from the appropriate EPA Regional Office. Regarding pre-application/pre-proposal  ",
          "isApplicable": true,
          "environmentalImpact": {
            "reports": [
              {
                "isSelected": false,
                "reportCode": "statement"
              },
              {
                "isSelected": false,
                "reportCode": "assessment"
              },
              {
                "isSelected": true,
                "reportCode": "ExecutiveOrder12372"
              }
            ]
          }
        }
      },
      "compliance": {
        "audit": {
          "description": "Grants and cooperative agreements are subject to inspections and audits by the Comptroller General of the United States, the ",
          "isApplicable": true
        },
        "records": {
          "description": "Financial records, including all documents to support entries on accounting records and to substantiate changes to each grant, "
        },
        "reports": [
          {
            "code": "program",
            "isSelected": true,
            "description": "EPA includes reporting requirements for grants and cooperative agreements in the terms and conditions of the agreements and "
          },
          {
            "code": "cash",
            "isSelected": true,
            "description": "Cash reports are required under this program.\r\n"
          },
          {
            "code": "progress",
            "isSelected": true,
            "description": "Progress reports are required under this program.\r\n"
          },
          {
            "code": "expenditure",
            "isSelected": true,
            "description": "Expenditure reports are required under this program.\r\n"
          },
          {
            "code": "performanceMonitoring",
            "isSelected": true,
            "description": "Performance monitoring is required under this program. "
          }
        ],
        "documents": {
          "description": "General Grant Regulations and Procedures (40 CFR 30 and 40 CFR 31). Federal Register, Vol. 59, 61124, November 29, 1994,  ",
          "isApplicable": true
        },
        "CFR200Requirements": {
          "questions": [
            {
              "code": "subpartB",
              "isSelected": false
            },
            {
              "code": "subpartC",
              "isSelected": true
            },
            {
              "code": "subpartD",
              "isSelected": false
            },
            {
              "code": "subpartE",
              "isSelected": true
            },
            {
              "code": "subpartF",
              "isSelected": true
            }
          ],
          "description": "The standard application forms, as furnished by the Federal agency and required by OMB Circular No. A-102, must be used for  "
        },
        "formulaAndMatching": {
          "types": {
            "moe": false,
            "formua": false,
            "matching": true
          },
          "matching": {
            "percent": "0",
            "description": "Public Law 106-457, which amended Section 320(g) of the Water Quality Act of 1987, limits the amount of grants to 75 percent  ",
            "requirementFlag": "voluntary"
          }
        }
      },
      "fiscalYear": 2012,
      "eligibility": {
        "usage": {
          "rules": {
            "description": "Section 320 authorizes issuance of assistance agreements used to meet Section 320 requirements to develop and implement CCMPs. "
          }
        },
        "applicant": {
          "types": [
            "0005",
            "0009",
            "0015",
            "0025",
            "0035"
          ],
          "description": "Assistance agreements are issued only to those estuaries designated by the Administrator. The Administrator is authorized to "
        },
        "limitation": {
          "awarded": "other",
          "description": "Assistance agreements are typically funded on a 12-month basis (yearly). Project period may cover up to 36 months ",
          "awardedDescription": "The method of fund disbursement will be determined at the time of award. "
        },
        "beneficiary": {
          "types": [
            "19"
          ],
          "description": "Anyone/General Public.",
          "isSameAsApplicant": false
        },
        "documentation": {
          "description": "Costs will be determined in accordance with OMB Circular No. A-87 for State and local governments, OMB Circular No. A-21"
        },
        "assistanceUsage": {
          "types": [
            "14"
          ]
        }
      },
      "programNumber": "66.456",
      "authorizations": {
        "list": [
          {
            "USC": {
              "title": "33",
              "section": "466"
            },
            "act": {
              "title": "3",
              "section": "320",
              "description": "Clean Water Act"
            },
            "publicLaw": {
              "number": "117",
              "congressCode": "94"
            },
            "authorizationId": "0611fd855c9946ea9f6819c69e410c9f",
            "authorizationTypes": {
              "USC": true,
              "act": true,
              "statute": false,
              "publicLaw": true,
              "executiveOrder": false
            }
          },
          {
            "USC": {
              "title": "33",
              "section": "466"
            },
            "act": {
              "title": "3",
              "section": "320",
              "description": "Clean Water Act"
            },
            "publicLaw": {
              "number": "457",
              "congressCode": "106"
            },
            "authorizationId": "d3ba823ab274a976ec886b85da8e43bd",
            "authorizationTypes": {
              "USC": true,
              "act": true,
              "statute": false,
              "publicLaw": true,
              "executiveOrder": false
            }
          }
        ]
      },
      "organizationId": "100013241",
      "assistanceTypes": [
        "0003001",
        "0003003"
      ],
      "relatedPrograms": [
        '39403d91bb81e9893cf57a2d53609a2f',
        '4fe03fb513d07749420618ff190d2ded'
      ],
      "alternativeNames": [
          "State and Private Forestry Technology, Marketing Assistance Program"
      ]
    },
    "parentProgramId": "09d3e5c197a84300cd2c6e351a786211",
    "latest": true,
    "fiscalYearLatest": true,
    "publishedDate": 1470978048000,
    "modifiedDate": 1475589895000,
    "submittedDate": 1241197352000,
    "status": {
      "code": "published",
      "value": "Published"
    },
    "archived": false,
    "_links": {
      "self": {
        "href": "/programs/677d60d2d329d827b666946673f76aaf/view"
      }
    },
    "id": "3077ea1df409265fb4378e0e844b8811"
  });
  },
  getLatestProgramById: (id: string) => {
    //return object that has attribute 'program' -> considered as published program
    return Observable.of({
        'id':'',
        'data': {
          'programNumber': '',
        },
    });
  }
};

let MockDictionaryService = {
  getDictionaryById: (id: string) => {
    return Observable.of({ 'assistance_type:': [
      {
        code: 'B',
        elements: null,
        description: null,
        element_id: '0003001',
        value: 'Cooperative Agreements'
      },
      {
        code: 'B',
        elements: null,
        description: null,
        element_id: '0003002',
        value: 'Cooperative Agreements (Discretionary Grants)'
      }
    ],
    'applicant_types': [
      {
        code: '11',
        description: null,
        displayValue: '24 - U.S. Territories and possessions',
        element_id: '0009',
        elements: null,
        parent: null,
        value: 'U.S. Territories and possessions'
      }
    ]
    });
  }
};

let MockHistoricalIndexService = {
  getHistoricalIndexByProgramNumber: (id: string, programNumber: string) => {
    return Observable.of({
    '_embedded': {
      'historicalIndex': [
        {
          'organizationId': '100006809',
          'fiscalYear': 1965,
          'statusCode': 'B',
          'changeDescription': 'Agricultural Research Service',
          'reason': null,
          'actionType': 'publish',
          'programNumber': '10.001',
          'index': 1,
          'createdDate': 1087776000000,
          'isManual': '1',
          '_links': {
            'self': {
              'href': 'http://XYZ.XYZ/v1/historicalChange/35463abf12a7c255d8de84d5f94376dd'
            }
          },
          'id': '35463abf12a7c255d8de84d5f94376dd'
        },
        {
          'organizationId': '100006809',
          'fiscalYear': 1969,
          'statusCode': 'B',
          'changeDescription': 'Agricultural Research_Basic and Applied Research',
          'reason': null,
          'actionType': 'title',
          'programNumber': '10.001',
          'index': 2,
          'createdDate': 1087776000000,
          'isManual': '1',
          '_links': {
            'self': {
              'href': 'http://XYZ.XYZ/v1/historicalChange/ed357710efc9ac8f0511a1d50918ef42'
            }
          },
          'id': 'ed357710efc9ac8f0511a1d50918ef42'
        }
      ]
    },
    '_links': {
      'self': {
        'href': 'http://XYZ.XYZ/v1/historicalIndex/ee2e956dbb639a67bb9a43722bd63ede?programNumber=10.001'
      }
    }
  });
  }
};


describe('ProgramPage', () => {
  // TODO: Fix spies
//  var spyMockProgramService:any, spyMockApiService:any, spyMockHistoricalIndexService:any, spyMockFHService:any, spyMockDictionaryService:any;

  beforeEach(() => {
    //Create spy on mocked services
//    spyMockProgramService = jasmine.createSpyObj('MockProgramService', ['getProgramById']);
//    spyMockApiService = jasmine.createSpyObj('MockApiService', ['call']);
//    spyMockHistoricalIndexService = jasmine.createSpyObj('MockHistoricalIndexService', ['getHistoricalIndexByProgramNumber']);
//    spyMockFHService = jasmine.createSpyObj('MockFHService', ['getFederalHierarchyById']);
//    spyMockDictionaryService = jasmine.createSpyObj('MockDictionaryService', ['getDictionaryById']);
    // End TODO
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        RouterTestingModule,
        CommonModule,
        SamUIKitModule
      ],
      declarations: [
        ProgramPage,
        FilterMultiArrayObjectPipe,
        KeysPipe,
        AuthorizationPipe,
        DateFormatPipe,
        HistoricalIndexLabelPipe,
        FinancialObligationChart
      ], //declare main and subcomponents
      providers: [
       //start - Mocks HTTP provider
        BaseRequestOptions,
        MockBackend,
        {
          provide: Http,
          useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions],
        },
        { provide: Location, useClass: Location },
        { provide: ActivatedRoute, useValue: { 'params': Observable.from([{ 'id': '3077ea1df409265fb4378e0e844b8811' }]) } },
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: FilterMultiArrayObjectPipe, useClass: FilterMultiArrayObjectPipe },
        KeysPipe,
        AuthorizationPipe,
        HistoricalIndexLabelPipe,
        DateFormatPipe,
      ]
    }) // https://github.com/angular/angular/issues/10727
    .overrideComponent(ProgramPage, {
        set: {
          providers: [
            { provide: FHService, useValue: MockFHService },
            { provide: ProgramService, useValue: MockProgramService },
            { provide: DictionaryService, useValue: MockDictionaryService },
            { provide: HistoricalIndexService, useValue: MockHistoricalIndexService },
          ]
        }
    });

    fixture = TestBed.createComponent(ProgramPage);
    comp = fixture.componentInstance; // BannerComponent test instance

    fixture.detectChanges(); // 1st change detection triggers ngOnInit
  });

  it('Should init & load data', () => {
    /**
     * TODO: FIX Spies
     */
    //checking method calls
//    expect(spyMockProgramService.getProgramById).not.toHaveBeenCalled();
//    expect(spyMockApiService.call).toHaveBeenCalled();
//    expect(spyMockHistoricalIndexService.getHistoricalIndexByProgramNumber).toHaveBeenCalled();
//    expect(spyMockFHService.getFederalHierarchyById).toHaveBeenCalled();
//    expect(spyMockDictionaryService.getDictionaryById).toHaveBeenCalled();

    //checking methods calls with args
//      expect(spyMockProgramService.getProgramById).toHaveBeenCalledWith('3077ea1df409265fb4378e0e844b8811');
//      expect(spyMockHistoricalIndexService.getHistoricalIndexByProgramNumber).toHaveBeenCalledWith('3077ea1df409265fb4378e0e844b8811', '15.664');
//      expect(spyMockFHService.getFederalHierarchyById).toHaveBeenCalledWith('100156642', true, false);
//      expect(spyMockDictionaryService.getDictionaryById).toHaveBeenCalledWith([
//        'program_subject_terms',
//        'date_range',
//        'match_percent',
//        'assistance_type',
//        'applicant_types',
//        'assistance_usage_types',
//        'beneficiary_types',
//        'functional_codes'
//      ].join(','));

    expect(comp.program).toBeDefined();
    expect(comp.federalHierarchy).toBeDefined();
    expect(comp.relatedProgram).toBeDefined();
    expect(comp.historicalIndex).toBeDefined();
    expect(comp.alert).toBeDefined();
    expect(comp.dictionaries).toBeDefined();
    expect(comp.assistanceTypes).toBeDefined();

    expect(fixture.debugElement.query(By.css('#program-title')).nativeElement.innerHTML).toContain('Wood Utilization Assistance')
  });

  it('Should show the alert for updated since YYYY', () => {
    //mocked program should show the alert -> Verifying it
    expect(comp.alert.length).toBeGreaterThan(0);
    expect(fixture.debugElement.queryAll(By.css('samalert')).length).toBeGreaterThan(0);
  });

  it('Should have related FAL', () => {
    //mocked program should show the related fal -> Verifying it
    expect(comp.relatedProgram.length).toBe(2);
  });

  it('Should have assistance types', () => {
    //mocked program should show all the assistance types -> Verifying it
    expect(comp.assistanceTypes.length).toBe(2);
  });

  it('Should show labels for designation types', () => {
    expect(comp.dictionaries['applicant_types']).toBeDefined();
    let labelElement = fixture.debugElement.query(By.css('.designation'));
    expect(labelElement.nativeElement.innerHTML).toContain('U.S. Territories and possessions');
  });
});
