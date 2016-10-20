import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { OpportunityPageComponent }   from './opportunity.page';
import { routing } from './opportunity.route';
import { SamAngularModule } from '../common/samuikit/samuikit.module';

@NgModule({
  imports: [
    BrowserModule,
    SamAngularModule,
    routing,
  ],
  exports: [
    OpportunityPageComponent,
  ],
  declarations: [
    OpportunityPageComponent,
  ],
})
export class OpportunityModule { }
