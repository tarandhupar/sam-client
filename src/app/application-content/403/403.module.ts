import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routing } from './403.route';
import { ForbiddenPage } from "./403.page";
import { IsLoggedInGuard } from "./is-logged-in.guard";
import { UnauthenticatedPage } from "../401/401.page";
import { CheckAccessGuard } from "./check-access.guard";
import { FHAccessGuard } from "./fh-access.guard";
import { FeatureToggleGuard } from "./feature-toggle.guard";

@NgModule({
  imports: [
    CommonModule,
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
    FHAccessGuard,
    FeatureToggleGuard,
  ],
})
export class ForbiddenModule { }
