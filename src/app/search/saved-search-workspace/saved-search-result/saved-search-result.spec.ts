import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { SavedSearchResult } from './saved-search-result.component';
import { SamUIKitModule } from 'sam-ui-kit';
import moment = require("moment");
import {FilterParamLabel} from "../../pipes/filter-label.pipe";
import {FilterParamValue} from "../../pipes/filter-value.pipe";

let comp: SavedSearchResult;
let fixture: ComponentFixture<SavedSearchResult>;
var titleEl;
var savedDateEl;
var parameters = [
  {label: "Active Only?", value: "true"},
  {label: "Organization", value: "FISH AND WILDLIFE"},
  {label: "Assistance Type", value: "A-Formula Grants"},
  {label: "Sort By", value: "-modifiedDate"}
];

describe('src/app/search/saved-search-workspace/saved-search-result/saved-search-result.spec.ts', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'savedsearches/workspace', component: SavedSearchResult }
        ]),
        SamUIKitModule],
      declarations: [ SavedSearchResult, FilterParamLabel, FilterParamValue],
    });
    TestBed.compileComponents().then( ()=>{
      fixture = TestBed.createComponent(SavedSearchResult);
      comp = fixture.componentInstance;
      titleEl  = fixture.debugElement.query(By.css('.saved-search-title')); // find title element
      comp.data = {
        createdOn: "2017/10/05T17:29:42+0000",
        modifiedOn: null,
        data: {
          key: "test_search",
          index: ["cfda"],
          parameters: {
            is_active: true,
            organization_id: "FISH AND WILDLIFE",
            assistance_type: "A-Formula Grants",
            sort: "-modifiedDate"
          }
        },
        numberOfUsages: 0,
        title: "Test Search",
        type: "saved_search",
        userId: "cfda.test.user@gmail.com"
      };
      fixture.detectChanges();// trigger data binding
    });

  }));

  it('SavedSearchResultComponent: should display a title', () => {
      expect(comp).toBeDefined();
      expect(titleEl.nativeElement.textContent).toContain("Test Search");
      expect(comp.data.createdOn).toEqual("2017/10/05");
      expect(comp.domain).toEqual("Assistance Listing");
      expect(comp.parameters).toEqual(parameters);
  });

});
