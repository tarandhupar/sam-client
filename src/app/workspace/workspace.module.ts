import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Ng2PageScrollModule } from 'ng2-page-scroll';

import { routing } from './workspace.route';
import { SamUIKitModule } from 'sam-ui-kit';
import { SamAPIKitModule } from 'api-kit';
import { AppComponentsModule } from "../app-components/app-components.module";
import { AppTemplatesModule } from 'app-templates';
import { PipesModule } from '../app-pipes/app-pipes.module';
import { WorkspacePage } from "./workspace.page";
import { WorkspaceWidgetComponent } from "./workspace-widget/workspace-widget.component";
import { SearchReportComponent } from "./search-report/search-report.component";
import { DataEntryComponent } from "./data-entry/data-entry.component";
import { AdministrationComponent } from "./administration/administration.component";
import { FSDGuard, FSDComponent, FSDUserComponent, FSDUsersComponent } from './fsd';
import {
  SystemGuard,
  SystemComponent,
  SystemDirectoryComponent,
  SystemCreateComponents,
  SystemProfileComponent,
  SystemPasswordComponent,
  SystemMigrationsComponent,
  SystemStatusComponent,
} from './system';

import {
  FHWidgetComponent,
  FSDWidgetComponent,
  ProfileWidgetComponent,
  RMWidgetComponent,
  SystemWidgetComponent,
} from "./administration";

import { AssistanceListingWidgetComponent } from "./data-entry/assistance-listing/assistance-listing-widget.component";
import { MsgFeedComponent } from "./msg-feed/msg-feed.component";
import { MsgFeedSideNavComponent } from "./msg-feed/msg-feed-sidenav/msg-feed-sidenav.component";
import { HelpContentManagementViewComponent } from "./content-management/view/content-management-view.component";
import { HelpContentManagementSideNavComponent } from "./content-management/view/sidenav/content-management-sidenav.component";
import { UserService } from "../role-management/user.service";
import { UserServiceMock } from "../role-management/user.service.mock";
import { HelpContentManagementEditComponent } from "./content-management/edit/content-management-edit.component";

import { FileValueAccessorDirective } from 'app-directives';
import { DragDropDirective } from "./content-management/edit/drag-drop.directive";

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

    AssistanceListingWidgetComponent,

    /**
     * FSD
     */
    FSDComponent,
    FSDUserComponent,
    FSDUsersComponent,

    /**
     * System
     */
    SystemComponent,
    SystemDirectoryComponent,
    SystemCreateComponents,
    SystemProfileComponent,
    SystemPasswordComponent,
    SystemMigrationsComponent,
    SystemStatusComponent,

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

    /**
     * Directives
     */
    FileValueAccessorDirective,
    DragDropDirective,

  ],
  providers: [
    /**
     * Route Guards
     */
    FSDGuard,
    SystemGuard,
    UserService,
    //{ provide: UserService, useClass: UserServiceMock },
  ],
})
export class WorkspaceModule { }
