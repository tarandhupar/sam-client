import { ForgotInitialComponent } from './forgot-initial.component.ts';
import { ForgotConfirmComponent } from './forgot-confirm.component.ts';
import { ForgotMainComponent } from './forgot-main.component.ts';

export default [
  { path: '',        component: ForgotInitialComponent },
  { path: 'confirm', component: ForgotConfirmComponent },
  { path: 'main',    component: ForgotMainComponent }
];
