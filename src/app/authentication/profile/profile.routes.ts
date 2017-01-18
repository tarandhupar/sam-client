import { DetailsComponent } from './details/details.component.ts';
import { MigrationsComponent } from './migrations/migrations.component.ts';

export default [
  { path: '',  redirectTo: 'details' },
  { path: 'details', component: DetailsComponent },
  { path: 'migrations', component: MigrationsComponent }
];
