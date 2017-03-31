import { RouterModule, Routes } from '@angular/router';

/**
 * Route Guards
 */
import { RegisterGuard } from './register/register.guard';
import { ProfileGuard } from './profile/profile.guard';
import { SystemGuard } from './system/system.guard';

/**
 * Components
 */
import { LoginComponent } from './login';
import { ForgotComponent } from './forgot';
import { RegisterComponent } from './register';
import { ProfileComponent } from './profile';
import { SystemComponent } from './system';

/**
 * Routes
 */
import RegisterRoutes from './register/register.routes';
import ForgotRoutes from './forgot/forgot.routes';
import ProfileRoutes from './profile/profile.routes';
import SystemRoutes from './system/system.routes';

export const routes: Routes = [
  { path: 'signin',  component: LoginComponent },
  { path: 'signout', component: ProfileComponent,  canActivate: [ProfileGuard] },
  { path: 'signup',  component: RegisterComponent, canActivateChild: [RegisterGuard], children: RegisterRoutes },
  { path: 'forgot',  component: ForgotComponent,                                      children: ForgotRoutes },
  { path: 'profile', component: ProfileComponent,  canActivateChild: [ProfileGuard],  children: ProfileRoutes },
  { path: 'system',  component: SystemComponent,   canActivateChild: [SystemGuard],   children: SystemRoutes }
];

export const AuthenticationRouter = RouterModule.forChild(routes)
