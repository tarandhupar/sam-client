import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { OpportunitiesResult } from './opportunities.component';

var fixture;
var comp;
var titleEl;
describe('OpportunitiesResultComponent', () => {  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpportunitiesResult ], 
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'search', component: OpportunitiesResult }
        ])
      ]
    });
    TestBed.compileComponents().then( ()=>{
      fixture = TestBed.createComponent(OpportunitiesResult);
      comp = fixture.componentInstance; 
      titleEl  = fixture.debugElement.query(By.css('.opportunity-title')); // find title element
      comp.data = {
        procurementTitle: "SAMPLE TITLE",
        archive:false
      };
      fixture.detectChanges();// trigger data binding
    });
  }));
  
  it('should display a title', () => {
    expect(titleEl.nativeElement.textContent).toContain("SAMPLE TITLE");
  });
});