import { Routes, RouterModule } from '@angular/router';
import { ProgramPage } from './assistance-listing.page';
import { FalWorkspacePage } from './assistance-listing-workspace/assistance-listing-workspace.page';
import { AccessRestrictedPage } from './assistance-listing-workspace/program-result/testauthenvironment.page';
import {RejectFALComponent} from "./assistance-listing-operations/workflow/reject/reject-fal.component";
import { FeedsPage } from "./assistance-listing-workspace/feeds/feeds.page";
import {AuthGuard} from "../../api-kit/authguard/authguard.service";
import { FalRegionalAssistanceLocationsPage } from './regional-assistance-locations/regional-assistance-location.page';
import { FALReviewComponent } from "./assistance-listing-operations/workflow/review/fal-review.component";
import { FALSubmitComponent } from "./assistance-listing-operations/workflow/submit/fal-form-submit.component";
import { FALRegionalAssistanceFormComponent } from './regional-assistance-locations/regional-assistance-operations/regional-assistance-form.component';
import {RAOFormResolver} from "./regional-assistance-locations/regional-assistance-operations/rao-form-resolver.service";
import { FALFormChangeRequestComponent } from "./assistance-listing-change-request/fal-form-change-request.component";
import { FALFormChangeRequestActionComponent } from "./assistance-listing-change-request/fal-form-change-request-action.component";
import {FALPublishComponent} from "./assistance-listing-operations/workflow/publish/fal-publish.component";

export const routes: Routes = [
  {path: 'programs/:id/view', component: ProgramPage},
  {path: 'programs', component: ProgramPage},
  {path: 'accessrestricted', component: AccessRestrictedPage},
];

if (SHOW_HIDE_RESTRICTED_PAGES === 'true' || ENV === 'development') {
  routes.unshift(
    {path: 'fal/workspace', component: FalWorkspacePage, canActivate: [AuthGuard]},
    {path: 'programs/:id/submit', component: FALSubmitComponent, canActivate: [AuthGuard]},
    {path: 'programs/:id/reject', component: RejectFALComponent, canActivate: [AuthGuard]},
    {path: 'programs/:id/review', component: FALReviewComponent, canActivate: [AuthGuard]},
    {path: 'programs/:id/publish', component: FALPublishComponent, canActivate: [AuthGuard]},
    {path: 'programs/:id/change-request', component: FALFormChangeRequestComponent},
    {path: 'programs/change-request/:id/action', component: FALFormChangeRequestActionComponent},
    {path: 'workspace/my-feed', component: FeedsPage, canActivate: [AuthGuard]},
    {path: 'fal/myRegionalOffices/add', component: FALRegionalAssistanceFormComponent, canActivate: [AuthGuard]},
    {path: 'fal/myRegionalOffices/:id/edit', component: FALRegionalAssistanceFormComponent, resolve: {rao: RAOFormResolver}, canActivate: [AuthGuard]},
    {path: 'fal/myRegionalOffices', component: FalRegionalAssistanceLocationsPage, canActivate: [AuthGuard]}
  );
}
export const routing = RouterModule.forChild(routes);
