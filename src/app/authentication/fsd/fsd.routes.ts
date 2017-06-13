import { UserComponent, UsersComponent } from './';

import { FSDGuard } from './fsd.guard';

export default [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: 'users',    component: UsersComponent },
  { path: 'user/:id', component: UserComponent }
];
