import { Routes, RouterModule } from '@angular/router';

import { WorkspacePage } from "./workspace.page";
import { FSDComponent, FSDGuard } from './fsd';
import { SystemComponent, SystemGuard } from './system';

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
];

export const routing = RouterModule.forChild(routes);
