import {Routes, RouterModule} from '@angular/router';
import {OpportunityPage} from './opportunity.page';
import {OpportunityAuthGuard} from "./components/authgaurd/authguard.service";
import {OPPWorkspacePage} from "./opportunity-workspace/opportunity-workspace.page";
import {OpportunityReviewComponent} from "./opportunity-operations/workflow/review/opportunity-review.component";


export const routes: Routes = [
  {path: 'opportunities/:id', component: OpportunityPage}
];

routes.unshift(
  {path: 'opp/workspace', component: OPPWorkspacePage, canActivate: [OpportunityAuthGuard]},
  {path: 'opp/:id/review', component: OpportunityReviewComponent, canActivate: [OpportunityAuthGuard]}
);

export const routing = RouterModule.forChild(routes);
