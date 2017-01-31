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

  it('should not display INACTIVE if the registration date is in the future', () => {
    comp.data.registrationExpirationDate = new Date(2030, 2, 2);
    fixture.detectChanges();// trigger data binding
    let p = fixture.debugElement.query(By.css('p'));
    expect(p.nativeElement.innerHTML).not.toContain('INACTIVE');
  });

  it('should display INACTIVE if the registration date has passed', () => {
    comp.data.registrationExpirationDate = new Date(2000, 2, 2);
    fixture.detectChanges();// trigger data binding
    let p = fixture.debugElement.query(By.css('p'));
    expect(p.nativeElement.innerHTML).toContain('INACTIVE');
  });

});
