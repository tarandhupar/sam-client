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
        "award": {
          "procedures": {
            "content": "Grants, if appropriated funds are provided, will generally be nationally competitive and merit-based. Technical Assistance request will be prioritized based on Tribal, state, or national forestry issues such as insect, disease, catastrophic events, and economic adjustments.\r\n"
          }
        },
        "title": "Wood Utilization Assistance",
        "usage": {
          "rules": {
            "content": "Technical assistance or limited project grants to achieve long-term forest health through local enterprises that support forest management. No land acquisition or construction. "
          },
          "loanTerms": {
            "flag": "na"
          },
          "restrictions": {
            "flag": "na"
          },
          "discretionaryFund": {
            "flag": "na"
          }
        },
        "website": "http://www.na.fs.fed.us/werc/",
        "contacts": {
          "list": [
            {
              "zip": "20250",
              "city": "Washington",
              "type": "headquarter",
              "email": "melissaljenkins@fs.fed.us",
              "phone": "703-605-5346",
              "state": "DC",
              "address": "1400 Independence Ave SW",
              "country": "US",
              "fullName": "Melissa Jenkins"
            }
          ],
          "local": {
            "flag": "appendix"
          }
        },
        "projects": {
          "flag": "yes",
          "list": [
            {
              "year": "2015",
              "content": {
                "actual": "Establishment of statewide wood energy teams that are public-private partnerships setup to educate, inform, and promote the sustainable use of woody biomass for energy purposes; feasibility assessments for woody biomass energy systems; design of institutional building using cross laminated timber. "
              }
            },
            {
              "year": "2017",
              "content": {

              }
            },
            {
              "year": "2016",
              "content": {
                "projection": "Establishment of statewide wood energy and wood utilization teams; feasibility assessments for woody biomass energy systems; addressing issues related to building with wood and cross-laminated timber (CLT), such as using beetle-killed trees for CLT manufacture, assessing seismic resiliency and wind performance of CLT, and overcoming building code barriers for tall wood buildings. "
              }
            }
          ]
        },
        "financial": {
          "accounts": [
            {
              "code": "12-1115-0-1-302"
            }
          ],
          "treasury": {
            "tafs": [
              {
                "accountCode": "12-1115",
                "departmentCode": "12"
              }
            ]
          },
          "obligations": [
            {
              "values": [
                {
                  "year": "2015",
                  "actual": 9069061,
                  "estimate": 9000000
                },
                {
                  "year": "2016",
                  "estimate": 8596085
                },
                {
                  "year": "2017",
                  "estimate": 5000000
                }
              ],
              "questions": [
                {
                  "flag": "na",
                  "questionCode": "recovery"
                },
                {
                  "flag": "na",
                  "questionCode": "salary_or_expense"
                }
              ],
              "obligationId": "53889143d2c4586749b5a8af0888c051",
              "additionalInfo": {

              },
              "assistanceType": "0009"
            }
          ],
          "additionalInfo": {
            "content": "Typical awards are $50,000 to $500,000 per award.  Exceptions may be made for special circumstances."
          }
        },
        "objective": "Provide direct technical assistance  to Forest Service, state foresters, tribes, public and private organizations regarding new and emerging clean technologies   to effectively manage forests and extend the most efficient and effective economic opportunities to forest landowners. The State & Private Forestry staff provides  expertise in  science-based management decisions concerning forest products utilization, biofuels production, and woody biomass utilization that uses material removed to meet forest landowner goals. Program may include: (1) development of potential new products; (2) projects that showcase innovative uses for small diameter and low-valued hardwoods and softwoods;  (3) reducing the challenge to economic and market barriers to the use of wood (4) provide seed money and gap funding for demonstration projects and (5) facilitate the creation/expansion of harvesting/processing/transporting enterprises around wildland urban interface areas threatened by catastrophic wildfires.\r\n",
        "postAward": {
          "audit": {
            "flag": "yes",
            "content": "Grant recipients may be subject to audit by the Office of Inspector General, USDA.",
            "questions": [
              {
                "flag": "yes",
                "questionCode": "OMBCircularA133"
              }
            ]
          },
          "records": {
            "content": "Grant records will be maintained for 3 years after submission of final documents.   Technical Assistance record will be maintained for 3 years from the close of the assistance.  Government Technical Report (GTR) maybe developed to share the results of Technical Assistance collaborative efforts."
          },
          "reports": {
            "flag": "yes",
            "list": [
              {
                "flag": "yes",
                "content": "Performance reports are required, and the frequency will be negotiated between the Forest Service and recipient.",
                "reportCode": "program"
              },
              {
                "flag": "na",
                "reportCode": "cash"
              },
              {
                "flag": "na",
                "reportCode": "progress"
              },
              {
                "flag": "yes",
                "content": "Financial reporting on SF-425 is required on financial assistance ",
                "reportCode": "expenditure"
              },
              {
                "flag": "yes",
                "content": "Forest Service program managers will provide overall program monitoring.",
                "reportCode": "performanceMonitoring"
              }
            ]
          },
          "documents": {
            "flag": "na"
          },
          "accomplishments": {
            "flag": "yes",
            "list": [
              {
                "year": "2015",
                "content": {
                  "actual": "43 nationally competed grants and agreements were funded totaling approximately $9 million.",
                  "projection": " Fiscal Year 2015: 43 nationally competed grants and agreements were funded totaling approximately $9 million."
                }
              },
              {
                "year": "2017",
                "content": {

                }
              },
              {
                "year": "2016",
                "content": {
                  "projection": "42 nationally competed grants and agreements were funded totaling approximately $8.6 million."
                }
              }
            ]
          }
        },
        "assistance": {
          "moe": {
            "flag": "na"
          },
          "formula": {
            "flag": "na"
          },
          "matching": {
            "flag": "yes",
            "percent": "35",
            "additionalInfo": {
              "content": "Letters for specific request from non-profits, local, state, and Tribal governments, business, companies, corporation, (for profit), special purpose districts, (public utilities districts, fire districts, conservation districts, or port) are encouraged to demonstrate collaboration and the role this federal assistance program can leverage accomplishing local projects. Matching will be required only for financial assistance and will be stated in Request For Proposal, and in accordance with Congressional direction."
            }
          },
          "limitation": {
            "awarded": "other",
            "content": "As determined by project, no longer than 5 years on grants or cooperative agreements. Technical assistance is limited to one year unless negotiated due to tribal, state or national priorities.  ",
            "additionalInfo": {
              "content": "Payments are made based on authorization and negotiation of provisions with cooperator. "
            }
          }
        },
        "fiscalYear": 2016,
        "application": {
          "deadlines": {
            "appeal": {
              "interval": "8"
            },
            "renewal": {
              "interval": "8",
              "additionalInfo": {
                "content": "None"
              }
            },
            "approval": {
              "interval": "6",
              "additionalInfo": {
                "content": "Range of Approval/Disapproval Time: 160 days after the date of closure on a Request for Proposals or Technical Assistance."
              }
            },
            "submission": {
              "flag": "contact"
            }
          },
          "procedures": {
            "questions": [
              {
                "flag": "yes",
                "questionCode": "OMBCircularA102"
              },
              {
                "flag": "yes",
                "questionCode": "OMBCircularA110"
              }
            ],
            "additionalInfo": {
              "content": "Procedures for submitting technical assistance or grant applications can be found on www.fpl.fs.fed.us/tmu or contact the Program Manager as listed under Information Contacts. ."
            }
          },
          "selectionCriteria": {
            "flag": "yes",
            "content": "Financial grants are approved on the basis of a nationwide review and are based on technical and financial merits of the project as evaluated by a panel of Federal experts or their designees "
          }
        },
        "eligibility": {
          "applicant": {
            "types": [
              "0009",
              "0011",
              "0031",
              "0033",
              "0035"
            ],
            "additionalInfo": {
              "content": "Entities eligible include: Non-profits, local, state, and Tribal governments, business, companies, corporations (for Profit), special purpose districts, (public utilities districts, fire districts, conservation districts, or ports).  "
            },
            "assistanceUsageTypes": [
              "2"
            ]
          },
          "beneficiary": {
            "types": [
              "11",
              "14",
              "4",
              "5"
            ],
            "additionalInfo": {
              "content": "Not applicable."
            }
          },
          "documentation": {
            "flag": "yes",
            "content": "No credentials or documentation are required.",
            "questions": [
              {
                "flag": "yes",
                "questionCode": "OMBCircularA87"
              }
            ]
          }
        },
        "programNumber": "10.674",
        "authorizations": {
          "list": [
            {
              "authorizationId": "0e5d451f58ce9053ba16159c9321e8ba",
              "authorizationTypes": {
                  "act": true,
                  "executiveOrder": false,
                  "publicLaw": false,
                  "statute": false,
                  "USC": false
              },
              "act": {
                "description": "Rural Revitalization Through Forestry, Public Law 101–624,  Section (d) Rural Revitalization Technologies (1990); P.L. 108-148 title II, Section 202 (2003); P. L. 110– 234, title VII (2008); P.L. 110-246 title VII (2008); and P.L. 113-79, title VIII, Section 8201 (2014) extending the program through 2018. "
              }
            }
          ]
        },
        "organizationId": "100013241",
        "preApplication": {
          "coordination": {
            "flag": "no"
          }
        },
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
          "href": "http://10.98.29.81:82/fac/v1/programs/6671e24f7d157c9ebeaaface56cd44f9"
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

export class FilterMultiArrayObjectCustomPipe implements PipeTransform {
  transform(value: any[], data: any[], fieldName: string, isNested: boolean, nestedFieldName: string): any[] {
    // TODO: REMOVE THIS WORKAROUND & FIX MOCK SERVICE DICTIONARY
    return [{
      code: 'B',
      elements: null,
      description: null,
      element_id: '0003001',
      value: 'Cooperative Agreements',
      displayValue: 'B - Cooperative Agreements'
    }];
    // END TODO
  }
}

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
        { provide: FilterMultiArrayObjectPipe, useClass: FilterMultiArrayObjectCustomPipe },
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

  it('Should show labels for designation types', () => {
    expect(comp.dictionaries['applicant_types']).toBeDefined();
    let labelElement = fixture.debugElement.query(By.css('.designation'));
    expect(labelElement.nativeElement.innerHTML).toContain('U.S. Territories and possessions');
  });
});
