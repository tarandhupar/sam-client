import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Ng2PageScrollModule } from 'ng2-page-scroll';

import { routing } from './users.route';
import { SamUIKitModule } from 'sam-ui-kit';
import { SamAPIKitModule } from 'api-kit';
import { UserDirectoryPage } from "./directory/user-directory.page";
import { ParentOrgsComponent } from "./directory/parent-orgs/parent-orgs.component";
import { UserAccessPage } from "./access/access.page";
import { GroupByDomainPipe } from "./access/group-by-domain.pipe";
import { PipesModule } from "../app-pipes/app-pipes.module";
import { GrantAccessPage } from "./grant-access/grant-access.page";
import { AppComponentsModule } from "../app-components/app-components.module";
import { AlertFooterService } from "../alerts/alert-footer/alert-footer.service";
import { ObjectsAndPermissionsComponent } from "./objects-and-permissions/objects-and-permissions.component";
import { RoleManagementModule } from "../role-management/role-management.module";
import { RequestAccessResolve } from "./request-access.resolve";
import { UserPic } from "./user-pic/user-pic.component";
import { PendingRequestsComponent } from "./pending-requests/pending-requests.component";
import { RoleTable } from "./role-table/role-table.component";
import { UserRoleDetailsPage } from "./user-role-details/user-role-details.page";
import { UserRoleDetailsResolve } from "./user-role-details.resolve";
import { AppTemplatesModule } from "../app-templates/index";
import { RequestAccessPage } from "./request-access/request-access.page";
import { RoleCategoriesResolve } from "./roles-categories.resolve";
import { ViewRequestPage } from "./view-request/view-request.page";
import { RequestResponsePage } from "./request-response/request-response.page";
import { UserService } from "./user.service";
import { UserServiceMock } from "./user.service.mock";
import { CapitalizePipe } from "../app-pipes/capitalize.pipe";
import { UserSearchModule } from "./user-search.module";

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
    PipesModule,
    AppComponentsModule,
    RoleManagementModule,
    AppTemplatesModule,
    Ng2PageScrollModule.forRoot(),
    UserSearchModule,
  ],
  exports: [
    UserPic
  ],
  declarations: [
    UserAccessPage,
    GrantAccessPage,
    UserDirectoryPage,
    ParentOrgsComponent,
    GroupByDomainPipe,
    ObjectsAndPermissionsComponent,
    UserPic,
    PendingRequestsComponent,
    RoleTable,
    UserRoleDetailsPage,
    RequestAccessPage,
    ViewRequestPage,
    RequestResponsePage,
  ],
  providers: [
    AlertFooterService,
    RequestAccessResolve,
    UserRoleDetailsResolve,
    RoleCategoriesResolve,
    CapitalizePipe,
    UserService,
    //{ provide: UserService, useClass: UserServiceMock }
  ],
})
export class UserDirectoryModule { }
