import { Routes, RouterModule } from '@angular/router';
import { OrganizationPage } from './organization.page.ts';

export const routes: Routes = [
  {
    path: 'organization/:id',
    component: OrganizationPage
  },
];

export const routing = RouterModule.forChild(routes);
