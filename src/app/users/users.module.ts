import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule } from "@angular/forms";

import { routing } from './users.route';
import { SamUIKitModule } from 'ui-kit';
import { SamAPIKitModule } from 'api-kit';
import { UserDirectoryPage } from "./user-directory/user-directory.page";
import { ParentOrgsComponent } from "./parent-orgs/parent-orgs.component";
import { UserAccessPage } from "./public/access/access.page";
import { UserViewComponent } from "./public/public.component";
import { UserMigrationsPage } from "./public/migrations/migrations.page";
import { UserProfilePage } from "./public/profile/profile.page";
import { GroupByDomainPipe } from "./public/access/group-by-domain.pipe";


@NgModule({
  imports: [
    routing,
    BrowserModule,
    RouterModule,
    HttpModule,
    FormsModule,
    SamUIKitModule,
    SamAPIKitModule
  ],
  exports: [

  ],
  declarations: [
    UserViewComponent,
    UserMigrationsPage,
    UserAccessPage,
    UserProfilePage,
    UserDirectoryPage,
    ParentOrgsComponent,
    GroupByDomainPipe,
  ],
  providers: [],
})
export class UserDirectoryModule { }
