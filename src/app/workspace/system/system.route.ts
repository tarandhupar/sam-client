import { RouterModule } from '@angular/router';

import { IsLoggedInGuard } from 'app-services/is-logged-in.guard';
import { SystemGuard } from './system.guard';

import {
  SystemComponent,
  SystemDirectoryComponent,
  SystemCreateComponent,
  SystemProfileComponent,
  SystemPasswordComponent,
  SystemMigrationsComponent,
  SystemStatusComponent,
} from './';

import { IBreadcrumb } from 'sam-ui-elements/src/ui-kit/types';

interface RouteData {
  breadcrumbs?: (IBreadcrumb[]|boolean),
}

function getRouteData(...breadcrumbs: Array<IBreadcrumb>): RouteData {
  return {
    breadcrumbs: breadcrumbs.length ? breadcrumbs : false,
  }
}

const home = {
  breadcrumb: 'System Accounts',
  url: '/workspace/system'
};

export const SystemRouter = RouterModule.forChild([
  {
    path: '',
    component: SystemComponent,
    canActivate: [ IsLoggedInGuard, SystemGuard ],
    canActivateChild: [ IsLoggedInGuard, SystemGuard ],
    children: [
      {
        path: '',
        component: SystemDirectoryComponent,
        data: getRouteData({ breadcrumb: 'System Accounts Directory' }),
      },
      {
        path: 'new',
        component: SystemCreateComponent,
        data: getRouteData(home, { breadcrumb: 'New System Account' }),
      },
      {
        path: 'new/:id',
        component: SystemCreateComponent,
        data: getRouteData(home, { breadcrumb: 'New System Account' }),
      },
      {
        path: 'profile',
        component: SystemProfileComponent,
        data: getRouteData(home, { breadcrumb: 'System Account Profile' }),
      },
      {
        path: 'profile/:id',
        component: SystemProfileComponent,
        data: getRouteData(home, { breadcrumb: 'System Account Profile' }),
      },
      {
        path: 'password',
        component: SystemPasswordComponent,
        data: getRouteData({ breadcrumb: 'System Account Password Reset' }),
      },
      {
        path: 'password/:id',
        component: SystemPasswordComponent,
        data: getRouteData(home, { breadcrumb: 'System Account Password Reset' }),
      },
      {
        path: 'migrations',
        component: SystemMigrationsComponent,
        data: getRouteData(home, { breadcrumb: 'System Account Migration' }),
      },
      {
        path: 'status/:id',
        component: SystemStatusComponent,
        data: getRouteData(),
      },
    ],
  }
]);
