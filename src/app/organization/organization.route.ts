import { Routes, RouterModule } from '@angular/router';
import { OrganizationPage } from './organization.page.ts';
import { FeedbackFormService } from 'app/app-components/feedback-form/feedback-form.service';

export const routes: Routes = [
  {
    path: 'organization/:id',
    component: OrganizationPage, 
    canDeactivate:[FeedbackFormService]
  },
];
export const routing = RouterModule.forChild(routes);
