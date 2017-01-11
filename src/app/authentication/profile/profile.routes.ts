import { DetailsComponent } from './details/details.component.ts';
import { PasswordComponent } from './password/password.component.ts';

export default [
  { path: '',  redirectTo: 'details' },
  { path: 'details', component: DetailsComponent },
  { path: 'password', component: PasswordComponent }
];
