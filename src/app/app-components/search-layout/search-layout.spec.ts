import { TestBed, async } from '@angular/core/testing';
import { SamUIKitModule } from 'ui-kit';
import { By } from '@angular/platform-browser';

import { SearchLayoutComponent } from './search-layout.component';

var fixture;
var comp;

describe('Search Layout Tests', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchLayoutComponent ],
      imports: [SamUIKitModule]
    });
    TestBed.compileComponents().then( ()=>{
      fixture = TestBed.createComponent(SearchLayoutComponent);
      comp = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('logo test', ()  => {
    comp.totalPages = 14;
    comp.currentPage = 2;
    comp.totalElements = 140;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect( fixture.debugElement.query( By.css('.showing-results-meta') ).nativeElement.innerHTML ).toContain(140);
    });
	});

});
