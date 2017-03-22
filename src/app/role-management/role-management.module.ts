import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { routing } from './role-management.route';
import { SamUIKitModule } from "sam-ui-kit/index";
import { SamAPIKitModule } from "../../api-kit/api-kit.module";
import { AlertFooterService } from "../alerts/alert-footer/alert-footer.service";
import { ObjectWorkspacePage } from "./object-workspace.page";
import { RoleDetailsPage } from "./role-details.page";
import { ObjectDetailsPage } from "./object-details.page";
import { RoleWorkspacePage } from "./role-workspace.page";
<<<<<<< HEAD
import { RoleSideNav } from "./role-sidenav/role-sidenav.component.ts";
=======
import { PermissionSelectorComponent } from "./permission-selector";
>>>>>>> 8cbd3e2a9e57af2a5633eb8edd709c4d71168c5b

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
    ObjectWorkspacePage,
    RoleWorkspacePage,
    RoleDetailsPage,
    ObjectDetailsPage,
<<<<<<< HEAD
    RoleSideNav
=======
    PermissionSelectorComponent,
>>>>>>> 8cbd3e2a9e57af2a5633eb8edd709c4d71168c5b
  ],
  providers: [
    AlertFooterService
  ],
})
export class RoleManagementModule { }
