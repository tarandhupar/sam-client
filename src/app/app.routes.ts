import { Routes } from '@angular/router';
import { NoContentPage } from './app-pages/404';

export let ROUTES: Routes = [
  { path: '**',    component: NoContentPage },
];
