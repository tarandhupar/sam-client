import {
  SystemProfileComponent,
  SystemPasswordComponent,
  SystemMigrationsComponent,
} from './';

export default [
  { path: '', redirectTo: 'profile', pathMatch: 'full' },
  { path: 'profile',      component: SystemProfileComponent },
  { path: 'profile/:id',  component: SystemProfileComponent },
  { path: 'password',     component: SystemPasswordComponent },
  { path: 'password/:id', component: SystemPasswordComponent },
  { path: 'migrations',   component: SystemMigrationsComponent },
];
