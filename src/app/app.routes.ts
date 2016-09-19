import { Routes } from '@angular/router';
import { Home } from './home';
import { NoContent } from './common/no-content';
import { SamAngularComponents } from './sam-angular'

export const ROUTES: Routes = [
  { path: '',      component: Home },
  { path: 'home',  component: Home },
  { path: 'sam-angular', component: SamAngularComponents },
  { path: '**',    component: NoContent },
];
