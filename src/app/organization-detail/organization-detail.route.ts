import { Routes, RouterModule } from '@angular/router';
import { OrgDetailPage } from './organization-detail.page';
import { OrgDetailProfilePage } from './profile/profile.component';


export const routes: Routes = [
  {
    path: 'organization-detail/:orgId',
    component: OrgDetailPage,
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile',  component: OrgDetailProfilePage },
    ]
  },
];

export const routing = RouterModule.forChild(routes);
