import { Routes, RouterModule } from '@angular/router';
import { ProgramPage } from './assistance-listing.page';
import { ProgramDisplayPageDemoPage } from './display-template-demo/display-template-demo.page';

export const routes: Routes = [
  { path: 'programs/:id/view', component: ProgramPage },
  { path: 'programs',  component: ProgramPage },
];
if (SHOW_OPTIONAL === 'true' || ENV === 'development') {
  routes.unshift({ path: 'programs/demo', component: ProgramDisplayPageDemoPage });
}
export const routing = RouterModule.forChild(routes);
