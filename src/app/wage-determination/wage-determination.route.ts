import { Routes, RouterModule } from '@angular/router';
import { WageDeterminationPage } from './wage-determination.page';
import { WageDeterminationDocumentPage } from "./wage-determination-document.page";
import { FeedbackFormService } from 'app/app-components/feedback-form/feedback-form.service';
import { CbaPage } from './cba/wd-cba.page';

export const routes: Routes = [
  {
    path: 'wage-determination/:referencenumber/:revisionnumber',
    component: WageDeterminationPage, 
    canDeactivate:[FeedbackFormService]
  },
  {
    path: 'wage-determination/:referencenumber/:revisionnumber/document',
    component: WageDeterminationDocumentPage
  },
  {
    path: 'wd/cba/:referencenumber/view',
    component: CbaPage, 
    canDeactivate:[FeedbackFormService]
  },
];


export const routing = RouterModule.forChild(routes);
