import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { ProgramPage }   from './assistance-listing.page';
import { FinancialObligationChart } from './assistance-listing.chart';
import { routing } from './assistance-listing.route';
import { AuthorizationPipe } from './pipes/authorization.pipe';
import { HistoricalIndexLabelPipe } from './pipes/historical-index-label.pipe';
import { SamUIKitModule } from 'sam-ui-kit';
import { PipesModule } from "../app-pipes/app-pipes.module";
import { ProgramDisplayPageDemoPage } from './display-template-demo/display-template-demo.page';
import { AppComponentsModule } from "../app-components/app-components.module";
import { ProgramPageOperations } from './assistance-listing-operations/assistance-listing-operations.page';
import { AssistanceProgramResult } from './assistance-listing-workspace/program-result/assistance-program-result.component';
import { AccessRestrictedPage } from './assistance-listing-workspace/program-result/testauthenvironment.page';
import { FalWorkspacePage } from './assistance-listing-workspace/assistance-listing-workspace.page';


@NgModule({
  imports: [
    PipesModule,
    BrowserModule,
    SamUIKitModule,
    AppComponentsModule,
    routing,
    ReactiveFormsModule
  ],
  exports: [
    AuthorizationPipe,
    ProgramPage,
    FinancialObligationChart,
    HistoricalIndexLabelPipe,
    AssistanceProgramResult,
    AccessRestrictedPage,
  ],
  declarations: [
    AuthorizationPipe,
    ProgramPage,
    ProgramDisplayPageDemoPage,
    FinancialObligationChart,
    HistoricalIndexLabelPipe,
    AssistanceProgramResult,
    FalWorkspacePage,
    ProgramPageOperations,
    AccessRestrictedPage,
  ],
  providers: [],
})
export class ProgramModule { }
