import { Routes, RouterModule } from '@angular/router';

import { IBreadcrumb } from 'sam-ui-elements/src/ui-kit/types';

import { IsLoggedInGuard } from '../application-content/403/is-logged-in.guard';
import { RequestAccessPage } from './request-access/request-access.page';
import { RoleCategoriesResolve } from './roles-categories.resolve';
import { CheckAccessGuard } from '../application-content/403/check-access.guard';

import { DetailsComponent } from './details/details.component';
import { MigrationsComponent } from './migrations/migrations.component';
import { MyAccessPage } from './access/my-access.page';
import { ProfileComponent } from './profile.component';
import { ResetComponent } from './reset/reset.component';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';

import { merge } from 'lodash';

interface Alert {
  title?: string;
  content?: string;
};

interface RouteData {
  title: string;
  breadcrumbs: Array<IBreadcrumb>;
  alert?: Alert;
};

const getRouteData = function(baseData: { [key: string]: any }|null, title: string, alert?: Alert ): RouteData {
  let data = {
    title: title,
    breadcrumbs: [
      { breadcrumb: title }
    ]
  };

  if(alert) {
    data['alert'] = alert;
  }

  baseData = baseData || {};

  return merge({}, data, baseData);
};

const alert = {
  title: 'Migrate Your Roles',
  content: `
    If you have a user account at any of the <a routerLink="/profile/migrations" fragment="legacy-sites">websites</a> that are moving to the new SAM.gov,
    you may migrate your roles and keep your same permissions. <a routerLink="/profile/migrations" fragment="top">Begin Now</a>.
  `,
};

export const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    canActivate: [ IsLoggedInGuard ],
    canActivateChild: [ IsLoggedInGuard ],
    children: [
      { path: '', redirectTo: 'details', pathMatch: 'full'  },
      { path: 'details', component: DetailsComponent, data: getRouteData(null, 'Account Details', alert) },
      { path: 'password', component: ResetComponent, data: getRouteData(null, 'Reset Password', alert) },
      { path: 'access', component: MyAccessPage, data: getRouteData({ isMyAccess: true, pageName: 'profile/access' }, 'My Roles') },
      { path: 'migrations', component: MigrationsComponent, data: getRouteData(null, 'Role Migrations') },
      { path: 'subscriptions', component: SubscriptionsComponent, data: getRouteData({ pageName: 'profile/subscriptions' }, 'Following') }
    ],
  },
  {
    path: 'request-access',
    component: RequestAccessPage,
    data: { pageName: 'profile/request-access'},
    resolve: { roleCategories: RoleCategoriesResolve },
    canActivate: [ IsLoggedInGuard, CheckAccessGuard ]
  },
];

export const routing = RouterModule.forChild(routes);
