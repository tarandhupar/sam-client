import { async, inject, TestBed, fakeAsync, ComponentFixture } from '@angular/core/testing';
import { BaseRequestOptions, ConnectionBackend, Http } from '@angular/http';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { MockBackend } from '@angular/http/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { ProgramViewComponent } from './program-view.component';
//import {APIService} from '../../common/service/api/api.service';
import {FHService} from '../../common/service/api/fh.service';
import {ProgramService} from '../services/program.service';
import {DictionaryService} from '../services/dictionary.service';
import {HistoricalIndexService} from '../services/historical-index.service';
import { FilterMultiArrayObjectPipe } from '../../common/pipes/filter-multi-array-object.pipe';

TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

let fixture;

//let MockAPIService = {
//    call: (oApiParam) => {
//        return {};
//    }
//};
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

describe('ProgramViewComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProgramViewComponent],
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
//        { provide: APIService, useValue: MockAPIService},
        FilterMultiArrayObjectPipe,
        Location,
        { provide: FHService, useValue: MockFHService},
        { provide: ProgramService, useValue: MockProgramService},
        { provide: DictionaryService, useValue: MockDictionaryService},
        { provide: HistoricalIndexService, useValue: MockHistoricalIndexService },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
      imports: [ FormsModule ]
    });

    fixture = TestBed.createComponent(ProgramViewComponent);
  });

//  it('should render something', async(() => {
//    const element = this.fixture.nativeElement;
//    
//    console.log('should render something', element)
////    this.fixture.componentInstance.users = ['John'];
////    this.fixture.detectChanges();
////    expect(element.querySelectorAll('span').length).toBe(1);
//  }));

});

