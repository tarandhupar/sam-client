import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { SearchPage }   from './search.page';
import { SearchLayoutDemoPage }   from './search-layout-demo/search-layout-demo.page';
import { AssistanceListingResult } from '../assistance-listing/search-result/assistance-listing-result.component';
import {RegionalOfficeListingResult} from '../assistance-listing/regional-office-listing-search-result/regional-office-listing-result.component'
import { OpportunitiesResult } from '../opportunity/search-result/opportunities-result.component';
import { FederalHierarchyResult } from '../organization/search-result/federal-hierarchy-result.component';
import { EntitiesResult } from '../entity/search-result/entities-result.component';
import { ExclusionsResult } from '../exclusion/search-result/exclusions-result.component';
import { WageDeterminationResult } from '../wage-determination/search-result/wage-determination-result.component';
import { AwardsResult } from '../awards/search-result/awards-result.component';
import { FormsModule } from '@angular/forms';

import { routing } from './search.route';
import { SamUIKitModule } from 'sam-ui-kit';
import { SamAPIKitModule } from 'api-kit';
import { AppComponentsModule } from '../app-components/app-components.module';
import { FHFeaturedResult } from '../organization/featured-result/featured-result.component';
import { PipesModule } from '../app-pipes/app-pipes.module';
import {SamContractTypeFilter} from "../awards/search-result/contract-type-filter/contract-type-filter.component";
import {SamNaicsPscFilter} from "./naics-psc-filter/naics-psc-filter.component";

@NgModule({
  imports: [
    routing,
    BrowserModule,
    FormsModule,
    RouterModule,
    HttpModule,
    SamUIKitModule,
    SamAPIKitModule,
    AppComponentsModule,
    PipesModule
  ],
  exports: [
    SearchPage,
    AssistanceListingResult,
    OpportunitiesResult,
    FederalHierarchyResult,
    EntitiesResult,
    ExclusionsResult,
    WageDeterminationResult,
    AwardsResult,
    FHFeaturedResult,
    RegionalOfficeListingResult
  ],
  declarations: [
    SearchPage,
    SearchLayoutDemoPage,
    AssistanceListingResult,
    OpportunitiesResult,
    FederalHierarchyResult,
    EntitiesResult,
    ExclusionsResult,
    WageDeterminationResult,
    AwardsResult,
    FHFeaturedResult,
    SamContractTypeFilter,
    SamNaicsPscFilter,
    RegionalOfficeListingResult
  ],
  providers: [],
})
export class SearchModule { }
