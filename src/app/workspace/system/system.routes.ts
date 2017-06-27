import {
  SystemDirectoryComponent,
  SystemProfileComponent,
  SystemPasswordComponent,
  SystemMigrationsComponent,
} from './';

export default [
  { path: '',             component: SystemDirectoryComponent },
  { path: 'profile',      component: SystemProfileComponent },
  { path: 'profile/:id',  component: SystemProfileComponent },
  { path: 'password',     component: SystemPasswordComponent },
  { path: 'password/:id', component: SystemPasswordComponent },
  { path: 'migrations',   component: SystemMigrationsComponent },
];
