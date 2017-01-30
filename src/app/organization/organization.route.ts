import { Routes, RouterModule } from '@angular/router';
import { OrganizationPage } from './organization.page.ts';
import { OrganizationDisplayPageDemoPage } from './display-template-demo/display-template-demo.page';

export const routes: Routes = [
  {
    path: 'organization/:id',
    component: OrganizationPage
  },
  {
    path: 'organization/demo/:id',
    component: OrganizationDisplayPageDemoPage
  },
];

export const routing = RouterModule.forChild(routes);
