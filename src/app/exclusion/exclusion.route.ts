import { Routes, RouterModule } from '@angular/router';
import { ExclusionsPage } from './exclusion.page.ts';

export const routes: Routes = [
  {
    path: 'exclusion/:id',
    component: ExclusionsPage
  },
];

export const routing = RouterModule.forChild(routes);
