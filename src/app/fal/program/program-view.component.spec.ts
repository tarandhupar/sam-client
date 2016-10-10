import { async, inject, TestBed, fakeAsync, ComponentFixture } from '@angular/core/testing';
import { BaseRequestOptions, ConnectionBackend, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, HashLocationStrategy } from '@angular/common';

import { ProgramViewComponent } from './program-view.component';
import { APIService } from '../../common/service/api/api.service';
import { FHService } from '../../common/service/api/fh.service';
import { ProgramService } from '../services/program.service';
import { DictionaryService } from '../services/dictionary.service';
import { HistoricalIndexService } from '../services/historical-index.service';
import { KeysPipe } from '../../common/pipes/keyspipe.pipe';
import { CapitalizePipe } from '../../common/pipes/capitalize.pipe';
import { FilterMultiArrayObjectPipe } from '../../common/pipes/filter-multi-array-object.pipe';
import { AuthorizationPipe } from '../pipes/authorization.pipe';
import { HistoricalIndexLabelPipe } from '../pipes/historical-index-label.pipe';
import { SamUIKitModule } from '../../common/samuikit/samuikit.module';
import { Observable } from 'rxjs';

let comp: ProgramViewComponent;
let fixture: ComponentFixture<ProgramViewComponent>;

let MockFHService = {
  getFederalHierarchyById: (id: string, includeParentLevels: boolean, includeChildrenLevels: boolean) => {
    return Observable.of({
      elementId: "100156642",
      parentElementId: "100010393",
      _links: {
        self: {
          href: ""
        },
        parent: {
        href: ""
      },
        children: {
          href: ""
        }
      },
      name: "U.S. FISH AND WILDLIFE SERVICE",
      type: "AGENCY",
      cfdaCode: "15",
      sourceOrganizationId: "000710afb4d72c15f9fc20a83f7319d0",
      sourceParentOrganizationId: "b8765976b02cee3a384dec3de1edf2a0"
    });
  }
};
let MockProgramService = {
  getProgramById: (id: string) => {
    return Observable.of({
      "program": {
        "id":"3077ea1df409265fb4378e0e844b8811",
        "data":{"award":{"procedures":{"content":"Applications are evaluated by the FWC Program Administrator, Science Advisor, or designee, based on authorizing legislation and program goals.  Awards will be issued in a manner consistent with specific Congressional action, authorizing legislation, and/or Agency award notification and issuance procedures, 43 CFR Part12."}},"title":"Fish and Wildlife Coordination and Assistance Programs","usage":{"rules":{"content":"To fulfill the intent of Congress as specified in legislation authorizing the Agency to obligate and manage financial assistance funds; special appropriations projects; and awards for purposes consistent with the mission, expertise, and goals of the Agency."},"loanTerms":{"flag":"na"},"restrictions":{"flag":"na"},"discretionaryFund":{"flag":"na"}},"contacts":{"list":[{"zip":"20240","city":"Washington","type":"headquarter","phone":"(202) 208-3100.","state":"DC","address":"Science Advisor, Fish & Wildlife Service, Rm 3258, MIB, 1849 C Street NW\r\n","country":"US","fullName":"Office of the Director and/or "}],"local":{"flag":"none"}},"projects":{"flag":"yes","list":{"2009":{"content":{"actual":"Not available"}},"2010":{"content":{"projection":"FY10: Climate Change Initiatives, including Landscape Conservation Cooperatives "}},"2011":{"content":{"projection":"Not available"}}}},"financial":{"accounts":[{"code":"14-1611-0-4-517"}],"obligations":[{"values":{"2009":{"actual":0},"2010":{"estimate":0},"2011":{"estimate":0}},"questions":{"recovery":{"flag":"na"},"salary_or_expense":{"flag":"na"}},"additionalInfo":{"content":"New Program - Data Not Yet Available."},"assistanceType":"0003001"}],"additionalInfo":{"content":"(Estimate) $5,000 to 15M"}},"objective":"To implement: a) legislation mandating specific conservation and/or environmental project activity(ies), including, but not limited to, financial assistance funding for special appropriations projects to a designated recipient(s); and/or b) unfunded Congressional mandates, i.e., funding limited to costs associated with actual program/project implementation, not administrative costs.","postAward":{"audit":{"flag":"yes","questions":{"OMBCircularA133":{"flag":"yes"}}},"records":{"content":"Recipients will maintain records in accordance with the provisions of 43 CFR Part 12, Subpart C, \"Uniform Administrative Requirements for Grants and Cooperative Agreements to State and Local Governments” and 43 CFR Part 12, Subpart F, \"Uniform Administrative Requirements for Grants and Agreements With Institutions of Higher Education, Hospitals, and Other Nonprofit Organizations.\"  \r\n"},"reports":{"flag":"yes","list":{"cash":{"flag":"na"},"program":{"flag":"na"},"progress":{"flag":"na"},"expenditure":{"flag":"yes","content":"As specified by the authorizing legislation, Congressional action, and/or consistent with Agency reporting policy, 43 CFR Part 12.  Generally, this means monthly submission of  Progress and Financial Reports, including Standard Form (SF)-270, Request for Advance or Reimbursement and Federal Financial Reports (SF-425); at least annually or no more frequently than quarterly; and a final progress/outcomes/ accomplishments report  and SF-425 due 90 days after the end date of the award performance period."},"performanceMonitoring":{"flag":"na"}}},"documents":{"flag":"na"},"accomplishments":{"flag":"yes","list":{"2009":{"content":{"actual":"FY 09 - Data Not Yet Available       \r\n\r\n"}},"2010":{"content":{"projection":"FY 10 actual/anticipated - Data Not Yet Available       "}},"2011":{"content":{"projection":"FY 11 anticipated - Data Not Yet Available       \r\n"}}}}},"assistance":{"moe":{"flag":"na"},"formula":{"flag":"na"},"matching":{"flag":"yes","percent":"0","otherInfo":{"content":"As specified by the authorizing legislation or Congressional action."}},"limitation":{"awarded":"other","content":"As specified by the authorizing legislation or Congressional action."}},"fiscalYear":2010,"application":{"deadlines":{"appeal":{"interval":"8","otherInfo":{"content":"None"}},"renewal":{"interval":"9","otherInfo":{"content":"As specified by the authorizing legislation or Congressional action."}},"approval":{"interval":"9","otherInfo":{"content":"Applicant(s) will be notified as specified by the authorizing legislation or in a manner consistent with Agency award notification procedures, 43CFR Part12."}},"submission":{"flag":"contact"}},"procedures":{"questions":{"OMBCircularA102":{"flag":"yes"},"OMBCircularA110":{"flag":"no"}},"additionalInfo":{"content":"At a minimum, an application package must include an Application for Federal Assistance (SF-424), a description of project activity(ies), an estimated budget, and relevant and signed Assurances forms (SF 424A and SF 424B – Non-construction; or SF 424C and SF 424D – Construction)."}},"selectionCriteria":{"flag":"yes","content":"As specified by the authorizing legislation or Congressional action."}},"eligibility":{"applicant":{"types":["0003"],"additionalInfo":{"content":"Eligibility is limited to entity(ies) designated by the authorizing legislation."},"assistanceUsageTypes":["14"]},"beneficiary":{"types":["19"],"additionalInfo":{"content":"The general public benefits from the conservation and environmental efforts as identified by the authorizing legislation."}},"documentation":{"flag":"yes","content":"Applicant(s) must have financial and internal controls systems in place to manage/segregate Federal funds and report expenditures under the terms and conditions of the award(s).","questions":{"OMBCircularA87":{"flag":"no"}}}},"programNumber":"15.664","authorizations":[{"act":{"description":"Legislative authority based on U. S. Fish and Wildlife Coordination Act of 1958, 16 U.S.C. 661-666; Fish and Wildlife Act of 1956, as amended, 16 U.S.C. 742a; Fish and Wildlife Conservation Act, 16 US.C. 2901-2911; and/or specific Congressional action, generally through the annual Appropriations Act, i.e., The Department of the Interior, Environment, and Related Agencies Appropriations Act, that cites new or relevant environmental and/or conservation statutes and activities for a defined purpose consistent with the mission, expertise, and goals of the Agency."},"version":1,"authorizationId":"4a0d601e58c5611f2be6204e3cb6d76d","authorizationType":"act"}],"organizationId":"100156642","preApplication":{"coordination":{"flag":"no"}},"assistanceTypes":["0003001"],"relatedPrograms":{"flag":"na"},"alternativeNames":["FWCA Programs"],"_id":"3077ea1df409265fb4378e0e844b8811","status":"Published","archived":false},
        "parentProgramId":null,
        "latest":false,
        "fiscalYearLatest":true,
        "publishedDate":1292585293000, 
        "modifiedDate":1292585293000,
        "submittedDate":1291738815000,
        "status": {
            "code":"published",
            "value":"Published"
        },
        "archived":false
      },
      "_links":{
        "self":{
          "href":""
        }
      }
    });
  }
};
let MockDictionaryService = {
  getDictionaryById: (id: string) => {
    return Observable.of({ "assistance_type:": [
      {
        code: "B",
        elements: null,
        description: null,
        element_id: "0003001",
        value: "Cooperative Agreements"
      },
      {
        code: "B",
        elements: null,
        description: null,
        element_id: "0003002",
        value: "Cooperative Agreements (Discretionary Grants)"
      }
    ] });
  }
};
let MockHistoricalIndexService = {
  getHistoricalIndexByProgramNumber: (id: string, programNumber: string) => {
    return Observable.of([
      {"id":"6506cad09ee82324fcefb115d3ca16fa","organizationId":"100006809","fiscalYear":2005,"statusCode":null,"changeDescription":"Fresh Fruit and Vegetable Program ","reason":null,"actionType":"publish","programNumber":"10.582","index":1,"createdDate":1118016000000,"isManual":"0"},
      {"id":"d1bde1a0ceda403e91216f97a1e6089c","organizationId":"100076645","fiscalYear":2016,"statusCode":"","changeDescription":"Fresh Fruit and Vegetable Program ","reason":null,"actionType":"publish","programNumber":"10.582","index":2,"createdDate":1474244542355,"isManual":"0"}
    ]);
  }
};

