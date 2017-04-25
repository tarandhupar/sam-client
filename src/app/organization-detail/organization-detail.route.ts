import { Routes, RouterModule } from '@angular/router';
import { OrgDetailPage } from './organization-detail.page';
import { OrgDetailProfilePage } from './profile/profile.component';
import { OrgCreatePage } from './create-org/create-org.component';
import { AACRequestPage } from "./AAC-request/AAC-request.component";

export const routes: Routes = [
  {
    path: 'organization-detail/:orgId',
    component: OrgDetailPage,
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile',  component: OrgDetailProfilePage },
    ]
  },
  {
    path: 'create-organization',
    component: OrgCreatePage,
  },
  {
    path: 'aac-request',
    component: AACRequestPage,
  }
];

export const routing = RouterModule.forChild(routes);
