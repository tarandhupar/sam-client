import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Search }   from './search.component';
import { AssistanceListingResult } from './assistance_listings/al.component';
import { OpportunitiesResult } from './opportunities/opportunities.component';
import { FHInputComponent } from './fh.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule
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
