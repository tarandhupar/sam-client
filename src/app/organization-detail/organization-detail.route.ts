import { Routes, RouterModule } from '@angular/router';
import { OrgDetailPage } from './organization-detail.page';
import { OrgDetailProfilePage } from './profile/profile.component';
import { OrgCreatePage } from './create-org/create-org.component';
import { OrgMovePage } from './move-org/move-org.component';
import { OrgHierarchyPage } from './hierarchy/hierarchy.component';
import { FHAccessGuard } from '../app-services/fh-access.guard';
import { IsLoggedInGuard } from '../app-services/is-logged-in.guard';
import { FeatureToggleGuard } from '../app-services/feature-toggle.guard';
import { CreateOrgResolve } from  './create-org/create-org.resolve';
import { OrgDetailResolve } from './organization-detail.resolve';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'detail/:orgId',
        component: OrgDetailPage,
        canActivateChild: [FHAccessGuard, FeatureToggleGuard],
        resolve: { org: OrgDetailResolve },
        data: { featureToggleKey: 'fh' },
        children: [
          { path: '', redirectTo: 'profile', pathMatch: 'full'},
          { path: 'profile',  component: OrgDetailProfilePage, data: { pageName: 'profile'} },
          { path: 'hierarchy',  component: OrgHierarchyPage, data: { pageName: 'hierarchy'} },
          { path: 'move',  component: OrgMovePage, data: { pageName: 'move'}  }
        ]
      }
    ]
  },
  {
    path: 'create',
    component: OrgCreatePage,
    canActivate: [FeatureToggleGuard, FHAccessGuard],
    resolve: { parentOrg: CreateOrgResolve },
    data: { pageName: 'create', featureToggleKey: 'fh' }
  }

  // {
  //   path: 'aac-request/procurement/:orgId',
  //   component: AACRequestPage,
  //   canActivate: [AACRequestGuard]
  // },
  // {
  //   path: 'aac-request/non-procurement/:orgId',
  //   component: AACRequestPage,
  //   canActivate: [AACRequestGuard]
  // },
  // {
  //   path: 'aac-confirm/:requestId',
  //   component: AACConfirmPage,
  // }
];

export const routing = RouterModule.forChild(routes);
