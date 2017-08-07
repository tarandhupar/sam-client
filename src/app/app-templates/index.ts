import { NgModule } from "@angular/core";
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { SamUIKitModule } from 'sam-ui-kit';

import { PageService } from './page.service'
import { PageTemplateComponent } from "./page.component";
import { SidebarTemplateComponent } from "./sidebar.component";
import { ResultsTemplateComponent } from "./results.component";

/**
 * This will be replaced by the page templates above
 */
import { WorkspaceTemplateComponent } from "./workspace/workspace-template.component";

/**
 * Only <list-results-message> is needed
 * Good candidate to be a shared component
 */
import { AppComponentsModule } from '../app-components/app-components.module';


/**
 * A module for reusable SAM Web Design components
 */
@NgModule({
  declarations: [
    WorkspaceTemplateComponent,
    PageTemplateComponent,
    SidebarTemplateComponent,
    ResultsTemplateComponent
  ],
  imports: [
    BrowserModule,
    SamUIKitModule,
    AppComponentsModule,
    RouterModule
  ],
  exports: [
    WorkspaceTemplateComponent,
    PageTemplateComponent,
    SidebarTemplateComponent,
    ResultsTemplateComponent
  ],
  providers: [
    PageService
  ]
})
export class AppTemplatesModule { }
