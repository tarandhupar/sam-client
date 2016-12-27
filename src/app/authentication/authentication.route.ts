import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: 'signin', component: LoginComponent }
];

export const Routing = RouterModule.forChild(routes);
