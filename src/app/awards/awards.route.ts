import { Routes, RouterModule } from '@angular/router';
import { AwardsPage } from './awards.page.ts';

export const routes: Routes = [
  { path: '', component: AwardsPage },
];

export const routing = RouterModule.forChild(routes);
