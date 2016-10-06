import { async, inject, TestBed, fakeAsync, ComponentFixture } from '@angular/core/testing';
import { BaseRequestOptions, ConnectionBackend, Http } from '@angular/http';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
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

let fixture;
let comp;

describe('ProgramViewComponent', () => {
  beforeEach(() => {

    let MockFHService = {
        getFederalHierarchyById: (id: string, includeParentLevels: boolean, includeChildrenLevels: boolean) => {
            return Observable.of({});
        }
    };
    let MockProgramService = {
        getProgramById: (id: string) => {
            return Observable.of({});
        }
    };
    let MockDictionaryService = {
        getDictionaryById: (id: string) => {
            return Observable.of({ "functional_codes": {}});
        }
    };
    let MockHistoricalIndexService = {
        getHistoricalIndexByProgramNumber: (id: string, programNumber: string) => {
            return Observable.of({});
        }
    };
    let activatedRouteStub = {
      params: {
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
        APIService,
        { provide: Location, useClass: Location }, 
        { provide: FHService, useValue: MockFHService },
        { provide: ProgramService, useValue: MockProgramService },
        { provide: DictionaryService, useValue: MockDictionaryService },
        { provide: HistoricalIndexService, useValue: MockHistoricalIndexService },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        CapitalizePipe, 
        FilterMultiArrayObjectPipe, 
        KeysPipe, 
        AuthorizationPipe, 
        HistoricalIndexLabelPipe,
      ],
      imports: [ SamUIKitModule ]
    });

    fixture = TestBed.createComponent(ProgramViewComponent);
    comp = fixture.componentInstance; 
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


  it('should "run" a search', () => {
        let element = fixture.nativeElement;
        fixture.detectChanges();
        console.log('element, ', element)

//    fixture.detectChanges();
//    fixture.whenStable().then(() => {
//      fixture.detectChanges(); 
//      expect(comp.data.results[0].title).toBe("Dummy Result 1");
//    }); 
  });


});