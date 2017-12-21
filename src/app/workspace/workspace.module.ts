import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Ng2PageScrollModule } from 'ng2-page-scroll';

import { routing } from './workspace.route';
import { SamUIKitModule } from 'sam-ui-elements/src/ui-kit';
import { SamAPIKitModule } from 'api-kit';
import { AppComponentsModule } from '../app-components/app-components.module';
import { AppTemplatesModule } from 'app-templates';
import { PipesModule } from '../app-pipes/app-pipes.module';
import { SystemSectionsModule } from './system/create';

import { FeatureToggleService } from 'api-kit/feature-toggle/feature-toggle.service';
import { UserService } from 'role-management/user.service';

import { IsLoggedInGuard } from 'app-services/is-logged-in.guard';
import { FeatureToggleGuard } from 'app-services/feature-toggle.guard';
import { SecurityGuard } from './system/security.guard';

import { WorkspacePage } from './workspace.page';
import { WorkspaceWidgetComponent } from './workspace-widget/workspace-widget.component';
import { SearchReportComponent } from './search-report/search-report.component';
import { DataEntryComponent } from './data-entry/data-entry.component';
import { AdministrationComponent } from './administration/administration.component';

import {
  FHWidgetComponent,
  FSDWidgetComponent,
  ProfileWidgetComponent,
  RMWidgetComponent,
  SystemWidgetComponent,
} from './administration';

import {
  OppWidgetComponent,
  OppPieChartComponent,
  AssistanceListingWidgetComponent,
  CbaWidgetComponent
} from './data-entry';

import { MsgFeedComponent } from './msg-feed/msg-feed.component';
import { MsgFeedSideNavComponent } from './msg-feed/msg-feed-sidenav/msg-feed-sidenav.component';
import { HelpContentManagementViewComponent } from './content-management/view/content-management-view.component';
import { HelpContentManagementSideNavComponent } from './content-management/view/sidenav/content-management-sidenav.component';

import { HelpContentManagementEditComponent } from './content-management/edit/content-management-edit.component';
import { HelpContentManagementDetailComponent } from './content-management/detail/content-management-detail.component';

import { ApplicationRequestsComponent } from './requests/application-requests/application-requests.component';

import { DragDropDirective } from './content-management/edit/drag-drop.directive';
import { FhWidgetService } from './administration/fh/fh-widget.service';
import { CmAccessGuard } from '../app-services/cm-access.guard';

@NgModule({
  imports: [
    routing,
    CommonModule,
    RouterModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    SamUIKitModule,
    SamAPIKitModule,
    AppComponentsModule,
    PipesModule,
    Ng2PageScrollModule.forRoot(),
    SystemSectionsModule,
  ],
  exports: [],
  declarations: [
    WorkspacePage,
    WorkspaceWidgetComponent,
    SearchReportComponent,
    DataEntryComponent,
    AdministrationComponent,

    /**
     * Widgets
     */
    FHWidgetComponent,
    FSDWidgetComponent,
    ProfileWidgetComponent,
    RMWidgetComponent,
    SystemWidgetComponent,

    OppWidgetComponent,
    OppPieChartComponent,
    AssistanceListingWidgetComponent,
    CbaWidgetComponent,

    /**
     * Requests
     */
    ApplicationRequestsComponent,

    /**
     * MyFeed
     */
    MsgFeedComponent,
    MsgFeedSideNavComponent,

    /**
     * Help Content Management
     */
    HelpContentManagementViewComponent,
    HelpContentManagementEditComponent,
    HelpContentManagementSideNavComponent,
    HelpContentManagementDetailComponent,

    /**
     * Directives
     */
    DragDropDirective,
  ],
  providers: [
    /**
     * Services
     */
    FeatureToggleService,
    UserService,

    /**
     * Route Guards
     */
    IsLoggedInGuard,
    FeatureToggleGuard,
    SecurityGuard,
    FhWidgetService,
    CmAccessGuard,
  ],
})
export class WorkspaceModule { }
