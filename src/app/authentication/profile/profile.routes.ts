import { DetailsComponent } from './details/details.component.ts';
import { ResetComponent } from './reset/reset.component.ts';
import { MigrationsComponent } from './migrations/migrations.component.ts';

export default [
  { path: '',  redirectTo: 'details' },
  { path: 'details', component: DetailsComponent },
  { path: 'password', component: ResetComponent },
  { path: 'migrations', component: MigrationsComponent }
];
