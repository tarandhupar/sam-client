import { Routes, RouterModule } from '@angular/router';
import { UserDirectoryPage } from './directory/user-directory.page';
import { UserAccessPage } from './public/access/access.page';
import { UserViewComponent } from "./public/public.component";
import { UserMigrationsPage } from './public/migrations/migrations.page';
import { UserProfilePage } from './public/profile/profile.page';

export const routes: Routes = [];

if (SHOW_OPTIONAL === 'true' || ENV === 'development') {
  routes.unshift({ path: 'users',  component: UserDirectoryPage });
  routes.unshift({
    path: 'users/:id',
    component: UserViewComponent,
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile',  component: UserProfilePage },
      { path: 'migrations',  component: UserMigrationsPage },
      { path: 'access',  component: UserAccessPage },
    ]
  });
}

export const routing = RouterModule.forChild(routes);
