import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';

import { AssistanceListingResult } from './al.component';

var fixture;
var comp;
var titleEl;
var programNumberEl;
describe('AssistanceListingResultComponent', () => {
  /*beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistanceListingResult ], 
    });

    fixture = TestBed.createComponent(AssistanceListingResult);
    comp = fixture.componentInstance; 
    titleEl  = fixture.debugElement.query(By.css('.assistance-listing-title')); // find title element
    programNumberEl = fixture.debugElement.query(By.css((".fal-program-number"));
    comp.data = {
    	title: "ABCDEFG",
      programNumber: "12345",
      archive: false
    };
    fixture.detectChanges();// trigger data binding
  });

  it('should display a title', () => {
	  expect(titleEl.nativeElement.textContent).toContain("ABCDEFG");
	});

  it('should display a programNumber', () => {
    expect(programNumberEl.nativeElement.textContent).toContain("12345");
  });*/
});