import { Routes, RouterModule } from '@angular/router';
import { FederalHierarchyPage } from './federal-hierarchy.page';
import { FeatureToggleGuard } from "../application-content/403/feature-toggle.guard";
import { FeedbackFormService } from 'app/app-components/feedback-form/feedback-form.service';


export const routes: Routes = [
  {
    path: '',
    component: FederalHierarchyPage,
    data: {featureToggleKey:'fh'},
    canActivate:[FeatureToggleGuard], 
    canDeactivate:[FeedbackFormService]
  },
];

export const routing = RouterModule.forChild(routes);
