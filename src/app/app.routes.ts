import { Routes } from '@angular/router';
import { Home } from './home';
import { Search } from './search/search.component';
import { NoContent } from './common/no-content';
import {ProgramViewComponent} from './fal/program/program-view.component';
import { SamAngularDemo } from './sam-angular-demo';

export const ROUTES: Routes = [
  { path: '',      component: Home },
  { path: 'home',  component: Home },
  { path: 'sam-angular', component: SamAngularDemo },
  { path: 'search',  component: Search },
  { path: 'programs',  component: ProgramViewComponent },
  { path: '**',    component: NoContent },
];
