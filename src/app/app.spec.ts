import {
  inject,
  TestBed
} from '@angular/core/testing';
import {Router, ActivatedRoute} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';

// Load the implementations that should be tested
import {App} from './app.component';
import {ROUTES} from "./app.routes";
import {HomePage} from "./app-pages/home/home.page";
import {SearchPage} from "./search/search.page";
import {SamUIKitModule} from "ui-kit";
import {OpportunitiesResult} from "./search/opportunities/opportunities.component";
import {AssistanceListingResult} from "./search/assistance-listings/al.component";
import {FHInputComponent} from "./search/fh.component";
import {ProgramModule} from "./assistance-listing/assistance-listing.module";
import {OpportunityViewComponent} from "./display/opportunities/opportunity-view.component";
import {NoContentPage} from "./app-pages/404/404.page";


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
    declarations: [HomePage, SearchPage, OpportunitiesResult, AssistanceListingResult, FHInputComponent, OpportunityViewComponent, NoContentPage],
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
