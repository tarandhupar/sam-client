import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import { ProgramPage }   from './assistance-listing.page';
import { FinancialObligationChart } from './assistance-listing.chart';
import { routing } from './assistance-listing.route';
import { AuthorizationPipe } from './pipes/authorization.pipe';
import { HistoricalIndexLabelPipe } from './pipes/historical-index-label.pipe';
import { SamUIKitModule } from 'sam-ui-kit';
import { PipesModule } from '../app-pipes/app-pipes.module';
import { AppComponentsModule } from "../app-components/app-components.module";
import { AssistanceProgramResult } from './assistance-listing-workspace/program-result/assistance-program-result.component';
import { AccessRestrictedPage } from './assistance-listing-workspace/program-result/testauthenvironment.page';
import { FalWorkspacePage } from './assistance-listing-workspace/assistance-listing-workspace.page';
import { FALComponentsModule } from './components/index';
import { FeedsPage } from "./assistance-listing-workspace/feeds/feeds.page";
import { FalRegionalAssistanceLocationsPage } from './regional-assistance-locations/regional-assistance-location.page';
import { RegionalAssistanceLocationResult } from './regional-assistance-locations/location-result/regional-assistance-location-result.component';
import { FALRegionalAssistanceFormComponent } from './regional-assistance-locations/regional-assistance-operations/regional-assistance-form.component';
import { FALFormModule } from "./assistance-listing-operations/fal-form.module";
import { RejectFALComponent } from "./assistance-listing-operations/workflow/reject/reject-fal.component";
import {RequestLabelPipe} from "./pipes/request-label.pipe";
import { FALFormErrorService } from './assistance-listing-operations/fal-form-error.service';
import {RAOFormService} from "./regional-assistance-locations/regional-assistance-operations/regional-assistance-form.service";
import { FALReviewComponent } from "./assistance-listing-operations/workflow/review/fal-review.component";
import {FALSubmitComponent} from "./assistance-listing-operations/workflow/submit/fal-form-submit.component";
import { FALFormChangeRequestComponent } from "./assistance-listing-change-request/fal-form-change-request.component";
import { FALFormChangeRequestActionComponent } from "./assistance-listing-change-request/fal-form-change-request-action.component";
import {ActionHistoryPipe} from "./pipes/action-history.pipe";
import {RAOFormResolver} from "./regional-assistance-locations/regional-assistance-operations/rao-form-resolver.service";
import {FALPublishComponent} from "./assistance-listing-operations/workflow/publish/fal-publish.component";
import {ActionHistoryLabelPipe} from "./pipes/action-history-label.pipe";
import {RequestTypeLabelPipe} from "./pipes/request-type-label.pipe";
import { AppTemplatesModule } from "../app-templates/index";

@NgModule({
  imports: [
    PipesModule,
    BrowserModule,
    SamUIKitModule,
    AppComponentsModule,
    routing,
    ReactiveFormsModule,
    FormsModule,
    FALComponentsModule,
    FALFormModule,
    AppTemplatesModule
  ],
  exports: [
    AuthorizationPipe,
    ProgramPage,
    FinancialObligationChart,
    HistoricalIndexLabelPipe,
    AssistanceProgramResult,
    AccessRestrictedPage,
    ActionHistoryPipe
  ],
  declarations: [
    AuthorizationPipe,
    ProgramPage,
    FinancialObligationChart,
    HistoricalIndexLabelPipe,
    AssistanceProgramResult,
    FalWorkspacePage,
    AccessRestrictedPage,
    RejectFALComponent,
    FeedsPage,
    FALFormChangeRequestActionComponent,
    FALFormChangeRequestComponent,
    FALSubmitComponent,
    RequestLabelPipe,
    FALReviewComponent,
    FalRegionalAssistanceLocationsPage,
    RegionalAssistanceLocationResult,
    FALReviewComponent,
    ActionHistoryPipe,
    ActionHistoryLabelPipe,
    RequestTypeLabelPipe,
    FALRegionalAssistanceFormComponent,
    FALPublishComponent
  ],
  providers: [
    FALFormErrorService,
    RAOFormService,
    RAOFormResolver
  ],
})
export class ProgramModule { }
