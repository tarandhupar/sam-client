import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { SearchPage }   from './search.page';
import { AssistanceListingResult } from './assistance-listings/al.component';
import { OpportunitiesResult } from './opportunities/opportunities.component';
import { FHInputComponent } from './fh.component';
import { FormsModule } from '@angular/forms';

import { routing } from './search.route';
import { SamAngularModule } from '../common/samuikit/samuikit.module';
import { SamUIKitModule } from 'ui-kit';
import { SamAPIKitModule } from 'api-kit';

@NgModule({
  imports: [
    routing,
    BrowserModule,
    FormsModule,
    RouterModule,
    HttpModule,
    SamAngularModule,
    SamUIKitModule,
    SamAPIKitModule,
  ],
  exports: [
    SearchPage,
    AssistanceListingResult,
    OpportunitiesResult,
    FHInputComponent
  ],
  declarations: [
    SearchPage,
    AssistanceListingResult,
    OpportunitiesResult,
    FHInputComponent
  ],
  providers: [],
})
export class SearchModule { }
