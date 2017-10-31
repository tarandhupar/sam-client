import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { SavedSearchResult } from './saved-search-result.component';
import { SamUIKitModule } from 'sam-ui-kit';
import moment = require("moment");
import {FilterParamLabel} from "../../pipes/filter-label.pipe";
import {FilterParamValue} from "../../pipes/filter-value.pipe";
import {SavedSearchService} from "../../../../api-kit/search/saved-search.service";
import {Observable} from "rxjs/Rx";
import {BaseRequestOptions, Http} from "@angular/http";
import {MockBackend} from "@angular/http/testing";
import {SamAPIKitModule} from "../../../../api-kit/api-kit.module";
import {AlertFooterService} from "../../../app-components/alert-footer/alert-footer.service";

//other library
import * as Cookies from 'js-cookie';

let savedSearchServiceStub = {
  createSavedSearch: (authToken, obj:any) => {
    return Observable.of("12345-abcde");
  },
  getSavedSearch: (authToken, id) => {
    return Observable.of({
      createdOn: "2017-10-05T16:58:28Z",
      lastUsageDate: "2017-10-05T16:58:28Z",
      modifiedOn: null,
      data: {
        key: "test_search",
        index: ["cfda"],
        parameters: {
          is_active: true,
          organization_id: "1",
          assistance_type: "1000101",
          sort: "-modifiedDate"
        }
      },
      numberOfUsages: 0,
      title: "Test Search",
      type: "saved_search",
      preferenceId: "abcde-12345",
      userId: "cfda.test.user@gmail.com"
    })
  },
  updateSavedSearch: (authToken, id, obj:any) => {
    return Observable.of(null);
  },
  deleteSavedSearch: (authToken, id) => {
    return Observable.of(null);
  }
};

let comp: SavedSearchResult;
let fixture: ComponentFixture<SavedSearchResult>;
var titleEl;
var parameters = [
  {label: "Active Only?", value: "true"},
  {label: "Organization", value: "FISH AND WILDLIFE"},
  {label: "Assistance Type", value: "A-Formula Grants"},
  {label: "Sort By", value: "-modifiedDate"}
];

describe('src/app/search/saved-search-workspace/saved-search-result/saved-search-result.spec.ts', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'savedsearches/workspace', component: SavedSearchResult }
        ]),
        SamUIKitModule,
        SamAPIKitModule],
      declarations: [ SavedSearchResult, FilterParamLabel, FilterParamValue],
      providers: [ SavedSearchService, AlertFooterService ]
    }).overrideComponent(SavedSearchResult, {
      set: {
        providers: [
          {provide: SavedSearchService, useValue: savedSearchServiceStub}
        ]
      }
    }).compileComponents();

      fixture = TestBed.createComponent(SavedSearchResult);
      comp = fixture.componentInstance;
      titleEl  = fixture.debugElement.query(By.css('.saved-search-title')); // find title element
      comp.data = {
        createdOn: "2017-10-05T16:58:28Z",
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
        preferenceId: "abcde-12345",
        userId: "cfda.test.user@gmail.com"
      };
      Cookies.set("iPlanetDirectoryPro", "anything");
      fixture.detectChanges();// trigger data binding

  }));

  it('SavedSearchResultComponent: should display a title', () => {
      expect(comp).toBeDefined();
      expect(titleEl.nativeElement.textContent).toContain("Test Search");
      expect(comp.data.createdOn).toEqual("2017-10-05");
      expect(comp.domain).toEqual("Assistance Listing");
      expect(comp.parameters).toEqual(parameters);
  });

  it('SavedSearchResultComponent: should perform edit action', () => {
      comp.newSearchName = "Test Edit Search";
      comp.handleAction({ name: 'edit', label: 'Edit Name', icon: 'fa fa-pencil-square-o', callback: this.actionsCallback });
      comp.performAction(null);
      expect(comp.action).toBe("edit");
      expect(comp.savedSearch['data']['key']).toBe("test-edit-search");
      expect(comp.savedSearch).hasOwnProperty("lastUsageDate");
  });

  it('SavedSearchResultComponent: should perform duplicate action', () => {
    comp.handleAction({ name: 'duplicate', label: 'Duplicate', icon: 'fa fa-copy', callback: this.actionsCallback });
    comp.newSearchName = "Test Duplicate Search";
    comp.performAction(null);
    expect(comp.action).toBe("duplicate");
    expect(comp.savedSearch['data']['key']).toBe("test-duplicate-search");
  });

  it('SavedSearchResultComponent: should perform delete action', () => {
    comp.handleAction({ name: 'delete', label: 'Delete', icon: 'fa fa-trash-o', callback: this.actionsCallback });
    comp.performAction(null);
    expect(comp.action).toBe("delete");
    expect(comp.newSearchName).toBe("");
  });

  it('SavedSearchResultComponent: should throw validation errors for edit', () => {
    comp.handleAction({ name: 'edit', label: 'Edit Name', icon: 'fa fa-pencil-square-o', callback: this.actionsCallback });
    comp.performAction(null);
    expect(comp.action).toBe("edit");
    expect(comp.textConfig.errorMessage).toBe("Please provide a name");
  });

  it('SavedSearchResultComponent: should throw validation errors for duplicate', () => {
    comp.handleAction({ name: 'duplicate', label: 'Duplicate', icon: 'fa fa-copy', callback: this.actionsCallback });
    comp.performAction(null);
    expect(comp.action).toBe("duplicate");
    expect(comp.textConfig.errorMessage).toBe("Please provide a new saved search name");
  });


});
