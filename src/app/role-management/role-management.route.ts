import { Routes, RouterModule } from '@angular/router';
import { ObjectWorkspacePage } from "./object-workspace.page";
import { ObjectDetailsPage } from "./object-details/object-details.page";
import { RoleDetailsPage } from "./role-details/role-details.page";
import { RoleDefinitionPage } from "./role-definition/role-definition.page";
import { DomainsResolve } from "./domains.resolve";
import { ManageRequestPage } from "./manage-request/manage-request";
import { RoleMgmtWorkspace } from "./rolemgmt-workspace.page.ts";
import { RolesDirectoryPage } from "./roles-directory/roles-directory.page";
import { BulkUpdateComponent } from "./bulk-update/bulk-update.component";
import { IsLoggedInGuard } from "../application-content/403/is-logged-in.guard";
import { CheckAccessGuard } from "../application-content/403/check-access.guard";
import { RMBackDoorComponent } from "./back-door/back-door.component";
import { ViewRequestPage } from "./view-request/view-request.page";
import { RequestResponsePage } from "./request-response/request-response.page";
import { RequestAccessResolve } from "./request-access.resolve";
import { MyAccessPage } from "../users/access/my-access.page";
import { GrantOrEditAccess } from "./grant-or-edit-access/grant-or-edit-access";
import { RoleCategoriesResolve } from "../users/roles-categories.resolve";

export const routes: Routes = [{
  path: '',
  resolve: { domains: DomainsResolve },
  canActivateChild: [IsLoggedInGuard],
  children: [
    {
      path: 'users',
      children: [
        {
          path: ':id/access',
          component: MyAccessPage,
          data: { isMyAccess: false, pageName: 'users/:id/access' },
          canActivate: [ CheckAccessGuard ],
        },
        {
          path: ':id/edit-access',
          component: GrantOrEditAccess,
          canActivate: [ CheckAccessGuard ],
          data: { grantOrEdit: 'edit', pageName: 'users/:id/edit-access' },
        },
        {
          path: ':id/assign-roles',
          component: GrantOrEditAccess,
          canActivate: [ CheckAccessGuard ],
          data: { grantOrEdit: 'grant', pageName: 'users/:id/grant-access' },
        },
      ]
    },
    {
      path: 'bulk-update',
      component: BulkUpdateComponent,
      canActivate: [CheckAccessGuard],
      data: {pageName:'access/bulk-update'}
    },
    {
      path: 'workspace',
      component: RoleDefinitionPage,
      canActivate: [CheckAccessGuard],
      data: {pageName:'access/workspace'}
    },
    {
      path: 'objects/new',
      component: ObjectDetailsPage,
      canActivate: [CheckAccessGuard],
      data: {pageName:'access/objects'}
    },
    {
      path: 'roles/new',
      component: RoleDetailsPage,
      canActivate: [CheckAccessGuard],
      data: {pageName:'access/roles'}
    },
    {
      path: 'objects/:objectId/edit',
      component: ObjectDetailsPage,
      canActivate: [CheckAccessGuard],
      data: {pageName:'access/objects'}
    },
    {
      path: 'roles/:roleId/edit',
      component: RoleDetailsPage,
      canActivate: [CheckAccessGuard],
      data: {pageName:'access/roles'}
    },
    {
      path: 'requests',
      component: RoleMgmtWorkspace,
      canActivate: [CheckAccessGuard],
      data: {pageName:'access/requests'}
    },
    {
      path: 'roles-directory',
      component: RolesDirectoryPage,
      canActivate: [CheckAccessGuard],
      data: {pageName:'access/user-roles-directory'},
    },
    {
      path: 'requests/:requestId',
      component: ViewRequestPage,
      data: { pageName: 'access-requests/:id' },
      canActivate: [ IsLoggedInGuard, CheckAccessGuard ],
      resolve: {
        request: RequestAccessResolve,
      },
    },
    {
      path: 'requests/:requestId/respond',
      component: RequestResponsePage,
      data: { pageName: 'access-requests/:id/respond' },
      canActivate: [ IsLoggedInGuard, CheckAccessGuard ],
      resolve: {
        request: RequestAccessResolve,
      },
    },
  ]
}];

if (SHOW_OPTIONAL === 'true' || ENV === 'development') {
  routes.unshift({ path: 'rm', component: RMBackDoorComponent });
}

export const routing = RouterModule.forChild(routes);
