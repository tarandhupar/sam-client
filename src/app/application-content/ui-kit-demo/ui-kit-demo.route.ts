import { Routes, RouterModule } from '@angular/router';
import { UIKitDemoPage } from './ui-kit-demo.page';
import { SimpleFormDemoPage } from './simple-form-demo.page';

export let routes: Routes = [];

if (SHOW_OPTIONAL === 'true' || ENV === 'development') {
  routes.unshift({ path: 'ui-kit', component: UIKitDemoPage });
  routes.unshift({ path: 'simple-form-demo', component: SimpleFormDemoPage });
}

export const routing = RouterModule.forChild(routes);
