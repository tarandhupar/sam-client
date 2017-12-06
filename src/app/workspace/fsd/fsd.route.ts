import { RouterModule } from '@angular/router';

import { FSDGuard } from './fsd.guard';
import { IsLoggedInGuard } from 'application-content/403/is-logged-in.guard';

import { FSDComponent } from './fsd.component';
import { FSDUserComponent } from './fsd-user/fsd-user.component';
import { FSDUsersComponent } from './fsd-users/fsd-users.component';

export const FSDRouter = RouterModule.forChild([
  {
    path: '',
    component: FSDComponent,
    canActivate: [ IsLoggedInGuard, FSDGuard ],
    canActivateChild: [ IsLoggedInGuard, FSDGuard ],
    children: [
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full'
      },
      { path: 'users', component: FSDUsersComponent, data: {
        breadcrumbs: [
          { breadcrumb: 'FSD Users Directory' }
        ]
      } },
      { path: 'user/:id', component: FSDUserComponent, data: {
        breadcrumbs: [
          { breadcrumb: 'FSD', url: '/workspace/fsd/users' },
          { breadcrumb: 'FSD User Profile' }
        ]
      } },
    ],
  }
]);
