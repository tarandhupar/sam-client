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

export const routes: Routes = [];

if (SHOW_OPTIONAL === 'true' || ENV === 'development') {
  routes.unshift({path: 'users', component: UserDirectoryPage});
}

routes.unshift(
  {
    path: 'users',
    canActivateChild: [ IsLoggedInGuard, DeptAdminGuard ],
    resolve: { adminLevel: AdminLevelResolve },
    children: [
      {
        path: ':id/access',
        component: UserAccessPage,
        data: { isAdminView: true },
        resolve: { domains: DomainsResolve },
      },
      {
        path: ':id/role-details',
        component: UserRoleDetailsPage,
        data: { isAdminView: true },
        resolve: { details: UserRoleDetailsResolve },
      },
      {
        path: ':id/edit-access',
        component: GrantAccessPage,
        data: { mode: 'edit', isAdminView: true },
      },
      {
        path: ':id/grant-access',
        component: GrantAccessPage,
        resolve: { 'request': RequestAccessResolve },
        data: { mode: 'grant', isAdminView: true },
      },
    ]
  },
  {
    path: 'access-requests/:requestId',
    component: ViewRequestPage,    
    canActivate: [ IsLoggedInGuard ],
    resolve: {
      request: RequestAccessResolve,
    },
  },
  {
    path: 'access-requests/:requestId/respond',
    component: RequestResponsePage,    
    canActivate: [IsLoggedInGuard, DeptAdminGuard],
    resolve: {
      request: RequestAccessResolve,
    },
  },
  {
    path: 'profile/access',
    component: UserAccessPage,
    data: { isAdminView: false },
    resolve: { userName: UserNameResolve },
    canActivate: [ IsLoggedInGuard ]
  },
  // {
  //   path: 'profile/request-access',
  //   component: GrantAccessPage,
  //   data: { mode: 'request', isAdminView: false },
  //   resolve: { userName: UserNameResolve },
  //   canActivate: [ IsLoggedInGuard ]
  // },
  {
    path: 'profile/request-access',
    component: RequestAccessPage,
    data: { },
    resolve: { roleCategories: RoleCategoriesResolve },
    canActivate: [ IsLoggedInGuard ]
  },
  {
    path: 'profile/role-details',
    component: UserRoleDetailsPage,
    data: { isAdminView: false },
    resolve: { details: UserRoleDetailsResolve },
    canActivate: [ IsLoggedInGuard ]
  }
);

export const routing = RouterModule.forChild(routes);
