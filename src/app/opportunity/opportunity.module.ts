import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { OpportunityPage }   from './opportunity.page';
import { routing } from './opportunity.route';
import { PipesModule } from "../app-pipes/app-pipes.module";

@NgModule({
  imports: [
    PipesModule,
    BrowserModule,
    routing,
  ],
  exports: [
    OpportunityPage
  ],
  declarations: [
    OpportunityPage
  ],
})
export class OpportunityModule { }
