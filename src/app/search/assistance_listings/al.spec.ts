import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';

import { AssistanceListingResult } from './al.component';

var fixture;
var comp;
var titleEl;
describe('AssistanceListingResultComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistanceListingResult ], 
    });

    fixture = TestBed.createComponent(AssistanceListingResult);
    comp = fixture.componentInstance; 
    titleEl  = fixture.debugElement.query(By.css('.assistance-listing-title')); // find title element

    comp.data = {
    	title: "SAMPLE TITLE"
    };
    fixture.detectChanges();// trigger data binding
  });

  it('should display a title', () => {
	  expect(titleEl.nativeElement.textContent).toContain("SAMPLE TITLE");
	});
});