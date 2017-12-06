import { Routes, RouterModule } from '@angular/router';

import { IsLoggedInGuard } from 'application-content/403/is-logged-in.guard';
import { FeatureToggleGuard } from 'application-content/403/feature-toggle.guard';
import { SecurityGuard } from './system/security.guard';

import { ApplicationRequestsComponent } from './requests/application-requests/application-requests.component';
import { HelpContentManagementViewComponent } from "./content-management/view/content-management-view.component";
import { HelpContentManagementEditComponent } from "./content-management/edit/content-management-edit.component";
import { HelpContentManagementDetailComponent } from "./content-management/detail/content-management-detail.component";
import { MsgFeedComponent } from "./msg-feed/msg-feed.component";
import { WorkspacePage } from "./workspace.page";

import SystemRouter from './system/system.route';

export const routes: Routes = [
  {
    path: '',
    component: WorkspacePage,
  },
  {
    path: 'fsd',
    loadChildren: './fsd/fsd.module#FSDModule',
  },
  {
    path: 'system',
    loadChildren: './system/system.module#SystemModule',
  },
  {
    path: 'requests/system/:id',
    component: ApplicationRequestsComponent,
    canActivate: [ IsLoggedInGuard, SecurityGuard ],
  },
  {
    path: 'myfeed/:section',
    component: MsgFeedComponent
  },
  {
    path: 'myfeed/:section/:subsection',
    component: MsgFeedComponent
  },
  {
    path: 'content-management/:section',
    canActivate:[FeatureToggleGuard],
    data: { featureToggleKey:'cms' },
    component: HelpContentManagementViewComponent
  },
  {
    path: 'content-management/:section/edit',
    canActivate:[FeatureToggleGuard],
    data: { featureToggleKey:'cms' },
    component: HelpContentManagementEditComponent
  },
  {
    path: 'content-management/:section/detail',
    canActivate:[FeatureToggleGuard],
    data: { featureToggleKey:'cms' },
    component: HelpContentManagementDetailComponent
  },
];

export const routing = RouterModule.forChild(routes);
