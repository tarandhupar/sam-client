import { Routes, RouterModule } from '@angular/router';
import { SearchPage } from './search.page';
import { SearchLayoutDemoPage }   from './search-layout-demo/search-layout-demo.page';

export const routes: Routes = [
  { path: 'search',  component: SearchPage },
];
if (SHOW_OPTIONAL === 'true' || ENV === 'development') {
  routes.unshift({ path: 'search/demo', component: SearchLayoutDemoPage });
}
export const routing = RouterModule.forChild(routes);
