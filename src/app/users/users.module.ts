import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Ng2PageScrollModule } from 'ng2-page-scroll';

import { routing } from './users.route';
import { SamUIKitModule } from 'sam-ui-elements/src/ui-kit';
import { SamAPIKitModule } from 'api-kit';
import { PipesModule } from '../app-pipes/app-pipes.module';
import { AppComponentsModule } from '../app-components/app-components.module';
import { RequestAccessResolve } from './request-access.resolve';
import { PendingRequestsComponent } from './pending-requests/pending-requests.component';
import { UserRoleDetailsPage } from './user-role-details/user-role-details.page';
import { UserRoleDetailsResolve } from './user-role-details.resolve';

import { RequestAccessPage } from './request-access/request-access.page';
import { RoleCategoriesResolve } from './roles-categories.resolve';
import { ViewRequestPage } from '../role-management/view-request/view-request.page';
import { RequestResponsePage } from '../role-management/request-response/request-response.page';
import { MyAccessPage } from './access/my-access.page';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { SubscriptionsSideNavComponent } from './subscriptions/subscriptions-sidenav/subscriptions-sidenav.component';
import { SubscriptionActionsComponent } from './subscriptions/subscription-actions/subscription-actions.component';
import { RmCommentsComponent } from '../role-management/rm-comments/rm-comments.component';

import { ProfileComponent } from './profile.component';
import { DetailsComponent } from './details/details.component';
import { MigrationsComponent } from './migrations/migrations.component';
import { ResetComponent } from './reset/reset.component';

import { GrantOrEditAccess } from '../role-management/grant-or-edit-access/grant-or-edit-access';
import { IsLoggedInGuard } from '../app-services/is-logged-in.guard';

import { ProfilePageService } from './profile-page.service';
import { UserService } from 'role-management/user.service';
import { SideNavFilterSelector, SideNavFilterDirective } from './side-nav-filter.directive';

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
    Ng2PageScrollModule.forRoot(),
  ],
  exports: [
    GrantOrEditAccess,
    MyAccessPage,
    SideNavFilterSelector,
    SideNavFilterDirective,
  ],
  declarations: [
    SideNavFilterSelector,
    SideNavFilterDirective,
    RmCommentsComponent,
    MyAccessPage,
    RequestAccessPage,
    ViewRequestPage,
    RequestResponsePage,
    SubscriptionsComponent,
    SubscriptionsSideNavComponent,
    SubscriptionActionsComponent,
    GrantOrEditAccess,
    MyAccessPage,
    ProfileComponent,
    DetailsComponent,
    MigrationsComponent,
    ResetComponent,
  ],
  providers: [
    IsLoggedInGuard,
    RoleCategoriesResolve,
    ProfilePageService,
    UserService,
  ],
})
export class UsersModule { }
