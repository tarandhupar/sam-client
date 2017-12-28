import { RouterModule, Routes } from '@angular/router';

import {
  RegistrationGuard,
  RegisterComponent,
  RegisterInitialComponent,
  RegisterConfirmComponent,
  RegisterMainComponent,
} from '.';

export const RegistrationRouter = RouterModule.forChild([
  {
    path: '',
    component: RegisterComponent,
    canActivate: [RegistrationGuard],
    children: [
      { path: '',        component: RegisterInitialComponent },
      { path: 'confirm', component: RegisterConfirmComponent },
      { path: 'main',    component: RegisterMainComponent }
    ]
  },
]);
