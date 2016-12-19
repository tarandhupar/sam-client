import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { OpportunityPage, Tabs, Tab }   from './opportunity.page';
import { routing } from './opportunity.route';
import { PipesModule } from "../app-pipes/app-pipes.module";
import { OpportunityTypeLabelPipe } from "./pipes/opportunity-type-label.pipe";
import { TimezoneLabelPipe } from "./pipes/timezone-label.pipe";
import { FixHTMLPipe } from "./pipes/fix-html.pipe";

@NgModule({
  imports: [
    PipesModule,
    BrowserModule,
    routing,
  ],
  exports: [
    OpportunityPage,
    OpportunityTypeLabelPipe,
    TimezoneLabelPipe,
    FixHTMLPipe,
    Tabs,
    Tab
  ],
  declarations: [
    OpportunityPage,
    OpportunityTypeLabelPipe,
    TimezoneLabelPipe,
    FixHTMLPipe,
    Tabs,
    Tab
  ],
})
export class OpportunityModule { }
