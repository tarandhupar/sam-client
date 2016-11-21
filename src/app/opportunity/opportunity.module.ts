import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { OpportunityPage }   from './opportunity.page';
import { routing } from './opportunity.route';
import { PipesModule } from "../app-pipes/app-pipes.module";
import { CapitalizePipe } from '../app-pipes/capitalize.pipe';

@NgModule({
  imports: [
    PipesModule,
    BrowserModule,
    routing,
  ],
  exports: [
    OpportunityPage,
    CapitalizePipe
  ],
  declarations: [
    OpportunityPage,
    CapitalizePipe
  ],
})
export class OpportunityModule { }
