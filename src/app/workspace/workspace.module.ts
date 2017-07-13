import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Ng2PageScrollModule } from 'ng2-page-scroll';

import { routing } from './workspace.route';
import { SamUIKitModule } from 'sam-ui-kit';
import { SamAPIKitModule } from 'api-kit';
import { AppComponentsModule } from "../app-components/app-components.module";
import { PipesModule } from '../app-pipes/app-pipes.module';
import { AlertFooterService } from "../alerts/alert-footer/alert-footer.service";
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
  SystemProfileComponent,
  SystemPasswordComponent,
  SystemMigrationsComponent
} from './system';

import { FSDWidgetComponent, RMWidgetComponent, SystemWidgetComponent } from "./administration";
import { AssistanceListingWidgetComponent } from "./data-entry/assistance-listing/assistance-listing-widget.component";

@NgModule({
  imports: [
    routing,
    BrowserModule,
    RouterModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    SamUIKitModule,
    SamAPIKitModule,
    AppComponentsModule,
    PipesModule,
    Ng2PageScrollModule.forRoot()
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
    FSDWidgetComponent,
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
    SystemProfileComponent,
    SystemPasswordComponent,
    SystemMigrationsComponent,
  ],
  providers: [
    /**
     * Services
     */
    AlertFooterService,

    /**
     * Route Guards
     */
    FSDGuard,
    SystemGuard,
  ],
})
export class WorkspaceModule { }
