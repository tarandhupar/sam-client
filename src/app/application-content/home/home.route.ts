import { Routes, RouterModule } from '@angular/router';
import { HomePage } from './home.page';
import { FeedbackFormService } from 'app/app-components/feedback-form/feedback-form.service';

export const routes: Routes = [
  { path: '', component: HomePage, canDeactivate:[FeedbackFormService] },
];

export const routing = RouterModule.forChild(routes);
