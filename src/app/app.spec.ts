import {
  inject,
  TestBed
} from '@angular/core/testing';
import {Router, ActivatedRoute} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';

// Load the implementations that should be tested
import {App} from './app.component';
import {ROUTES} from "./app.route";
import {HomePage} from "./application-content/home/home.page";
import {SearchPage} from "./search/search.page";
import {SamUIKitModule} from "ui-kit";
import {OpportunitiesResult} from "./opportunity/search-result/opportunities-result.component";
import {AssistanceListingResult} from "./assistance-listing/search-result/assistance-listing-result.component";
import {FHInputComponent} from "./search/agency-selector/agency-selector.component";
import {ProgramModule} from "./assistance-listing/assistance-listing.module";
import {OpportunityPage} from "./opportunity/opportunity.page";
import {PageNotFoundErrorPage} from "./application-content/404/404.page";


class RouterStub {
  navigate(url:string) {
    return url;
  }
}

var activatedRouteStub = {
  queryParams: {
    subscribe: () => {
      return {};
    }
  }
};


describe('App', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEach(() => TestBed.configureTestingModule({
    declarations: [HomePage, SearchPage, OpportunitiesResult, AssistanceListingResult, FHInputComponent, OpportunityPage, PageNotFoundErrorPage],
    imports: [SamUIKitModule, RouterTestingModule.withRoutes(ROUTES), ProgramModule],
    providers: [
      App,
      {provide: Router, useClass: RouterStub},
      {provide: ActivatedRoute, useValue: activatedRouteStub}
    ]
  }));

  it('should have a test value', inject([App], (app) => {
    // expect(app.testValue.value).toEqual('Test');
    // app.ngOnInit();
    // expect(app.testValue.value).toEqual('Test' );
  }));

});
