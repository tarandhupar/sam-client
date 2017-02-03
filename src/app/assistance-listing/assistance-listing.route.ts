import { Routes, RouterModule } from '@angular/router';
import { ProgramPage } from './assistance-listing.page';

export const routes: Routes = [
  { path: 'programs/:id/view', component: ProgramPage },
  { path: 'programs',  component: ProgramPage },
];

export const routing = RouterModule.forChild(routes);
