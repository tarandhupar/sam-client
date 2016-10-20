import { Routes, RouterModule } from '@angular/router';
import { SearchPage } from './search.page';

export const routes: Routes = [
  { path: 'search',  component: SearchPage },
];

export const routing = RouterModule.forChild(routes);
