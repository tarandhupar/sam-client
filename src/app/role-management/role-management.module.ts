import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { routing } from './role-management.route';
import { SamUIKitModule } from "sam-ui-kit/index";
import { SamAPIKitModule } from "../../api-kit/api-kit.module";
import { AlertFooterService } from "../app-components/alert-footer/alert-footer.service";
import { RoleDetailsPage } from "./role-details/role-details.page";
import { ObjectDetailsPage } from "./object-details/object-details.page";
import { RoleDefinitionPage } from "./role-definition/role-definition.page";
import { RoleSideNav } from "./role-sidenav/role-sidenav.component.ts";
import { PermissionSelectorComponent } from "./permission-selector/permission-selector";
import { DomainsResolve } from "./domains.resolve";
import { RequestAccessResolve } from "./request-access.resolve";
import { RequestStatusNamesResolve } from "./request-statuses.resolve";
import { RoleMainContent } from "./role-maincontent/role-maincontent.component.ts";
import { RoleMgmtWorkspace } from "./rolemgmt-workspace.page.ts";
import { RoleMgmtSidenav } from "./rolemgmt-sidenav/rolemgmt-sidenav.component.ts";
import { RoleMgmtContent } from "./rolemgmt-content/rolemgmt-content.component.ts";
import { AppComponentsModule } from "../app-components/app-components.module";
import { RolesDirectoryPage } from "./roles-directory/roles-directory.page";
import { AppTemplatesModule } from "../app-templates/index";
import { BulkUpdateComponent } from "./bulk-update/bulk-update.component";
import { PipesModule } from "../app-pipes/app-pipes.module";
import { RMBackDoorComponent } from "./back-door/back-door.component";
import { GrantOrEditAccess } from "./grant-or-edit-access/grant-or-edit-access";
import { UsersModule } from "../users/users.module";
import { UserService } from "./user.service";
import { IAMService } from "../../api-kit/iam/iam.service";

@NgModule({
  imports: [
    routing,
    CommonModule,
    RouterModule,
    HttpModule,
    FormsModule,
    SamUIKitModule,
    SamAPIKitModule,
    AppComponentsModule,
    AppTemplatesModule,
    PipesModule,
    UsersModule,
  ],
  declarations: [
    RoleDefinitionPage,
    RoleDetailsPage,
    ObjectDetailsPage,
    RoleSideNav,
    PermissionSelectorComponent,
    RoleMainContent,
    RoleMgmtWorkspace,
    RoleMgmtSidenav,
    RoleMgmtContent,
    RolesDirectoryPage,
    BulkUpdateComponent,
    RMBackDoorComponent,
  ],
  providers: [
    DomainsResolve,
    RequestAccessResolve,
    RequestStatusNamesResolve,
    UserService,
    IAMService,
  ],
})
export class RoleManagementModule { }
