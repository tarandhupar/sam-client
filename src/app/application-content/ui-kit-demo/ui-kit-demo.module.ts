import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import {FormsModule} from "@angular/forms";

import { routing } from './ui-kit-demo.route';
import { SamUIKitModule } from 'ui-kit';
import { SamAPIKitModule } from 'api-kit';
import {UIKitDemoPage} from "./ui-kit-demo.page";
import { AlertListComponent } from "app/app-components/alert-list/alert-list.component";

@NgModule({
  imports: [
    routing,
    BrowserModule,
    RouterModule,
    FormsModule,
    SamUIKitModule,
    SamAPIKitModule,
  ],
  exports: [],
  declarations: [
    AlertListComponent,
    UIKitDemoPage
  ],
  providers: [],
})
export class UIKitDemoModule { }
