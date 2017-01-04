import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { routing } from './alerts.route';
import { AlertsPage} from "./alerts.page";
import {SamUIKitModule} from "ui-kit";
import {AlertItemComponent} from "./alert-item/alert-item.component";
import {PipesModule} from "../app-pipes/app-pipes.module";
import {AlertHeaderComponent} from "./alert-header/alert-header.component";
import {AlertFooterComponent} from "./alert-footer/alert-footer.component";
import {AlertFooterService} from "./alert-footer/alert-footer.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AlertEditComponent} from "./alert-edit/alert-edit.component";

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    routing,
    SamUIKitModule,
    PipesModule
  ],
  exports: [ AlertHeaderComponent, AlertFooterComponent ],
  declarations: [ AlertsPage, AlertItemComponent, AlertHeaderComponent, AlertFooterComponent, AlertEditComponent ],
  providers: [ AlertFooterService ],
})
export class AlertsModule { }
