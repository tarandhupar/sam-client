import { TestBed, async } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { EntitiesResult } from './entities-result.component';

var fixture;
var comp;
var titleEl;
describe('EntitiesResultComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntitiesResult ],
      imports: [RouterTestingModule]
    });
    TestBed.compileComponents().then( ()=>{
      fixture = TestBed.createComponent(EntitiesResult);
      comp = fixture.componentInstance;
      titleEl  = fixture.debugElement.query(By.css('.entity-title')); // find title element
      comp.data = {
        name: "SAMPLE NAME",
        isActive:true,
        address: {
          "zip": "12345",
          "streetAddress": "street",
          "city": "city",
          "streetAddress2": "",
          "state": "AB"
        }

      };
      fixture.detectChanges();// trigger data binding
    });
  }));

  it('should display an entity name', () => {
    expect(titleEl.nativeElement.textContent).toContain("SAMPLE NAME");
  });
});
