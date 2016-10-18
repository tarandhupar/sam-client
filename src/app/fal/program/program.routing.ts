import { Routes, RouterModule } from '@angular/router';
import { ProgramViewPage } from './program-view.component';

export const routes: Routes = [
  { path: 'programs/:id/view', component: ProgramViewPage },
  { path: 'programs',  component: ProgramViewPage },
];

export const routing = RouterModule.forChild(routes);
