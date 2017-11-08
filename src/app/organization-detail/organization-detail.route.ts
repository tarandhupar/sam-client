import { Routes, RouterModule } from '@angular/router';
import { OrgDetailPage } from './organization-detail.page';
import { OrgDetailProfilePage } from './profile/profile.component';
import { OrgCreatePage } from './create-org/create-org.component';
import { AACRequestPage } from "./AAC-request/AAC-request.component";
import { AACConfirmPage } from "./AAC-confirm/AAC-confirm.component";
import { AACRequestGuard } from "./AAC-request/AAC-request.guard.ts";
import { OrgMovePage } from "./move-org/move-org.component";
import { OrgHierarchyPage } from "./hierarchy/hierarchy.component";
import { FHAccessGuard } from "../application-content/403/fh-access.guard";
import { IsLoggedInGuard } from "../application-content/403/is-logged-in.guard";

export const routes: Routes = [
  {
    path:'',
    children:[
      {
        path: 'detail/:orgId',
        component: OrgDetailPage,
        canActivateChild:[FHAccessGuard],
        data: { pageName:'FH/org-detail' },
        children: [
          { path:'', redirectTo:'profile', pathMatch:'full'},
          { path: 'profile',  component: OrgDetailProfilePage },
          { path: 'hierarchy',  component: OrgHierarchyPage },
          { path: 'move',  component: OrgMovePage  }
        ]
      }
    ]
  },
  {
    path:'create',
    component: OrgCreatePage,
    data: { pageName:'FH/create-org' }
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
