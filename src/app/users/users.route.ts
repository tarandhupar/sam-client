import { Routes, RouterModule } from '@angular/router';
import { UserDirectoryPage } from './directory/user-directory.page';
import { UserAccessPage } from './access/access.page';
import { UserViewComponent } from "./public/public.component";
import { UserMigrationsPage } from './public/migrations/migrations.page';
import { UserProfilePage } from './public/profile/profile.page';
import { GrantAccessPage } from "./grant-access/grant-access.page";
import { RequestAccessResolve } from "./request-access.resolve";
import { DeptAdminGuard } from "../application-content/403/dept-admin.guard";
import { UserRoleDetailsPage } from "./user-role-details/user-role-details.page";
import { UserRoleDetailsResolve } from "./user-role-details.resolve";
import { DomainsResolve } from "../role-management/domains.resolve";
import { AdminLevelResolve } from "../application-content/403/admin-level.resolve";
import { UserNameResolve } from "../application-content/403/user-name.resolve";
import {ProfileGuard} from "../authentication/profile/profile.guard";
import {IsLoggedInGuard} from "../application-content/403/is-logged-in.guard";
import { RequestAccessPage } from "./request-access/request-access.page";
import { RoleCategoriesResolve } from "./roles-categories.resolve";
import { ViewRequestPage } from "./view-request/view-request.page";
import { RequestStatusNamesResolve } from "../role-management/request-statuses.resolve";
import { RequestResponsePage } from "./request-response/request-response.page";
import { CheckAccessGuard } from "../application-content/403/check-access.guard";

export const routes: Routes = [];

if (SHOW_OPTIONAL === 'true' || ENV === 'development') {
  routes.unshift({path: 'users', component: UserDirectoryPage});
}

routes.unshift(
  {
    path: 'users',
    canActivateChild: [ IsLoggedInGuard ],
    resolve: { adminLevel: AdminLevelResolve },
    children: [
      {
        path: ':id/access',
        component: UserAccessPage,
        data: { isAdminView: true, pageName: 'users/:id/access' },
        canActivate: [ CheckAccessGuard ],
        resolve: { domains: DomainsResolve },
      },
      {
        path: ':id/role-details',
        component: UserRoleDetailsPage,
        canActivate: [ CheckAccessGuard ],
        data: { isAdminView: true, pageName: 'users/:id/role-details' },
        resolve: { details: UserRoleDetailsResolve },
      },
      {
        path: ':id/edit-access',
        component: GrantAccessPage,
        canActivate: [ CheckAccessGuard ],
        data: { mode: 'edit', isAdminView: true, pageName: 'users/:id/edit-access' },
      },
      {
        path: ':id/grant-access',
        component: GrantAccessPage,
        canActivate: [ CheckAccessGuard ],
        resolve: { 'request': RequestAccessResolve },
        data: { mode: 'grant', isAdminView: true, pageName: 'users/:id/grant-access' },
      },
    ]
  },
  {
    path: 'access-requests/:requestId',
    component: ViewRequestPage,
    data: { pageName: 'access-requests/:id' },
    canActivate: [ IsLoggedInGuard, CheckAccessGuard ],
    resolve: {
      request: RequestAccessResolve,
    },
  },
  {
    path: 'access-requests/:requestId/respond',
    component: RequestResponsePage,
    data: { pageName: 'access-requests/:id/respond' },
    canActivate: [ IsLoggedInGuard, CheckAccessGuard ],
    resolve: {
      request: RequestAccessResolve,
    },
  },
  {
    path: 'profile/access',
    component: UserAccessPage,
    data: { isAdminView: false, pageName: 'profile/access' },
    resolve: { userName: UserNameResolve },
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
    path: 'profile/role-details',
    component: UserRoleDetailsPage,
    data: { isAdminView: false, pageName: 'profile/role-details' },
    resolve: { details: UserRoleDetailsResolve },
    canActivate: [ IsLoggedInGuard, CheckAccessGuard ]
  }
);

export const routing = RouterModule.forChild(routes);
