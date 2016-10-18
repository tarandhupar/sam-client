import { inject,ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';

import { AssistanceListingResult } from './al.component';

var fixture;
var comp;
var titleEl;
var programNumberEl;
describe('AssistanceListingResultComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
        archive: false,
        _links: {
          self:{
            href: "http://www.sam.gov"
          }
        }
      };
      fixture.detectChanges();// trigger data binding
    });
    
  }));
  
  it('should display a title', () => {
    expect(titleEl.nativeElement.textContent).toContain("ABCDEFG");	  
	});

  it('should display a programNumber', () => {
    expect(programNumberEl.nativeElement.textContent).toContain("12345");
  });

  it('should display have a FAL url', () => {
    expect(comp.printFALLink()).toEqual("http://www.sam.gov");
  });

});