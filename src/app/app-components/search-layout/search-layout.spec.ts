import { TestBed, async } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MockBackend } from '@angular/http/testing';
import { WrapperService, FHService } from 'api-kit';
import { BaseRequestOptions, ConnectionBackend, Http } from '@angular/http';
import { Observable } from 'rxjs';
import { SamUIKitModule } from 'ui-kit';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { SearchLayoutComponent } from './search-layout.component';

var fixture;
var comp;
var titleEl;

describe('SearchTemplateTests', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchLayoutComponent ],
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
      imports: [FormsModule,SamUIKitModule,RouterTestingModule]
    });
    TestBed.compileComponents().then( ()=>{
      fixture = TestBed.createComponent(SearchLayoutComponent);
      comp = fixture.componentInstance;
    });
  }));

  it('logo test', ()  => {
    /*
    @Input() totalPages: number;
  	@Input() currentPage: number;
    @Input() totalElements: number;
    */
    //comp.sidenavConfig = {};
    comp.totalPages = 14;
    comp.currentPage = 2;
    comp.totalElements = 140;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect( fixture.debugElement.query( By.css('.showing-results-meta') ).nativeElement.innerHTML() ).toContain(140);
    });
	});

});
