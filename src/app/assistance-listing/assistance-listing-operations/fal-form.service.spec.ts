import {BaseRequestOptions, ResponseOptions, Http, Response} from '@angular/http';
import {inject, TestBed} from '@angular/core/testing';
import {MockBackend} from '@angular/http/testing';
import {WrapperService} from "../../../api-kit/wrapper/wrapper.service";
import {ProgramService} from "../../../api-kit/program/program.service";
import {DictionaryService} from "../../../api-kit/dictionary/dictionary.service";
import {FHService} from "../../../api-kit/fh/fh.service";
import {Router , ActivatedRoute} from "@angular/router";
import {FALFormService} from "./fal-form.service";
import * as Cookies from 'js-cookie';
import {RouterTestingModule} from "@angular/router/testing";
import {Observable} from "rxjs/Observable";

export class FALFormServiceStub extends FALFormService {

  getContactsList() {
    return Observable.of({});
  }

  saveFAL(programId: string, data: {}) {
    return Observable.of("");
  }

  getRelatedProgramList(programs) {
    return Observable.of({});
  }

  getFunctionalCodesDict() {
    return Observable.of({});
  }

  getSubjectTermsDict(multiTypeData) {
    return Observable.of({});
  }

  getAssistanceDict() {
    return Observable.of({});
  }

  getCriteria_Info_Dictionaries() {
    return Observable.of({});
  }

  getObligation_Info_Dictionaries() {
    return Observable.of({});
  }

  getContactDict() {
    return Observable.of({});
  }

  getOrganization(id) {
    return Observable.of({});
  }

  submitFAL(programId, data) {
    return Observable.of({});
  }

  falWFRequestTypeProgram(programId, data, workflowRequestType) {
    return Observable.of({});
  }

  getSubmitReason(programId: string) {
    return Observable.of({});
  }

  sendNotification(programId: string) {
    return Observable.of({});
  }

  getFALPermission(type?: string) {
    return Observable.of({});
  }

  getFederalHierarchyConfiguration(orgId: string) {
    return Observable.of({});
  }

  getCfdaCode(orgId) {
    return Observable.of({});
  }

  isProgramNumberUnique(programNumber, programId, organizationId) {
    return Observable.of({});
  }

