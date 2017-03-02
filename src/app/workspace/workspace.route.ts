import {Routes, RouterModule} from '@angular/router';
import {WorkspacePage} from './workspace.page';

export const routes: Routes = [
  {
    path: 'workspace',
    component: WorkspacePage,
  },
];

export const routing = RouterModule.forChild(routes);
