import { Routes, RouterModule } from '@angular/router';
import { SearchPage } from './search.page';
import { SearchTemplateDemoPage }   from './search-template-demo/search-template-demo.page';

export const routes: Routes = [
  { path: 'search',  component: SearchPage },
];
if (SHOW_OPTIONAL === 'true' || ENV === 'development') {
  routes.unshift({ path: 'search/demo', component: SearchTemplateDemoPage });
}
export const routing = RouterModule.forChild(routes);
