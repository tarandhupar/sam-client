import { Routes, RouterModule } from '@angular/router';
import { OrganizationPage } from './organization.page.ts';
import { OrganizationDisplayPageDemoPage } from './display-template-demo/display-template-demo.page';

export const routes: Routes = [
  {
    path: 'organization/demo',
    component: OrganizationDisplayPageDemoPage
  },
  {
    path: 'organization/:id',
    component: OrganizationPage
  },
];

export const routing = RouterModule.forChild(routes);
