import { Routes, RouterModule } from '@angular/router';
import { FederalHierarchyPage } from './federal-hierarchy.page';


export const routes: Routes = [
  { path: '', component: FederalHierarchyPage },
];

export const routing = RouterModule.forChild(routes);
