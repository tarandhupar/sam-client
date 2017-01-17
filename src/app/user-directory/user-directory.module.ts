import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule } from "@angular/forms";

import { routing } from './user-directory.route';
import { SamUIKitModule } from 'ui-kit';
import { SamAPIKitModule } from 'api-kit';
import { UserDirectoryPage } from "./user-directory.page";
import { ParentOrgsComponent } from "./parent-orgs/parent-orgs.component";


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
    UserDirectoryPage,
    ParentOrgsComponent
  ],
  providers: [],
})
export class UserDirectoryModule { }
