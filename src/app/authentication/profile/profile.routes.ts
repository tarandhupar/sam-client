import { DetailsComponent } from './details/details.component.ts';
import { PasswordResetComponent } from './password-reset/password-reset.component.ts';

export default [
  { path: '',  redirectTo: 'details' },
  { path: 'details', component: DetailsComponent },
  { path: 'password', component: PasswordResetComponent }
];
