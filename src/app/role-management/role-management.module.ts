import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { routing } from './role-management.route';
import { SamUIKitModule } from "sam-ui-kit/index";
import { SamAPIKitModule } from "../../api-kit/api-kit.module";
import { AlertFooterService } from "../alerts/alert-footer/alert-footer.service";
import { RoleDetailsPage } from "./role-details/role-details.page";
import { ObjectDetailsPage } from "./object-details/object-details.page";
import { RoleDefinitionPage } from "./role-definition/role-definition.page";
import { RoleSideNav } from "./role-sidenav/role-sidenav.component.ts";
import { PermissionSelectorComponent } from "./permission-selector/permission-selector";
import { DomainsResolve } from "./domains.resolve";
import { RequestAccessResolve } from "./request-access.resolve";
import { ManageRequestPage } from "./manage-request/manage-request";
import { RequestStatusNamesResolve } from "./request-statuses.resolve";
import { RoleMainContent } from "./role-maincontent/role-maincontent.component.ts";
import { RoleMgmtWorkspace } from "./rolemgmt-workspace.page.ts";
import { RoleMgmtSidenav } from "./rolemgmt-sidenav/rolemgmt-sidenav.component.ts";
import { RoleMgmtContent } from "./rolemgmt-content/rolemgmt-content.component.ts";
import { AppComponentsModule } from "../app-components/app-components.module";
import { RequestDetailsComponent } from "./request-details/request-details";

@NgModule({
  imports: [
    routing,
    BrowserModule,
    RouterModule,
    HttpModule,
    FormsModule,
    SamUIKitModule,
    SamAPIKitModule,
    AppComponentsModule,

  ],
  exports: [
    RequestDetailsComponent
  ],
  declarations: [
    RequestDetailsComponent,
    RoleDefinitionPage,
    RoleDetailsPage,
    ObjectDetailsPage,
    RoleSideNav,
    PermissionSelectorComponent,
    RoleMainContent,
    ManageRequestPage,
    RoleMgmtWorkspace,
    RoleMgmtSidenav,
    RoleMgmtContent,
  ],
  providers: [
    DomainsResolve,
    RequestAccessResolve,
    RequestStatusNamesResolve,
    AlertFooterService
  ],
})
export class RoleManagementModule { }
