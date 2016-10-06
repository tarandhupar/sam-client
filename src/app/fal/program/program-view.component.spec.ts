import { async, inject, TestBed, fakeAsync, ComponentFixture } from '@angular/core/testing';
import { BaseRequestOptions, ConnectionBackend, Http } from '@angular/http';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { MockBackend } from '@angular/http/testing';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

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

let fixture;
let comp;

describe('ProgramViewComponent', () => {
  beforeEach(() => {

    let MockAPIService = {
        call: (oApiParam) => {
            return {};
        }
    };
    let MockFHService = {
        getFederalHierarchyById: (id: string, includeParentLevels: boolean, includeChildrenLevels: boolean) => {
            return {};
        }
    };
    let MockProgramService = {
        getProgramById: (id: string) => {
            return {};
        }
    };
    let MockDictionaryService = {
        getDictionaryById: (id: string) => {
            return {};
        }
    };
    let MockHistoricalIndexService = {
        getHistoricalIndexByProgramNumber: (id: string, programNumber: string) => {
            return {};
        }
    };
    let activatedRouteStub = {
      queryParams: {
         subscribe: () =>{
           return {};
         }
      }
    };

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
        { provide: APIService, useValue: MockAPIService },
        { provide: Location, useClass: Location }, 
        { provide: FHService, useValue: MockFHService },
        { provide: ProgramService, useValue: MockProgramService },
        { provide: DictionaryService, useValue: MockDictionaryService },
        { provide: HistoricalIndexService, useValue: MockHistoricalIndexService },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
      imports: [ SamUIKitModule ]
    });

    fixture = TestBed.createComponent(ProgramViewComponent);
    comp = fixture.componentInstance; 

    //final compile
//    TestBed.compileComponents().then( ()=>{
//      //create main component
//      fixture = TestBed.createComponent(ProgramViewComponent);
//      comp = fixture.componentInstance; 
////      comp.searchService = fixture.debugElement.injector.get(SearchService);
////      comp.data= [{},{}];
//      fixture.detectChanges();// trigger data binding
//    });
  });

//  it('should "run" a search', inject([SearchService],(service: SearchService) => {
//    fixture.detectChanges();
//    comp.searchService = service; //Todo: confirm correct way to make stubservice override real service for test, setting the provider statement in the configuration doesn't seem to work
//    comp.runSearch();	 
//    fixture.whenStable().then(() => { 
//      fixture.detectChanges(); 
//      expect(comp.data.results[0].title).toBe("Dummy Result 1");
//    }); 
//	}));


  it('should "run" a search', inject([Location, HistoricalIndexService, ProgramService, FHService, DictionaryService, FilterMultiArrayObjectPipe], 
//  it('should "run" a search', inject([ActivatedRoute, Location, HistoricalIndexService, ProgramService, FHService, DictionaryService, FilterMultiArrayObjectPipe], 
      (location:Location, oHistoricalIndexService: HistoricalIndexService, oProgramService:ProgramService, oFHService:FHService, oDictionaryService:DictionaryService, FilterMultiArrayObjectPipe: FilterMultiArrayObjectPipe) => {
        let element = fixture.nativeElement;
        fixture.detectChanges();
        console.log('element, ', element)

//    fixture.detectChanges();
//    fixture.whenStable().then(() => {
//      fixture.detectChanges(); 
//      expect(comp.data.results[0].title).toBe("Dummy Result 1");
//    }); 
  }));

//  it('should render list', async(() => {
//    const element = fixture.nativeElement;
//    fixture.detectChanges();
//    console.log('element, ', element)
////    expect(element.querySelectorAll('span').length).toBe(2);
//  }));

});