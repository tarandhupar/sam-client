import { RouterModule, Routes } from '@angular/router';

import { ProfileGuard } from './profile/profile.guard';

import { LoginComponent } from './login';
import { ProfileComponent } from './profile';

import ProfileRoutes from './profile/profile.routes';

export const routes: Routes = [
  { path: 'signin', component: LoginComponent },
  { path: 'profile', component: ProfileComponent, canActivateChild: [ProfileGuard], children: ProfileRoutes }
];

export const AuthenticationRouter = RouterModule.forChild(routes);
