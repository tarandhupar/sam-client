import { Routes, RouterModule } from '@angular/router';
import { OpportunityPage } from './opportunity.page';

export const routes: Routes = [
  {
    path: 'opportunities/:id',
    component: OpportunityPage
  },
];

export const routing = RouterModule.forChild(routes);
