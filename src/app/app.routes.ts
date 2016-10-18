import { Routes } from '@angular/router';
import { NoContent } from './common/no-content';
import {ProgramViewComponent} from './fal/program/program-view.component';
import { SamAngularDemo } from './sam-angular-demo';

export let ROUTES: Routes = [
  { path: 'programs',  component: ProgramViewComponent },
  { path: '**',    component: NoContent },
];

if (ENV === 'development' || ENV === 'comp' || ENV === 'local') {
  ROUTES.unshift({ path: 'sam-angular', component: SamAngularDemo });
}
