import { Routes } from '@angular/router';
import { NoContentPage } from './application-content/404';

export let ROUTES: Routes = [
  { path: '**',    component: NoContentPage },
];
