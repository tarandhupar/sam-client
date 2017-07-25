import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { routing } from './403.route';
import { ForbiddenPage } from "./403.page";
import { SuperAdminGuard } from "./super-admin.guard";
import { DeptAdminGuard } from "./dept-admin.guard";
import { AdminLevelResolve } from "./admin-level.resolve";
import { AdminLevelService } from "./admin-level.service";
import { IsLoggedInService } from "./is-logged-in.service";
import { IsLoggedInGuard } from "./is-logged-in.guard";
import { UnauthenticatedPage } from "../401/401.page";
import { UserNameResolve } from "./user-name.resolve";
import { CheckAccessGuard } from "./check-access.guard";

@NgModule({
  imports: [
    BrowserModule,
    RouterModule,
    routing
  ],
  exports: [

  ],
  declarations: [
    ForbiddenPage,
    UnauthenticatedPage,
  ],
  providers: [
    SuperAdminGuard,
    DeptAdminGuard,
    AdminLevelService,
    AdminLevelResolve,
    IsLoggedInService,
    IsLoggedInGuard,
    UserNameResolve,
    CheckAccessGuard,
  ],
})
export class ForbiddenModule { }
