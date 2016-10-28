import { Routes } from '@angular/router';
import { PageNotFoundErrorPage } from './application-content/404';

export let ROUTES: Routes = [
  { path: '**',    component: PageNotFoundErrorPage },
];
