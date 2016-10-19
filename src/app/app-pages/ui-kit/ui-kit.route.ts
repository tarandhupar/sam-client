import { Routes, RouterModule } from '@angular/router';
import {UIKitDemoPage} from "./ui-kit.page";

export let routes: Routes = [];

if (ENV === 'development' || ENV === 'comp' || ENV === 'local') {
  routes.unshift({ path: 'ui-kit', component: UIKitDemoPage });
}

export const routing = RouterModule.forChild(routes);
