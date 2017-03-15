import { TestBed } from '@angular/core/testing';
import { SamUIKitModule } from "ui-kit";
import { SamAPIKitModule } from "api-kit";
import { ReactiveFormsModule, FormGroup } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { Observable } from 'rxjs';
//import { ActivatedRoute } from '@angular/router';

import { ProgramPageOperations } from './assistance-listing-operations.page';
import { ProgramService } from 'api-kit';

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
        "authorizations": [
          {
            "act": {
              "description": "Rural Revitalization Through Forestry, Public Law 101–624,  Section (d) Rural Revitalization Technologies (1990); P.L. 108-148 title II, Section 202 (2003); P. L. 110– 234, title VII (2008); P.L. 110-246 title VII (2008); and P.L. 113-79, title VIII, Section 8201 (2014) extending the program through 2018. "
            },
            "version": 1,
            "authorizationId": "0e5d451f58ce9053ba16159c9321e8ba",
            "authorizationType": "act"
          }
        ],
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
        "relatedPrograms": {
          "flag": "yes",
          "relatedTo": [
            '39403d91bb81e9893cf57a2d53609a2f',
            '4fe03fb513d07749420618ff190d2ded'
          ]
        },
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
  saveProgram:(id:string = null, data: any) => {
    return (id == null? Observable.of('123'): Observable.of('b26121d95b06472e80c4a7cffe3c2cc0'));
  }

};

describe('ProgramPageOperations', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProgramPageOperations,
      ],
      providers: [
        //{ provide: ActivatedRoute, useValue: { 'params': Observable.from([{ 'id': '3077ea1df409265fb4378e0e844b8811' }]) } },
      ],
      imports: [
        RouterTestingModule,
        SamUIKitModule,
        SamAPIKitModule,
        ReactiveFormsModule,
      ]
    })
    .overrideComponent(ProgramPageOperations, {
      set: {
        providers: [
          { provide: ProgramService, useValue: MockProgramService },
        ]
      }
    }).compileComponents();

    fixture = TestBed.createComponent(ProgramPageOperations);
    component = fixture.componentInstance;
  });

  it('should compile', () => {
    expect(true).toBe(true);
  });

  it('should have a defined component', () => {
    expect(component).toBeDefined();
  });

  it('should create a `FormGroup` comprised of `FormControl`s in add mode', () => {
    component.mode = 'add';
    fixture.detectChanges();
    expect(component.programForm instanceof FormGroup).toBe(true);
  });

  it('should create a `FormGroup` comprised of `FormControl`s in edit mode', () => {
    component.mode = 'edit';
    fixture.detectChanges();
    expect(component.programForm instanceof FormGroup).toBe(true);
  });

  it('should run saveProgram in Create mode', () => {
     component.mode = 'add';
     fixture.detectChanges();
     component.saveProgram();
     expect(component.programId).toBe('123');

   });



});
