import { Routes, RouterModule } from '@angular/router';
import { DataServicePage } from "./data-service.page";


export const routes: Routes = [
  { path: '', component: DataServicePage, }
];

export const routing = RouterModule.forChild(routes);