  getFAL(programId: string) {
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

describe('src/app/assistance-listing/assistance-listing-operations/fal-form.service.spec.ts', () => {
  let formService: FALFormService;
  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        WrapperService,
        ProgramService,
        FALFormService,
        DictionaryService,
        BaseRequestOptions,
        FHService,
        MockBackend,
        {
          provide: Http,
        },
      ],
      imports: [
        RouterTestingModule,
      ],
    });
  });

  it('FALFormService.getFAL: should HaveBeenCalledWith to programService.getProgramById', inject([WrapperService, ProgramService, FALFormService, DictionaryService, FHService], (testService: FALFormService, wrapperService: WrapperService, programService: ProgramService, dictionaryService: DictionaryService, fHService: FHService) => {
    programService = new ProgramService(wrapperService);
    let spyData = spyOn(programService, 'getProgramById');
    formService = new FALFormService(programService, dictionaryService, fHService);
    let id = 'fee2e0e30ce63b7bc136aeff32096c1d';
    formService.getFAL(id);
    expect(spyData).toHaveBeenCalledWith(id, Cookies.get('iPlanetDirectoryPro'));
  }));

  it('FALFormService.getContactsList: should HaveBeenCalledWith to programService.getContacts', inject([WrapperService, ProgramService, FALFormService, DictionaryService, FHService], (testService: FALFormService, wrapperService: WrapperService, programService: ProgramService, dictionaryService: DictionaryService, fHService: FHService) => {
    programService = new ProgramService(wrapperService);
    let spyData = spyOn(programService, 'getContacts');
    formService = new FALFormService(programService, dictionaryService, fHService);
    formService.getContactsList();
    expect(spyData).toHaveBeenCalledWith(Cookies.get('iPlanetDirectoryPro'));
  }));
  it('FALFormService.saveFAL: should HaveBeenCalledWith to programService.saveProgram update', inject([WrapperService, ProgramService, FALFormService, DictionaryService, FHService], (testService: FALFormService, wrapperService: WrapperService, programService: ProgramService, dictionaryService: DictionaryService, fHService: FHService) => {
    programService = new ProgramService(wrapperService);
    let spyData = spyOn(programService, 'saveProgram');
    formService = new FALFormService(programService, dictionaryService, fHService);
    let id = null;
    let data = {
      "data": {
        "title": "Test pub 1",
        "projects": {
          "list": [],
          "isApplicable": true
        },
        "financial": {
          "accounts": [
            {
              "code": "12-3131-3-3-231",
              "description": "asdasd"
            }
          ],
          "treasury": {
            "tafs": [
              {
                "fy1": null,
                "fy2": null,
                "accountCode": "1234",
                "departmentCode": "12",
                "subAccountCode": "123",
                "allocationTransferAgency": "12"
              }
            ]
          },
          "description": "sdsds",
          "obligations": [
            {
              "values": [
                {
                  "year": 2016,
                  "actual": 1232
                },
                {
                  "year": 2017,
                  "estimate": 23213
                },
                {
                  "year": 2018,
                  "estimate": 12321
                }
              ],
              "description": "sdsda",
              "obligationId": null,
              "isRecoveryAct": true,
              "assistanceType": null
            }
          ],
          "accomplishments": {
            "list": [
              {
                "fiscalYear": 2017,
                "description": "asdsads"
              },
              {
                "fiscalYear": 2018,
                "description": "sdsds"
              }
            ],
            "isApplicable": true
          }
        },
        "objective": "sds",
        "assistance": {
          "appeal": {
            "interval": "2"
          },
          "renewal": {
            "interval": "2"
          },
          "approval": {
            "interval": "1"
          },
          "deadlines": {
            "flag": "no"
          },
          "awardProcedure": {
            "description": "sdfdsf"
          },
          "selectionCriteria": {},
          "applicationProcedure": {},
          "preApplicationCoordination": {
            "environmentalImpact": {
              "reports": []
            }
          }
        },
        "compliance": {
          "audit": {
            "description": "",
            "isApplicable": true
          },
          "records": {
            "description": ""
          },
          "reports": [
            {
              "code": "program",
              "isSelected": false,
              "description": ""
            },
            {
              "code": "cash",
              "isSelected": false,
              "description": ""
            },
            {
              "code": "progress",
              "isSelected": false,
              "description": ""
            },
            {
              "code": "expenditure",
              "isSelected": false,
              "description": ""
            },
            {
              "code": "performanceMonitoring",
              "isSelected": false,
              "description": ""
            }
          ],
          "documents": {
            "description": "",
            "isApplicable": true
          },
          "CFR200Requirements": {
            "questions": [
              {
                "code": "subpartB",
                "isSelected": true
              },
              {
                "code": "subpartC",
                "isSelected": false
              },
              {
                "code": "subpartD",
                "isSelected": false
              },
              {
                "code": "subpartE",
                "isSelected": false
              },
              {
                "code": "subpartF",
                "isSelected": false
              }
            ],
            "description": ""
          },
          "formulaAndMatching": {
            "moe": {
              "description": ""
            },
            "types": {
              "moe": false,
              "formula": false,
              "matching": false
            },
            "formula": {
              "part": "",
              "title": "",
              "chapter": "",
              "subPart": "",
              "publicLaw": "",
              "description": ""
            },
            "matching": {
              "description": ""
            }
          }
        },
        "fiscalYear": 2017,
        "description": "ssdfsdf",
        "eligibility": {
          "usage": {
            "loanTerms": {
              "description": "12",
              "isApplicable": true
            },
            "restrictions": {
              "description": "sd",
              "isApplicable": true
            },
            "discretionaryFund": {
              "description": "12",
              "isApplicable": true
            }
          },
          "applicant": {
            "types": [
              "0001"
            ]
          },
          "limitation": {
            "awarded": "quarterly",
            "description": "qwdsd"
          },
          "beneficiary": {
            "types": [
              "2"
            ],
            "isSameAsApplicant": false
          },
          "documentation": {
            "description": "sdfsdf",
            "isApplicable": true
          },
          "assistanceUsage": {
            "types": [
              "1"
            ],
            "description": "sdsd"
          }
        },
        "subjectTerms": [
          "0031003"
        ],
        "programNumber": "230",
        "authorizations": {
          "list": [
            {
              "USC": null,
              "act": {
                "part": "asd",
                "title": "asds",
                "section": "asdasds",
                "description": null
              },
              "statute": null,
              "publicLaw": null,
              "executiveOrder": null,
              "authorizationId": "8e301a50b92d9ce39eb5874a61e73dc9",
              "authorizationTypes": {
                "USC": null,
                "act": true,
                "statute": null,
                "publicLaw": null,
                "executiveOrder": null
              },
              "parentAuthorizationId": null
            }
          ],
          "description": "sadsd"
        },
        "organizationId": "100004222",
        "functionalCodes": [
          "0003002"
        ],
        "relatedPrograms": [],
        "alternativeNames": [
          "Test pub 1  rev 1"
        ]
      },
      "parentProgramId": "f685399be984475885e3be8c6f740a5a",
      "latest": true,
      "revision": true,
      "fiscalYearLatest": true,
      "publishedDate": null,
      "modifiedDate": 1502680841287,
      "submittedDate": 1498829622361,
      "autoPublishDate": null,
      "status": {
        "code": "draft",
        "value": "Draft"
      },
      "archived": false,
      "additionalProperty": null,
      "additionalInfo": {
        "sections": [
          {
            "id": "header-information",
            "status": "updated"
          },
          {
            "id": "overview",
            "status": "updated"
          },
          {
            "id": "authorization",
            "status": "updated"
          },
          {
            "id": "financial-information-obligations",
            "status": "updated"
          },
          {
            "id": "financial-information-other",
            "status": "updated"
          },
          {
            "id": "criteria-information",
            "status": "updated"
          },
          {
            "id": "applying-for-assistance",
            "status": "updated"
          },
          {
            "id": "compliance-requirements",
            "status": "updated"
          },
          {
            "id": "contact-information",
            "status": "updated"
          }
        ]
      }
    }
    formService.saveFAL(id, data);
    expect(spyData).toHaveBeenCalledWith(id, data, Cookies.get('iPlanetDirectoryPro'));
  }));

  it('FALFormService.saveFAL: should HaveBeenCalledWith to programService.saveProgram update', inject([WrapperService, ProgramService, FALFormService, DictionaryService, FHService], (testService: FALFormService, wrapperService: WrapperService, programService: ProgramService, dictionaryService: DictionaryService, fHService: FHService) => {
    programService = new ProgramService(wrapperService);
    let spyData = spyOn(programService, 'saveProgram');
    formService = new FALFormService(programService, dictionaryService, fHService);
    let id = 'fee2e0e30ce63b7bc136aeff32096c1d';
    let data = {
      "data": {
        "title": "Test pub 1",
        "projects": {
          "list": [],
          "isApplicable": true
        },
        "financial": {
          "accounts": [
            {
              "code": "12-3131-3-3-231",
              "description": "asdasd"
            }
          ],
          "treasury": {
            "tafs": [
              {
                "fy1": null,
                "fy2": null,
                "accountCode": "1234",
                "departmentCode": "12",
                "subAccountCode": "123",
                "allocationTransferAgency": "12"
              }
            ]
          },
          "description": "sdsds",
          "obligations": [
            {
              "values": [
                {
                  "year": 2016,
                  "actual": 1232
                },
                {
                  "year": 2017,
                  "estimate": 23213
                },
                {
                  "year": 2018,
                  "estimate": 12321
                }
              ],
              "description": "sdsda",
              "obligationId": null,
              "isRecoveryAct": true,
              "assistanceType": null
            }
          ],
          "accomplishments": {
            "list": [
              {
                "fiscalYear": 2017,
                "description": "asdsads"
              },
              {
                "fiscalYear": 2018,
                "description": "sdsds"
              }
            ],
            "isApplicable": true
          }
        },
        "objective": "sds",
        "assistance": {
          "appeal": {
            "interval": "2"
          },
          "renewal": {
            "interval": "2"
          },
          "approval": {
            "interval": "1"
          },
          "deadlines": {
            "flag": "no"
          },
          "awardProcedure": {
            "description": "sdfdsf"
          },
          "selectionCriteria": {},
          "applicationProcedure": {},
          "preApplicationCoordination": {
            "environmentalImpact": {
              "reports": []
            }
          }
        },
        "compliance": {
          "audit": {
            "description": "",
            "isApplicable": true
          },
          "records": {
            "description": ""
          },
          "reports": [
            {
              "code": "program",
              "isSelected": false,
              "description": ""
            },
            {
              "code": "cash",
              "isSelected": false,
              "description": ""
            },
            {
              "code": "progress",
              "isSelected": false,
              "description": ""
            },
            {
              "code": "expenditure",
              "isSelected": false,
              "description": ""
            },
            {
              "code": "performanceMonitoring",
              "isSelected": false,
              "description": ""
            }
          ],
          "documents": {
            "description": "",
            "isApplicable": true
          },
          "CFR200Requirements": {
            "questions": [
              {
                "code": "subpartB",
                "isSelected": true
              },
              {
                "code": "subpartC",
                "isSelected": false
              },
              {
                "code": "subpartD",
                "isSelected": false
              },
              {
                "code": "subpartE",
                "isSelected": false
              },
              {
                "code": "subpartF",
                "isSelected": false
              }
            ],
            "description": ""
          },
          "formulaAndMatching": {
            "moe": {
              "description": ""
            },
            "types": {
              "moe": false,
              "formula": false,
              "matching": false
            },
            "formula": {
              "part": "",
              "title": "",
              "chapter": "",
              "subPart": "",
              "publicLaw": "",
              "description": ""
            },
            "matching": {
              "description": ""
            }
          }
        },
        "fiscalYear": 2017,
        "description": "ssdfsdf",
        "eligibility": {
          "usage": {
            "loanTerms": {
              "description": "12",
              "isApplicable": true
            },
            "restrictions": {
              "description": "sd",
              "isApplicable": true
            },
            "discretionaryFund": {
              "description": "12",
              "isApplicable": true
            }
          },
          "applicant": {
            "types": [
              "0001"
            ]
          },
          "limitation": {
            "awarded": "quarterly",
            "description": "qwdsd"
          },
          "beneficiary": {
            "types": [
              "2"
            ],
            "isSameAsApplicant": false
          },
          "documentation": {
            "description": "sdfsdf",
            "isApplicable": true
          },
          "assistanceUsage": {
            "types": [
              "1"
            ],
            "description": "sdsd"
          }
        },
        "subjectTerms": [
          "0031003"
        ],
        "programNumber": "230",
        "authorizations": {
          "list": [
            {
              "USC": null,
              "act": {
                "part": "asd",
                "title": "asds",
                "section": "asdasds",
                "description": null
              },
              "statute": null,
              "publicLaw": null,
              "executiveOrder": null,
              "authorizationId": "8e301a50b92d9ce39eb5874a61e73dc9",
              "authorizationTypes": {
                "USC": null,
                "act": true,
                "statute": null,
                "publicLaw": null,
                "executiveOrder": null
              },
              "parentAuthorizationId": null
            }
          ],
          "description": "sadsd"
        },
        "organizationId": "100004222",
        "functionalCodes": [
          "0003002"
        ],
        "relatedPrograms": [],
        "alternativeNames": [
          "Test pub 1  rev 1"
        ]
      },
      "parentProgramId": "f685399be984475885e3be8c6f740a5a",
      "latest": true,
      "revision": true,
      "fiscalYearLatest": true,
      "publishedDate": null,
      "modifiedDate": 1502680841287,
      "submittedDate": 1498829622361,
      "autoPublishDate": null,
      "status": {
        "code": "draft",
        "value": "Draft"
      },
      "archived": false,
      "additionalProperty": null,
      "additionalInfo": {
        "sections": [
          {
            "id": "header-information",
            "status": "updated"
          },
          {
            "id": "overview",
            "status": "updated"
          },
          {
            "id": "authorization",
            "status": "updated"
          },
          {
            "id": "financial-information-obligations",
            "status": "updated"
          },
          {
            "id": "financial-information-other",
            "status": "updated"
          },
          {
            "id": "criteria-information",
            "status": "updated"
          },
          {
            "id": "applying-for-assistance",
            "status": "updated"
          },
          {
            "id": "compliance-requirements",
            "status": "updated"
          },
          {
            "id": "contact-information",
            "status": "updated"
          }
        ]
      },
      "_links": {
        "self": {
          "href": "/fac/v1/programs/fee2e0e30ce63b7bc136aeff32096c1d"
        },
        "program:access": {
          "href": "/fac/v1/programs/fee2e0e30ce63b7bc136aeff32096c1d"
        },
        "program:update": {
          "href": "/fac/v1/programs/fee2e0e30ce63b7bc136aeff32096c1d/edit"
        },
        "program:delete": {
          "href": "/fac/v1/programs/fee2e0e30ce63b7bc136aeff32096c1d/delete"
        },
        "program:submit": {
          "href": "/fac/v1/programs/fee2e0e30ce63b7bc136aeff32096c1d/submit"
        }
      },
      "id": "fee2e0e30ce63b7bc136aeff32096c1d"
    }
    formService.saveFAL(id, data);
    expect(spyData).toHaveBeenCalledWith(id, data, Cookies.get('iPlanetDirectoryPro'));
  }));

  it('FALFormService.getRelatedProgramList: should HaveBeenCalledWith to programService.falautosearch', inject([WrapperService, ProgramService, FALFormService, DictionaryService, FHService], (testService: FALFormService, wrapperService: WrapperService, programService: ProgramService, dictionaryService: DictionaryService, fHService: FHService) => {
    programService = new ProgramService(wrapperService);
    let spyData = spyOn(programService, 'falautosearch');
    formService = new FALFormService(programService, dictionaryService, fHService);
    let relatedPrograms = ['7b2add7264a5d4db4458527302e36d12', 'dcde8fe82f8fb017e06bb0a45c61296c'];
    formService.getRelatedProgramList(relatedPrograms);
    expect(spyData).toHaveBeenCalledWith('', '7b2add7264a5d4db4458527302e36d12,dcde8fe82f8fb017e06bb0a45c61296c');
  }));

  it('FALFormService.getFunctionalCodesDict Not Empty: should HaveBeenCalledWith to DictionaryService.getProgramDictionaryById', inject([WrapperService, ProgramService, FALFormService, DictionaryService, FHService], (testService: FALFormService, wrapperService: WrapperService, programService: ProgramService, dictionaryService: DictionaryService, fHService: FHService) => {
    dictionaryService = new DictionaryService(wrapperService);
    let spyData = spyOn(dictionaryService, 'getProgramDictionaryById');
    formService = new FALFormService(programService, dictionaryService, fHService);
    dictionaryService.dictionaries = 'functional_codes';
    formService.filteredDictionaries = 'functional_codes';
    formService.getFunctionalCodesDict();
    expect(spyData).toHaveBeenCalledWith('functional_codes');
  }));

  it('FALFormService.getSubjectTermsDict: should HaveBeenCalledWith to DictionaryService.getProgramDictionaryById', inject([WrapperService, ProgramService, FALFormService, DictionaryService, FHService], (testService: FALFormService, wrapperService: WrapperService, programService: ProgramService, dictionaryService: DictionaryService, fHService: FHService) => {
    dictionaryService = new DictionaryService(wrapperService);
    let spyData = spyOn(dictionaryService, 'getProgramDictionaryById');
    formService = new FALFormService(programService, dictionaryService, fHService);
    let subjectTermIds = ['0115', '0487'];
    formService.getSubjectTermsDict(subjectTermIds);
    expect(spyData).toHaveBeenCalledWith('program_subject_terms', '100', '0115,0487');
  }));
  it('FALFormService.getAssistanceDict: should HaveBeenCalledWith to DictionaryService.getProgramDictionaryById', inject([WrapperService, ProgramService, FALFormService, DictionaryService, FHService], (testService: FALFormService, wrapperService: WrapperService, programService: ProgramService, dictionaryService: DictionaryService, fHService: FHService) => {
    dictionaryService = new DictionaryService(wrapperService);
    let spyData = spyOn(dictionaryService, 'getProgramDictionaryById');
    formService = new FALFormService(programService, dictionaryService, fHService);
    formService.dictionaries = ['deadline_flag', 'date_range'];
    dictionaryService.dictionaries = 'deadline_flag,date_range';
    formService.filteredDictionaries = 'deadline_flag';
    formService.getAssistanceDict();
    expect(spyData).toHaveBeenCalledWith('deadline_flag,date_range');
  }));
  it('FALFormService.getCriteria_Info_Dictionaries: should HaveBeenCalledWith to DictionaryService.getProgramDictionaryById', inject([WrapperService, ProgramService, FALFormService, DictionaryService, FHService], (testService: FALFormService, wrapperService: WrapperService, programService: ProgramService, dictionaryService: DictionaryService, fHService: FHService) => {
    dictionaryService = new DictionaryService(wrapperService);
    let spyData = spyOn(dictionaryService, 'getProgramDictionaryById');
    formService = new FALFormService(programService, dictionaryService, fHService);
    let criteriaDict = ['applicant_types', 'beneficiary_types', 'phasing_assistance', 'assistance_usage_types'];
    formService.getCriteria_Info_Dictionaries();
    expect(spyData).toHaveBeenCalledWith('applicant_types,beneficiary_types,phasing_assistance,assistance_usage_types');
  }));
  it('FALFormService.getObligation_Info_Dictionaries: should HaveBeenCalledWith to DictionaryService.getProgramDictionaryById', inject([WrapperService, ProgramService, FALFormService, DictionaryService, FHService], (testService: FALFormService, wrapperService: WrapperService, programService: ProgramService, dictionaryService: DictionaryService, fHService: FHService) => {
    dictionaryService = new DictionaryService(wrapperService);
    let spyData = spyOn(dictionaryService, 'getProgramDictionaryById');
    formService = new FALFormService(programService, dictionaryService, fHService);
    formService.getObligation_Info_Dictionaries();
    expect(spyData).toHaveBeenCalledWith('assistance_type');
  }));
  it('FALFormService.getContactDict: should HaveBeenCalledWith to DictionaryService.getProgramDictionaryById', inject([WrapperService, ProgramService, FALFormService, DictionaryService, FHService], (testService: FALFormService, wrapperService: WrapperService, programService: ProgramService, dictionaryService: DictionaryService, fHService: FHService) => {
    dictionaryService = new DictionaryService(wrapperService);
    let spyData = spyOn(dictionaryService, 'getProgramDictionaryById');
    formService = new FALFormService(programService, dictionaryService, fHService);
    let contactDict = ['states', 'countries'];
    formService.getContactDict();
    expect(spyData).toHaveBeenCalledWith('states,countries');
  }));
  it('FALFormService.submitFAL: should HaveBeenCalledWith to programService.submitProgram', inject([WrapperService, ProgramService, FALFormService, DictionaryService, FHService], (testService: FALFormService, wrapperService: WrapperService, programService: ProgramService, dictionaryService: DictionaryService, fHService: FHService) => {
    programService = new ProgramService(wrapperService);
    let spyData = spyOn(programService, 'submitProgram');
    formService = new FALFormService(programService, dictionaryService, fHService);
    formService.submitFAL('3ee89dcaa18143698b27f46b05a330f9', {});
    expect(spyData).toHaveBeenCalledWith('3ee89dcaa18143698b27f46b05a330f9', {}, Cookies.get('iPlanetDirectoryPro'));
  }));
  it('FALFormService.falWFRequestTypeProgram: should HaveBeenCalledWith to programService.falWFRequestTypeProgram', inject([WrapperService, ProgramService, FALFormService, DictionaryService, FHService], (testService: FALFormService, wrapperService: WrapperService, programService: ProgramService, dictionaryService: DictionaryService, fHService: FHService) => {
    programService = new ProgramService(wrapperService);
    let spyData = spyOn(programService, 'falWFRequestTypeProgram');
    formService = new FALFormService(programService, dictionaryService, fHService);
    let workflowRequestType = '/reject';
    formService.falWFRequestTypeProgram('3ee89dcaa18143698b27f46b05a330f9', {}, workflowRequestType);
    expect(spyData).toHaveBeenCalledWith('3ee89dcaa18143698b27f46b05a330f9', {}, Cookies.get('iPlanetDirectoryPro'), workflowRequestType);
  }));
  it('FALFormService.falWFRequestTypeProgram: should HaveBeenCalledWith to programService.falWFRequestTypeProgram', inject([WrapperService, ProgramService, FALFormService, DictionaryService, FHService], (testService: FALFormService, wrapperService: WrapperService, programService: ProgramService, dictionaryService: DictionaryService, fHService: FHService) => {
    programService = new ProgramService(wrapperService);
    let spyData = spyOn(programService, 'falWFRequestTypeProgram');
    formService = new FALFormService(programService, dictionaryService, fHService);
    let workflowRequestType = '/approve';
    formService.falWFRequestTypeProgram('3ee89dcaa18143698b27f46b05a330f9', {}, workflowRequestType);
    expect(spyData).toHaveBeenCalledWith('3ee89dcaa18143698b27f46b05a330f9', {}, Cookies.get('iPlanetDirectoryPro'), workflowRequestType);
  }));
  it('FALFormService.getSubmitReason: should HaveBeenCalledWith to programService.getReasons', inject([WrapperService, ProgramService, FALFormService, DictionaryService, FHService], (testService: FALFormService, wrapperService: WrapperService, programService: ProgramService, dictionaryService: DictionaryService, fHService: FHService) => {
    programService = new ProgramService(wrapperService);
    let spyData = spyOn(programService, 'getReasons');
    formService = new FALFormService(programService, dictionaryService, fHService);
    formService.getSubmitReason('3ee89dcaa18143698b27f46b05a330f9');
    expect(spyData).toHaveBeenCalledWith('3ee89dcaa18143698b27f46b05a330f9', Cookies.get('iPlanetDirectoryPro'));
  }));
  it('FALFormService.sendNotification: should HaveBeenCalledWith to programService.sendNotification', inject([WrapperService, ProgramService, FALFormService, DictionaryService, FHService], (testService: FALFormService, wrapperService: WrapperService, programService: ProgramService, dictionaryService: DictionaryService, fHService: FHService) => {
    programService = new ProgramService(wrapperService);
    let spyData = spyOn(programService, 'sendNotification');
    formService = new FALFormService(programService, dictionaryService, fHService);
    formService.sendNotification('3ee89dcaa18143698b27f46b05a330f9');
    expect(spyData).toHaveBeenCalledWith('3ee89dcaa18143698b27f46b05a330f9', Cookies.get('iPlanetDirectoryPro'));
  }));
