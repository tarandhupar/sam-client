import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { MockBackend } from '@angular/http/testing';
import { By }              from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Location, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { SavedSearchRedirect } from './saved-search-redirect.component';
import { Observable } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

import { SavedSearchService } from '../../../../api-kit/search/saved-search.service';
import { AlertFooterService } from "../../../app-components/alert-footer/alert-footer.service";
import {} from 'jasmine';
import * as Cookies from 'js-cookie';

let comp: SavedSearchRedirect;
let fixture: ComponentFixture<SavedSearchRedirect>;

let MockSavedSearchService = {
    getSavedSearch: (authToken, id) => {
        return Observable.of({
              "preferenceId": "abcde-12345",
              "userId": "cfda.test.use.rsrloca@gmail.com",
              "type": "saved_search",
              "title": "Test Saved Search",
              "createdOn": null,
              "modifiedOn": "2017/09/27T17:43:16+0000",
              "lastUsageDate": "2017/09/27T17:43:16+0000",
              "numberOfUsages": 1,
              "data": {
                  "index": ["cfda"],
                  "key": "test_saved_search",
                  "parameters": {
                      "is_active": true,
                      "beneficiary": "10",
                      "assistance_type": "0001001",
                      "organization_id": "100004222"
                  }
              },
              "_links": {
                  "self": {
                      "href": "https://gsaiae-dev02.reisys.com/preferences/v1/search/85e220d4-a48e-480f-8fe1-db3cd0bf4625"
                  }
              }
        });
    },
    updateSavedSearchUsage: (authToken: string, id: string) => {
        return Observable.of();
    }
};

class MockRouter {
    navigate(url: string) { return url; }
}

class MockActivatedRoute extends ActivatedRoute {
    constructor() {
        super();
        this.params = Observable.of({id: "test_saved_search"});
    }
}

describe('src/app/search/saved-search-workspace/saved-search-redirect/saved-search-redirect.spec.ts', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [SavedSearchRedirect],
        providers: [AlertFooterService, SavedSearchService],
        imports: [RouterTestingModule]
      }).overrideComponent(SavedSearchRedirect, {
         set: {
           providers: [
             {provide: SavedSearchService, useValue: MockSavedSearchService},
             {provide: Router, useClass: MockRouter},
             {provide: ActivatedRoute, useClass: MockActivatedRoute}
           ]
        }
      }).compileComponents();

      fixture = TestBed.createComponent(SavedSearchRedirect);
      Cookies.set('iPlanetDirectoryPro', 'AGENCY SUBMITTER');
    });

it('SavedSearchRedirect: should get saved search by id', () => {
    fixture.whenStable().then(() => {
        fixture.componentInstance.ngOnInit();
        expect(fixture.componentInstance.savedSearch.preferenceId).toBe("abcde-12345");
    });
});

it('SavedSearchRedirect: should increment number of usages', () => {
    fixture.whenStable().then(() => {
        spyOn(fixture.componentInstance, 'updateSavedSearchStatistics');
        fixture.componentInstance.ngOnInit();
        expect(fixture.componentInstance.updateSavedSearchStatistics).toHaveBeenCalled();
    });
});

// it('SavedSearchRedirect: should redirect to search page with correct parameters',
//     inject([Router], (router: Router) => { // ...

//           const spy = spyOn(router, 'navigate');
//           fixture.componentInstance.ngOnInit();
//           fixture.componentInstance.searchRedirect();
//           // args passed to router.navigate()
//           const navArgs = spy.calls.first().args;

//           expect(navArgs).toBe({
//             "index": "cfda",
//             "is_active": true,
//             "beneficiary": "10",
//             "assistance_type": "0001001",
//             "organization_id": "100004222"
//           },
//             'should nav to Search Result for provided parameters');
//         }
//     )
// );

});
