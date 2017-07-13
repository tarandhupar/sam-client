import { RouterModule, Routes } from '@angular/router';

/**
 * Components & Guards
 */
import { LoginComponent } from './login';
import { ProfileGuard, ProfileComponent } from './profile';
import { RegisterGuard, RegisterComponent } from './register';
import { ForgotComponent } from './forgot';

/**
 * Routes
 */
import ForgotRoutes from './forgot/forgot.routes';
import ProfileRoutes from './profile/profile.routes';
import RegisterRoutes from './register/register.routes';

export const routes: Routes = [
  { path: 'signin',    component: LoginComponent },
  { path: 'signout',   component: ProfileComponent,  canActivate: [ProfileGuard] },
  { path: 'signup',    component: RegisterComponent, canActivateChild: [RegisterGuard], children: RegisterRoutes },
  { path: 'forgot',    component: ForgotComponent,                                      children: ForgotRoutes },
  { path: 'fsdforgot', component: ForgotComponent,                                      children: ForgotRoutes },
  { path: 'profile',   component: ProfileComponent,  canActivateChild: [ProfileGuard],  children: ProfileRoutes },
];

export const AuthenticationRouter = RouterModule.forChild(routes);
