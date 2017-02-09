import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ProgramPage }   from './assistance-listing.page';
import { FinancialObligationChart } from './assistance-listing.chart';
import { routing } from './assistance-listing.route';
import { AuthorizationPipe } from './pipes/authorization.pipe';
import { HistoricalIndexLabelPipe } from './pipes/historical-index-label.pipe';
import { SamUIKitModule } from 'ui-kit';
import { PipesModule } from "../app-pipes/app-pipes.module";
import { ProgramDisplayPageDemoPage } from './display-template-demo/display-template-demo.page';
import { AppComponentsModule } from "../app-components/app-components.module";

@NgModule({
  imports: [
    PipesModule,
    BrowserModule,
    SamUIKitModule,
    AppComponentsModule,
    routing
  ],
  exports: [
    AuthorizationPipe,
    ProgramPage,
    FinancialObligationChart,
    HistoricalIndexLabelPipe,
  ],
  declarations: [
    AuthorizationPipe,
    ProgramPage,
    ProgramDisplayPageDemoPage,
    FinancialObligationChart,
    HistoricalIndexLabelPipe,
  ],
  providers: [],
})
export class ProgramModule { }
