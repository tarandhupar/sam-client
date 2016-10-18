import { Routes, RouterModule } from '@angular/router';
import {SamAngularDemoPage} from "./sam-angular-demo.page";

export let routes: Routes = [];

if (ENV === 'development' || ENV === 'comp' || ENV === 'local') {
  routes.unshift({ path: 'sam-angular', component: SamAngularDemoPage });
}

export const routing = RouterModule.forChild(routes);
