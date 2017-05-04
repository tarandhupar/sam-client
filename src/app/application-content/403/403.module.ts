import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { routing } from './403.route';
import { ForbiddenPage } from "./403.page";
import { AdminOnlyGuard } from "./admin-only.guard";
import { AdminOrDeptAdminGuard } from "./admin-or-dept-admin.guard";


@NgModule({
  imports: [
    BrowserModule,
    RouterModule,
    routing
  ],
  exports: [],
  declarations: [ ForbiddenPage ],
  providers: [
    AdminOnlyGuard,
    AdminOrDeptAdminGuard
  ],
})
export class ForbiddenModule { }
