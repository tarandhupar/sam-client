import { Routes, RouterModule } from '@angular/router';
import { AlertsPage } from './alerts.page';

export const routes: Routes = [
  {
    path: 'system-alerts',
    component: AlertsPage
  },
];

export const routing = RouterModule.forChild(routes);
