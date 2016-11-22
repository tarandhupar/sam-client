import { Routes, RouterModule } from '@angular/router';
import {GenericErrorPage} from "./error.page";

export const ERROR_PAGE_PATH = 'error';

export const routes: Routes = [
  {
    path: ERROR_PAGE_PATH,
    component: GenericErrorPage
  },
];

export const routing = RouterModule.forChild(routes);
