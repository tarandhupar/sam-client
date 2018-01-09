import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from "../app-pipes/app-pipes.module";

import { Ng2PageScrollModule } from 'ng2-page-scroll';

import { routing } from './organization-detail.route';
import { SamUIKitModule } from 'sam-ui-elements/src/ui-kit';
import { SamAPIKitModule } from 'api-kit';
import { AppComponentsModule } from "../app-components/app-components.module";
import { OrgDetailPage } from "./organization-detail.page";
import { OrgDetailProfilePage } from "./profile/profile.component";
import { OrgCreatePage } from "./create-org/create-org.component";
import { FlashMsgService } from "./flash-msg-service/flash-message.service";
import { AACRequestPage } from "./AAC-request/AAC-request.component";
import { AACConfirmPage } from './AAC-confirm/AAC-confirm.component';
import { AACRequestGuard } from './AAC-request/AAC-request.guard';
import { OrgMovePage } from './move-org/move-org.component';
import { OrgCreateForm } from './create-org-form/create-org-form.component';
import { OrgHierarchyPage } from './hierarchy/hierarchy.component';
import { CapitalizePipe } from '../app-pipes/capitalize.pipe';
import { CreateOrgResolve } from  './create-org/create-org.resolve';
import { OrgDetailResolve } from './organization-detail.resolve';
import { FHTitleCasePipe } from '../app-pipes/fhTitleCase.pipe';

@NgModule({
  imports: [
    routing,
    CommonModule,
    RouterModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    SamUIKitModule,
    SamAPIKitModule,
    AppComponentsModule,
    PipesModule,
    Ng2PageScrollModule.forRoot()
  ],
  exports: [],
  declarations: [
    OrgDetailPage,
    OrgDetailProfilePage,
    OrgCreatePage,
    OrgCreateForm,
    OrgMovePage,
    OrgHierarchyPage,
    AACRequestPage,
    AACConfirmPage,
  ],
  providers: [
    FlashMsgService,
    AACRequestGuard,
    CapitalizePipe,
    CreateOrgResolve,
    OrgDetailResolve,
    FHTitleCasePipe,
  ],
})
export class OrganizationDetailModule { }
