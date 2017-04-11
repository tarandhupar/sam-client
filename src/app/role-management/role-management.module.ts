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
import { RoleWorkspacePage } from "./role-workspace.page";
import { RoleSideNav } from "./role-sidenav/role-sidenav.component.ts";
import { PermissionSelectorComponent } from "./permission-selector/permission-selector";
import { DomainsResolve } from "./domains.resolve";
import {RoleMainContent} from "./role-maincontent/role-maincontent.component.ts"
import { RequestAccessResolve } from "./request-access.resolve";
import { ManageRequestPage } from "./manage-request/manage-request";
import { RequestStatusNamesResolve } from "./request-statuses.resolve";


@NgModule({
  imports: [
    routing,
    BrowserModule,
    RouterModule,
    HttpModule,
    FormsModule,
    SamUIKitModule,
    SamAPIKitModule,
  ],
  exports: [

  ],
  declarations: [
    RoleWorkspacePage,
    RoleDetailsPage,
    ObjectDetailsPage,
    RoleSideNav,
    PermissionSelectorComponent,
    RoleMainContent,
    ManageRequestPage,
  ],
  providers: [
    DomainsResolve,
    RequestAccessResolve,
    RequestStatusNamesResolve,
    AlertFooterService
  ],
})
export class RoleManagementModule { }
