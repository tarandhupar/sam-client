import { Routes, RouterModule } from '@angular/router';
import { ProgramViewComponent } from './program-view.component';

export const routes: Routes = [
  { path: 'programs/:id/view', component: ProgramViewComponent },
  { path: 'programs',  component: ProgramViewComponent },
];

export const routing = RouterModule.forChild(routes);
