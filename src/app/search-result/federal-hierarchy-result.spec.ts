import { TestBed, async } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { FederalHierarchyResult } from './federal-hierarchy-result.component';

var fixture;
var comp;
var titleEl;
describe('FederalHierarchyResultComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FederalHierarchyResult ],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'search', component: FederalHierarchyResult }
        ])
      ]
    });
    TestBed.compileComponents().then( ()=>{
      fixture = TestBed.createComponent(FederalHierarchyResult);
      comp = fixture.componentInstance;
      titleEl  = fixture.debugElement.query(By.css('.federal-hierarchy-title')); // find title element
      comp.data = {
        title: "SAMPLE TITLE",
        archive:false
      };
      fixture.detectChanges();// trigger data binding
    });
  }));

  it('should display a title', () => {
    expect(titleEl.nativeElement.textContent).toContain("SAMPLE TITLE");
  });
});
