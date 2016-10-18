import { Routes } from '@angular/router';
import { Search } from './search/search.component';
import { NoContent } from './common/no-content';
import {ProgramViewComponent} from './fal/program/program-view.component';
import { SamAngularDemo } from './sam-angular-demo';

export let ROUTES: Routes = [
  { path: 'search',  component: Search },
  { path: 'programs',  component: ProgramViewComponent },
  { path: '**',    component: NoContent },
];

if (ENV === 'development' || ENV === 'comp' || ENV === 'local') {
  ROUTES.unshift({ path: 'sam-angular', component: SamAngularDemo });
}
