import { Routes, RouterModule } from '@angular/router';
import { AlertsPage } from './alerts.page';

export const SYSTEM_ALERTS_PAGE_PATH: string = 'alerts';

export const routes: Routes = [
  { path: '', component: AlertsPage },
];

export const routing = RouterModule.forChild(routes);
