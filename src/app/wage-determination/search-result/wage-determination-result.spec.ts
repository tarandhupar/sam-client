import { TestBed, async } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { WageDeterminationResult } from './wage-determination-result.component';

var fixture;
var comp;
var titleEl;
describe('WageDeterminationResultComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WageDeterminationResult ],
      imports: [RouterTestingModule]
    });
    TestBed.compileComponents().then( ()=>{
      fixture = TestBed.createComponent(WageDeterminationResult);
      comp = fixture.componentInstance;
      titleEl  = fixture.debugElement.query(By.css('.wage-determination-number')); // find title element
      comp.data = {
        fullReferenceNumber: "12345678",
        _type:"wdSCA",
        services: [
          {
            "code": 8,
            "value": "SAMPLE SERVICE"
          }
        ],
        constructionTypes: "CONSTRUCTION TYPES",
        isActive:true,
        location:{
         "additionalInfo": {
           "content": null
         },
          "states":[
            {
              "isStateWide": false,
              "code": "DC",
              "name": "District of Columbia",
              "counties": {
                "include": [
                  {
                    "code": 12345,
                    "value": "DC"
                  }
                ],
                "exclude": null
              }
            }
          ]
        }
      };
      fixture.detectChanges();// trigger data binding
    });
  }));

  it('should display a wage determination number', () => {
    expect(titleEl.nativeElement.textContent).toContain("12345678");
  });
});
