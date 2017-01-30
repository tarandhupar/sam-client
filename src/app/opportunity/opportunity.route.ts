import { Routes, RouterModule } from '@angular/router';
import { OpportunityPage } from './opportunity.page';
import { OpportunityDisplayPageDemoPage } from './display-template-demo/display-template-demo.page';

export const routes: Routes = [
  {
    path: 'opportunities/:id',
    component: OpportunityPage
  },
  {
  	path: 'opportunity/demo',
  	component: OpportunityDisplayPageDemoPage
  }
];

export const routing = RouterModule.forChild(routes);
