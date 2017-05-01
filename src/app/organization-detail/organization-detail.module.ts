import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {Ng2PageScrollModule} from 'ng2-page-scroll';

import { routing } from './organization-detail.route';
import { SamUIKitModule } from 'sam-ui-kit';
import { SamAPIKitModule } from 'api-kit';
import { AppComponentsModule } from "../app-components/app-components.module";
import { AlertFooterService } from "../alerts/alert-footer/alert-footer.service";
import { OrgDetailPage } from "./organization-detail.page";
import { OrgDetailProfilePage } from "./profile/profile.component";
import { OrgCreatePage } from "./create-org/create-org.component";
import { FlashMsgService } from "./flash-msg-service/flash-message.service";
import { AACRequestPage } from "./AAC-request/AAC-request.component";
import { AACConfirmPage } from "./AAC-confirm/AAC-confirm.component";

@NgModule({
  imports: [
    routing,
    BrowserModule,
    RouterModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    SamUIKitModule,
    SamAPIKitModule,
    AppComponentsModule,
    Ng2PageScrollModule.forRoot()
  ],
  exports: [],
  declarations: [
    OrgDetailPage,
    OrgDetailProfilePage,
    OrgCreatePage,
    AACRequestPage,
    AACConfirmPage,
  ],
  providers: [
    AlertFooterService,
    FlashMsgService
  ],
})
export class OrganizationDetailModule { }
