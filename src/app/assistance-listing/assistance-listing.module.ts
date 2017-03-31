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
import { FALHeaderInfoComponent } from './assistance-listing-operations/sections/header-information/header-information.component';
import { FALOverviewComponent } from './assistance-listing-operations/sections/overview/overview.component';
import { FALContactInfoComponent } from './assistance-listing-operations/sections/contact-information/contact-information.component';
import {FinancialObligationsComponent} from "./assistance-listing-operations/sections/financial-info/obligations/obligation.component";
import {SamTextRadioButtonComponent} from "./components/text-radio/text-radio-button.component";


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
    FALHeaderInfoComponent,
    FALOverviewComponent,
    FALContactInfoComponent,
    FinancialObligationsComponent,
    SamTextRadioButtonComponent
  ],
  providers: [],
})
export class ProgramModule { }
