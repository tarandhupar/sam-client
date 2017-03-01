import { Routes, RouterModule } from '@angular/router';
import { WageDeterminationPage } from './wage-determination.page';

export const routes: Routes = [
  {
    path: 'wage-determination/:referencenumber/:revisionnumber',
    component: WageDeterminationPage
  }
];


export const routing = RouterModule.forChild(routes);
