import { Routes, RouterModule } from '@angular/router';
import { SearchComponent } from './search.component';

export const routes: Routes = [
  { path: 'search',  component: SearchComponent },
];

export const routing = RouterModule.forChild(routes);
