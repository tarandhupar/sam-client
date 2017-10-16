import { Routes, RouterModule } from '@angular/router';
import { IsLoggedInGuard } from "../application-content/403/is-logged-in.guard";
import { RequestAccessPage } from "./request-access/request-access.page";
import { RoleCategoriesResolve } from "./roles-categories.resolve";
import { CheckAccessGuard } from "../application-content/403/check-access.guard";
import { MyAccessPage } from "./access/my-access.page";
import {SubscriptionsComponent} from "./subscriptions/subscriptions.component";

export const routes: Routes = [
  {
    path: 'profile/access',
    component: MyAccessPage,
    data: { isMyAccess: true, pageName: 'profile/access' },
    canActivate: [ IsLoggedInGuard, CheckAccessGuard ]
  },
  {
    path: 'profile/request-access',
    component: RequestAccessPage,
    data: { pageName: 'profile/request-access'},
    resolve: { roleCategories: RoleCategoriesResolve },
    canActivate: [ IsLoggedInGuard, CheckAccessGuard ]
  },
  {
    path: 'profile/subscriptions',
    component: SubscriptionsComponent,
    data: { pageName: 'profile/subscriptions' },
    canActivate: [ IsLoggedInGuard ]
  },
];

export const routing = RouterModule.forChild(routes);
