import {
  SystemProfileComponent,
  SystemPasswordComponent,
} from './';

export default [
  { path: '',         redirectTo: 'profile', pathMatch: 'full' },
  { path: 'profile',  component: SystemProfileComponent },
  { path: 'password', component: SystemPasswordComponent },
];
