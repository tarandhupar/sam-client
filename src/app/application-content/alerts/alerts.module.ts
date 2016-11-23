import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { routing } from './alerts.route';
import { AlertsPage} from "./alerts.page";
import {AlertsResolver} from "./alerts.resolve";
import {SamUIKitModule} from "../../../ui-kit/ui-kit.module";

@NgModule({
  imports: [
    BrowserModule,
    routing,
    SamUIKitModule,
  ],
  exports: [],
  declarations: [ AlertsPage ],
  providers: [ AlertsResolver ],
})
export class AlertsModule { }
