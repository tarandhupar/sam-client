import { Routes } from '@angular/router';
import { PageNotFoundErrorPage } from './application-content/404';

export let ROUTES: Routes = [
  { path: 'awards/:id', loadChildren: './awards/awards.module#AwardsModule' },
  { path: 'help', loadChildren: './Help/help.module#HelpModule' },
  { path: 'alerts', loadChildren: './alerts/alerts.module#AlertsModule' },
  { path: 'ui-kit', loadChildren: './application-content/ui-kit-demo/ui-kit-demo.module#UIKitDemoModule' },
  { path: 'error', loadChildren: './application-content/error/error.module#ErrorModule' },
  { path: 'data-services', loadChildren: './data-service/data-service.module#DataServiceModule' },
  { path: 'federal-hierarchy', loadChildren: './fh/federal-hierarchy.module#FederalHierarchyModule' },
  { path: 'reports', loadChildren: './Reports/reports.module#ReportsModule' },
  { path: 'role-management', loadChildren: './role-management/role-management.module#RoleManagementModule' },
  { path: '**',    component: PageNotFoundErrorPage },
];
