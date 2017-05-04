import { Routes, RouterModule } from '@angular/router';
import { UserDirectoryPage } from './directory/user-directory.page';
import { UserAccessPage } from './public/access/access.page';
import { UserViewComponent } from "./public/public.component";
import { UserMigrationsPage } from './public/migrations/migrations.page';
import { UserProfilePage } from './public/profile/profile.page';
import { GrantAccessPage } from "./public/grant-access/grant-access.page";
import { RequestAccessResolve } from "./request-access.resolve";
import { AdminOnlyGuard } from "../application-content/403/admin-only.guard";
import {AdminOrDeptAdminGuard} from "../application-content/403/admin-or-dept-admin.guard";

export const routes: Routes = [];

if (SHOW_OPTIONAL === 'true' || ENV === 'development') {
  routes.unshift({path: 'users', component: UserDirectoryPage});
}

routes.unshift(
  {
    path: 'users/:id',
    component: UserViewComponent,
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile',  component: UserProfilePage },
      { path: 'migrations',  component: UserMigrationsPage },
      { path: 'access',  component: UserAccessPage, },
    ]
  },
  { path: 'users/:id/edit-access',  component: GrantAccessPage, canActivate: [AdminOrDeptAdminGuard] },
  { path: 'users/:id/grant-access',  component: GrantAccessPage, canActivate: [AdminOrDeptAdminGuard], resolve: { 'request': RequestAccessResolve }},
  { path: 'users/:id/request-access',  component: GrantAccessPage },
);

export const routing = RouterModule.forChild(routes);
