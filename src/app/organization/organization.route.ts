import { Routes, RouterModule } from '@angular/router';
import { OrganizationPage } from './organization.page.ts';
import { OrganizationDisplayPageDemoPage } from './display-template-demo/display-template-demo.page';

export const routes: Routes = [
  {
    path: 'organization/:id',
    component: OrganizationPage
  },
];
if (SHOW_OPTIONAL === 'true' || ENV === 'development') {
  routes.unshift({ path: 'organization/demo', component: OrganizationDisplayPageDemoPage });
}
export const routing = RouterModule.forChild(routes);
