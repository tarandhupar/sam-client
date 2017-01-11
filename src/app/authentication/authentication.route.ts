import { RouterModule, Routes } from '@angular/router';

import { RegisterGuard } from './register/register.guard';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register';
import { ProfileComponent } from './profile';

import RegisterRoutes from './register/register.routes';

export const routes: Routes = [
  { path: 'signin', component: LoginComponent },
  { path: 'signup', component: RegisterComponent, canActivateChild: [RegisterGuard], children: RegisterRoutes },
  { path: 'profile', component: ProfileComponent }
];

export const AuthenticationRouter = RouterModule.forChild(routes);
