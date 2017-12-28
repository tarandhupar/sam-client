import { Routes, RouterModule } from '@angular/router';
import { ExclusionsPage } from './exclusion.page.ts';
import { FeedbackFormService } from 'app/app-components/feedback-form/feedback-form.service';

export const routes: Routes = [
  {
    path: '',
    component: ExclusionsPage, 
    canDeactivate:[FeedbackFormService]
  },
];

export const routing = RouterModule.forChild(routes);
