/**
 * Created by prashant.pillai on 4/20/17.
 */
import { TestBed, async } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { SamUIKitModule } from 'sam-ui-kit';
import {RegionalOfficeListingResult} from "./regional-office-listing-result.component";

var fixture;
var comp;
var titleEl;
var regionEl;
describe('RegionalOfficeListingResultComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule,SamUIKitModule],
      declarations: [ RegionalOfficeListingResult ],
    });
    TestBed.compileComponents().then( ()=>{
      fixture = TestBed.createComponent(RegionalOfficeListingResult);
      comp = fixture.componentInstance;
      titleEl  = fixture.debugElement.query(By.css('.regional-office-listing-title'));// find title element
      regionEl = fixture.debugElement.query(By.css(".region-name"));
      comp.data = {
        title: "Education, Department Of",
        isActive: true,
        region: "Georgia",
        address: {
          "zip": "12345",
          "country": "",
          "streetAddress": "street",
          "city": "city",
          "streetAddress2": "",
          "state": "AB"
        }

      };
      fixture.detectChanges();// trigger data binding
    });

  }));

  it('should display a title', () => {
    expect(titleEl.nativeElement.textContent).toContain("Education, Department Of");
  });

  it('should display a region', () => {
    expect(regionEl.nativeElement.textContent).toContain("Georgia");
  });


  });

