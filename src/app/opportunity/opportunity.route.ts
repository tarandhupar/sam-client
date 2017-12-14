import {Routes, RouterModule} from '@angular/router';
import {OpportunityPage} from './opportunity.page';
import {OpportunityAuthGuard} from "./components/authgaurd/authguard.service";
import {OPPWorkspacePage} from "./opportunity-workspace/opportunity-workspace.page";
import {OpportunityReviewComponent} from "./opportunity-operations/workflow/review/opportunity-review.component";
import { FeedbackFormService } from 'app/app-components/feedback-form/feedback-form.service';


export const routes: Routes = [
  {path: 'opp/:id', component: OpportunityPage, canDeactivate:[FeedbackFormService]}
];

routes.unshift(
  {path: 'opp/workspace', component: OPPWorkspacePage, canActivate: [OpportunityAuthGuard], canDeactivate:[FeedbackFormService]},
  {path: 'opp/:id/review', component: OpportunityReviewComponent, canActivate: [OpportunityAuthGuard]}
);

export const routing = RouterModule.forChild(routes);
