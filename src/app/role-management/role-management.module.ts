import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { routing } from './role-management.route';
import { SamUIKitModule } from "sam-ui-kit/index";
import { SamAPIKitModule } from "../../api-kit/api-kit.module";
import { AlertFooterService } from "../alerts/alert-footer/alert-footer.service";
import { ObjectsWorkspacePage } from "./objects-workspace.page";

@NgModule({
  imports: [
    routing,
    BrowserModule,
    RouterModule,
    HttpModule,
    FormsModule,
    SamUIKitModule,
    SamAPIKitModule,
  ],
  exports: [

  ],
  declarations: [
    ObjectsWorkspacePage
  ],
  providers: [
    AlertFooterService
  ],
})
export class RoleManagementModule { }
