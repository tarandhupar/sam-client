import { Routes, RouterModule } from '@angular/router';
import { ForbiddenPage } from "./403.page";
import { UnauthenticatedPage } from "../401/401.page";

export const FORBIDDEN_PAGE_PATH: string = "403";

const routes: Routes = [
  {
    path: FORBIDDEN_PAGE_PATH,
    component: ForbiddenPage
  },
  {
    path: '401',
    component: UnauthenticatedPage,
  }
];

export const routing = RouterModule.forChild(routes);
