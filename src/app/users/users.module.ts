import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { Ng2PageScrollModule } from 'ng2-page-scroll';

import { routing } from './users.route';
import { SamUIKitModule } from 'sam-ui-kit';
import { SamAPIKitModule } from 'api-kit';
import { UserDirectoryPage } from "./directory/user-directory.page";
import { ParentOrgsComponent } from "./directory/parent-orgs/parent-orgs.component";
import { UserAccessPage } from "./public/access/access.page";
import { UserViewComponent } from "./public/public.component";
import { UserMigrationsPage } from "./public/migrations/migrations.page";
import { UserProfilePage } from "./public/profile/profile.page";
import { GroupByDomainPipe } from "./public/access/group-by-domain.pipe";
import { PipesModule } from "../app-pipes/app-pipes.module";
import { GrantAccessPage } from "./public/grant-access/grant-access.page";
import { AppComponentsModule } from "../app-components/app-components.module";
import { AlertFooterService } from "../alerts/alert-footer/alert-footer.service";
import { ObjectsAndPermissionsComponent } from "./objects-and-permissions/objects-and-permissions.component";


@NgModule({
  imports: [
    routing,
    BrowserModule,
    RouterModule,
    HttpModule,
    FormsModule,
    SamUIKitModule,
    SamAPIKitModule,
    PipesModule,
    AppComponentsModule,
    Ng2PageScrollModule.forRoot()
  ],
  exports: [

  ],
  declarations: [
    UserViewComponent,
    UserMigrationsPage,
    UserAccessPage,
    GrantAccessPage,
    UserProfilePage,
    UserDirectoryPage,
    ParentOrgsComponent,
    GroupByDomainPipe,
    ObjectsAndPermissionsComponent,
  ],
  providers: [
    AlertFooterService
  ],
})
export class UserDirectoryModule { }
