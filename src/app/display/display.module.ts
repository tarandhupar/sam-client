import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { OpportunityViewComponent }   from './opportunities/opportunity-view.component';
import { routing } from './display.routing';
import { SamUIKitModule } from '../common/samuikit/samuikit.module';

@NgModule({
  imports: [
    BrowserModule,
    SamUIKitModule,
    routing,
  ],
  exports: [
    OpportunityViewComponent,
  ],
  declarations: [
    OpportunityViewComponent,
  ],
})
export class DisplayModule { }
