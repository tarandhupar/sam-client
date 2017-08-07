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
import { CheckAccessGuard } from "../application-content/403/check-access.guard";

export const routes: Routes = [{
  path: 'access',
  resolve: { domains: DomainsResolve },
  canActivateChild: [IsLoggedInGuard],
  children: [
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
      path: 'user-roles-directory',
      component: UserRolesDirectoryPage,
      canActivate: [CheckAccessGuard],
      data: {pageName:'access/user-roles-directory'},
      resolve: { domainDefinition: DomainDefinitionResolve }
    }
  ]
}];

export const routing = RouterModule.forChild(routes);
