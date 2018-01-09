import { Routes, RouterModule } from '@angular/router';
import { WageDeterminationPage } from './wage-determination.page';
import { WageDeterminationDocumentPage } from "./wage-determination-document.page";
import { FeedbackFormService } from 'app/app-components/feedback-form/feedback-form.service';
import { CbaPage } from './cba/wd-cba.page';
import {CBADocumentPage} from "./cba/wd-cba-document.page";

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
    path: 'wage-determination/cba/:referencenumber/view',
    component: CbaPage,
    canDeactivate:[FeedbackFormService]
  },
  {
    path: 'agreement/:cbanumber/document',
    component: CBADocumentPage
  }
];


export const routing = RouterModule.forChild(routes);
