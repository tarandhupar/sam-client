import { Routes, RouterModule } from '@angular/router';
import { OrgDetailPage } from './organization-detail.page';
import { OrgDetailProfilePage } from './profile/profile.component';
import { OrgCreatePage } from './create-org/create-org.component';
import { AACRequestPage } from "./AAC-request/AAC-request.component";
import { AACConfirmPage } from "./AAC-confirm/AAC-confirm.component";
import { AACRequestGuard } from "./AAC-request/AAC-request.guard.ts";

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
    canActivate: [AACRequestGuard]
},
  {
    path: 'aac-confirm/:requestId',
    component: AACConfirmPage,
  }
];

export const routing = RouterModule.forChild(routes);
