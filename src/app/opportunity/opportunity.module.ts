import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { OpportunityPage }   from './opportunity.page';
import { routing } from './opportunity.route';
import { PipesModule } from "../app-pipes/app-pipes.module";
import { OpportunityTypeLabelPipe } from "./pipes/opportunity-type-label.pipe";
import { TimezoneLabelPipe } from "./pipes/timezone-label.pipe";

@NgModule({
  imports: [
    PipesModule,
    BrowserModule,
    routing,
  ],
  exports: [
    OpportunityPage,
    OpportunityTypeLabelPipe,
    TimezoneLabelPipe
  ],
  declarations: [
    OpportunityPage,
    OpportunityTypeLabelPipe,
    TimezoneLabelPipe
  ],
})
export class OpportunityModule { }