let MockApiService = {
  call: () => {
    return Observable.of({});
  }
}

let activatedRouteStub = {
  params: {
    subscribe: () =>{
      return {"id": "3077ea1df409265fb4378e0e844b8811"};
//      return Observable.of({ "id": "3077ea1df409265fb4378e0e844b8811" });
    }
  }
};

describe('ProgramViewComponent', () => {
//  beforeEach(() => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProgramViewComponent,
        CapitalizePipe,
        FilterMultiArrayObjectPipe,
        KeysPipe,
        AuthorizationPipe,
        HistoricalIndexLabelPipe
      ], //declare main and subcomponents
      providers: [
       //start - Mocks HTTP provider
        BaseRequestOptions,
        MockBackend,
        {
          provide: Http, 
          useFactory: function (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        { provide: APIService, useValue: MockApiService },
        { provide: Location, useClass: Location }, 
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        CapitalizePipe, 
        FilterMultiArrayObjectPipe, 
        KeysPipe, 
        AuthorizationPipe, 
        HistoricalIndexLabelPipe,
      ],
      imports: [ SamUIKitModule ]
    }) //https://github.com/angular/angular/issues/10727
    .overrideComponent(ProgramViewComponent, {
        set: {
          providers: [
            { provide: APIService, useValue: MockApiService },
            { provide: FHService, useValue: MockFHService },
            { provide: ProgramService, useValue: MockProgramService },
            { provide: DictionaryService, useValue: MockDictionaryService },
            { provide: HistoricalIndexService, useValue: MockHistoricalIndexService },
            { provide: ActivatedRoute, useValue: activatedRouteStub },
          ]
        }
    })
    .compileComponents().then( () => {
      fixture = TestBed.createComponent(ProgramViewComponent);
      comp = fixture.componentInstance;

      // change detection triggers ngOnInit
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        // change detection updates the view
        fixture.detectChanges();
      });
    });

