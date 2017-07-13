import { FSDUserComponent, FSDUsersComponent } from './';

import { FSDGuard } from './fsd.guard';

export default [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: 'users',    component: FSDUsersComponent, data: {
    breadcrumbs: [
      { breadcrumb: 'FSD Users Directory' }
    ]
  } },
  { path: 'user/:id', component: FSDUserComponent,  data: {
    breadcrumbs: [
      { breadcrumb: 'FSD', url: '/workspace/fsd/users' },
      { breadcrumb: 'FSD User Profile' }
    ]
  } },
];
