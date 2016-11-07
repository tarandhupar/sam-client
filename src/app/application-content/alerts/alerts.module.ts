import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { routing } from './alerts.route';
import { AlertsPage} from "./alerts.page";

@NgModule({
  imports: [
    BrowserModule,
    routing
  ],
  exports: [],
  declarations: [ AlertsPage ],
  providers: [],
})
export class AlertsModule { }
