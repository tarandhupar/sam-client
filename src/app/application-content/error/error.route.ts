import { Routes, RouterModule } from '@angular/router';
import {GenericErrorPage} from "./error.page";

export const routes: Routes = [
  {
    path: 'error',
    component: GenericErrorPage
  },
];

export const routing = RouterModule.forChild(routes);
