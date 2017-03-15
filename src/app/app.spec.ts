import {
  inject,
  TestBed
} from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

// Load the implementations that should be tested

import { App } from './app.component';
import { ROUTES } from './app.route';
import { HomePage } from './application-content/home/home.page';
import { SearchPage } from './search/search.page';
import { SamUIKitModule } from 'sam-ui-kit';
import { SearchService } from 'api-kit';
import { AppComponentsModule } from './app-components/app-components.module';
import { OpportunitiesResult } from './opportunity/search-result/opportunities-result.component';
import { AssistanceListingResult } from './assistance-listing/search-result/assistance-listing-result.component';
import { FederalHierarchyResult } from './organization/search-result/federal-hierarchy-result.component';
import { EntitiesResult } from './entity/search-result/entities-result.component';
import { ExclusionsResult } from './exclusion/search-result/exclusions-result.component';
import { WageDeterminationResult } from './wage-determination/search-result/wage-determination-result.component';
import { FHFeaturedResult } from './organization/featured-result/featured-result.component';
import { ProgramModule } from './assistance-listing/assistance-listing.module';
import { OpportunityPage } from './opportunity/opportunity.page';
import { PageNotFoundErrorPage } from './application-content/404/404.page';
import { PipesModule } from './app-pipes/app-pipes.module';
import { OpportunityTypeLabelPipe } from './opportunity/pipes/opportunity-type-label.pipe';
import { TimezoneLabelPipe } from './opportunity/pipes/timezone-label.pipe';
import { FixHTMLPipe } from './opportunity/pipes/fix-html.pipe';
import { FilesizePipe } from './opportunity/pipes/filesize.pipe';
import { FHService } from '../api-kit/fh/fh.service';
import {AwardsResult} from "./awards/search-result/awards-result.component";

class RouterStub {
  navigate(url:string) {
    return url;
  }
}

let activatedRouteStub = {
  queryParams: {
    subscribe: () => {
      return {};
    }
  }
};

let searchServiceStub = {};
let fhServiceStub = {};

describe('App', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEach(() => TestBed.configureTestingModule({
    declarations: [HomePage, SearchPage, OpportunitiesResult, AssistanceListingResult, FederalHierarchyResult, EntitiesResult, ExclusionsResult, WageDeterminationResult, AwardsResult, FHFeaturedResult, OpportunityPage, PageNotFoundErrorPage, OpportunityTypeLabelPipe, TimezoneLabelPipe, FixHTMLPipe, FilesizePipe],
    imports: [PipesModule, SamUIKitModule, AppComponentsModule, RouterTestingModule.withRoutes(ROUTES), ProgramModule],
    providers: [
      App,
      {provide: Router, useClass: RouterStub},
      {provide: ActivatedRoute, useValue: activatedRouteStub},
      {provide: SearchService, useValue: searchServiceStub},
      {provide: FHService, useValue: fhServiceStub}
    ]
  }));

  it('should have a test value', inject([App], (app) => {
    // expect(app.testValue.value).toEqual('Test');
    // app.ngOnInit();
    // expect(app.testValue.value).toEqual('Test' );
  }));

});
