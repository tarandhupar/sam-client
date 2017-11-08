import { Routes, RouterModule } from '@angular/router';
import { ProgramPage } from './assistance-listing.page';
import { FalWorkspacePage } from './assistance-listing-workspace/assistance-listing-workspace.page';
import { AccessRestrictedPage } from './assistance-listing-workspace/program-result/testauthenvironment.page';
import {RejectFALComponent} from "./assistance-listing-operations/workflow/reject/reject-fal.component";
import { FeedsPage } from "./assistance-listing-workspace/feeds/feeds.page";
import { FALAuthGuard } from "./components/authguard/authguard.service";
import { FalRegionalAssistanceLocationsPage } from './regional-assistance-locations/regional-assistance-location.page';
import { FALReviewComponent } from "./assistance-listing-operations/workflow/review/fal-review.component";
import { FALSubmitComponent } from "./assistance-listing-operations/workflow/submit/fal-form-submit.component";
import { FALRegionalAssistanceFormComponent } from './regional-assistance-locations/regional-assistance-operations/regional-assistance-form.component';
import {RAOFormResolver} from "./regional-assistance-locations/regional-assistance-operations/rao-form-resolver.service";
import { FALFormChangeRequestComponent } from "./assistance-listing-change-request/fal-form-change-request.component";
import { FALFormChangeRequestActionComponent } from "./assistance-listing-change-request/fal-form-change-request-action.component";
import {FALPublishComponent} from "./assistance-listing-operations/workflow/publish/fal-publish.component";
import {CfdaNumbersPage} from "./assistance-listing-workspace/cfda-numbers/cfda-numbers.page";
import {CFDANumberManagementComponent} from "./assistance-listing-workspace/cfda-number-management/fal-form-cfda-number-management.component";

export const routes: Routes = [
  {path: 'fal/:id/view', component: ProgramPage},
  {path: 'fal', component: ProgramPage},
  {path: 'accessrestricted', component: AccessRestrictedPage},
  {path: 'fal/workspace', component: FalWorkspacePage, canActivate: [FALAuthGuard]},
  {path: 'fal/:id/submit', component: FALSubmitComponent, canActivate: [FALAuthGuard]},
  {path: 'fal/:id/reject', component: RejectFALComponent, canActivate: [FALAuthGuard]},
  {path: 'fal/:id/review', component: FALReviewComponent, canActivate: [FALAuthGuard]},
  {path: 'fal/:id/publish', component: FALPublishComponent, canActivate: [FALAuthGuard]},
  {path: 'fal/:id/change-request', component: FALFormChangeRequestComponent},
  {path: 'fal/change-request/:id/action', component: FALFormChangeRequestActionComponent},
  {path: 'workspace/my-feed', component: FeedsPage, canActivate: [FALAuthGuard]},
  {path: 'fal/workspace/cfda-numbers', component: CfdaNumbersPage, canActivate: [FALAuthGuard]},
  {path: 'fal/myRegionalOffices/add', component: FALRegionalAssistanceFormComponent, canActivate: [FALAuthGuard]},
  {path: 'fal/myRegionalOffices/:id/edit', component: FALRegionalAssistanceFormComponent, resolve: {rao: RAOFormResolver}, canActivate: [FALAuthGuard]},
  {path: 'fal/myRegionalOffices', component: FalRegionalAssistanceLocationsPage, canActivate: [FALAuthGuard]},
  {path: 'fal/cfda-management/:id/edit', component: CFDANumberManagementComponent, canActivate: [FALAuthGuard]},
];

export const routing = RouterModule.forChild(routes);
