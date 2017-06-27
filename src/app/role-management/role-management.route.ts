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
import { SuperAdminGuard } from "../application-content/403/super-admin.guard";
import { DeptAdminGuard } from "../application-content/403/dept-admin.guard";
import { UserRolesDirectoryPage } from "./user-roles-directory/user-roles-directory.page";
import { DomainDefinitionResolve } from "./domaindefinition.resolve";
import { BulkUpdateComponent } from "./bulk-update/bulk-update.component";
import { IsLoggedInGuard } from "../application-content/403/is-logged-in.guard";

export const routes: Routes = [{
  path: 'access',
  resolve: { domains: DomainsResolve },
  canActivateChild: [IsLoggedInGuard],
  children: [
    { path: 'bulk-update', component: BulkUpdateComponent, canActivate: [SuperAdminGuard] },
    { path: 'workspace',  component: RoleDefinitionPage, canActivate: [SuperAdminGuard] },
    { path: 'objects/new', component: ObjectDetailsPage, canActivate: [SuperAdminGuard] },
    { path: 'roles/new', component: RoleDetailsPage, canActivate: [SuperAdminGuard] },
    { path: 'objects/:objectId/edit', component: ObjectDetailsPage, canActivate: [SuperAdminGuard] },
    { path: 'roles/:roleId/edit', component: RoleDetailsPage, canActivate: [SuperAdminGuard] },
    {
      path: 'requests/:requestId',
      component: ManageRequestPage,
      resolve: {
        request: RequestAccessResolve,
        statusNames: RequestStatusNamesResolve,
      },
      canActivate: [DeptAdminGuard]
    },
    { path: 'requests', component: RoleMgmtWorkspace, canActivate: [DeptAdminGuard] },
    {
      path: 'user-roles-directory',
      component: UserRolesDirectoryPage,
      canActivate: [DeptAdminGuard],
      resolve: { domainDefinition: DomainDefinitionResolve }
    }
  ]
}];

export const routing = RouterModule.forChild(routes);
