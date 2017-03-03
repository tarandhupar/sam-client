import { TestBed, async } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { ExclusionsResult } from './exclusions-result.component';

var fixture;
var comp;
var titleEl;
var labelEl;
describe('ExclusionsResultComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExclusionsResult ],
      imports: [RouterTestingModule]
    });
    TestBed.compileComponents().then( ()=>{
      fixture = TestBed.createComponent(ExclusionsResult);
      comp = fixture.componentInstance;
      titleEl  = fixture.debugElement.query(By.css('.exclusion-title')); // find title element
      labelEl = fixture.debugElement.query(By.css('.usa-label'));
      comp.data = {
        name: "SAMPLE NAME",
        cageCode: "1234",
        terminationDate: null,
        isActive: true,
        address: {
          "city": "city",
          "state": "AB",
          "streetAddress": "street",
          "streetAddress2": "",
          "zip": "12345"
        },
        classification: {
          "code": "Individual",
          "value": null
        }
      };
      fixture.detectChanges();// trigger data binding
    });
  }));

  it('should display an exclusion name', () => {
    expect(titleEl.nativeElement.textContent).toContain("SAMPLE NAME");
  });
  it('should display Exclusion label', () => {
    expect(labelEl.nativeElement.textContent).toContain("Exclusion");
  });
});
