import {Routes, RouterModule} from '@angular/router';
import {OpportunityPage} from './opportunity.page';
import {OpportunityAuthGuard} from "./components/authgaurd/authguard.service";
import {OPPWorkspacePage} from "./opportunity-workspace/opportunity-workspace.page";
import {OpportunityReviewComponent} from "./opportunity-operations/workflow/review/opportunity-review.component";
import { FeedbackFormService } from 'app/app-components/feedback-form/feedback-form.service';
import { OpportunityPublicPage } from 'app/opportunity/opportunity-operations/workflow/public/opportunity-public.page';


export const routes: Routes = [
  {path: ':id', component: OpportunityPage, canDeactivate:[FeedbackFormService]}
];

routes.unshift(
  {path: 'workspace', component: OPPWorkspacePage, canActivate: [OpportunityAuthGuard], canDeactivate:[FeedbackFormService]},
  {path: ':id/review', component: OpportunityReviewComponent, canActivate: [OpportunityAuthGuard]},
  {path: ':id/view', component: OpportunityPublicPage, canActivate: [OpportunityAuthGuard]}
);

export const routing = RouterModule.forChild(routes);
