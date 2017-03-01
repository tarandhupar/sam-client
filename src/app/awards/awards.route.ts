import { Routes, RouterModule } from '@angular/router';
import { AwardsPage } from './awards.page.ts';

export const routes: Routes = [
  {
    path: 'awards/:id',
    component: AwardsPage
  },
];

export const routing = RouterModule.forChild(routes);
