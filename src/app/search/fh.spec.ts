import { inject,ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FHService } from '../../api-kit/fh/fh.service';
import { MockBackend } from '@angular/http/testing';
import { WrapperService } from '../../api-kit/wrapper/wrapper.service';
import { BaseRequestOptions, ConnectionBackend, Http, HttpModule } from '@angular/http';
import { Observable } from 'rxjs';
import { SamUIKitModule } from '../../ui-kit/ui-kit.module';

import { FHInputComponent } from './fh.component';

var fixture;
var comp;
var titleEl;
var fhServiceStub = {
  getFederalHierarchyById: (id: string, includeParentLevels: boolean, includeChildrenLevels: boolean)=>{
    return Observable.of({
      _embedded:{
        hierarchy: [{elementId:"1000000",name:"Test Organization",type:"DEPARTMENT"}]
      },
      _links: {
        self: {
          href: 'test'
        },
        search: {
          href: 'test'
        }
      }
    });
  }
};
var apiServiceStub = {
  call: (oApiParam)=>{
    return {};
  }
};
var activatedRouteStub = {
  queryParams: {
    subscribe: () =>{
      return {};
    }
  }
};
describe('FederalHierarchyInput', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FHInputComponent ],
      providers: [//start - Mocks HTTP provider
        BaseRequestOptions,
        MockBackend,
        {
          provide: Http,
          useFactory: function (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        //end
        {
          provide: WrapperService, //override APIservice
          useValue: apiServiceStub
        },
        {
          provide: FHService,
          useValue: fhServiceStub
        },
        {
          provide: ActivatedRoute, //override activatedRoute
          useValue: activatedRouteStub
        },
      ],
      imports: [FormsModule,SamUIKitModule]
    });
    TestBed.overrideComponent(FHInputComponent, {
      set: {
        providers: [
          { provide: FHService, useValue: fhServiceStub }, { provide: WrapperService, useValue: apiServiceStub }
        ]
      }
    });
    TestBed.compileComponents().then( ()=>{
      fixture = TestBed.createComponent(FHInputComponent);
      comp = fixture.componentInstance;
      fixture.detectChanges();
    });

  }));

  it('sample test', ()  => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect("ABCDEFG").toEqual("ABCDEFG");
    });
	});
});
