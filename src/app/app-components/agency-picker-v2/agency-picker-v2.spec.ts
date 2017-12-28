import { TestBed, async } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MockBackend } from '@angular/http/testing';
import { WrapperService, FHService } from 'api-kit';
import { BaseRequestOptions, ConnectionBackend, Http } from '@angular/http';
import { Observable } from 'rxjs';
import { SamUIKitModule } from 'sam-ui-elements/src/ui-kit';

import { AgencyPickerV2Component } from './agency-picker-v2.component';

let fixture;
let comp;
let titleEl;
let fhServiceStub = {
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
let apiServiceStub = {
  call: (oApiParam)=>{
    return {};
  }
};

xdescribe('src/app/app-components/agency-picker/agency-picker.spec.ts', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgencyPickerV2Component ],
      providers: [
        {
          provide: WrapperService, //override APIservice
          useValue: apiServiceStub
        },
        {
          provide: FHService,
          useValue: fhServiceStub
        }
      ],
      imports: [FormsModule,SamUIKitModule]
    });
    TestBed.overrideComponent(AgencyPickerV2Component, {
      set: {
        providers: [
          { provide: FHService, useValue: fhServiceStub }, { provide: WrapperService, useValue: apiServiceStub }
        ]
      }
    });
    TestBed.compileComponents().then( ()=>{
      fixture = TestBed.createComponent(AgencyPickerV2Component);
      comp = fixture.componentInstance;
    });

  }));

  it('AgencyPickerTests: compile test', ()  => {
    expect(true).toBe(true);
  });
});
