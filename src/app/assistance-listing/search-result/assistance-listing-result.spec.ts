import { TestBed, async } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { AssistanceListingResult } from './assistance-listing-result.component';
import { SamUIKitModule } from 'sam-ui-elements/src/ui-kit';

var fixture;
var comp;
var titleEl;
var programNumberEl;
describe('src/app/assistance-listing/search-result/assistance-listing-result.spec.ts', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule,SamUIKitModule],
      declarations: [ AssistanceListingResult ],
    });
    TestBed.compileComponents().then( ()=>{
      fixture = TestBed.createComponent(AssistanceListingResult);
      comp = fixture.componentInstance;
      titleEl  = fixture.debugElement.query(By.css('.assistance-listing-title')); // find title element
      programNumberEl = fixture.debugElement.query(By.css(".fal-program-number"));
      comp.data = {
        title: "ABCDEFG",
        programNumber: "12345",
        isActive: false,
        _links: {
          self:{
            href: "http://www.sam.gov"
          }
        }
      };
      fixture.detectChanges();// trigger data binding
    });

  }));

  it('AssistanceListingResultComponent: should display a title', () => {
    expect(titleEl.nativeElement.textContent).toContain("ABCDEFG");
	});

  it('AssistanceListingResultComponent: should display a programNumber', () => {
    expect(programNumberEl.nativeElement.textContent).toContain("12345");
  });

});
