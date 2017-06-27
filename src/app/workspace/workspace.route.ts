import { Routes, RouterModule } from '@angular/router';

import { WorkspacePage } from "./workspace.page";
import { SystemComponent, SystemGuard } from './system';

import { IsAdminResolve } from "../application-content/403/admin.resolve";
import { AdminLevelResolve } from "../application-content/403/admin-level.resolve";
import { IsLoggedInGuard } from "../application-content/403/is-logged-in.guard";
import { DeptAdminGuard } from "../application-content/403/dept-admin.guard";

import SystemRoutes from './system/system.routes';

export const routes: Routes = [
  { path: 'workspace',
    component: WorkspacePage,
    canActivate: [ IsLoggedInGuard ],
    resolve: { adminLevel: AdminLevelResolve },
  },
  {
    path: 'workspace/system',
    component: SystemComponent,
    canActivate: [ IsLoggedInGuard, SystemGuard ],
    canActivateChild: [ IsLoggedInGuard, SystemGuard ],
    children: SystemRoutes
  },
];

export const routing = RouterModule.forChild(routes);
