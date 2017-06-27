import { DetailsComponent, MigrationsComponent, ResetComponent } from './';

import { ProfileResolve } from './profile.resolve';

export default [
  { path: '', redirectTo: 'details', pathMatch: 'full' },
  { path: 'details',      component: DetailsComponent, resolve: { roles: ProfileResolve } },
  { path: 'password',     component: ResetComponent },
  { path: 'migrations',   component: MigrationsComponent },
];
