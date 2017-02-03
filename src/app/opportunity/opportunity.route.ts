import { Routes, RouterModule } from '@angular/router';
import { OpportunityPage } from './opportunity.page';
import { OpportunityDisplayPageDemoPage } from './display-template-demo/display-template-demo.page';

export const routes: Routes = [
  {
    path: 'opportunities/:id',
    component: OpportunityPage
  }
];

if (SHOW_OPTIONAL === 'true' || ENV === 'development') {
  routes.unshift({ path: 'opportunity/demo', component: OpportunityDisplayPageDemoPage });
}
export const routing = RouterModule.forChild(routes);
