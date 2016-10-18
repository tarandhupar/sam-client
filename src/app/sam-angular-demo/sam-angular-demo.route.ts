import { Routes, RouterModule } from '@angular/router';
import {SamAngularDemoComponent} from "./sam-angular-demo.component";

export let routes: Routes = [];

if (ENV === 'development' || ENV === 'comp' || ENV === 'local') {
  routes.unshift({ path: 'sam-angular', component: SamAngularDemoComponent });
}

export const routing = RouterModule.forChild(routes);
