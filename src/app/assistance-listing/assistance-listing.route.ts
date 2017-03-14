import {Routes, RouterModule} from '@angular/router';
import {ProgramPage} from './assistance-listing.page';
import {ProgramDisplayPageDemoPage} from './display-template-demo/display-template-demo.page';
import {ProgramPageOperations} from './assistance-listing-operations/assistance-listing-operations.page';
import {FalWorkspacePage} from './assistance-listing-workspace/assistance-listing-workspace.page';
import {AccessRestrictedPage} from './assistance-listing-workspace/program-result/testauthenvironment.page';

export const routes: Routes = [
  {path: 'programs/:id/view', component: ProgramPage},
  {path: 'programs', component: ProgramPage},
  {path: 'accessrestricted', component: AccessRestrictedPage},
];
if (SHOW_OPTIONAL === 'true' || ENV === 'development') {
  routes.unshift({path: 'programs/demo', component: ProgramDisplayPageDemoPage});
}
if (SHOW_HIDE_RESTRICTED_PAGES === 'true' || ENV === 'development') {
  routes.unshift(
    {path: 'falworkspace', component: FalWorkspacePage},
    {path: 'programs/add', component: ProgramPageOperations},
    {path: 'programs/:id/edit', component: ProgramPageOperations}
  );
}
export const routing = RouterModule.forChild(routes);
