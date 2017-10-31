import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { SearchPage }   from './search.page';
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
import {SearchMultiSelectFilter} from "./search-multi-select-filter/search-multi-select-filter.component";
import {SamNaicsPscFilter} from "./naics-psc-filter/naics-psc-filter.component";
import {DunsEntityAutoCompleteWrapper} from "../../api-kit/autoCompleteWrapper/entityDunsAutoCompleteWrapper.service";
import {SamEligibilityFilter} from "./eligibility-filter/eligibility-filter.component";
import {SavedSearchWorkspacePage} from "./saved-search-workspace/saved-search-workspace.page";
import {SavedSearchResult} from "./saved-search-workspace/saved-search-result/saved-search-result.component";
import {FilterParamLabel} from "./pipes/filter-label.pipe";
import {SavedSearchRedirect} from "./saved-search-workspace/saved-search-redirect/saved-search-redirect.component";
import {FilterParamValue} from "./pipes/filter-value.pipe";
import {SearchAuthGuard} from "./authguard.service";

@NgModule({
  imports: [
    routing,
    CommonModule,
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
    SavedSearchWorkspacePage,
    AssistanceListingResult,
    OpportunitiesResult,
    FederalHierarchyResult,
    EntitiesResult,
    ExclusionsResult,
    WageDeterminationResult,
    AwardsResult,
    FHFeaturedResult,
    SearchMultiSelectFilter,
    SamNaicsPscFilter,
    SamEligibilityFilter,
    RegionalOfficeListingResult,
    SavedSearchResult,
    FilterParamLabel,
    FilterParamValue,
    SavedSearchRedirect
  ],
  providers: [
    DunsEntityAutoCompleteWrapper,
    SearchAuthGuard
  ],
})
export class SearchModule { }
