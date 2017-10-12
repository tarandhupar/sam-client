import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Ng2PageScrollModule } from 'ng2-page-scroll';

import { routing } from './users.route';
import { SamUIKitModule } from 'sam-ui-kit';
import { SamAPIKitModule } from 'api-kit';
import { PipesModule } from "../app-pipes/app-pipes.module";
import { AppComponentsModule } from "../app-components/app-components.module";
import { RequestAccessResolve } from "./request-access.resolve";
import { PendingRequestsComponent } from "./pending-requests/pending-requests.component";
import { UserRoleDetailsPage } from "./user-role-details/user-role-details.page";
import { UserRoleDetailsResolve } from "./user-role-details.resolve";
// import { AppTemplatesModule } from "../app-templates/index";
import { RequestAccessPage } from "./request-access/request-access.page";
import { RoleCategoriesResolve } from "./roles-categories.resolve";
import { ViewRequestPage } from "../role-management/view-request/view-request.page";
import { RequestResponsePage } from "../role-management/request-response/request-response.page";
import { CapitalizePipe } from "../app-pipes/capitalize.pipe";
import { MyAccessPage } from "./access/my-access.page";
import { SubscriptionsComponent } from "./subscriptions/subscriptions.component";
import { SubscriptionsSideNavComponent } from "./subscriptions/subscriptions-sidenav/subscriptions-sidenav.component";
import { SubscriptionActionsComponent } from "./subscriptions/subscription-actions/subscription-actions.component";
import { GrantOrEditAccess } from "../role-management/grant-or-edit-access/grant-or-edit-access";

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
    PipesModule,
    AppComponentsModule,
    // AppTemplatesModule,
    Ng2PageScrollModule.forRoot(),
  ],
  exports: [
    GrantOrEditAccess,
    MyAccessPage,
  ],
  declarations: [
    MyAccessPage,
    RequestAccessPage,
    ViewRequestPage,
    RequestResponsePage,
    SubscriptionsComponent,
    SubscriptionsSideNavComponent,
    SubscriptionActionsComponent,
    GrantOrEditAccess,
    MyAccessPage,
  ],
  providers: [
    RoleCategoriesResolve,
    CapitalizePipe,
  ],
})
export class UsersModule { }
