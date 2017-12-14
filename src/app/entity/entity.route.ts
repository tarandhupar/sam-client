import { Routes, RouterModule } from '@angular/router';
import { EntityPage } from './entity.page.ts';
import { FeedbackFormService } from 'app/app-components/feedback-form/feedback-form.service';

export const routes: Routes = [
  {
    path: '',
    component: EntityPage, 
    canDeactivate:[FeedbackFormService]
  },
];

export const routing = RouterModule.forChild(routes);
