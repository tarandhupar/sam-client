import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import {FormsModule} from "@angular/forms";

import { routing } from './ui-kit-demo.route';
import { SamUIKitModule } from 'ui-kit';
import { SamAPIKitModule } from 'api-kit';
import {UIKitDemoPage} from "./ui-kit-demo.page";
import { AppComponentsModule } from "../../app-components/app-components.module";
import { AlertsModule } from "../../alerts/alerts.module";
import { HelpModule } from "../../Help/help.module";
import { SamPipesModule } from "../../../sam-ui-elements/src/ui-kit/pipes";

console.log('pipes imported sucessfully');

@NgModule({
  imports: [
    routing,
    BrowserModule,
    RouterModule,
    FormsModule,
    SamUIKitModule,
    SamAPIKitModule,
    AppComponentsModule,
    AlertsModule,
    HelpModule,
    SamPipesModule,
  ],
  exports: [],
  declarations: [
    UIKitDemoPage
  ],
  providers: [],
})
export class UIKitDemoModule { }
