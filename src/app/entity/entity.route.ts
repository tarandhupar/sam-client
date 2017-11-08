import { Routes, RouterModule } from '@angular/router';
import { EntityPage } from './entity.page.ts';

export const routes: Routes = [
  {
    path: '',
    component: EntityPage
  },
];

export const routing = RouterModule.forChild(routes);