//    fixture = TestBed.createComponent(ProgramViewComponent);
//    comp = fixture.componentInstance; 
//    fixture.detectChanges(); // 1st change detection triggers ngOnInit
//  });
  }));

  /**
   * TODO: Fix Component Unit Test & Add CASE SCENARIOS
   */
//  it('should "run" a search', inject([SearchService],(service: SearchService) => {
//    fixture.detectChanges();
//    comp.searchService = service; //Todo: confirm correct way to make stubservice override real service for test, setting the provider statement in the configuration doesn't seem to work
//    comp.runSearch();	 
//    fixture.whenStable().then(() => { 
//      fixture.detectChanges(); 
//      expect(comp.data.results[0].title).toBe("Dummy Result 1");
//    }); 
//	}));
  
//  it('should show alert message 2', fakeAsync(() => {
//    console.log('comp21 , ', comp)
//    console.log('aDictionaries 21 ', comp.aDictionaries)
//      // change detection triggers ngOnInit
//    fixture.detectChanges();
//    console.log('comp22 , ', comp)
//    console.log('aDictionaries 21 ', comp.aDictionaries)
//    fixture.whenStable().then(() => {
//      console.log('comp23 , ', comp)
//      console.log('aDictionaries 21 ', comp.aDictionaries)
//      // change detection updates the view
//      fixture.detectChanges();
//      console.log('comp24 , ', comp)
//      console.log('aDictionaries 21 ', comp.aDictionaries)
//    });
//  }));
});