import { Routes, RouterModule } from '@angular/router';
import { FederalHierarchyPage } from './federal-hierarchy.page';
import { FeatureToggleGuard } from "../application-content/403/feature-toggle.guard";


export const routes: Routes = [
  {
    path: '',
    component: FederalHierarchyPage,
    data: {featureToggleKey:'fh'},
    canActivate:[FeatureToggleGuard]
  },
];

export const routing = RouterModule.forChild(routes);
