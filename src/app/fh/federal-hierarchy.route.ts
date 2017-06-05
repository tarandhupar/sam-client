import { Routes, RouterModule } from '@angular/router';
import { FederalHierarchyPage } from './federal-hierarchy.page';


export const routes: Routes = [
  {
    path: 'federal-hierarchy',
    component: FederalHierarchyPage,
    
  },
];

export const routing = RouterModule.forChild(routes);
