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
    titleEl  = fixture.debugElement.query(By.css('.fal-program-number')); // find title element

    comp.data = {
    	programNumber: "12345",
      archive: false
    };
    fixture.detectChanges();// trigger data binding
  });

  it('should display a programNumber', () => {
	  //expect(titleEl.nativeElement.textContent).toContain("12345");
	});
});