import { Routes, RouterModule } from '@angular/router';
import { ProgramPage } from './assistance-listing.page';
import { ProgramDisplayPageDemoPage } from './display-template-demo/display-template-demo.page';
import { FalWorkspacePage } from './assistance-listing-workspace/assistance-listing-workspace.page';
import { AccessRestrictedPage } from './assistance-listing-workspace/program-result/testauthenvironment.page';
import {RejectFALComponent} from "./assistance-listing-operations/workflow/reject/reject-fal.component";
import { PendingRequestsListPage } from "./assistance-listing-workspace/pending-requests/pending-requests-list.page";
import {AuthGuard} from "./authguard/authguard.component";
import { FalRegionalAssistanceLocationsPage } from './regional-assistance-locations/regional-assistance-location.page';
import { FALReviewComponent } from "./assistance-listing-operations/workflow/review/fal-review.component";
import { FALSubmitComponent } from "./assistance-listing-operations/workflow/submit/fal-form-submit.component";
import { FALFormChangeRequestComponent } from "./assistance-listing-change-request/fal-form-change-request.component";
import { FALFormChangeRequestActionComponent } from "./assistance-listing-change-request/fal-form-change-request-action.component";

export const routes: Routes = [
  {path: 'programs/:id/view', component: ProgramPage},
  {path: 'programs', component: ProgramPage},
  {path: 'accessrestricted', component: AccessRestrictedPage},
];

if (SHOW_OPTIONAL === 'true' || ENV === 'development') {
  routes.unshift({path: 'programs/demo', component: ProgramDisplayPageDemoPage});
}

if (SHOW_HIDE_RESTRICTED_PAGES === 'true' || ENV === 'development') {
  routes.unshift(
    {path: 'fal/workspace', component: FalWorkspacePage, canActivate: [AuthGuard]},
    {path: 'programs/:id/reject', component: RejectFALComponent, canActivate: [AuthGuard]},
    {path: 'programs/:id/submit', component: FALSubmitComponent, canActivate: [AuthGuard]},
    {path: 'programs/:id/review', component: FALReviewComponent, canActivate: [AuthGuard]},
    {path: 'programs/:id/change-request', component: FALFormChangeRequestComponent},
    {path: 'programs/change-request/:id/action', component: FALFormChangeRequestActionComponent},
    {path: 'fal/workspace/requests', component: PendingRequestsListPage},
    {path: 'fal/myRegionalOffices', component: FalRegionalAssistanceLocationsPage},
    );
}
export const routing = RouterModule.forChild(routes);
