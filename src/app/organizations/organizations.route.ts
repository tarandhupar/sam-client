import { Routes, RouterModule } from '@angular/router';
import { OrganizationsPage } from './organizations.page';

export const routes: Routes = [
  {
    path: 'organizations/:id',
    component: OrganizationsPage
  },
];

export const routing = RouterModule.forChild(routes);
