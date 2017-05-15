import { TestBed, async } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { OpportunitiesResult } from './opportunities-result.component';

var fixture;
var comp;
var titleEl;
describe('src/app/opportunity/search-result/opportunities-result.spec.ts', () => {
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
        title: "SAMPLE TITLE",
        isActive:true
      };
      fixture.detectChanges();// trigger data binding
    });
  }));

  it('OpportunitiesResultComponent: should display a title', () => {
    expect(titleEl.nativeElement.textContent).toContain("SAMPLE TITLE");
  });
});
