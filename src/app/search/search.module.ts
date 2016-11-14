import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { SearchPage }   from './search.page';
import { AssistanceListingResult } from '../assistance-listing/search-result/assistance-listing-result.component';
import { OpportunitiesResult } from '../opportunity/search-result/opportunities-result.component';
import { FederalHierarchyResult } from '../search-result/federal-hierarchy-result.component'
import { FHInputComponent } from './agency-selector/agency-selector.component';
import { FormsModule } from '@angular/forms';

import { routing } from './search.route';
import { SamUIKitModule } from 'ui-kit';
import { SamAPIKitModule } from 'api-kit';

@NgModule({
  imports: [
    routing,
    BrowserModule,
    FormsModule,
    RouterModule,
    HttpModule,
    SamUIKitModule,
    SamAPIKitModule,
  ],
  exports: [
    SearchPage,
    AssistanceListingResult,
    OpportunitiesResult,
    FederalHierarchyResult,
    FHInputComponent
  ],
  declarations: [
    SearchPage,
    AssistanceListingResult,
    OpportunitiesResult,
    FederalHierarchyResult,
    FHInputComponent
  ],
  providers: [],
})
export class SearchModule { }
