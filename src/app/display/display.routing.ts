import { Routes, RouterModule } from '@angular/router';
import { OpportunityViewComponent } from './opportunities/opportunity-view.component';

export const routes: Routes = [
  {
    path: 'opportunities/:id/view',
    component: OpportunityViewComponent
  },
];

export const routing = RouterModule.forChild(routes);
