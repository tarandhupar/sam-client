import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { routing } from './403.route';
import { ForbiddenPage } from "./403.page";
import { IsLoggedInGuard } from "./is-logged-in.guard";
import { UnauthenticatedPage } from "../401/401.page";
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
    IsLoggedInGuard,
    CheckAccessGuard,
  ],
})
export class ForbiddenModule { }
