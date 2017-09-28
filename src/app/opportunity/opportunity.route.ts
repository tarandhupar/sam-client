import { Routes, RouterModule } from '@angular/router';
import { OpportunityPage } from './opportunity.page';
import {AuthGuard} from "../../api-kit/authguard/authguard.service";
import {OPPWorkspacePage} from "./opportunity-workspace/opportunity-workspace.page";

export const routes: Routes = [
  { path: 'opportunities/:id', component: OpportunityPage }
];

  routes.unshift(
    {path: 'opp/workspace', component: OPPWorkspacePage, canActivate: [AuthGuard]}
  );

export const routing = RouterModule.forChild(routes);
