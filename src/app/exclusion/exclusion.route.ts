import { Routes, RouterModule } from '@angular/router';
import { ExclusionsPage } from './exclusion.page.ts';

export const routes: Routes = [
  {
    path: 'exclusions/:id',
    component: ExclusionsPage
  },
];

export const routing = RouterModule.forChild(routes);
