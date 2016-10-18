import { Routes } from '@angular/router';
import { NoContent } from './common/no-content';

export let ROUTES: Routes = [
  { path: '**',    component: NoContent },
];
