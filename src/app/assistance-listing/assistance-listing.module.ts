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
import { FinancialInfoFormPage2 } from "./assistance-listing-operations/sections/financial-info/other/financial-info-other.page";
import { SamCheckboxToggledTextareaComponent } from "./components/checkbox-toggled-textarea.component";
import { FALHeaderInfoComponent } from './assistance-listing-operations/sections/header-information/header-information.component';
import { FALOverviewComponent } from './assistance-listing-operations/sections/overview/overview.component';
import { FALContactInfoComponent } from './assistance-listing-operations/sections/contact-information/contact-information.component';
import { FALContactInfoTableComponent } from './assistance-listing-operations/sections/contact-information/contact-information-table.component';
import { FinancialObligationsComponent } from "./assistance-listing-operations/sections/financial-info/obligations/obligation.component";
import { SamTextRadioButtonComponent } from "./components/text-radio/text-radio-button.component";
import { FALAccountIdentificationComponent } from "./components/account-identification.component";
import { FALTafsComponent } from "./components/tafs.component";
import { FALAuthorizationsComponent } from "./assistance-listing-operations/sections/authorizations/authorizations.component";
import { FALAuthSubFormComponent } from "./assistance-listing-operations/sections/authorizations/authorization-subform.component";
import { SamCheckboxToggledGroupTextareaComponent } from "./assistance-listing-operations/sections/authorizations/checkbox-toggled-group-textarea.component";

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
    FinancialInfoFormPage2,
    SamCheckboxToggledTextareaComponent,
    FALAccountIdentificationComponent,
    FALTafsComponent,
    FALHeaderInfoComponent,
    FALOverviewComponent,
    FALContactInfoComponent,
    FALContactInfoTableComponent,
    FinancialObligationsComponent,
    SamTextRadioButtonComponent,
    FALAuthorizationsComponent,
    FALAuthSubFormComponent,
    SamCheckboxToggledGroupTextareaComponent
  ],
  providers: [],
})
export class ProgramModule { }
