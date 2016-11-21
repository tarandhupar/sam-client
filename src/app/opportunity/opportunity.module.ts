import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { OpportunityPage }   from './opportunity.page';
import { routing } from './opportunity.route';
import { PipesModule } from "../app-pipes/app-pipes.module";
import {NoticeTypeLabelPipe} from "./pipes/notice-type-label.pipe";
import {TimezoneLabelPipe} from "./pipes/timezone-label.pipe";

@NgModule({
  imports: [
    PipesModule,
    BrowserModule,
    routing,
  ],
  exports: [
    OpportunityPage,
    NoticeTypeLabelPipe,
    TimezoneLabelPipe
  ],
  declarations: [
    OpportunityPage,
    NoticeTypeLabelPipe,
    TimezoneLabelPipe
  ],
})
export class OpportunityModule { }
