import { TestBed, async } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { OpportunitiesResult } from './opportunities-result.component';


var titleEl;
describe('src/app/opportunity/search-result/opportunities-result.spec.ts', () => {
  let fixture:any;
  let comp: OpportunitiesResult;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ OpportunitiesResult ],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'search', component: OpportunitiesResult }
        ])
      ]
    });
    fixture = TestBed.createComponent(OpportunitiesResult);
    comp = fixture.componentInstance;

    comp.data = {
      title: "SAMPLE TITLE",
      isActive:true,
      publishDate: "2012-01-01",
      type: {
        value: "dummy"
      }
    };
    fixture.detectChanges();// trigger data binding
  });

  it('OpportunitiesResultComponent: should display a title', () => {
    fixture.detectChanges();// trigger data binding
    fixture.whenStable().then(()=>{
      titleEl  = fixture.debugElement.query(By.css('.opportunity-title')); // find title element
      expect(titleEl.nativeElement.textContent).toContain("SAMPLE TITLE");
    });
  });
});
