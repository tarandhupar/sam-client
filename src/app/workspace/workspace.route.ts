import { Routes, RouterModule } from '@angular/router';

import { ApplicationRequestsComponent } from './requests/application-requests/application-requests.component';
import { FSDComponent, FSDGuard } from './fsd';
import { HelpContentManagementViewComponent } from "./content-management/view/content-management-view.component";
import { HelpContentManagementEditComponent } from "./content-management/edit/content-management-edit.component";
import { MsgFeedComponent } from "./msg-feed/msg-feed.component";
import { SystemComponent, SystemGuard, SecurityGuard } from './system';
import { WorkspacePage } from "./workspace.page";

import { AdminLevelResolve } from "../application-content/403/admin-level.resolve";
import { IsLoggedInGuard } from "../application-content/403/is-logged-in.guard";

import FSDRouter from './fsd/fsd.route';
import SystemRouter from './system/system.route';

export const routes: Routes = [
  { path: 'workspace',
    component: WorkspacePage,
  },
  {
    path: 'workspace/fsd',
    component: FSDComponent,
    canActivate: [ IsLoggedInGuard, FSDGuard ],
    canActivateChild: [ IsLoggedInGuard, FSDGuard ],
    children: FSDRouter,
  },
  {
    path: 'workspace/system',
    component: SystemComponent,
    canActivate: [ IsLoggedInGuard, SystemGuard ],
    canActivateChild: [ IsLoggedInGuard, SystemGuard ],
    children: SystemRouter,
  },
  {
    path: 'workspace/requests/system/:id',
    component: ApplicationRequestsComponent,
    canActivate: [ IsLoggedInGuard, SecurityGuard ],
  },
  {
    path: 'workspace/myfeed/:section',
    component: MsgFeedComponent
  },
  {
    path: 'workspace/myfeed/:section/:subsection',
    component: MsgFeedComponent
  },
  {
    path: 'workspace/content-management/:section',
    component: HelpContentManagementViewComponent
  },
  {
    path: 'workspace/content-management/:section/edit',
    component: HelpContentManagementEditComponent
  },
];

export const routing = RouterModule.forChild(routes);
