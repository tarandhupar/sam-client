import { Routes, RouterModule } from '@angular/router';
import { ObjectsWorkspacePage } from "./objects-workspace.page";

export const routes: Routes = [];

if (SHOW_OPTIONAL === 'true' || ENV === 'development') {
  routes.unshift({
    path: 'access',
    children: [
      { path: 'objects',  component: ObjectsWorkspacePage },
    ]
  });
}

export const routing = RouterModule.forChild(routes);
