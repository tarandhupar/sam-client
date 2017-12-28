import { RouterModule } from '@angular/router';

import { FSDGuard } from './fsd.guard';
import { IsLoggedInGuard } from 'app-services/is-logged-in.guard';
import { RmAccessGuard } from 'app-services/rm-access.guard';

import { FSDUserResolve } from './fsd-user/fsd-user.resolve';
import { UserResolve } from 'role-management/user.resolve';

import { FSDComponent } from './fsd.component';
import { FSDUserComponent } from './fsd-user/fsd-user.component';
import { FSDUsersComponent } from './fsd-users/fsd-users.component';

import { MyAccessPage } from 'users/access/my-access.page';

import { merge } from 'lodash';

interface RouteData {
  title: string;
  breadcrumbs: Array<IBreadcrumb>;
};

const crumb = { breadcrumb: 'FSD', url: '/workspace/fsd/users' };
const getRouteData = function(baseData: { [key: string]: any }|null, title: string, root: boolean = false): RouteData {
  let data = {
    title: title,
    breadcrumbs: [
      { breadcrumb: title },
    ]
  };

  if(!root) {
    data.breadcrumbs.unshift(crumb);
  }

  baseData = baseData || {};

  return merge({}, data, baseData);
};

export const FSDRouter = RouterModule.forChild([
  {
    path: '',
    component: FSDComponent,
    canActivate: [ IsLoggedInGuard, FSDGuard ],
    canActivateChild: [ IsLoggedInGuard, FSDGuard ],
    children: [
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full'
      },
      { path: 'users',
        component: FSDUsersComponent,
        data: getRouteData(null, 'Users Directory', true),
      },
      {
        path: 'user/:id/access',
        component: MyAccessPage,
        canActivate: [ RmAccessGuard ],
        data: getRouteData({ isMyAccess: false, pageName: 'users/:id/access', }, 'User Account Roles'),
        resolve: {
          user: UserResolve,
        },
      },
      { path: 'user/:id',
        component: FSDUserComponent,
        data: getRouteData(null, 'User Account Info'),
        resolve: {
          user: FSDUserResolve,
        },
      },
    ],
  }
]);
