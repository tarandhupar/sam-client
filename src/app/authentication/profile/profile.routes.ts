import {
  // User
  DetailsComponent,
  MigrationsComponent,
  ResetComponent,
  // System Account
  SystemDetailsComponent,
  SystemResetComponent,
} from './';

export default [
  { path: '',       redirectTo: 'details', pathMatch: 'full' },
  { path: 'system', children: [
    { path: '', redirectTo: 'details', pathMatch: 'full' },
    { path: 'details', component: SystemDetailsComponent },
    { path: 'reset', component: SystemResetComponent }
  ] },
  { path: 'details', component: DetailsComponent },
  { path: 'password', component: ResetComponent },
  { path: 'migrations', component: MigrationsComponent },
];
