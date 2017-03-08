import { Routes, RouterModule } from '@angular/router';
import { UIKitDemoPage } from './ui-kit-demo.page';

export let routes: Routes = [];

if (SHOW_OPTIONAL === 'true' || ENV === 'development') {
  routes.unshift({ path: 'ui-kit', component: UIKitDemoPage });
}

export const routing = RouterModule.forChild(routes);
