import { TestBed, async } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MockBackend } from '@angular/http/testing';
import { WrapperService, FHService } from 'api-kit';
import { BaseRequestOptions, ConnectionBackend, Http } from '@angular/http';
import { Observable } from 'rxjs';
import { SamUIKitModule } from 'ui-kit';

import { DisplayPageComponent } from './display-page.component';

var fixture;
var comp;
var titleEl;

describe('AgencyPickerTests', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayPageComponent ],
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
        //end,
      ],
      imports: [FormsModule,SamUIKitModule]
    });
    TestBed.compileComponents().then( ()=>{
      fixture = TestBed.createComponent(DisplayPageComponent);
      comp = fixture.componentInstance;
    });

  }));

  it('logo test', ()  => {
    let fakepath = "/this/is/a/fake/path.png";
    comp.sidenavConfig = {};
    comp.logoSrc = fakepath;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(comp.querySelector('.sidenav-logo').getAttribute("src")).toEqual(fakepath);
    });
	});

});
