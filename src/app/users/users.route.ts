import { Routes, RouterModule } from '@angular/router';
import { UserDirectoryPage } from './directory/user-directory.page';
import { UserViewComponent } from "./public/public.component";
import { UserMigrationsPage } from './public/migrations/migrations.page';
import { UserProfilePage } from './public/profile/profile.page';
import { GrantAccessPage } from "./grant-access/grant-access.page";
import { RequestAccessResolve } from "./request-access.resolve";
import { DeptAdminGuard } from "../application-content/403/dept-admin.guard";
import { UserRoleDetailsPage } from "./user-role-details/user-role-details.page";
import { UserRoleDetailsResolve } from "./user-role-details.resolve";
import { IsLoggedInGuard } from "../application-content/403/is-logged-in.guard";
import { RequestAccessPage } from "./request-access/request-access.page";
import { RoleCategoriesResolve } from "./roles-categories.resolve";
import { ViewRequestPage } from "./view-request/view-request.page";
import { RequestResponsePage } from "./request-response/request-response.page";
import { CheckAccessGuard } from "../application-content/403/check-access.guard";
import { MyAccessPage } from "./access/my-access.page";

export const routes: Routes = [];

if (SHOW_OPTIONAL === 'true' || ENV === 'development') {
  routes.unshift({path: 'users', component: UserDirectoryPage});
}

routes.unshift(
  {
    path: 'users',
    canActivateChild: [ IsLoggedInGuard ],
    children: [
      {
        path: ':id/access',
        component: MyAccessPage,
        data: { isMyAccess: false, pageName: 'users/:id/access' },
        canActivate: [ CheckAccessGuard ],
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
    path: 'profile/role-details',
    component: UserRoleDetailsPage,
    data: { isAdminView: false, pageName: 'profile/role-details' },
    resolve: { details: UserRoleDetailsResolve },
    canActivate: [ IsLoggedInGuard, CheckAccessGuard ]
  }
);

export const routing = RouterModule.forChild(routes);
