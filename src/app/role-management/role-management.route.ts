import { Routes, RouterModule } from '@angular/router';
import { ObjectWorkspacePage } from "./object-workspace.page";
import { ObjectDetailsPage } from "./object-details.page";
import { RoleDetailsPage } from "./role-details/role-details.page";
import { RoleWorkspacePage } from "./role-workspace.page";
import { DomainsResolve } from "./domains.resolve";

export const routes: Routes = [];

if (SHOW_OPTIONAL === 'true' || ENV === 'development') {
  routes.unshift({
    path: 'access',
    resolve: { domains: DomainsResolve },
    children: [
      { path: 'objects',  component: ObjectWorkspacePage },
      { path: 'roles', component: RoleWorkspacePage },
      { path: 'objects/new', component: ObjectDetailsPage},
      { path: 'roles/new', component: RoleDetailsPage},
      { path: 'objects/:objectId/edit', component: ObjectDetailsPage },
      { path: 'roles/:roleId/edit', component: RoleDetailsPage },
    ]
  });
}

export const routing = RouterModule.forChild(routes);
