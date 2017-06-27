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
import { ProgramDisplayPageDemoPage } from './display-template-demo/display-template-demo.page';
import { AppComponentsModule } from "../app-components/app-components.module";
import { AssistanceProgramResult } from './assistance-listing-workspace/program-result/assistance-program-result.component';
import { AccessRestrictedPage } from './assistance-listing-workspace/program-result/testauthenvironment.page';
import { FalWorkspacePage } from './assistance-listing-workspace/assistance-listing-workspace.page';
import { FALComponentsModule } from './components/index';
import { PendingRequestsListPage } from "./assistance-listing-workspace/pending-requests/pending-requests-list.page";
import { FALFormModule } from "./assistance-listing-operations/fal-form.module";
import { FalRegionalAssistanceLocationsPage } from './regional-assistance-locations/regional-assistance-location.page';
import { RegionalAssistanceLocationResult } from './regional-assistance-locations/location-result/regional-assistance-location-result.component';
import { RejectFALComponent } from "./assistance-listing-operations/workflow/reject/reject-fal.component";
import {RequestLabelPipe} from "./pipes/request-label.pipe";
import { FALFormErrorService } from './assistance-listing-operations/fal-form-error.service';
import { FALReviewComponent } from "./assistance-listing-operations/workflow/review/fal-review.component";
import {FALSubmitComponent} from "./assistance-listing-operations/workflow/submit/fal-form-submit.component";
import { FALFormChangeRequestComponent } from "./assistance-listing-change-request/fal-form-change-request.component";
import { FALFormChangeRequestActionComponent } from "./assistance-listing-change-request/fal-form-change-request-action.component";

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
    FALFormModule
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
    AccessRestrictedPage,
    RejectFALComponent,
    PendingRequestsListPage,
    FALFormChangeRequestActionComponent,
    FALFormChangeRequestComponent,
    FALSubmitComponent,
    RequestLabelPipe,
    FALReviewComponent,
    FalRegionalAssistanceLocationsPage,
    RegionalAssistanceLocationResult,
    FALReviewComponent
  ],
  providers: [
    FALFormErrorService
  ],
})
export class ProgramModule { }
