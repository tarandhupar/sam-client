import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import {Ng2PageScrollModule} from 'ng2-page-scroll';

import { routing } from './organization-detail.route';
import { SamUIKitModule } from 'sam-ui-kit';
import { SamAPIKitModule } from 'api-kit';
import { AppComponentsModule } from "../app-components/app-components.module";
import { AlertFooterService } from "../alerts/alert-footer/alert-footer.service";
import { OrgDetailPage } from "./organization-detail.page";
import { OrgDetailProfilePage } from "./profile/profile.component";

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
    Ng2PageScrollModule.forRoot()
  ],
  exports: [],
  declarations: [
    OrgDetailPage,
    OrgDetailProfilePage,
  ],
  providers: [
    AlertFooterService
  ],
})
export class OrganizationDetailModule { }
