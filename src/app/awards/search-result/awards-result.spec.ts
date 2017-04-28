import { TestBed, async } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { AwardsResult } from './awards-result.component';

var fixture;
var comp;
var titleEl;
var labelEl;
describe('AwardsComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AwardsResult ],
      imports: [RouterTestingModule]
    });
    TestBed.compileComponents().then( ()=>{
      fixture = TestBed.createComponent(AwardsResult);
      comp = fixture.componentInstance;
      titleEl  = fixture.debugElement.query(By.css('.award-title')); // find title element
      labelEl = fixture.debugElement.query(By.css('.usa-label'));
      comp.data = {
        isActive: true,
        identifiers: [{
          "piid": "SAMPLE PIID",
          "isCurrent": true,
          "referenceModificationNumber": "",
          "referencePiid": "",
          "transactionNumber": 0,
          "organizationHierarchy": {
            "organizationId": "6800",
            "level": 2,
            "name": "ENVIRONMENTAL PROTECTION AGENCY"
          },
          "referenceOrganizationHierarchy": {
            "organizationId": "",
            "level": 2,
            "name": "0"
          },
          "modificationNumber": "1"
        }],
        purchaser: {
          "contractingOrganizationHierarchy": [{
              "organizationId": "D",
              "level": 1,
              "name": "DEPARTMENT"
            },
            {
              "organizationId": "A",
              "level": 2,
              "name": "AGENCY"
            },
            {
              "organizationId": "O",
              "level": 3,
              "name": "OFFICE"
            }]
        },
        contract: {
          "obligatedAmount": 10000,
          "signedDate": "2017-13-03T00:00:00.000-04:00"
        },
        type: "AWARD",
        vendor: {
          "globalDunsNumber": "1234",
          "globalName": "ABCD",
          "address": {
            "zip": "12345",
            "streetAddress": "street",
            "city": "city",
            "streetAddress2": "",
            "state": {
              "code": "OH",
              "name": "OHIO"
            }
          },
          "name": "EFGH",
          "dunsNumber": "5678"
        },
        productOrService: {
          "psc": [{
            "code": "1234",
            "value": ""
          }],
          "naics": {
            "code": "1234",
            "value": ""
          }
        },
        _type: "awards"
      };
    });
  }));

  it('should display Award label', () => {
    fixture.detectChanges();
    expect(labelEl.nativeElement.textContent).toContain("Award");
  });

  it('should display an award piid', () => {
    fixture.detectChanges();// trigger data binding
    expect(titleEl.nativeElement.textContent).toContain("SAMPLE PIID");
  });

});
