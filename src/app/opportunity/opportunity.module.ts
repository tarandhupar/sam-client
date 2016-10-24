import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { OpportunityPage }   from './opportunity.page';
import { routing } from './opportunity.route';

@NgModule({
  imports: [
    BrowserModule,
    routing,
  ],
  exports: [
    OpportunityPage,
  ],
  declarations: [
    OpportunityPage,
  ],
})
export class OpportunityModule { }
