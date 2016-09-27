import { inject,ComponentFixture, TestBed, async,fakeAsync } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { By }              from '@angular/platform-browser';
import { Component,DebugElement,Input,Output,OnInit,EventEmitter }    from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { Search } from './search.component';
import { SearchService } from '../common/service/search.service';
import { AssistanceListingResult } from './assistance_listings/al.component';
import { OpportunitiesResult } from './opportunities/opportunities.component';
import { FHInputComponent } from './fh.component';
import { FHService } from '../fal/services/fh.service';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { APIService } from '../common/service/api.service';
import { BaseRequestOptions, ConnectionBackend, Http, HttpModule } from '@angular/http';

//dummy child components
@Component({selector: 'fh-input',template:''})
class EmptyFHInputComponent{
}
@Component({selector: 'opportunities-result',template:''})
class EmptyOpportunitiesComponent{
  @Input() data: any;
}
@Component({selector: 'assistance-listing-result',template:''})
class EmptyAssistanceListingResultComponent{
  @Input() data: any;
}

var fixture;
var comp;
//dummy providers
var searchServiceStub = {
  runSearch: (obj)=>{
    return Observable.of({
      _embedded: {
        results: [{
          _type:"CFDA",
          title:"Dummy Result 1"
        },{
          _type:"FBO",
          procurementTitle:"Dummy Result 2"
        }],
      },
      page: {
        size:10,
        totalElements: 123,
        totalPages: 123,
        number: 0
      }
    });
  }
};
//todo: move stub into a common place for all unit tests to use
var apiServiceStub = {
  call: (oApiParam)=>{
    return {};
  }
}
var activatedRouteStub = {
  queryParams: {
     subscribe: () =>{
       return {};
     }
  }
};
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
describe('SearchComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Search,OpportunitiesResult,AssistanceListingResult,FHInputComponent ], //declare main and subcomponents
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
        //end
        {
          provide: SearchService, //override search service
          useValue: searchServiceStub
        },
        {
          provide: ActivatedRoute, //override activatedRoute
          useValue: activatedRouteStub
        },
        { provide: APIService, //override APIservice
          useValue: apiServiceStub
        }],
      imports: [FormsModule]//needed if template has form directives
    });
    //override sub-components
    TestBed.overrideComponent(FHInputComponent,{set: {'template': '',providers:[{provide: FHService, useValue: fhServiceStub }]}});
    TestBed.overrideComponent(OpportunitiesResult,EmptyOpportunitiesComponent);
    TestBed.overrideComponent(AssistanceListingResult,EmptyAssistanceListingResultComponent);
    //final compile
    TestBed.compileComponents().then( ()=>{
      //create main component
      fixture = TestBed.createComponent(Search);
      comp = fixture.componentInstance; 
      comp.searchService = fixture.debugElement.injector.get(SearchService);
      comp.data= [{},{}];
      fixture.detectChanges();// trigger data binding
    });
    
  }));
  
  it('should "run" a search', inject([SearchService],(service: SearchService) => {
    fixture.detectChanges();
    comp.searchService = service; //Todo: confirm correct way to make stubservice override real service for test, setting the provider statement in the configuration doesn't seem to work
    comp.runSearch();	 
    fixture.whenStable().then(() => { 
      fixture.detectChanges(); 
      expect(comp.data.results[0].title).toBe("Dummy Result 1");
    }); 
	}));

});