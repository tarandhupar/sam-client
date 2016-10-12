import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { Search }   from './search.component';
import { AssistanceListingResult } from './assistance_listings/al.component';
import { OpportunitiesResult } from './opportunities/opportunities.component';
import { FHInputComponent } from './fh.component';
import { FormsModule } from '@angular/forms';
import { SamAngularModule } from '../../sam-angular';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule,
    HttpModule,
    SamAngularModule
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
