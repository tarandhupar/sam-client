import { Routes } from '@angular/router';
import { IsLoggedInGuard } from 'application-content/403/is-logged-in.guard';

import { SamLoginComponent } from 'app-components';
import { PageNotFoundErrorPage } from 'application-content/404';
import { ProfileComponent } from 'users/profile';
import { SupportComponent } from './Help/sections/support/support.component';

export let ROUTES: Routes = [
  { path: 'alerts', loadChildren: './alerts/alerts.module#AlertsModule' },
  { path: 'awards/:id', loadChildren: './awards/awards.module#AwardsModule' },
  { path: 'data-services', loadChildren: './data-service/data-service.module#DataServiceModule' },
  { path: 'entity/:id', loadChildren: './entity/entity.module#EntityModule' },
  { path: 'error', loadChildren: './application-content/error/error.module#ErrorModule' },
  { path: 'exclusions/:id', loadChildren: './exclusion/exclusion.module#ExclusionModule' },
  { path: 'federal-hierarchy', loadChildren: './fh/federal-hierarchy.module#FederalHierarchyModule' },
  { path: 'forgot', loadChildren: './recovery/recovery.module#RecoveryModule' },
  { path: 'fsdforgot', loadChildren: './recovery/recovery.module#RecoveryModule' },
  { path: 'help', loadChildren: './Help/help.module#HelpModule' },
  { path: 'help/support', component: SupportComponent },
  { path: 'org', loadChildren: './organization-detail/organization-detail.module#OrganizationDetailModule' },
  { path: 'profile', loadChildren: './users/users.module#UsersModule' },
  { path: 'reports', loadChildren: './Reports/reports.module#ReportsModule' },
  { path: 'role-management', loadChildren: './role-management/role-management.module#RoleManagementModule' },
  { path: 'signin', component: SamLoginComponent },
  { path: 'signout', component: SamLoginComponent,  canActivate: [IsLoggedInGuard] },
  { path: 'signup', loadChildren: './registration/registration.module#RegistrationModule' },
  { path: 'ui-kit', loadChildren: './application-content/ui-kit-demo/ui-kit-demo.module#UIKitDemoModule' },
  { path: 'workspace', loadChildren: './workspace/workspace.module#WorkspaceModule' },
  { path: 'fal', loadChildren: './assistance-listing/assistance-listing.module#ProgramModule'},
  { path: '**', component: PageNotFoundErrorPage },
];
