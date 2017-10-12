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
        title: "SAMPLE NAME",
        isActive:true,
        registrationExpirationDate: +new Date(2016, 2, 2),
        address: {
          "zip": "12345",
          "streetAddress": "street",
          "city": "city",
          "streetAddress2": "",
          "state": "AB"
        }

      };
    });
  }));

  it('should display an entity name', () => {
    fixture.detectChanges();// trigger data binding
    expect(titleEl.nativeElement.textContent).toContain("SAMPLE NAME");
  });

});
