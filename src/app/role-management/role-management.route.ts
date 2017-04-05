import { Routes, RouterModule } from '@angular/router';
import { ObjectWorkspacePage } from "./object-workspace.page";
import { ObjectDetailsPage } from "./object-details/object-details.page";
import { RoleDetailsPage } from "./role-details/role-details.page";
import { RoleWorkspacePage } from "./role-workspace.page";
import { DomainsResolve } from "./domains.resolve";
import { ManageRequestPage } from "./manage-request/manage-request";
import { RequestAccessResolve } from "./request-access.resolve";

export const routes: Routes = [{
  path: 'access',
  resolve: { domains: DomainsResolve },
  children: [
    { path: 'workspace',  component: RoleWorkspacePage },
    { path: 'objects/new', component: ObjectDetailsPage},
    { path: 'roles/new', component: RoleDetailsPage},
    { path: 'objects/:objectId/edit', component: ObjectDetailsPage },
    { path: 'roles/:roleId/edit', component: RoleDetailsPage },
    { path: 'requests/:requestId', component: ManageRequestPage, resolve: { request: RequestAccessResolve } }
  ]
}];

export const routing = RouterModule.forChild(routes);
