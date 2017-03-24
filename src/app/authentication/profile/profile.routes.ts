import {
  DetailsComponent,
  SystemDetailsComponent,
  MigrationsComponent,
  ResetComponent
} from './';

export default [
  { path: '',       redirectTo: 'details', pathMatch: 'full' },
  { path: 'system', redirectTo: 'details/system' },
  { path: 'details', children: [
    { path: '',       component: DetailsComponent },
    { path: 'system', component: SystemDetailsComponent },
  ] },
  { path: 'password',   component: ResetComponent },
  { path: 'migrations', component: MigrationsComponent },
];
