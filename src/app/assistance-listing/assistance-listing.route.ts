import { Routes, RouterModule } from '@angular/router';
import { ProgramPage } from './assistance-listing.page';
import { FalWorkspacePage } from './assistance-listing-workspace/assistance-listing-workspace.page';
import { RejectFALComponent } from "./assistance-listing-operations/workflow/reject/reject-fal.component";
import { FALAuthGuard } from "./components/authguard/authguard.service";
import { FalRegionalAssistanceLocationsPage } from './regional-assistance-locations/regional-assistance-location.page';
import { FALReviewComponent } from "./assistance-listing-operations/workflow/review/fal-review.component";
import { FALSubmitComponent } from "./assistance-listing-operations/workflow/submit/fal-form-submit.component";
import { FALRegionalAssistanceFormComponent } from './regional-assistance-locations/regional-assistance-operations/regional-assistance-form.component';
import { RAOFormResolver } from "./regional-assistance-locations/regional-assistance-operations/rao-form-resolver.service";
import { FALFormChangeRequestComponent } from "./assistance-listing-change-request/fal-form-change-request.component";
import { FALFormChangeRequestActionComponent } from "./assistance-listing-change-request/fal-form-change-request-action.component";
import { FALPublishComponent } from "./assistance-listing-operations/workflow/publish/fal-publish.component";
import { CfdaNumbersPage } from "./assistance-listing-workspace/cfda-numbers/cfda-numbers.page";
import { CFDANumberManagementComponent } from "./assistance-listing-workspace/cfda-number-management/fal-form-cfda-number-management.component";
import { FeedbackFormService } from 'app/app-components/feedback-form/feedback-form.service';

export const routes: Routes = [
      { path: '', component: ProgramPage },
      { path: ':id/view', component: ProgramPage, canDeactivate:[FeedbackFormService] },
      { path: 'workspace', component: FalWorkspacePage, canActivate: [FALAuthGuard], canDeactivate:[FeedbackFormService]},
      { path: ':id/submit', component: FALSubmitComponent, canActivate: [FALAuthGuard] },
      { path: ':id/reject', component: RejectFALComponent, canActivate: [FALAuthGuard] },
      { path: ':id/review', component: FALReviewComponent, canActivate: [FALAuthGuard] },
      { path: ':id/publish', component: FALPublishComponent, canActivate: [FALAuthGuard] },
      { path: ':id/change-request', component: FALFormChangeRequestComponent },
      { path: 'change-request/:id/action', component: FALFormChangeRequestActionComponent },
      { path: 'workspace/cfda-numbers', component: CfdaNumbersPage, canActivate: [FALAuthGuard]},
      { path: 'myRegionalAssistanceLocations/add', component: FALRegionalAssistanceFormComponent, canActivate: [FALAuthGuard] },
      {
        path: 'myRegionalAssistanceLocations/:id/edit',
        component: FALRegionalAssistanceFormComponent,
        resolve: {rao: RAOFormResolver},
        canActivate: [FALAuthGuard]
      },
      {
        path: 'myRegionalAssistanceLocations',
        component: FalRegionalAssistanceLocationsPage,
        canActivate: [FALAuthGuard]
      },
      { path: 'cfda-management/:id/edit', component: CFDANumberManagementComponent, canActivate: [FALAuthGuard] },
];

export const routing = RouterModule.forChild(routes);
