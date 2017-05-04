import { Routes, RouterModule } from '@angular/router';
import { ObjectWorkspacePage } from "./object-workspace.page";
import { ObjectDetailsPage } from "./object-details/object-details.page";
import { RoleDetailsPage } from "./role-details/role-details.page";
import { RoleDefinitionPage } from "./role-definition/role-definition.page";
import { DomainsResolve } from "./domains.resolve";
import { ManageRequestPage } from "./manage-request/manage-request";
import { RequestAccessResolve } from "./request-access.resolve";
import { RequestStatusNamesResolve } from "./request-statuses.resolve";
import { RoleMgmtWorkspace } from "./rolemgmt-workspace.page.ts";
import {AdminOnlyGuard} from "../application-content/403/admin-only.guard";
import {AdminOrDeptAdminGuard} from "../application-content/403/admin-or-dept-admin.guard";

export const routes: Routes = [{
  path: 'access',
  resolve: { domains: DomainsResolve },
  children: [
    { path: 'workspace',  component: RoleDefinitionPage, canActivate: [AdminOnlyGuard] },
    { path: 'objects/new', component: ObjectDetailsPage, canActivate: [AdminOnlyGuard] },
    { path: 'roles/new', component: RoleDetailsPage, canActivate: [AdminOnlyGuard] },
    { path: 'objects/:objectId/edit', component: ObjectDetailsPage, canActivate: [AdminOnlyGuard] },
    { path: 'roles/:roleId/edit', component: RoleDetailsPage, canActivate: [AdminOnlyGuard] },
    { path: 'requests/:requestId',
      component: ManageRequestPage,
      resolve: {
        request: RequestAccessResolve,
        statusNames: RequestStatusNamesResolve,
      },
      canActivate: [AdminOrDeptAdminGuard]
    },
    { path: 'role-workspace', component: RoleMgmtWorkspace, canActivate: [AdminOrDeptAdminGuard] },
  ]
}];

export const routing = RouterModule.forChild(routes);
