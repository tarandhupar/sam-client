import { Routes, RouterModule } from '@angular/router';
import { ProgramPage } from './assistance-listing.page';
import { ProgramDisplayPageDemoPage } from './display-template-demo/display-template-demo.page';
import { ProgramPageOperations } from './assistance-listing-operations/assistance-listing-operations.page';
import { FalWorkspacePage } from './assistance-listing-workspace/assistance-listing-workspace.page';

export const routes: Routes = [
  { path: 'falworkspace', component: FalWorkspacePage},
  { path: 'programs/:id/view', component: ProgramPage },
  { path: 'programs',  component: ProgramPage },
  { path: 'programs/add', component:ProgramPageOperations },
  { path: 'programs/:id/edit', component:ProgramPageOperations },
];
if (SHOW_OPTIONAL === 'true' || ENV === 'development') {
  routes.unshift({ path: 'programs/demo', component: ProgramDisplayPageDemoPage });
}
export const routing = RouterModule.forChild(routes);
