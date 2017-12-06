import { RouterModule, Routes } from '@angular/router';

import { ForgotComponent } from '.';
import { ForgotInitialComponent, ForgotConfirmComponent, ForgotMainComponent } from './forgot';

export const RecoveryRouter = RouterModule.forChild([
  {
    path: '',
    component: ForgotComponent,
    children: [
      { path: '',        component: ForgotInitialComponent },
      { path: 'confirm', component: ForgotConfirmComponent },
      { path: 'main',    component: ForgotMainComponent }
    ]
  },
]);
