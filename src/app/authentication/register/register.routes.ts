import { RegisterInitialComponent } from './register-initial.component.ts';
import { RegisterConfirmComponent } from './register-confirm.component.ts';
import { RegisterMainComponent } from './register-main.component.ts';

export default [
  { path: '',        component: RegisterInitialComponent },
  { path: 'confirm', component: RegisterConfirmComponent },
  { path: 'main',    component: RegisterMainComponent }
];
