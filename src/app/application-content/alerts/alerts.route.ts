import { Routes, RouterModule } from '@angular/router';
import { AlertsPage } from './alerts.page';
import {AlertsResolver} from "./alerts.resolve";

export const routes: Routes = [
  {
    path: 'system-alerts',
    component: AlertsPage,
    resolve: { alerts: AlertsResolver }
  },
];

export const routing = RouterModule.forChild(routes);
