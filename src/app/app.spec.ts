import {
  inject,
  TestBed
} from '@angular/core/testing';
import {Router, ActivatedRoute} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';

// Load the implementations that should be tested
import {App} from './app.component';
import {ROUTES} from "./app.routes";
import {Home} from "./home/home.component";
import {Search} from "./search/search.component";
import {SamUIKitModule} from "../ui-kit/ui-kit.module";
import {OpportunitiesResult} from "./search/opportunities/opportunities.component";
import {AssistanceListingResult} from "./search/assistance_listings/al.component";
import {FHInputComponent} from "./search/fh.component";
import {ProgramModule} from "./fal/program/program.module";
import {OpportunityViewComponent} from "./display/opportunities/opportunity-view.component";
import {NoContent} from "./common/no-content/no-content";


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
    declarations: [Home, Search, OpportunitiesResult, AssistanceListingResult, FHInputComponent, OpportunityViewComponent, NoContent],
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
