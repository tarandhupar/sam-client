import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { SearchPage }   from './search.page';
import { AssistanceListingResult } from '../assistance-listing/search-result/assistance-listing-result.component';
import { OpportunitiesResult } from '../opportunity/search-result/opportunities-result.component';
import { FederalHierarchyResult } from '../organization/search-result/federal-hierarchy-result.component';
import { EntitiesResult } from '../entity/search-result/entities-result.component';
import { WageDeterminationResult } from '../wage-determination/search-result/wage-determination-result.component';
import { FormsModule } from '@angular/forms';

import { routing } from './search.route';
import { SamUIKitModule } from 'ui-kit';
import { SamAPIKitModule } from 'api-kit';
import { AppComponentsModule } from "../app-components/app-components.module";

@NgModule({
  imports: [
    routing,
    BrowserModule,
    FormsModule,
    RouterModule,
    HttpModule,
    SamUIKitModule,
    SamAPIKitModule,
    AppComponentsModule
  ],
  exports: [
    SearchPage,
    AssistanceListingResult,
    OpportunitiesResult,
    FederalHierarchyResult,
    EntitiesResult,
    WageDeterminationResult
  ],
  declarations: [
    SearchPage,
    AssistanceListingResult,
    OpportunitiesResult,
    FederalHierarchyResult,
    EntitiesResult,
    WageDeterminationResult
  ],
  providers: [],
})
export class SearchModule { }
