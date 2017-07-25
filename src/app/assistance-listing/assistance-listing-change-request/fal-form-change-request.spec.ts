import {TestBed} from "@angular/core/testing";
import {FALFormChangeRequestComponent} from "./fal-form-change-request.component";
import {SamUIKitModule} from "sam-ui-kit/index";
import {RouterTestingModule} from "@angular/router/testing";
import {ProgramService} from "../../../api-kit/program/program.service";
import {FormBuilder, ReactiveFormsModule, FormsModule} from "@angular/forms";
import {SamAPIKitModule} from "../../../api-kit/api-kit.module";
import {AppComponentsModule} from "../../app-components/app-components.module";
import {FALFormService} from "../assistance-listing-operations/fal-form.service";
import {ChangeRequestService} from "../../../api-kit/program/change-request.service";
import {Observable} from "rxjs";

var programServiceStub ={
  getCfdaCode: (orgId: string) =>{
    return Observable.of({
      "content":{
        "cfdaCode":"93",
        "orgKey":"100004222"
      },
      "_links":{
        "self":{
          "href":"https://gsaiae-dev02.reisys.com/fac/v1/programs/getCfdaCode?organizationId=100004222"
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

var falFormServiceStub = {
  getFAL: (id: string, cookie: string) => {
    return Observable.of({
      "data":{
        "title":"rk new program as coordinator",
        "website":"",
        "contacts":{
          "local":{
            "flag":"none",
            "description":""
          },
          "headquarters":[
            {
              "fax":"",
              "zip":"20201.",
              "city":"Washington",
              "email":"michelle.feagins@hhs.gov",
              "phone":"1231231231",
              "state":"DC",
              "title":"Grants Management Officer",
              "country":"US",
              "fullName":"Michelle Feagins",
              "contactId":"19f3146496b7e213845572529a7fcea7",
              "streetAddress":"200 Independence Avenue, SW\r\n"
            }
          ]
        },
        "projects":{
          "list":[

          ],
          "isApplicable":true
        },
        "financial":{
          "accounts":[
            {
              "code":"12-1231-1-3-131",
              "description":"account identification"
            }
          ],
          "treasury":{
            "tafs":[
              {
                "fy1":null,
                "fy2":null,
                "accountCode":"1231",
                "departmentCode":"12",
                "subAccountCode":null,
                "allocationTransferAgency":null
              }
            ]
          },
          "obligations":[
            {
              "values":[
                {
                  "year":2016,
                  "actual":123123119
                },
                {
                  "year":2017,
                  "estimate":123123123
                },
                {
                  "year":2018,
                  "estimate":123123213
                }
              ],
              "description":null,
              "obligationId":"7349b4023ec787886d1193026605ff04",
              "isRecoveryAct":false,
              "assistanceType":"0001002"
            }
          ],
          "accomplishments":{
            "list":[
              {
                "fiscalYear":2017,
                "description":"accomp"
              }
            ],
            "isApplicable":true
          }
        },
        "objective":"objectives",
        "assistance":{
          "appeal":{
            "interval":"3"
          },
          "renewal":{
            "interval":"1"
          },
          "approval":{
            "interval":"2"
          },
          "deadlines":{
            "flag":"yes",
            "list":[
              {
                "end":null,
                "start":"1980-12-12",
                "description":null
              }
            ]
          },
          "awardProcedure":{
            "description":"awards"
          },
          "selectionCriteria":{

          },
          "applicationProcedure":{

          },
          "preApplicationCoordination":{
            "environmentalImpact":{
              "reports":[

              ]
            }
          }
        },
        "compliance":{
          "audit":{
            "description":"audits",
            "isApplicable":true
          },
          "records":{
            "description":""
          },
          "reports":[
            {
              "code":"program",
              "isSelected":false,
              "description":""
            },
            {
              "code":"cash",
              "isSelected":false,
              "description":""
            },
            {
              "code":"progress",
              "isSelected":false,
              "description":""
            },
            {
              "code":"expenditure",
              "isSelected":false,
              "description":""
            },
            {
              "code":"performanceMonitoring",
              "isSelected":false,
              "description":""
            }
          ],
          "documents":{
            "description":"regulations",
            "isApplicable":true
          },
          "CFR200Requirements":{
            "questions":[
              {
                "code":"subpartB",
                "isSelected":false
              },
              {
                "code":"subpartC",
                "isSelected":false
              },
              {
                "code":"subpartD",
                "isSelected":false
              },
              {
                "code":"subpartE",
                "isSelected":false
              },
              {
                "code":"subpartF",
                "isSelected":false
              }
            ],
            "description":""
          },
          "formulaAndMatching":{
            "moe":{
              "description":""
            },
            "types":{
              "moe":false,
              "formula":false,
              "matching":false
            },
            "formula":{
              "part":"",
              "title":"",
              "chapter":"",
              "subPart":"",
              "publicLaw":"",
              "description":""
            },
            "matching":{
              "description":""
            }
          }
        },
        "fiscalYear":2017,
        "description":"",
        "eligibility":{
          "usage":{
            "loanTerms":{
              "description":"asdsad",
              "isApplicable":true
            },
            "restrictions":{
              "description":"asdasd",
              "isApplicable":true
            },
            "discretionaryFund":{
              "description":"asdasd",
              "isApplicable":true
            }
          },
          "applicant":{
            "types":[
              "0020"
            ]
          },
          "limitation":{
            "awarded":"lump",
            "description":"length"
          },
          "beneficiary":{
            "types":[
              "2"
            ],
            "isSameAsApplicant":false
          },
          "documentation":{
            "description":"credebtials",
            "isApplicable":true
          },
          "assistanceUsage":{
            "types":[
              "2"
            ],
            "description":"asdads"
          }
        },
        "subjectTerms":[
          "0035001"
        ],
        "programNumber":"123",
        "authorizations":{
          "list":[
            {
              "USC":{
                "title":"title",
                "section":"section"
              },
              "act":null,
              "statute":null,
              "publicLaw":null,
              "executiveOrder":null,
              "authorizationId":"b57c8bd56a21b59651913705c1675199",
              "authorizationTypes":{
                "USC":true,
                "act":null,
                "statute":null,
                "publicLaw":null,
                "executiveOrder":null
              },
              "parentAuthorizationId":null
            }
          ],
          "description":""
        },
        "organizationId":"100004222",
        "functionalCodes":[
          "0001002"
        ],
        "relatedPrograms":[

        ],
        "alternativeNames":[
          ""
        ]
      },
      "parentProgramId":null,
      "latest":true,
      "revision":false,
      "fiscalYearLatest":true,
      "publishedDate":1500332408921,
      "modifiedDate":1500332408921,
      "submittedDate":1500332408938,
      "autoPublishDate":null,
      "status":{
        "code":"published",
        "value":"Published"
      },
      "archived":false,
      "additionalProperty":null,
      "additionalInfo":null,
      "_links":{
        "self":{
          "href":"/fac/v1/programs/05e1b351323a4f00950f9e6fdace5941"
        }
      },
      "id":"05e1b351323a4f00950f9e6fdace5941"

    });
  }
};

describe('Change Request Component', () =>{
  let component: FALFormChangeRequestComponent;
  let fixture: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FALFormChangeRequestComponent],
      imports: [SamUIKitModule, AppComponentsModule, ReactiveFormsModule, FormsModule, SamAPIKitModule, RouterTestingModule],
      providers:[ProgramService, FALFormService, ChangeRequestService]
    });
    TestBed.overrideComponent(FALFormChangeRequestComponent, {
      set: {
        providers: [
          { provide: ProgramService, useValue: programServiceStub },
          { provide: FALFormService, useValue: falFormServiceStub }
        ]
      }
    });
    fixture = TestBed.createComponent(FALFormChangeRequestComponent);
    component = fixture.componentInstance;
  });

  it('should compile', function(){
    fixture.detectChanges();
    expect(true).toBe(true);
  });
});
