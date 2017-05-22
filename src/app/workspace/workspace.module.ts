import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {Ng2PageScrollModule} from 'ng2-page-scroll';

import { routing } from './workspace.route';
import { SamUIKitModule } from 'sam-ui-kit';
import { SamAPIKitModule } from 'api-kit';
import { AppComponentsModule } from "../app-components/app-components.module";
import { AlertFooterService } from "../alerts/alert-footer/alert-footer.service";
import { WorkspacePage } from "./workspace.page";
import { WorkspaceWidgetComponent } from "./workspace-widget/workspace-widget.component";
// import { DraggableDirective } from "./workspace-widget/widget-drag.directive";


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
    Ng2PageScrollModule.forRoot()
  ],
  exports: [],
  declarations: [
    WorkspacePage,
    WorkspaceWidgetComponent,
    // DraggableDirective,
  ],
  providers: [
    AlertFooterService,
  ],
})
export class WorkspaceModule { }
