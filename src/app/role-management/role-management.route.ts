import { Routes, RouterModule } from '@angular/router';
import { ObjectWorkspacePage } from "./object-workspace.page";
import { ObjectDetailsPage } from "./object-details/object-details.page";
import { RoleDetailsPage } from "./role-details/role-details.page";
import { RoleDefinitionPage } from "./role-definition/role-definition.page";
import { DomainsResolve } from "./domains.resolve";
import { RoleMgmtWorkspace } from "./rolemgmt-workspace.page.ts";


export const routes: Routes = [];

routes.unshift({
  path: 'access',
  resolve: { domains: DomainsResolve },
  children: [
    { path: 'workspace',  component: RoleDefinitionPage },
    { path: 'objects/new', component: ObjectDetailsPage},
    { path: 'roles/new', component: RoleDetailsPage},
    { path: 'objects/:objectId/edit', component: ObjectDetailsPage },
    { path: 'roles/:roleId/edit', component: RoleDetailsPage },
    { path: 'role-workspace', component: RoleMgmtWorkspace },
  ]
});

export const routing = RouterModule.forChild(routes);
