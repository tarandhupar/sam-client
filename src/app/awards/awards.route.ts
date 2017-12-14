import { Routes, RouterModule } from '@angular/router';
import { AwardsPage } from './awards.page.ts';
import { FeedbackFormService } from 'app/app-components/feedback-form/feedback-form.service';

export const routes: Routes = [
  { path: '', component: AwardsPage, canDeactivate:[FeedbackFormService] },
];

export const routing = RouterModule.forChild(routes);
