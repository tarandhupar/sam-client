import { Routes, RouterModule } from '@angular/router';
import { FederalHierarchyPage } from './federal-hierarchy.page';
import { FeatureToggleGuard } from "../app-services/feature-toggle.guard";
import { FeedbackFormService } from 'app/app-components/feedback-form/feedback-form.service';

import { FHAccessGuard } from "../app-services/fh-access.guard";

export const routes: Routes = [
 {
   path: '',
   component: FederalHierarchyPage,
   data: {featureToggleKey:'fh',pageName:'federal-hierarchy'},
   canActivate:[FeatureToggleGuard,FHAccessGuard],
  }

];

export const routing = RouterModule.forChild(routes);
