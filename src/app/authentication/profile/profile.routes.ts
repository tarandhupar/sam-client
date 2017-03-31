import {
  DetailsComponent,
  MigrationsComponent,
  ResetComponent,
} from './';

export default [
  { path: '',           redirectTo: 'details', pathMatch: 'full' },
  { path: 'details',    component: DetailsComponent },
  { path: 'password',   component: ResetComponent },
  { path: 'migrations', component: MigrationsComponent },
];
