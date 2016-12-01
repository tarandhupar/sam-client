import { Routes, RouterModule } from '@angular/router';
import { AlertsPage } from './alerts.page';
//import {AlertsResolver} from "./alerts.resolve";

export const SYSTEM_ALERTS_PAGE_PATH: string = 'alerts';

export const routes: Routes = [
  {
    path: SYSTEM_ALERTS_PAGE_PATH,
    component: AlertsPage,
    //resolve: { alerts: AlertsResolver }
  },
];

export const routing = RouterModule.forChild(routes);
