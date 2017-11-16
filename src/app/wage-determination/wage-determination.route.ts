import { Routes, RouterModule } from '@angular/router';
import { WageDeterminationPage } from './wage-determination.page';
import { WageDeterminationDocumentPage } from "./wage-determination-document.page";

export const routes: Routes = [
  {
    path: 'wage-determination/:referencenumber/:revisionnumber',
    component: WageDeterminationPage
  },
  {
    path: 'wage-determination/:referencenumber/:revisionnumber/document',
    component: WageDeterminationDocumentPage
  },
  
];


export const routing = RouterModule.forChild(routes);
