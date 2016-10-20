import { Routes, RouterModule } from '@angular/router';
import { OpportunityPageComponent } from './opportunity.page';

export const routes: Routes = [
  {
    path: 'opportunities/:id',
    component: OpportunityPageComponent
  },
];

export const routing = RouterModule.forChild(routes);