/*  it('FALFormService.getFALPermission: should HaveBeenCalledWith to programService.getPermissions', inject([WrapperService, ProgramService, FALFormService, DictionaryService, FHService], (testService: FALFormService, wrapperService: WrapperService, programService: ProgramService, dictionaryService: DictionaryService, fHService: FHService) => {
    programService = new ProgramService(wrapperService);
    let spyData = spyOn(programService, 'getPermissions');
    formService = new FALFormService(programService, dictionaryService, fHService);
    formService.getFALPermission();
    expect(spyData).toHaveBeenCalledWith(Cookies.get('iPlanetDirectoryPro'));
  }));*/
  it('FALFormService.getFALPermission: should HaveBeenCalledWith to programService.getPermissions', inject([WrapperService, ProgramService, FALFormService, DictionaryService, FHService], (testService: FALFormService, wrapperService: WrapperService, programService: ProgramService, dictionaryService: DictionaryService, fHService: FHService) => {
    programService = new ProgramService(wrapperService);
    let spyData = spyOn(programService, 'getPermissions');
    formService = new FALFormService(programService, dictionaryService, fHService);
    formService.getFALPermission('ORG_LEVELS');
    expect(spyData).toHaveBeenCalledWith(Cookies.get('iPlanetDirectoryPro'), 'ORG_LEVELS');
  }));
  it('FALFormService.getFederalHierarchyConfiguration: should HaveBeenCalledWith to programService.getFederalHierarchyConfiguration', inject([WrapperService, ProgramService, FALFormService, DictionaryService, FHService], (testService: FALFormService, wrapperService: WrapperService, programService: ProgramService, dictionaryService: DictionaryService, fHService: FHService) => {
    programService = new ProgramService(wrapperService);
    let spyData = spyOn(programService, 'getFederalHierarchyConfiguration');
    formService = new FALFormService(programService, dictionaryService, fHService);
    formService.getFederalHierarchyConfiguration('100004222');
    expect(spyData).toHaveBeenCalledWith('100004222', Cookies.get('iPlanetDirectoryPro'));
  }));
  it('FALFormService.getCfdaCode: should HaveBeenCalledWith to programService.getCfdaCode', inject([WrapperService, ProgramService, FALFormService, DictionaryService, FHService], (testService: FALFormService, wrapperService: WrapperService, programService: ProgramService, dictionaryService: DictionaryService, fHService: FHService) => {
    programService = new ProgramService(wrapperService);
    let spyData = spyOn(programService, 'getCfdaCode');
    formService = new FALFormService(programService, dictionaryService, fHService);
    formService.getCfdaCode('100004222');
    expect(spyData).toHaveBeenCalledWith('100004222');
  }));
  it('FALFormService.isProgramNumberUnique: should HaveBeenCalledWith to programService.isProgramNumberUnique', inject([WrapperService, ProgramService, FALFormService, DictionaryService, FHService], (testService: FALFormService, wrapperService: WrapperService, programService: ProgramService, dictionaryService: DictionaryService, fHService: FHService) => {
    programService = new ProgramService(wrapperService);
    let spyData = spyOn(programService, 'isProgramNumberUnique');
    formService = new FALFormService(programService, dictionaryService, fHService);
    formService.isProgramNumberUnique('491', '3ee89dcaa18143698b27f46b05a330f9', '100004222');
    expect(spyData).toHaveBeenCalledWith('491', '3ee89dcaa18143698b27f46b05a330f9', Cookies.get('iPlanetDirectoryPro'), '100004222');
  }));
});
