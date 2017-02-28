import { Routes, RouterModule } from '@angular/router';
import { ProgramPage } from './assistance-listing.page';
import { ProgramDisplayPageDemoPage } from './display-template-demo/display-template-demo.page';
import { ProgramPageOperations } from './assistance-listing-operations/assistance-listing-operations.page';

export const routes: Routes = [
  { path: 'programs/:id/view', component: ProgramPage },
  { path: 'programs',  component: ProgramPage },
  { path: 'programs/new', component:ProgramPageOperations },
  { path: 'programs/:id/edit', component:ProgramPageOperations },
];
if (SHOW_OPTIONAL === 'true' || ENV === 'development') {
  routes.unshift({ path: 'programs/demo', component: ProgramDisplayPageDemoPage });
}
export const routing = RouterModule.forChild(routes);
