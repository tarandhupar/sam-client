import { TestBed, async } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MockBackend } from '@angular/http/testing';
import { WrapperService, FHService } from 'api-kit';
import { BaseRequestOptions, ConnectionBackend, Http } from '@angular/http';
import { Observable } from 'rxjs';
import { SamUIKitModule } from 'ui-kit';

import { AgencyPickerComponent } from './agency-picker.component';

var fixture;
var comp;
var titleEl;
var fhServiceStub = {
  getOrganizationById: (id: string, includeChildrenLevels: boolean)=>{
    return Observable.of({
      _embedded:[{
          org: { elementId:"1000000", l1Name:"Test Organization", type:"DEPARTMENT" },
          _links: {
            self: {
              href: 'test'
            }
          }
        }
      ]
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
describe('AgencyPickerTests', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgencyPickerComponent ],
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
    TestBed.overrideComponent(AgencyPickerComponent, {
      set: {
        providers: [
          { provide: FHService, useValue: fhServiceStub }, { provide: WrapperService, useValue: apiServiceStub }
        ]
      }
    });
    TestBed.compileComponents().then( ()=>{
      fixture = TestBed.createComponent(AgencyPickerComponent);
      comp = fixture.componentInstance;
    });

  }));

  it('hint test', ()  => {
    comp.hint = "dummy text";
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      let nativeElement = fixture.nativeElement;
      console.log(nativeElement.querySelector('.usa-form-hint').textContent);
      expect(nativeElement.querySelector('.usa-form-hint').textContent).toEqual("dummy text");
    });
	});

  it('label test', ()  => {
    comp.label = "dummy label";
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      let nativeElement = fixture.nativeElement;
      console.log(nativeElement.querySelector('.organization-container > label').textContent);
      expect(nativeElement.querySelector('.organization-container > label').textContent).toEqual("dummy label");
    });
  });

});
