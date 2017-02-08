// Angular Dependencies
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SamUIKitModule } from 'ui-kit';
import { SamAPIKitModule } from 'api-kit';
import { AgencyPickerComponent } from './agency-picker/agency-picker.component';
import { DisplayPageComponent } from './display-page/display-page.component';
import { HistoryComponent } from "./history/history.component";



/**
 * A module for reusable SAM Web Design components
 * https://gsa.github.io/sam-web-design-standards/
 */
@NgModule({
  declarations: [
    AgencyPickerComponent,
    DisplayPageComponent,
    HistoryComponent
  ],
  imports: [
    BrowserModule,
    SamUIKitModule,
    FormsModule,
    SamAPIKitModule
  ],
  exports: [
    AgencyPickerComponent,
    DisplayPageComponent,
    HistoryComponent
  ],
  providers: [ ]
})
export class AppComponentsModule { }
