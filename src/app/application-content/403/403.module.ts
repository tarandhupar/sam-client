import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routing } from './403.route';
import { ForbiddenPage } from "./403.page";
import { IsLoggedInGuard } from "../../app-services/is-logged-in.guard";
import { UnauthenticatedPage } from "../401/401.page";
import { RmAccessGuard } from "../../app-services/rm-access.guard";
import { FHAccessGuard } from "../../app-services/fh-access.guard";
import { FeatureToggleGuard } from "../../app-services/feature-toggle.guard";
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    routing,
  ],
  exports: [

  ],
  declarations: [
    ForbiddenPage,
    UnauthenticatedPage,
  ],
  providers: [
    IsLoggedInGuard,
    RmAccessGuard,
    FHAccessGuard,
    FeatureToggleGuard,
  ],
})
export class ForbiddenModule { }
