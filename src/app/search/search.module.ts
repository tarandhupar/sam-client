import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { Search }   from './search.component';
import { AssistanceListingResult } from './assistance_listings/al.component';
import { OpportunitiesResult } from './opportunities/opportunities.component';
import { FHInputComponent } from './fh.component';
import { FormsModule } from '@angular/forms';
import { SamAngularModule } from '../common/samuikit/samuikit.module';
import { SamUIKitModule } from '../../ui-kit/ui-kit.module';
import { SamAPIKitModule } from '../../api-kit/api-kit.module';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule,
    HttpModule,
    SamAngularModule,
    SamUIKitModule,
    SamAPIKitModule,
  ],
  exports: [
    Search,
    AssistanceListingResult,
    OpportunitiesResult,
    FHInputComponent
  ],
  declarations: [
    Search,
    AssistanceListingResult,
    OpportunitiesResult,
    FHInputComponent
  ],
  providers: [],
})
export class SearchModule { }
